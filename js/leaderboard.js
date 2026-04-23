// Leaderboard module for fetching and displaying on-chain leaderboard data

const Leaderboard = {
    // Current leaderboard data
    data: null,
    
    // Current game mode filter
    currentGameMode: 'Immortal',
    
    // Player's rank (null if not on leaderboard)
    playerRank: null,
    
    // Fetch leaderboard from smart contract
    fetchLeaderboard: async function(count = 100, gameMode = 'Immortal') {
        try {
            if (typeof Web3Manager === 'undefined') {
                throw new Error('Web3Manager is not available');
            }
            
            if (!GameConfig.BLOCKCHAIN.CONTRACT_ADDRESS) {
                throw new Error('Contract address not set in config');
            }
            
            // Store current game mode
            this.currentGameMode = gameMode || 'Immortal';
            
            console.log(`Fetching leaderboard (top ${count}) for ${this.currentGameMode} mode...`);
            
            // Fetch leaderboard data for the specified game mode
            const result = await Web3Manager.getLeaderboard(count, this.currentGameMode);
            
            // Process the data
            this.data = {
                players: result.players || [],
                scores: result.scores || [],
                count: result.players.length,
                gameMode: this.currentGameMode,
                fetchedAt: Date.now()
            };
            
            // Calculate player's rank if connected
            if (Web3Manager.isConnected() && Web3Manager.currentAccount) {
                this.playerRank = this.findPlayerRank(Web3Manager.currentAccount);
            } else {
                this.playerRank = null;
            }
            
            console.log(`Leaderboard fetched: ${this.data.count} players for ${this.currentGameMode} mode`);
            return this.data;
            
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            throw error;
        }
    },
    
    // Find player's rank in the leaderboard
    findPlayerRank: function(playerAddress) {
        if (!this.data || !this.data.players || !playerAddress) {
            return null;
        }
        
        // Normalize address for comparison (case-insensitive)
        const normalizedPlayer = playerAddress.toLowerCase();
        
        // Search for player in leaderboard
        for (let i = 0; i < this.data.players.length; i++) {
            if (this.data.players[i].toLowerCase() === normalizedPlayer) {
                return i + 1; // Rank is 1-indexed
            }
        }
        
        return null; // Player not on leaderboard
    },
    
    // Get player's rank (async version that fetches if needed)
    getPlayerRank: async function(playerAddress) {
        if (!this.data) {
            // Fetch leaderboard first if not cached
            await this.fetchLeaderboard(100);
        }
        
        if (!playerAddress) {
            // Use current account if available
            if (Web3Manager && Web3Manager.isConnected()) {
                playerAddress = Web3Manager.currentAccount;
            } else {
                return null;
            }
        }
        
        return this.findPlayerRank(playerAddress);
    },
    
    // Format leaderboard data for display
    formatLeaderboard: function(data = null) {
        const leaderboardData = data || this.data;
        
        if (!leaderboardData || !leaderboardData.players) {
            return [];
        }
        
        const formatted = [];
        for (let i = 0; i < leaderboardData.players.length; i++) {
            formatted.push({
                rank: i + 1,
                address: leaderboardData.players[i],
                score: parseInt(leaderboardData.scores[i]) || 0,
                isCurrentPlayer: Web3Manager && Web3Manager.isConnected() && 
                    Web3Manager.currentAccount &&
                    leaderboardData.players[i].toLowerCase() === Web3Manager.currentAccount.toLowerCase()
            });
        }
        
        return formatted;
    },
    
    // Refresh leaderboard data
    refresh: async function(count = 100, gameMode = null) {
        try {
            const mode = gameMode || this.currentGameMode || 'Immortal';
            await this.fetchLeaderboard(count, mode);
            return this.data;
        } catch (error) {
            console.error('Error refreshing leaderboard:', error);
            throw error;
        }
    },
    
    // Format score for display
    formatScore: function(score) {
        if (typeof score === 'string') {
            score = parseInt(score);
        }
        return score.toLocaleString();
    },
    
    // Format address for display
    formatAddress: function(address) {
        if (!address) return '';
        if (typeof Web3Manager !== 'undefined' && Web3Manager.formatAddress) {
            return Web3Manager.formatAddress(address);
        }
        // Fallback formatting
        if (address.length < 10) return address;
        return address.substring(0, 6) + '...' + address.substring(address.length - 4);
    },
    
    // Check if leaderboard data is stale (older than 30 seconds)
    isStale: function() {
        if (!this.data || !this.data.fetchedAt) {
            return true;
        }
        const age = Date.now() - this.data.fetchedAt;
        return age > 30000; // 30 seconds
    }
};

