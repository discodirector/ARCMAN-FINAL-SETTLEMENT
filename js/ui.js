// UI Update Module
const UI = {
    // Update level UI
    updateLevelUI: function() {
        if (!GameState.levelManager) return;
        
        const currentLevel = GameState.levelManager.getCurrentLevel();
        const allLevels = GameState.levelManager.getAllLevels();
        const currentIndex = GameState.levelManager.currentLevelIndex;
        
        const levelNameEl = document.getElementById('levelName');
        const levelProgressEl = document.getElementById('levelProgress');
        
        if (levelNameEl && currentLevel) {
            levelNameEl.textContent = `Level ${currentLevel.id}: ${currentLevel.name}`;
        }
        
        if (levelProgressEl) {
            levelProgressEl.textContent = `${currentIndex + 1}/${allLevels.length}`;
        }
        
        // Update lives UI in tournament mode
        this.updateLivesUI();
    },
    
    // Update lives UI
    updateLivesUI: function() {
        const livesCounterEl = document.getElementById('livesCounter');
        if (livesCounterEl) {
            if (GameState.tournamentMode) {
                livesCounterEl.style.display = 'block';
                livesCounterEl.textContent = `Lives: ${GameState.tournamentLives}`;
            } else {
                livesCounterEl.style.display = 'none';
            }
        }
    },
    
    // Show in-game notification (replaces browser alerts)
    showNotification: function(message, duration = 3000) {
        const notification = document.getElementById('gameNotification');
        if (!notification) {
            // Fallback to console if notification element doesn't exist
            console.log('Notification:', message);
            return;
        }
        
        // Clear any existing timeout
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
        
        // Set message
        notification.textContent = message;
        
        // Remove any existing classes
        notification.classList.remove('show', 'fade-out');
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-hide after duration
        this.notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('fade-out');
            
            // Remove fade-out class after transition completes
            setTimeout(() => {
                notification.classList.remove('fade-out');
                notification.textContent = '';
            }, 300);
        }, duration);
    }
};








