// Web3 Integration Module
const Web3Manager = {
    // Provider and signer
    provider: null,
    signer: null,
    contract: null,
    
    // Current account
    currentAccount: null,
    
    // Contract ABI (matching contract.sol)
    // The board keeps scores; the ranking is read from its events by the
    // server, so there is no getLeaderboard to call here.
    CONTRACT_ABI: [
        "function finalizeScore((address player, uint256 score, uint256 levelId, uint256 nonce, string gameMode), bytes signature) external",
        "function getPlayerScore(address player, string gameMode) external view returns (uint256 bestScore, uint256 levelId, uint256 timestamp)",
        "function playerScores(address, string) external view returns (uint256 bestScore, uint256 levelId, uint256 timestamp)",
        "event ScoreSubmitted(address indexed player, uint256 score, uint256 levelId, string gameMode)",
        "event NewBestScore(address indexed player, uint256 score, uint256 levelId, string gameMode, uint256 timestamp)"
    ],
    
    // Check if wallet is connected
    isConnected: function() {
        return this.currentAccount !== null && this.signer !== null;
    },
    
    // Where a player can go and see a transaction for themselves
    getTransactionUrl: function(txHash) {
        const network = GameConfig.BLOCKCHAIN.NETWORK;
        if (network === 'ArcMainnet') return `https://explorer.arc.io/tx/${txHash}`;
        return `https://explorer.testnet.arc.io/tx/${txHash}`;
    },

    // Get a read-only provider (no wallet required) for view-only contract calls
    getReadOnlyProvider: function() {
        const network = GameConfig.BLOCKCHAIN.NETWORK;
        const rpcUrl = GameConfig.BLOCKCHAIN.RPC_URLS[network];
        if (!rpcUrl) {
            throw new Error(`No RPC URL configured for network: ${network}`);
        }
        return new ethers.JsonRpcProvider(rpcUrl);
    },
    
    // Check if page is using file:// protocol (wallets don't work with file://)
    isFileProtocol: function() {
        return window.location.protocol === 'file:';
    },
    
    // Check if any wallet provider is installed
    isWalletInstalled: function() {
        if (typeof window === 'undefined') {
            return false;
        }
        
        // Check for file:// protocol first
        if (this.isFileProtocol()) {
            console.warn('Page loaded via file:// protocol. Wallets require HTTP/HTTPS.');
            return false;
        }
        
        // Check for window.ethereum (standard EIP-1193)
        if (window.ethereum) {
            return true;
        }
        
        // Check for legacy web3 (some older wallets)
        if (window.web3 && window.web3.currentProvider) {
            return true;
        }
        
        // Check for specific wallet objects (some wallets inject differently)
        if (window.rabby || window.ethereum?.isRabby) {
            return true;
        }
        
        if (window.metamask || window.ethereum?.isMetaMask) {
            return true;
        }
        
        return false;
    },
    
    // Diagnostic function to check wallet status
    diagnoseWallet: function() {
        const diagnosis = {
            protocol: window.location.protocol,
            isFileProtocol: this.isFileProtocol(),
            hasEthereum: !!window.ethereum,
            ethereumType: typeof window.ethereum,
            ethereumKeys: window.ethereum ? Object.keys(window.ethereum).slice(0, 10) : [],
            isMetaMask: window.ethereum?.isMetaMask,
            isRabby: window.ethereum?.isRabby,
            hasProviders: !!window.ethereum?.providers,
            providerCount: window.ethereum?.providers?.length || 0,
            hasWeb3: !!window.web3,
            hasRabby: !!window.rabby,
            hasMetamask: !!window.metamask
        };
        
        console.log('Wallet Diagnosis:', diagnosis);
        return diagnosis;
    },
    
    // Check if MetaMask is installed
    isMetaMaskInstalled: function() {
        return this.isWalletInstalled() && (window.ethereum.isMetaMask || window.ethereum.providers?.some(p => p.isMetaMask));
    },
    
    // Check if Rabby is installed
    isRabbyInstalled: function() {
        return this.isWalletInstalled() && (window.ethereum.isRabby || window.ethereum.providers?.some(p => p.isRabby));
    },
    
    // Get the wallet provider (MetaMask, Rabby, or first available)
    getWalletProvider: function() {
        if (!this.isWalletInstalled()) {
            console.log('Wallet detection: window.ethereum =', window.ethereum);
            console.log('Wallet detection: window.web3 =', window.web3);
            console.log('Wallet detection: window.rabby =', window.rabby);
            console.log('Wallet detection: window.metamask =', window.metamask);
            return null;
        }
        
        // Check for window.ethereum first (most common)
        if (window.ethereum) {
            // If multiple providers, prefer MetaMask or Rabby
            if (window.ethereum.providers && Array.isArray(window.ethereum.providers) && window.ethereum.providers.length > 0) {
                // Try Rabby first (if user prefers it)
                const rabby = window.ethereum.providers.find(p => p.isRabby);
                if (rabby) {
                    console.log('Selected wallet provider: Rabby');
                    return rabby;
                }
                
                // Then MetaMask
                const metamask = window.ethereum.providers.find(p => p.isMetaMask);
                if (metamask) {
                    console.log('Selected wallet provider: MetaMask');
                    return metamask;
                }
                
                // Fallback to first provider
                console.log('Selected wallet provider: First available');
                return window.ethereum.providers[0];
            }
            
            // Single provider
            console.log('Selected wallet provider: window.ethereum');
            return window.ethereum;
        }
        
        // Fallback to legacy web3
        if (window.web3 && window.web3.currentProvider) {
            console.log('Selected wallet provider: Legacy web3');
            return window.web3.currentProvider;
        }
        
        return null;
    },
    
    // Get wallet name for display
    getWalletName: function() {
        if (this.isRabbyInstalled()) return 'Rabby';
        if (this.isMetaMaskInstalled()) return 'MetaMask';
        if (this.isWalletInstalled()) return 'Wallet';
        return 'Wallet';
    },
    
    // Wait for wallet to be injected (some wallets take time to load)
    waitForWallet: async function(timeout = 5000) {
        // Check file protocol first
        if (this.isFileProtocol()) {
            console.error('Cannot detect wallet: Page is loaded via file:// protocol');
            return false;
        }
        
        const startTime = Date.now();
        let lastCheck = false;
        
        while (Date.now() - startTime < timeout) {
            const currentCheck = window.ethereum !== undefined;
            
            // Log when wallet appears
            if (currentCheck && !lastCheck) {
                console.log('Wallet detected after', Date.now() - startTime, 'ms');
            }
            
            if (this.isWalletInstalled()) {
                return true;
            }
            
            lastCheck = currentCheck;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Final diagnostic if still not found
        if (!this.isWalletInstalled()) {
            this.diagnoseWallet();
        }
        
        return false;
    },
    
    // Connect to wallet
    connectWallet: async function() {
        try {
            // First, wait a bit for wallet to be injected (in case it's still loading)
            console.log('Waiting for wallet injection...');
            const walletAvailable = await this.waitForWallet(2000);
            
            // Check if any wallet is installed
            if (!this.isWalletInstalled()) {
                const walletName = this.getWalletName();
                throw new Error(t('wallet.notInstalled', { wallet: walletName }));
            }
            
            // Get the appropriate provider
            const provider = this.getWalletProvider();
            if (!provider) {
                throw new Error(t('wallet.noProvider'));
            }
            
            const providerName = provider.isMetaMask ? 'MetaMask' : (provider.isRabby ? 'Rabby' : 'Unknown');
            console.log('Connecting to wallet provider:', providerName);
            
            // Request account access
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            
            if (!accounts || accounts.length === 0) {
                throw new Error(t('wallet.noAccounts'));
            }
            
            // Get provider and signer
            this.provider = new ethers.BrowserProvider(provider);
            this.signer = await this.provider.getSigner();
            this.currentAccount = accounts[0];
            
            // Check network and switch if needed
            await this.checkNetwork();
            
            // Re-initialize provider/signer after potential network switch
            this.provider = new ethers.BrowserProvider(provider);
            this.signer = await this.provider.getSigner();
            
            // Initialize contract if address is set
            if (GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS) {
                this.initializeContract();
            }
            
            const walletName = this.getWalletName();
            console.log(`Wallet connected (${walletName}):`, this.currentAccount);
            return this.currentAccount;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            
            // Provide more helpful error messages
            if (error.code === 4001) {
                throw new Error(t('wallet.rejected'));
            } else if (error.code === -32002) {
                throw new Error(t('wallet.pending'));
            } else if (error.message) {
                throw error;
            } else {
                throw new Error(t('wallet.connectFailed'));
            }
        }
    },
    
    // Check and switch network if needed
    checkNetwork: async function() {
        if (!this.provider) return;
        
        const provider = this.getWalletProvider();
        if (!provider) return;
        
        // Get expected chain ID from config
        const expectedChainId = GameConfig.BLOCKCHAIN.CHAIN_IDS[GameConfig.BLOCKCHAIN.NETWORK];
        
        // If no chain ID configured for this network, skip network check
        if (expectedChainId === undefined) {
            console.warn(`No chain ID configured for network: ${GameConfig.BLOCKCHAIN.NETWORK}. Skipping network check.`);
            return;
        }
        
        try {
            const network = await this.provider.getNetwork();
            
            // Convert both to BigInt for comparison (ethers v6 returns chainId as BigInt)
            const currentChainId = typeof network.chainId === 'bigint' 
                ? network.chainId 
                : BigInt(network.chainId || 0);
            const expectedChainIdBigInt = BigInt(expectedChainId);
            
            if (currentChainId !== expectedChainIdBigInt) {
                console.log(`Current network: ${currentChainId}, Required: ${expectedChainIdBigInt}. Switching to ${GameConfig.BLOCKCHAIN.NETWORK}...`);
                try {
                    // Try to switch network
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x' + expectedChainId.toString(16) }]
                    });
                    console.log(`Successfully switched to ${GameConfig.BLOCKCHAIN.NETWORK}`);
                } catch (switchError) {
                    // If network doesn't exist, try to add it
                    if (switchError.code === 4902) {
                        console.log(`Network not found in wallet. Adding ${GameConfig.BLOCKCHAIN.NETWORK}...`);
                        const networkConfig = this.getNetworkConfig();
                        if (networkConfig) {
                            await provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [networkConfig]
                            });
                            console.log(`Successfully added ${GameConfig.BLOCKCHAIN.NETWORK}`);
                        } else {
                            throw new Error(`Cannot add network: Network configuration not available for ${GameConfig.BLOCKCHAIN.NETWORK}`);
                        }
                    } else if (switchError.code === 4001) {
                        throw new Error(t('wallet.switchNetwork', { network: GameConfig.BLOCKCHAIN.NETWORK }));
                    } else {
                        throw new Error(`Failed to switch network: ${switchError.message}`);
                    }
                }
                
                // Verify we're on the correct network after switching
                const networkAfter = await this.provider.getNetwork();
                const chainIdAfter = typeof networkAfter.chainId === 'bigint' 
                    ? networkAfter.chainId 
                    : BigInt(networkAfter.chainId || 0);
                if (chainIdAfter !== expectedChainIdBigInt) {
                    throw new Error(t('wallet.switchFailed', { network: GameConfig.BLOCKCHAIN.NETWORK }));
                }
            } else {
                console.log(`Connected to ${GameConfig.BLOCKCHAIN.NETWORK} (chain ID: ${currentChainId})`);
            }
        } catch (error) {
            console.warn('Network check failed:', error);
            // Don't throw - allow connection to proceed even if network check fails
        }
    },
    
    // Get network configuration for adding
    getNetworkConfig: function() {
        const chainId = GameConfig.BLOCKCHAIN.CHAIN_IDS[GameConfig.BLOCKCHAIN.NETWORK];
        const rpcUrl = GameConfig.BLOCKCHAIN.RPC_URLS[GameConfig.BLOCKCHAIN.NETWORK];
        
        const networks = {
            ArcMainnet: {
                chainId: '0x' + chainId.toString(16),
                chainName: 'Arc',
                // On Arc the gas is USDC itself. The wallet shows it with
                // eighteen decimals even though the token has six.
                nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
                rpcUrls: [rpcUrl],
                blockExplorerUrls: ['https://explorer.arc.io']
            },
            ArcTestnet: {
                chainId: '0x' + chainId.toString(16),
                chainName: 'Arc Testnet',
                nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
                rpcUrls: [rpcUrl],
                blockExplorerUrls: ['https://explorer.testnet.arc.io']
            }
        };
        
        return networks[GameConfig.BLOCKCHAIN.NETWORK] || networks.ArcTestnet;
    },
    
    // Get current account
    getAccount: async function() {
        if (this.currentAccount) {
            return this.currentAccount;
        }
        
        if (this.isWalletInstalled()) {
            const provider = this.getWalletProvider();
            if (provider) {
                try {
                    const accounts = await provider.request({ method: 'eth_accounts' });
                    if (accounts && accounts.length > 0) {
                        this.currentAccount = accounts[0];
                        this.provider = new ethers.BrowserProvider(provider);
                        this.signer = await this.provider.getSigner();
                        if (GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS) {
                            this.initializeContract();
                        }
                        return this.currentAccount;
                    }
                } catch (error) {
                    console.error('Error getting accounts:', error);
                }
            }
        }
        
        return null;
    },
    
    // Disconnect wallet
    disconnectWallet: function() {
        this.currentAccount = null;
        this.signer = null;
        this.contract = null;
        console.log('Wallet disconnected');
    },
    
    // Initialize contract instance
    initializeContract: function() {
        if (!this.signer || !GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS) {
            console.warn('Cannot initialize contract: signer or contract address missing');
            return;
        }
        
        try {
            this.contract = new ethers.Contract(
                GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS,
                this.CONTRACT_ABI,
                this.signer
            );
            console.log('Contract initialized:', GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS);
        } catch (error) {
            console.error('Error initializing contract:', error);
        }
    },
    
    // Get contract instance
    getContract: function() {
        if (!this.contract) {
            this.initializeContract();
        }
        return this.contract;
    },
    
    // Submit score to blockchain
    submitScore: async function(scoreData, signature) {
        try {
            if (!this.isConnected()) {
                throw new Error(t('wallet.notConnected'));
            }
            
            const contract = this.getContract();
            if (!contract) {
                throw new Error(t('wallet.contractMissing'));
            }
            
            // Prepare score data struct (must include gameMode)
            const scoreDataStruct = [
                scoreData.player,
                scoreData.score,
                scoreData.levelId,
                scoreData.nonce,
                scoreData.gameMode || 'Tournament'
            ];
            
            // Estimate gas
            let gasEstimate;
            try {
                gasEstimate = await contract.finalizeScore.estimateGas(scoreDataStruct, signature);
            } catch (error) {
                console.error('Gas estimation failed:', error);
                throw new Error(t('wallet.txWouldFail'));
            }
            
            // Submit transaction
            const tx = await contract.finalizeScore(scoreDataStruct, signature, {
                gasLimit: gasEstimate * BigInt(120) / BigInt(100) // Add 20% buffer
            });
            
            console.log('Transaction submitted:', tx.hash);
            
            // Wait for confirmation
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
            
            return {
                success: true,
                txHash: tx.hash,
                receipt: receipt
            };
        } catch (error) {
            console.error('Error submitting score:', error);
            throw error;
        }
    },
    
    // Get player's best score from contract
    getPlayerScore: async function(address) {
        try {
            const provider = this.provider || this.getReadOnlyProvider();
            
            if (!GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS) {
                throw new Error('Contract address not set');
            }
            
            const contract = new ethers.Contract(
                GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS,
                this.CONTRACT_ABI,
                provider
            );
            
            const result = await contract.getPlayerScore(address);
            return {
                bestScore: result[0].toString(),
                levelId: result[1].toString(),
                timestamp: result[2].toString()
            };
        } catch (error) {
            console.error('Error getting player score:', error);
            throw error;
        }
    },
    
    // Get leaderboard from contract
    // The ranking comes from our server, which reads it out of the contract's
    // events. Sorting a hundred players in contract storage cost ten times the
    // price of a score, and it was the best players who paid it, so the chain
    // keeps the scores and the order is worked out from them.
    getLeaderboard: async function(count = 100, gameMode = 'Tournament') {
        const url = `${GameConfig.BLOCKCHAIN.API_URL}/api/leaderboard`
            + `?count=${encodeURIComponent(count)}&gameMode=${encodeURIComponent(gameMode)}`;

        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(t('errors.leaderboardUnavailable'));

        const board = await response.json();
        return {
            players: board.players || [],
            scores: (board.scores || []).map(String),
        };
    },
    
    // Get player's score for a specific game mode
    getPlayerScore: async function(playerAddress, gameMode = 'Tournament') {
        try {
            const provider = this.provider || this.getReadOnlyProvider();
            
            if (!GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS) {
                throw new Error('Contract address not set');
            }
            
            const contract = new ethers.Contract(
                GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS,
                this.CONTRACT_ABI,
                provider
            );
            
            const result = await contract.getPlayerScore(playerAddress, gameMode);
            return {
                bestScore: result[0].toString(),
                levelId: result[1].toString(),
                timestamp: result[2].toString()
            };
        } catch (error) {
            console.error('Error getting player score:', error);
            throw error;
        }
    },
    
    // Generate nonce for score submission
    generateNonce: function() {
        return Date.now().toString() + Math.random().toString(36).substring(2, 15);
    },
    
    // Format address for display
    formatAddress: function(address) {
        if (!address) return '';
        return address.substring(0, 6) + '...' + address.substring(address.length - 4);
    },
    
    // Listen for account changes
    setupAccountListener: function(callback) {
        if (this.isWalletInstalled()) {
            const provider = this.getWalletProvider();
            if (provider) {
                provider.on('accountsChanged', (accounts) => {
                    if (accounts.length === 0) {
                        this.currentAccount = null;
                        this.signer = null;
                        this.contract = null;
                    } else {
                        this.currentAccount = accounts[0];
                        this.provider = new ethers.BrowserProvider(provider);
                        this.provider.getSigner().then(signer => {
                            this.signer = signer;
                            if (GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS) {
                                this.initializeContract();
                            }
                        });
                    }
                    if (callback) callback(accounts);
                });
                
                // A changed chain used to reload the page. That was harmless
                // when the page held nothing worth keeping, but connecting a
                // wallet at the end of a run switches the chain, and the reload
                // then threw the finished run away along with the reward. The
                // provider is rebuilt in place instead: it caches the network,
                // so a new one is needed, and nothing else has to be lost.
                provider.on('chainChanged', async (chainId) => {
                    console.log('Chain changed:', chainId);
                    try {
                        this.provider = new ethers.BrowserProvider(provider);
                        this.signer = await this.provider.getSigner();
                        this.contract = null;
                        if (GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS) this.initializeContract();
                    } catch (error) {
                        console.warn('Could not follow the chain change:', error.message);
                    }
                });
            }
        }
    }
};

