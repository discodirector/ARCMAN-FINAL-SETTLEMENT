// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ARCMAN Reward Pool
 * @notice Pays a fixed USDC reward to a player who finishes the course, once
 *         per wallet and once per verified X account.
 *
 * How a claim works
 * -----------------
 * Everything that decides *whether* a player deserves the reward happens off
 * chain: the backend checks that the run was finished, that the X account is
 * verified and old enough, and that the player proved the wallet is theirs by
 * signing a message with it. Only then does the backend sign a claim, which
 * this contract verifies.
 *
 * The claim is relayed: the backend sends the transaction and pays the gas, so
 * a player needs no gas of their own. Anyone may relay a signed claim — the
 * reward always goes to the `player` named inside the signature, never to the
 * sender — so a leaked relayer key cannot redirect money.
 *
 * What is stored on chain
 * -----------------------
 * Only the fact that a wallet and an identity have claimed. The identity is a
 * hash the backend computes from the X account id together with a secret salt,
 * so the chain never carries the account id itself, and nobody can test whether
 * a given account has claimed by hashing its id.
 *
 * Filling the pool
 * ----------------
 * The pool is simply this contract's USDC balance. Anyone may add to it, by
 * calling fund() or by transferring USDC here directly, which is what lets
 * trading fees top it up automatically later without this contract knowing
 * anything about where the money came from.
 *
 * When the pool runs dry a claim reverts with PoolEmpty, and remainingClaims()
 * lets the game say so honestly before a player gets their hopes up.
 *
 * Note for Arc: USDC has 6 decimals here, so a $3 reward is 3_000_000. USDC is
 * also the gas token, and Circle can block addresses — a transfer to a blocked
 * address reverts, which rolls the whole claim back and leaves it claimable.
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract ARCMANRewardPool {
    // --- configuration -----------------------------------------------------

    /// @notice The reward token. USDC on Arc, 6 decimals.
    IERC20 public immutable usdc;

    /// @notice Owner: funds, pauses and reconfigures the pool. Meant to be a
    ///         multisig or hardware wallet, never the backend's hot key.
    address public owner;

    /// @notice Set by transferOwnership, takes effect when it calls acceptOwnership.
    ///         Two steps, so a typo cannot lock the pool away forever.
    address public pendingOwner;

    /// @notice The backend key that signs claims. Kept separate from `owner` on
    ///         purpose: it lives on a server, and losing it must not mean losing
    ///         the money.
    address public signer;

    /// @notice Reward per claim, in USDC units. A claim is signed for an exact
    ///         amount and is rejected above this, so changing it here cannot be
    ///         outrun by a signature made moments earlier.
    uint256 public maxReward;

    /// @notice While paused, no claim can be made. Funding still works.
    bool public paused;

    // --- what has been claimed ---------------------------------------------

    /// @notice courseId => wallet => claimed
    mapping(uint256 => mapping(address => bool)) public walletClaimed;

    /// @notice courseId => salted hash of the X account id => claimed
    mapping(uint256 => mapping(bytes32 => bool)) public identityClaimed;

    /// @notice Totals, for the dashboard and for honest reporting.
    uint256 public totalPaid;
    uint256 public claimCount;

    // --- EIP-712 -----------------------------------------------------------
    //
    // The domain binds every signature to this contract on this chain, so a
    // claim signed on the testnet cannot be replayed against the real pool.

    bytes32 private constant TYPE_HASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant CLAIM_TYPE_HASH =
        keccak256("Claim(uint256 courseId,address player,bytes32 identityHash,uint256 amount,uint256 deadline)");
    bytes32 private immutable domainSeparator;

    // --- events ------------------------------------------------------------

    event Claimed(uint256 indexed courseId, address indexed player, bytes32 indexed identityHash, uint256 amount);
    event Funded(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    event SignerChanged(address indexed previousSigner, address indexed newSigner);
    event MaxRewardChanged(uint256 previousAmount, uint256 newAmount);
    event PausedSet(bool paused);
    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // --- errors ------------------------------------------------------------

    error NotOwner();
    error NotPendingOwner();
    error ZeroAddress();
    error Paused();
    error DeadlinePassed();
    error BadSignature();
    error AmountTooHigh();
    error WalletAlreadyClaimed();
    error IdentityAlreadyClaimed();
    error PoolEmpty();
    error TransferFailed();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address _usdc, address _owner, address _signer, uint256 _maxReward) {
        if (_usdc == address(0) || _owner == address(0) || _signer == address(0)) revert ZeroAddress();

        usdc = IERC20(_usdc);
        owner = _owner;
        signer = _signer;
        maxReward = _maxReward;

        domainSeparator = keccak256(abi.encode(
            TYPE_HASH,
            keccak256(bytes("ARCMAN Reward Pool")),
            keccak256(bytes("1")),
            block.chainid,
            address(this)
        ));

        emit OwnershipTransferred(address(0), _owner);
        emit SignerChanged(address(0), _signer);
        emit MaxRewardChanged(0, _maxReward);
    }

    // --- claiming ----------------------------------------------------------

    /**
     * @notice Pay a signed reward to `player`. Callable by anyone; in practice
     *         the backend relays it so the player needs no gas.
     * @param courseId     Which course was finished. One claim per course.
     * @param player       Who receives the reward — taken from the signature,
     *                     not from msg.sender.
     * @param identityHash Salted hash of the verified X account id.
     * @param amount       Reward in USDC units, signed by the backend.
     * @param deadline     Unix time after which the signature is dead.
     * @param signature    65-byte secp256k1 signature from `signer`.
     */
    function claim(
        uint256 courseId,
        address player,
        bytes32 identityHash,
        uint256 amount,
        uint256 deadline,
        bytes calldata signature
    ) external {
        if (paused) revert Paused();
        if (block.timestamp > deadline) revert DeadlinePassed();
        if (amount > maxReward) revert AmountTooHigh();
        if (player == address(0)) revert ZeroAddress();
        if (walletClaimed[courseId][player]) revert WalletAlreadyClaimed();
        if (identityClaimed[courseId][identityHash]) revert IdentityAlreadyClaimed();

        bytes32 digest = claimDigest(courseId, player, identityHash, amount, deadline);
        if (_recover(digest, signature) != signer) revert BadSignature();

        if (usdc.balanceOf(address(this)) < amount) revert PoolEmpty();

        // Marked before paying, so a token that calls back cannot claim twice.
        walletClaimed[courseId][player] = true;
        identityClaimed[courseId][identityHash] = true;
        totalPaid += amount;
        claimCount += 1;

        if (!usdc.transfer(player, amount)) revert TransferFailed();

        emit Claimed(courseId, player, identityHash, amount);
    }

    /// @notice The digest the backend signs. Exposed so the server and tests
    ///         can check they build the same bytes this contract expects.
    function claimDigest(
        uint256 courseId,
        address player,
        bytes32 identityHash,
        uint256 amount,
        uint256 deadline
    ) public view returns (bytes32) {
        bytes32 structHash = keccak256(abi.encode(
            CLAIM_TYPE_HASH, courseId, player, identityHash, amount, deadline
        ));
        return keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
    }

    // --- reading the pool ---------------------------------------------------

    /// @notice USDC currently held, i.e. the pool.
    function poolBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    /// @notice How many more rewards the pool can pay at the current amount.
    ///         What the game shows players before they start.
    function remainingClaims() external view returns (uint256) {
        if (maxReward == 0) return 0;
        return usdc.balanceOf(address(this)) / maxReward;
    }

    /// @notice Whether this course is still claimable for this wallet and
    ///         identity — one call for the whole eligibility question the UI asks.
    function claimable(uint256 courseId, address player, bytes32 identityHash)
        external
        view
        returns (bool)
    {
        return !paused
            && !walletClaimed[courseId][player]
            && !identityClaimed[courseId][identityHash]
            && usdc.balanceOf(address(this)) >= maxReward;
    }

    // --- funding ------------------------------------------------------------

    /**
     * @notice Add USDC to the pool. Requires an allowance for this contract.
     * @dev A plain USDC transfer to this address works just as well; this
     *      exists so funding shows up as an event.
     */
    function fund(uint256 amount) external {
        if (!usdc.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        emit Funded(msg.sender, amount);
    }

    // --- owner --------------------------------------------------------------

    /// @notice Take USDC out — for winding the pilot down or moving to a new pool.
    function withdraw(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        if (!usdc.transfer(to, amount)) revert TransferFailed();
        emit Withdrawn(to, amount);
    }

    function setSigner(address newSigner) external onlyOwner {
        if (newSigner == address(0)) revert ZeroAddress();
        emit SignerChanged(signer, newSigner);
        signer = newSigner;
    }

    function setMaxReward(uint256 newMaxReward) external onlyOwner {
        emit MaxRewardChanged(maxReward, newMaxReward);
        maxReward = newMaxReward;
    }

    function setPaused(bool newPaused) external onlyOwner {
        paused = newPaused;
        emit PausedSet(newPaused);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner, newOwner);
    }

    function acceptOwnership() external {
        if (msg.sender != pendingOwner) revert NotPendingOwner();
        emit OwnershipTransferred(owner, pendingOwner);
        owner = pendingOwner;
        pendingOwner = address(0);
    }

    // --- signature ----------------------------------------------------------

    /// @dev Plain ecrecover with the malleability guard from the usual ECDSA
    ///      library: `s` in the lower half, `v` either 27 or 28.
    function _recover(bytes32 digest, bytes calldata signature) private pure returns (address) {
        if (signature.length != 65) revert BadSignature();

        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 32))
            v := byte(0, calldataload(add(signature.offset, 64)))
        }
        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) revert BadSignature();
        if (v != 27 && v != 28) revert BadSignature();

        address recovered = ecrecover(digest, v, r, s);
        if (recovered == address(0)) revert BadSignature();
        return recovered;
    }
}
