// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title ARCMAN score board
 * @notice Keeps each player's best score per game mode and a leaderboard of the
 *         top hundred, on the word of the game's server.
 *
 * The server watches a run, computes the score itself and signs it. This
 * contract checks that signature and nothing else: it has no idea what a level
 * is. Two consequences worth stating plainly —
 *
 *   - whoever holds the signing key can write any score for any player, which
 *     is why the key can be replaced without redeploying;
 *   - anyone may send the transaction. The signature names the player, so a
 *     stranger paying the gas cannot steal or misplace a score. That is the
 *     point: on Arc the gas is USDC, and a player who has just finished their
 *     first run has none.
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
        string gameMode;
    }

    uint256 public constant LEADERBOARD_SIZE = 100;

    address public owner;
    address public pendingOwner;

    /// The key the server signs scores with.
    address public serverSigner;

    /// Every score the server has signed, so none can be replayed.
    mapping(bytes32 => bool) public usedSignatures;

    mapping(address => mapping(string => PlayerRecord)) public playerScores;

    /// One leaderboard per game mode, best first.
    mapping(string => address[]) public leaderboards;
    /// Position of a player on their mode's board, one-based; 0 means absent.
    mapping(string => mapping(address => uint256)) private leaderboardIndices;

    event ScoreSubmitted(address indexed player, uint256 score, uint256 levelId, string gameMode);
    event LeaderboardUpdated(address indexed player, uint256 newScore, string gameMode);
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
            record.gameMode = scoreData.gameMode;

            _place(scoreData.player, scoreData.score, scoreData.gameMode);
        }

        emit ScoreSubmitted(scoreData.player, scoreData.score, scoreData.levelId, scoreData.gameMode);
    }

    /**
     * @dev Put a player at their place on the board, best first. The old entry
     *      is lifted out by shifting the rest up rather than by swapping the
     *      last one into the gap: a swap is cheaper but leaves the board out of
     *      order, and every later insertion then lands in the wrong place.
     */
    function _place(address player, uint256 score, string calldata gameMode) private {
        address[] storage board = leaderboards[gameMode];
        mapping(address => uint256) storage indexOf = leaderboardIndices[gameMode];

        uint256 held = indexOf[player];
        if (held != 0) {
            for (uint256 i = held - 1; i + 1 < board.length; i++) {
                board[i] = board[i + 1];
                indexOf[board[i]] = i + 1;
            }
            indexOf[player] = 0;
            board.pop();
        }

        uint256 place = board.length;
        for (uint256 i = 0; i < board.length; i++) {
            if (playerScores[board[i]][gameMode].bestScore < score) {
                place = i;
                break;
            }
        }
        if (place >= LEADERBOARD_SIZE) return;   // not good enough for a full board

        board.push(player);
        for (uint256 i = board.length - 1; i > place; i--) {
            board[i] = board[i - 1];
            indexOf[board[i]] = i + 1;
        }
        board[place] = player;
        indexOf[player] = place + 1;

        if (board.length > LEADERBOARD_SIZE) {
            indexOf[board[LEADERBOARD_SIZE]] = 0;
            board.pop();
        }

        emit LeaderboardUpdated(player, score, gameMode);
    }

    // --- reading -----------------------------------------------------------

    function getLeaderboard(uint256 count, string calldata gameMode)
        external
        view
        returns (address[] memory players, uint256[] memory scores)
    {
        address[] storage board = leaderboards[gameMode];
        uint256 length = count < board.length ? count : board.length;
        players = new address[](length);
        scores = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            players[i] = board[i];
            scores[i] = playerScores[board[i]][gameMode].bestScore;
        }
    }

    function getPlayerScore(address player, string calldata gameMode)
        external
        view
        returns (uint256 bestScore, uint256 levelId, uint256 timestamp)
    {
        PlayerRecord memory record = playerScores[player][gameMode];
        return (record.bestScore, record.levelId, record.timestamp);
    }

    function leaderboardLength(string calldata gameMode) external view returns (uint256) {
        return leaderboards[gameMode].length;
    }

    function leaderboardPosition(address player, string calldata gameMode) external view returns (uint256) {
        return leaderboardIndices[gameMode][player];
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
