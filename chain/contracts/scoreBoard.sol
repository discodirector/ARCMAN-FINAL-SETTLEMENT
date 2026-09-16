// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title ARCMAN score board
 * @notice Keeps each player's best score per game mode, on the word of the
 *         game's server.
 *
 * The server watches a run, computes the score itself and signs it. This
 * contract checks that signature and nothing else: it has no idea what a level
 * is. Three consequences worth stating plainly —
 *
 *   - whoever holds the signing key can write any score for any player, which
 *     is why the key can be replaced without redeploying;
 *   - anyone may send the transaction. The signature names the player, so a
 *     stranger paying the gas can neither steal a score nor misplace it. That
 *     is the point: on Arc the gas is USDC, and a player who has just finished
 *     their first run has none;
 *   - there is no leaderboard here. Keeping a sorted hundred in storage cost
 *     about six times the price of the score itself, because a new leader
 *     shifts everyone below them. The ranking is built by reading NewBestScore
 *     instead — the chain still holds every score, just not the order.
 */
contract ARCMANScoreBoard {
    struct ScoreData {
        address player;
        uint256 score;
        uint256 levelId;
        uint256 nonce;
        string gameMode;
    }

    struct PlayerRecord {
        uint256 bestScore;
        uint256 levelId;
        uint256 timestamp;
    }

    address public owner;
    address public pendingOwner;

    /// The key the server signs scores with.
    address public serverSigner;

    /// Every signature is spent on use, so none can be replayed.
    mapping(bytes32 => bool) public usedSignatures;

    mapping(address => mapping(string => PlayerRecord)) public playerScores;

    /// Every finished run, whether or not it beat the player's own best.
    event ScoreSubmitted(address indexed player, uint256 score, uint256 levelId, string gameMode);
    /// A player's new best. Read these to build the ranking.
    event NewBestScore(address indexed player, uint256 score, uint256 levelId, string gameMode, uint256 timestamp);
    event SignerChanged(address indexed previousSigner, address indexed newSigner);
    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    error NotOwner();
    error NotPendingOwner();
    error ZeroAddress();
    error ZeroScore();
    error NoGameMode();
    error BadSignature();
    error SignatureAlreadyUsed();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address _owner, address _serverSigner) {
        if (_owner == address(0) || _serverSigner == address(0)) revert ZeroAddress();
        owner = _owner;
        serverSigner = _serverSigner;
        emit OwnershipTransferred(address(0), _owner);
        emit SignerChanged(address(0), _serverSigner);
    }

    // --- scores ------------------------------------------------------------

    /**
     * @notice Record a score the server has signed.
     * @dev The sender is not checked: the signature is what names the player.
     */
    function finalizeScore(ScoreData calldata scoreData, bytes calldata signature) external {
        if (scoreData.player == address(0)) revert ZeroAddress();
        if (scoreData.score == 0) revert ZeroScore();
        if (bytes(scoreData.gameMode).length == 0) revert NoGameMode();

        bytes32 signatureId = keccak256(signature);
        if (usedSignatures[signatureId]) revert SignatureAlreadyUsed();

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                scoreData.player,
                scoreData.score,
                scoreData.levelId,
                scoreData.nonce,
                scoreData.gameMode
            )
        );
        // The server signs the hash itself, so the prefix says 32 bytes.
        bytes32 signedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        if (_recover(signedHash, signature) != serverSigner) revert BadSignature();

        usedSignatures[signatureId] = true;

        PlayerRecord storage record = playerScores[scoreData.player][scoreData.gameMode];
        if (scoreData.score > record.bestScore) {
            record.bestScore = scoreData.score;
            record.levelId = scoreData.levelId;
            record.timestamp = block.timestamp;
            emit NewBestScore(scoreData.player, scoreData.score, scoreData.levelId, scoreData.gameMode, block.timestamp);
        }

        emit ScoreSubmitted(scoreData.player, scoreData.score, scoreData.levelId, scoreData.gameMode);
    }

    // --- reading -----------------------------------------------------------

    function getPlayerScore(address player, string calldata gameMode)
        external
        view
        returns (uint256 bestScore, uint256 levelId, uint256 timestamp)
    {
        PlayerRecord memory record = playerScores[player][gameMode];
        return (record.bestScore, record.levelId, record.timestamp);
    }

    // --- keeping the keys --------------------------------------------------

    function setServerSigner(address newSigner) external onlyOwner {
        if (newSigner == address(0)) revert ZeroAddress();
        emit SignerChanged(serverSigner, newSigner);
        serverSigner = newSigner;
    }

    /// Ownership moves in two steps, so a wrong address cannot strand it.
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

    // --- signatures --------------------------------------------------------

    function _recover(bytes32 hash, bytes calldata signature) private pure returns (address) {
        if (signature.length != 65) revert BadSignature();

        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            let ptr := signature.offset
            r := calldataload(ptr)
            s := calldataload(add(ptr, 32))
            v := byte(0, calldataload(add(ptr, 64)))
        }

        // Every signature has a mirror image with the same meaning. Refusing
        // the upper half keeps one signature from wearing two faces — which
        // would otherwise slip past the replay check above.
        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) revert BadSignature();
        if (v != 27 && v != 28) revert BadSignature();

        address signer = ecrecover(hash, v, r, s);
        if (signer == address(0)) revert BadSignature();
        return signer;
    }
}
