// NFT Minting Module
const NFTManager = {
    // NFT contract instance
    contract: null,
    
    // Initialize NFT contract
    initializeContract: async function() {
        if (!Web3Manager.isConnected()) {
            console.warn('Wallet not connected. Cannot initialize NFT contract.');
            return false;
        }
        
        if (!GameConfig.BLOCKCHAIN.NFT_CONTRACT_ADDRESS) {
            console.warn('NFT contract address not configured.');
            return false;
        }
        
        try {
            const provider = Web3Manager.provider;
            const signer = Web3Manager.signer;
            
            // NFT Contract ABI
            const nftABI = [
                "function mintCompletionNFT(address player, uint256 finalScore, uint256 levelsCompleted, uint256 completionTime, string memory gameMode, string memory tokenURI) external returns (uint256)",
                "function hasCompletionNFT(address player, string memory gameMode) external view returns (bool)",
                "function getPlayerTokenId(address player, string memory gameMode) external view returns (uint256)",
                "function getCompletionData(uint256 tokenId) external view returns ((uint256 finalScore, uint256 levelsCompleted, uint256 completionTime, string memory gameMode, uint256 timestamp))",
                "function totalSupply() external view returns (uint256)",
                "function tokenURI(uint256 tokenId) external view returns (string memory)",
                "function ownerOf(uint256 tokenId) external view returns (address)",
                "event CompletionNFTMinted(address indexed player, uint256 indexed tokenId, uint256 finalScore, uint256 levelsCompleted, string gameMode)"
            ];
            
            this.contract = new ethers.Contract(
                GameConfig.BLOCKCHAIN.NFT_CONTRACT_ADDRESS,
                nftABI,
                signer
            );
            
            console.log('NFT contract initialized:', GameConfig.BLOCKCHAIN.NFT_CONTRACT_ADDRESS);
            return true;
        } catch (error) {
            console.error('Error initializing NFT contract:', error);
            return false;
        }
    },
    
    // Check if player already has a completion NFT for a specific game mode
    hasCompletionNFT: async function(address, gameMode) {
        if (!this.contract) {
            const initialized = await this.initializeContract();
            if (!initialized) {
                return false;
            }
        }
        
        if (!gameMode) {
            console.warn('Game mode not provided for hasCompletionNFT check');
            return false;
        }
        
        try {
            const hasNFT = await this.contract.hasCompletionNFT(address, gameMode);
            return hasNFT;
        } catch (error) {
            console.error('Error checking completion NFT:', error);
            return false;
        }
    },
    
    // Get player's token ID for a specific game mode
    getPlayerTokenId: async function(address, gameMode) {
        if (!this.contract) {
            const initialized = await this.initializeContract();
            if (!initialized) {
                return 0;
            }
        }
        
        if (!gameMode) {
            console.warn('Game mode not provided for getPlayerTokenId');
            return 0;
        }
        
        try {
            const tokenId = await this.contract.getPlayerTokenId(address, gameMode);
            return tokenId.toString();
        } catch (error) {
            console.error('Error getting player token ID:', error);
            return 0;
        }
    },
    
    // Get image URL based on game mode
    getImageForGameMode: function(gameMode) {
        // Get image URLs from config, with fallback defaults
        const imageUrls = GameConfig.BLOCKCHAIN.NFT_IMAGES || {
            'Immortal': 'https://via.placeholder.com/512/0ff/000000?text=ARCMAN+Immortal',
            'Tournament': 'https://via.placeholder.com/512/f0f/000000?text=ARCMAN+Tournament'
        };
        
        // Return the image for the game mode, or default if not found
        return imageUrls[gameMode] || imageUrls['Immortal'] || 'https://via.placeholder.com/512/2775CA/FFFFFF?text=ARCMAN+Completion';
    },
    
    // Generate NFT metadata
    generateMetadata: function(gameData) {
        const completionDate = new Date(gameData.timestamp);
        const dateStr = completionDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Get image based on game mode
        const imageUrl = this.getImageForGameMode(gameData.gameMode || 'Immortal');
        
        return {
            name: "ARCMAN: Final Settlement - Completion Certificate",
            description: `Certificate of completion for ARCMAN: Final Settlement. Player completed the game in ${gameData.gameMode} mode.`,
            image: imageUrl,
            attributes: [
                { trait_type: "Completion Date", value: dateStr },
                { trait_type: "Game Mode", value: gameData.gameMode || 'Immortal' }
            ],
            external_url: "https://arcmangame.com"
        };
    },
    
    // Generate token URI (for now, we'll use a data URI or server endpoint)
    generateTokenURI: async function(gameData) {
        // Option 1: Use server endpoint to store metadata
        try {
            const metadata = this.generateMetadata(gameData);
            const response = await fetch(`${GameConfig.BLOCKCHAIN.API_URL}/api/nft/metadata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(metadata)
            });
            
            if (response.ok) {
                const result = await response.json();
                return result.uri || `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
            }
        } catch (error) {
            console.warn('Failed to store metadata on server, using data URI:', error);
        }
        
        // Option 2: Fallback to data URI
        const metadata = this.generateMetadata(gameData);
        return `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
    },
    
    // Mint NFT for game completion
    mintNFT: async function(gameData) {
        if (!Web3Manager.isConnected()) {
            throw new Error('Wallet not connected');
        }
        
        if (!this.contract) {
            const initialized = await this.initializeContract();
            if (!initialized) {
                throw new Error('Failed to initialize NFT contract');
            }
        }
        
        const playerAddress = Web3Manager.currentAccount;
        const gameMode = gameData.gameMode || 'Immortal';
        
        // Check if player already has NFT for this game mode
        const hasNFT = await this.hasCompletionNFT(playerAddress, gameMode);
        if (hasNFT) {
            throw new Error(`You already have a completion NFT for ${gameMode} mode`);
        }
        
        try {
            // Generate token URI
            const tokenURI = await this.generateTokenURI(gameData);
            
            // Prepare mint parameters
            const finalScore = BigInt(gameData.finalScore);
            const levelsCompleted = BigInt(gameData.levelsCompleted);
            const completionTime = BigInt(Math.floor(gameData.completionTime));
            const gameMode = gameData.gameMode || 'Immortal';
            
            // Estimate gas
            const gasEstimate = await this.contract.mintCompletionNFT.estimateGas(
                playerAddress,
                finalScore,
                levelsCompleted,
                completionTime,
                gameMode,
                tokenURI
            );
            
            // Mint NFT
            const tx = await this.contract.mintCompletionNFT(
                playerAddress,
                finalScore,
                levelsCompleted,
                completionTime,
                gameMode,
                tokenURI,
                { gasLimit: gasEstimate * BigInt(120) / BigInt(100) } // Add 20% buffer
            );
            
            console.log('NFT minting transaction sent:', tx.hash);
            
            // Wait for transaction
            const receipt = await tx.wait();
            console.log('NFT minted! Transaction confirmed:', receipt);
            
            // Get token ID from event
            const mintEvent = receipt.logs.find(log => {
                try {
                    const parsed = this.contract.interface.parseLog(log);
                    return parsed && parsed.name === 'CompletionNFTMinted';
                } catch {
                    return false;
                }
            });
            
            let tokenId = null;
            if (mintEvent) {
                const parsed = this.contract.interface.parseLog(mintEvent);
                tokenId = parsed.args.tokenId.toString();
            } else {
                // Fallback: query the contract
                tokenId = await this.getPlayerTokenId(playerAddress, gameMode);
            }
            
            return {
                success: true,
                tokenId: tokenId,
                txHash: tx.hash,
                receipt: receipt
            };
        } catch (error) {
            console.error('Error minting NFT:', error);
            throw error;
        }
    },
    
    // Get NFT metadata
    getNFTMetadata: async function(tokenId) {
        if (!this.contract) {
            const initialized = await this.initializeContract();
            if (!initialized) {
                return null;
            }
        }
        
        try {
            const tokenURI = await this.contract.tokenURI(tokenId);
            
            // If it's a data URI, parse it
            if (tokenURI.startsWith('data:')) {
                const base64 = tokenURI.split(',')[1];
                const json = atob(base64);
                return JSON.parse(json);
            }
            
            // Otherwise, fetch from URL
            const response = await fetch(tokenURI);
            if (response.ok) {
                return await response.json();
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching NFT metadata:', error);
            return null;
        }
    },
    
    // Get completion data from contract
    getCompletionData: async function(tokenId) {
        if (!this.contract) {
            const initialized = await this.initializeContract();
            if (!initialized) {
                return null;
            }
        }
        
        try {
            const data = await this.contract.getCompletionData(tokenId);
            return {
                finalScore: data.finalScore.toString(),
                levelsCompleted: data.levelsCompleted.toString(),
                completionTime: data.completionTime.toString(),
                gameMode: data.gameMode,
                timestamp: data.timestamp.toString()
            };
        } catch (error) {
            console.error('Error fetching completion data:', error);
            return null;
        }
    },
    
    // Get player's NFTs for all game modes
    getPlayerNFTs: async function(address) {
        if (!this.contract) {
            const initialized = await this.initializeContract();
            if (!initialized) {
                return [];
            }
        }
        
        try {
            const nfts = [];
            
            // Check for Immortal mode NFT
            const immortalTokenId = await this.getPlayerTokenId(address, 'Immortal');
            if (immortalTokenId !== '0') {
                nfts.push({ tokenId: immortalTokenId, gameMode: 'Immortal' });
            }
            
            // Check for Tournament mode NFT
            const tournamentTokenId = await this.getPlayerTokenId(address, 'Tournament');
            if (tournamentTokenId !== '0') {
                nfts.push({ tokenId: tournamentTokenId, gameMode: 'Tournament' });
            }
            
            return nfts;
        } catch (error) {
            console.error('Error fetching player NFTs:', error);
            return [];
        }
    },
    
    // Format address for display
    formatAddress: function(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    },
    
    // Get transaction URL
    getTransactionUrl: function(txHash) {
        const network = GameConfig.BLOCKCHAIN.NETWORK;
        if (network === 'ArcTestnet') {
            return `https://testnet.arcscan.app/tx/${txHash}`;
        } else if (network === 'sepolia') {
            return `https://sepolia.etherscan.io/tx/${txHash}`;
        }
        return `https://etherscan.io/tx/${txHash}`;
    },
    
    // Get token URL for block explorer
    getTokenUrl: function(tokenId) {
        if (!tokenId || tokenId === '0' || !GameConfig.BLOCKCHAIN.NFT_CONTRACT_ADDRESS) {
            return '#';
        }
        
        const network = GameConfig.BLOCKCHAIN.NETWORK;
        const contractAddress = GameConfig.BLOCKCHAIN.NFT_CONTRACT_ADDRESS;
        
        if (network === 'ArcTestnet') {
            // ArcTestnet uses /instance/ between contract address and token ID
            return `https://testnet.arcscan.app/token/${contractAddress}/instance/${tokenId}`;
        } else if (network === 'sepolia') {
            return `https://sepolia.etherscan.io/token/${contractAddress}?a=${tokenId}`;
        } else if (network === 'mainnet') {
            return `https://etherscan.io/token/${contractAddress}?a=${tokenId}`;
        }
        
        return '#';
    }
};

