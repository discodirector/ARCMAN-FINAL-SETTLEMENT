// Player Statistics Module
const PlayerStatistics = {
    // Statistics data structure
    stats: {
        // Game Sessions
        gamesPlayed: 0,
        gamesCompleted: 0,
        gamesAbandoned: 0,
        
        // Scores
        bestFinalScore: 0,
        bestLevelScore: 0,
        averageFinalScore: 0,
        totalLifetimePoints: 0,
        
        // Performance
        totalLevelsCompleted: 0,
        averageLevelsPerGame: 0,
        fastestCompletionTime: null, // in seconds
        averageCompletionTime: 0, // in seconds
        totalCompletionTime: 0, // in seconds
        
        // Achievements
        totalGatesPassed: 0,
        totalCloudsPassed: 0,
        totalBarriersHit: 0,
        perfectGames: 0, // Games where all levels were completed
        
        // Game Mode Stats
        immortalGamesPlayed: 0,
        immortalGamesCompleted: 0,
        tournamentGamesPlayed: 0,
        tournamentGamesCompleted: 0,
        
        // Last game data
        lastGameDate: null,
        lastGameMode: null,
        lastGameScore: 0
    },
    
    // Load statistics from localStorage
    loadStats: function() {
        try {
            const saved = localStorage.getItem('arcman_player_stats');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge saved stats with default structure
                this.stats = { ...this.stats, ...parsed };
                console.log('Statistics loaded from localStorage');
            }
        } catch (e) {
            console.error('Error loading statistics:', e);
            // Keep default stats if loading fails
        }
    },
    
    // Save statistics to localStorage
    saveStats: function() {
        try {
            localStorage.setItem('arcman_player_stats', JSON.stringify(this.stats));
            console.log('Statistics saved to localStorage');
        } catch (e) {
            console.error('Error saving statistics:', e);
        }
    },
    
    // Update statistics after game completion
    updateStats: function(completionData) {
        if (!completionData) {
            console.warn('No completion data provided to updateStats');
            return;
        }
        
        // Game Sessions
        this.stats.gamesPlayed++;
        this.stats.gamesCompleted++;
        
        // Update game mode specific stats
        if (completionData.gameMode === 'Immortal') {
            this.stats.immortalGamesPlayed++;
            this.stats.immortalGamesCompleted++;
        } else if (completionData.gameMode === 'Tournament') {
            this.stats.tournamentGamesPlayed++;
            this.stats.tournamentGamesCompleted++;
        }
        
        // Scores
        if (completionData.finalScore > this.stats.bestFinalScore) {
            this.stats.bestFinalScore = completionData.finalScore;
        }
        
        if (completionData.bestLevelScore > this.stats.bestLevelScore) {
            this.stats.bestLevelScore = completionData.bestLevelScore;
        }
        
        // Update average final score
        const totalScore = this.stats.averageFinalScore * (this.stats.gamesCompleted - 1) + completionData.finalScore;
        this.stats.averageFinalScore = Math.floor(totalScore / this.stats.gamesCompleted);
        
        // Lifetime points
        this.stats.totalLifetimePoints += completionData.finalScore;
        
        // Performance
        this.stats.totalLevelsCompleted += completionData.levelsCompleted;
        this.stats.averageLevelsPerGame = this.stats.totalLevelsCompleted / this.stats.gamesCompleted;
        
        // Completion time
        if (completionData.completionTime > 0) {
            this.stats.totalCompletionTime += completionData.completionTime;
            this.stats.averageCompletionTime = Math.floor(this.stats.totalCompletionTime / this.stats.gamesCompleted);
            
            if (this.stats.fastestCompletionTime === null || completionData.completionTime < this.stats.fastestCompletionTime) {
                this.stats.fastestCompletionTime = completionData.completionTime;
            }
        }
        
        // Perfect games (all levels completed)
        // This is tracked when all levels are completed, which is already the case in completionData
        this.stats.perfectGames++;
        
        // Track gates, clouds, and barriers
        if (completionData.totalGates) {
            this.stats.totalGatesPassed += completionData.totalGates;
        }
        if (completionData.totalClouds) {
            this.stats.totalCloudsPassed += completionData.totalClouds;
        }
        if (completionData.totalBarriers) {
            this.stats.totalBarriersHit += completionData.totalBarriers;
        }
        
        // Last game data
        this.stats.lastGameDate = new Date(completionData.timestamp).toISOString();
        this.stats.lastGameMode = completionData.gameMode;
        this.stats.lastGameScore = completionData.finalScore;
        
        // Save to localStorage
        this.saveStats();
        
        console.log('Statistics updated:', this.stats);
    },
    
    // Update statistics for abandoned game (when user returns to menu without completing)
    updateAbandonedGame: function() {
        this.stats.gamesPlayed++;
        this.stats.gamesAbandoned++;
        this.saveStats();
    },
    
    // Get formatted statistics
    getStats: function() {
        return { ...this.stats }; // Return a copy
    },
    
    // Get formatted statistics for display
    getFormattedStats: function() {
        const stats = this.getStats();
        
        // Format completion times
        const formatTime = (seconds) => {
            if (seconds === null || seconds === undefined) return 'N/A';
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        
        return {
            // Game Sessions
            gamesPlayed: stats.gamesPlayed,
            gamesCompleted: stats.gamesCompleted,
            gamesAbandoned: stats.gamesAbandoned,
            completionRate: stats.gamesPlayed > 0 
                ? ((stats.gamesCompleted / stats.gamesPlayed) * 100).toFixed(1) + '%'
                : '0%',
            
            // Scores
            bestFinalScore: stats.bestFinalScore.toLocaleString(),
            bestLevelScore: stats.bestLevelScore.toLocaleString(),
            averageFinalScore: stats.averageFinalScore.toLocaleString(),
            totalLifetimePoints: stats.totalLifetimePoints.toLocaleString(),
            
            // Performance
            totalLevelsCompleted: stats.totalLevelsCompleted,
            averageLevelsPerGame: stats.averageLevelsPerGame.toFixed(1),
            fastestCompletionTime: formatTime(stats.fastestCompletionTime),
            averageCompletionTime: formatTime(stats.averageCompletionTime),
            
            // Achievements
            totalGatesPassed: stats.totalGatesPassed,
            totalCloudsPassed: stats.totalCloudsPassed,
            totalBarriersHit: stats.totalBarriersHit,
            perfectGames: stats.perfectGames,
            
            // Game Mode Stats
            immortalGamesPlayed: stats.immortalGamesPlayed,
            immortalGamesCompleted: stats.immortalGamesCompleted,
            tournamentGamesPlayed: stats.tournamentGamesPlayed,
            tournamentGamesCompleted: stats.tournamentGamesCompleted,
            
            // Last game
            lastGameDate: stats.lastGameDate 
                ? new Date(stats.lastGameDate).toLocaleDateString()
                : 'Never',
            lastGameMode: stats.lastGameMode || 'N/A',
            lastGameScore: stats.lastGameScore.toLocaleString()
        };
    },
    
    // Reset all statistics
    resetStats: function() {
        this.stats = {
            gamesPlayed: 0,
            gamesCompleted: 0,
            gamesAbandoned: 0,
            bestFinalScore: 0,
            bestLevelScore: 0,
            averageFinalScore: 0,
            totalLifetimePoints: 0,
            totalLevelsCompleted: 0,
            averageLevelsPerGame: 0,
            fastestCompletionTime: null,
            averageCompletionTime: 0,
            totalCompletionTime: 0,
            totalGatesPassed: 0,
            totalCloudsPassed: 0,
            totalBarriersHit: 0,
            perfectGames: 0,
            immortalGamesPlayed: 0,
            immortalGamesCompleted: 0,
            tournamentGamesPlayed: 0,
            tournamentGamesCompleted: 0,
            lastGameDate: null,
            lastGameMode: null,
            lastGameScore: 0
        };
        this.saveStats();
        console.log('Statistics reset');
    },
    
    // Initialize - load stats on module load
    init: function() {
        this.loadStats();
    }
};

// Auto-initialize on load
PlayerStatistics.init();

