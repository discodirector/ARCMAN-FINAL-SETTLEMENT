// Game Configuration Module
const GameConfig = {
    // Base dimensions for scaling
    BASE_CONFIG: {
        width: 800,
        height: 600,
        gravity: 0.3,
        coinSpeed: 8,
        starCount: 100,
        timeScale: 0.5 // Time scale factor (1.0 = normal speed, < 1.0 = slower, > 1.0 = faster)
    },
    
    // Current game config (scaled) - will be updated at runtime
    CONFIG: {},
    
    // Color constants
    COLORS: {
        cyan: '#0ff',
        magenta: '#f0f',
        yellow: '#ff0',
        white: '#fff',
        black: '#000',
        silver: '#c0c0c0',
        silverLight: '#e8e8e8',
        silverDark: '#a0a0a0',
        peach: '#e8c99a', // Light reddish-brown/peach color (lighter)
        usdcBlue: '#2775CA' // USDC logo blue color
    },
    
    // Tournament mode constants
    MAX_TOURNAMENT_LIVES: 5,
    
    // Player size scaling (1.0 = default size, 1.5 = 50% bigger, 2.0 = double size, etc.)
    PLAYER_SIZE_SCALE: 2.0,
    
    // Optional coin sprite image path (set to null or empty string to use drawn logo)
    // Example: 'images/coin.png' or 'images/usdc-logo.png'
    COIN_SPRITE_PATH: 'images/coin.png',
    
    // Player animation configuration
    // Set to null to use drawn character, or configure for PNG sequence animation
    PLAYER_ANIMATION: {
        // Default/idle animation (plays when not aiming)
        idle: {
            pathPattern: 'images/player/player-{n}.png',
            frameCount: 8, // Number of frames in animation (1-indexed, so 8 means frames 1-8)
            frameRate: 8, // Frames per second (animation speed)
            numberingStyle: 'single' // 'single' (1,2,3) or 'double' (01,02,03) or 'triple' (001,002,003)
        },
        // Throwing/aiming animation (plays when player is aiming/choosing throw strength)
        throwing: {
            pathPattern: 'images/player/player-throw-{n}.png',
            frameCount: 2, // Number of frames in animation
            frameRate: 8, // Frames per second (animation speed)
            numberingStyle: 'single'
        }
    },
    
    // Blockchain configuration
    BLOCKCHAIN: {
        // Contract addresses (update these after deployment)
        CONTRACT_ADDRESS: '0x1E880c3165f5f2ee6B4d00598C9B5e1BfAC6ED0f', // Will be set after contract deployment
        NFT_CONTRACT_ADDRESS: '0x6695B1B9d03fB3E94fdC7599abeB97DDF3E9a764', // NFT contract address (set after deployment)
        // Network configuration
        NETWORK: 'ArcTestnet', // 'sepolia', 'mainnet', 'localhost', 'ArcTestnet'
        // RPC URLs (using public endpoints - in production, use your own)
        RPC_URLS: {
            ArcTestnet: 'https://rpc.testnet.arc.network',
            sepolia: 'https://rpc.sepolia.org',
            localhost: 'http://localhost:8545'
        },
        // Chain IDs
        CHAIN_IDS: {
            ArcTestnet: 5042002, // Arc Testnet chain ID
            sepolia: 11155111, // Sepolia testnet (corrected)
            localhost: 1337
        },
        // Backend API URL
        API_URL: 'https://localhost:3000', // Update for production
        // NFT image URLs for each game mode
        // For development: use local paths (images/nft-immortal.png, images/nft-tournament.png)
        // For production: replace with IPFS/CDN URLs (e.g., https://ipfs.io/ipfs/QmXx...)
        NFT_IMAGES: {
            Immortal: 'https://black-generous-crocodile-850.mypinata.cloud/ipfs/bafybeicayq4fii7wd52rzqkhysvjd6vhohzxvw2ooez34fssrpvzfizuta', // Local file for development, replace with IPFS/CDN for production
            Tournament: 'https://black-generous-crocodile-850.mypinata.cloud/ipfs/bafybeiabkfecwarftaaaj3vvgavqaco4idmvshbtzkwbaqbrwu5qdsejoy' // Local file for development, replace with IPFS/CDN for production
        }
    },
    
    // Initialize CONFIG from BASE_CONFIG
    init: function() {
        this.CONFIG = { ...this.BASE_CONFIG };
    }
};

// Initialize on load
GameConfig.init();

