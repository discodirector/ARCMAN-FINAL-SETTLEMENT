// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title USDC Space Launch - Score Verification Contract
 * @notice Verifies and stores game scores with server-signed validation
 */
contract USDCLaunchScore {
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
    
    // Server address that signs scores
    address public serverSigner;
    
    // Mapping of player address and game mode to their best score
    mapping(address => mapping(string => PlayerRecord)) public playerScores;
    
    // Separate leaderboards for each game mode (top 100 each)
    mapping(string => address[]) public leaderboards;
    mapping(string => mapping(address => uint256)) public leaderboardIndices;
    
    // Events
    event ScoreSubmitted(address indexed player, uint256 score, uint256 levelId);
    event LeaderboardUpdated(address indexed player, uint256 newScore);
    
    constructor(address _serverSigner) {
        require(_serverSigner != address(0), "Server signer address cannot be zero");
        serverSigner = _serverSigner;
    }
    
    /**
     * @notice Verify signature and store score
     * @param scoreData The score data to verify
     * @param signature The server signature
     */
    function finalizeScore(
        ScoreData memory scoreData,
        bytes memory signature
    ) external {
        require(scoreData.player == msg.sender, "Player mismatch");
        require(scoreData.score > 0, "Invalid score");
        require(bytes(scoreData.gameMode).length > 0, "Game mode required");
        
        // Verify signature (include game mode in hash)
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                scoreData.player,
                scoreData.score,
                scoreData.levelId,
                scoreData.nonce,
                scoreData.gameMode
            )
        );
        
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        
        address signer = recoverSigner(ethSignedMessageHash, signature);
        require(signer == serverSigner, "Invalid signature");
        
        // Update player's best score for this game mode if this is better
        PlayerRecord storage record = playerScores[scoreData.player][scoreData.gameMode];
        if (scoreData.score > record.bestScore) {
            record.bestScore = scoreData.score;
            record.levelId = scoreData.levelId;
            record.timestamp = block.timestamp;
            record.gameMode = scoreData.gameMode;
            
            updateLeaderboard(scoreData.player, scoreData.score, scoreData.gameMode);
            
            emit ScoreSubmitted(scoreData.player, scoreData.score, scoreData.levelId);
        }
    }
    
    /**
     * @notice Update leaderboard with new score for a specific game mode
     */
    function updateLeaderboard(address player, uint256 score, string memory gameMode) internal {
        address[] storage leaderboard = leaderboards[gameMode];
        mapping(address => uint256) storage leaderboardIndex = leaderboardIndices[gameMode];
        
        uint256 currentIndex = leaderboardIndex[player];
        
        // If player is already on leaderboard
        if (currentIndex > 0) {
            // Remove from current position
            address lastPlayer = leaderboard[leaderboard.length - 1];
            leaderboard[currentIndex - 1] = lastPlayer;
            leaderboardIndex[lastPlayer] = currentIndex;
            leaderboardIndex[player] = 0;
            leaderboard.pop();
        }
        
        // Find insertion point
        uint256 insertIndex = leaderboard.length;
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (playerScores[leaderboard[i]][gameMode].bestScore < score) {
                insertIndex = i;
                break;
            }
        }
        
        // Insert at position
        if (insertIndex < 100) {
            leaderboard.push(player);
            for (uint256 i = leaderboard.length - 1; i > insertIndex; i--) {
                leaderboard[i] = leaderboard[i - 1];
                leaderboardIndex[leaderboard[i]] = i + 1;
            }
            leaderboard[insertIndex] = player;
            leaderboardIndex[player] = insertIndex + 1;
            
            // Trim to top 100
            if (leaderboard.length > 100) {
                address removed = leaderboard[100];
                leaderboardIndex[removed] = 0;
                leaderboard.pop();
            }
            
            emit LeaderboardUpdated(player, score);
        }
    }
    
    /**
     * @notice Get top N players from leaderboard for a specific game mode
     */
    function getLeaderboard(uint256 count, string memory gameMode) external view returns (
        address[] memory players,
        uint256[] memory scores
    ) {
        address[] storage leaderboard = leaderboards[gameMode];
        uint256 length = count < leaderboard.length ? count : leaderboard.length;
        players = new address[](length);
        scores = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            players[i] = leaderboard[i];
            scores[i] = playerScores[leaderboard[i]][gameMode].bestScore;
        }
    }
    
    /**
     * @notice Get player's best score for a specific game mode
     */
    function getPlayerScore(address player, string memory gameMode) external view returns (
        uint256 bestScore,
        uint256 levelId,
        uint256 timestamp
    ) {
        PlayerRecord memory record = playerScores[player][gameMode];
        return (record.bestScore, record.levelId, record.timestamp);
    }
    
    /**
     * @notice Recover signer from signature
     */
    function recoverSigner(bytes32 messageHash, bytes memory signature) 
        internal 
        pure 
        returns (address) 
    {
        require(signature.length == 65, "Invalid signature length");
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        if (v < 27) {
            v += 27;
        }
        
        require(v == 27 || v == 28, "Invalid signature");
        
        return ecrecover(messageHash, v, r, s);
    }
}


