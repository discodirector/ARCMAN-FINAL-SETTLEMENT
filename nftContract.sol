// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ARCMAN: Final Settlement - Completion NFT
 * @notice ERC-721 NFT contract for minting game completion certificates
 */
contract ARCMANCompletionNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Mapping from player address and game mode to their completion NFT token ID
    // Allows one NFT per player per game mode (e.g., one for Immortal, one for Tournament)
    mapping(address => mapping(string => uint256)) public playerCompletionNFT;
    
    // Mapping from token ID to game completion data
    struct CompletionData {
        uint256 finalScore;
        uint256 levelsCompleted;
        uint256 completionTime;
        string gameMode;
        uint256 timestamp;
    }
    
    mapping(uint256 => CompletionData) public tokenCompletionData;
    
    // Events
    event CompletionNFTMinted(
        address indexed player,
        uint256 indexed tokenId,
        uint256 finalScore,
        uint256 levelsCompleted,
        string gameMode
    );
    
    constructor() ERC721("ARCMAN Final Settlement Completion", "ARCMAN") Ownable(msg.sender) {}
    
    /**
     * @notice Mint a completion NFT for a player
     * @param player The address of the player who completed the game
     * @param finalScore The final score achieved
     * @param levelsCompleted The number of levels completed
     * @param completionTime The time taken to complete (in seconds)
     * @param gameMode The game mode ("Immortal" or "Tournament")
     * @param tokenURI The metadata URI for the NFT
     */
    function mintCompletionNFT(
        address player,
        uint256 finalScore,
        uint256 levelsCompleted,
        uint256 completionTime,
        string memory gameMode,
        string memory tokenURI
    ) external returns (uint256) {
        // Only allow players to mint for themselves
        require(
            msg.sender == player,
            "Can only mint for yourself"
        );
        
        // Check if player already has a completion NFT for this game mode
        require(
            playerCompletionNFT[player][gameMode] == 0,
            "Player already has a completion NFT for this game mode"
        );
        
        // Increment token ID
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Mint NFT to player
        _safeMint(player, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // Store completion data
        tokenCompletionData[newTokenId] = CompletionData({
            finalScore: finalScore,
            levelsCompleted: levelsCompleted,
            completionTime: completionTime,
            gameMode: gameMode,
            timestamp: block.timestamp
        });
        
        // Map player and game mode to token ID
        playerCompletionNFT[player][gameMode] = newTokenId;
        
        emit CompletionNFTMinted(
            player,
            newTokenId,
            finalScore,
            levelsCompleted,
            gameMode
        );
        
        return newTokenId;
    }
    
    /**
     * @notice Check if a player has a completion NFT for a specific game mode
     * @param player The address to check
     * @param gameMode The game mode to check ("Immortal" or "Tournament")
     * @return True if player has a completion NFT for this game mode, false otherwise
     */
    function hasCompletionNFT(address player, string memory gameMode) external view returns (bool) {
        return playerCompletionNFT[player][gameMode] != 0;
    }
    
    /**
     * @notice Get the completion NFT token ID for a player and game mode
     * @param player The address to check
     * @param gameMode The game mode to check ("Immortal" or "Tournament")
     * @return The token ID (0 if player doesn't have one for this game mode)
     */
    function getPlayerTokenId(address player, string memory gameMode) external view returns (uint256) {
        return playerCompletionNFT[player][gameMode];
    }
    
    /**
     * @notice Get completion data for a token
     * @param tokenId The token ID
     * @return The completion data struct
     */
    function getCompletionData(uint256 tokenId) external view returns (CompletionData memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenCompletionData[tokenId];
    }
    
    /**
     * @notice Get total number of minted NFTs
     * @return The total supply
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds.current();
    }
}

