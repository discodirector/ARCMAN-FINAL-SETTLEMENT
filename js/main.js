// Main Game Module - Initialization and game loop
const Game = {
    // Game loop
    gameLoop: function() {
        // Don't render game when in menu or editor is open
        if (GameState.gameState !== 'menu' && !GameState.editorMode && GameState.gameMode !== null && GameConfig.CONFIG.width > 0 && GameConfig.CONFIG.height > 0) {
            const ctx = CanvasManager.ctx;
            
            // Clear canvas with proper dimensions
            ctx.fillStyle = GameConfig.COLORS.black;
            ctx.fillRect(0, 0, GameConfig.CONFIG.width, GameConfig.CONFIG.height);
            
            // Draw stars
            if (GameState.stars.length > 0) {
                Renderer.drawStars();
            }
            
            // Draw game objects
            if (GameState.settlementZone) {
                Renderer.drawSettlementZone();
            }
            GameState.arcGates.forEach(gate => Renderer.drawArcGate(gate));
            GameState.slippageClouds.forEach(cloud => Renderer.drawSlippageCloud(cloud));
            GameState.lifeRestores.forEach(lifeRestore => Renderer.drawLifeRestore(lifeRestore));
            GameState.barriers.forEach(barrier => Renderer.drawBarrier(barrier));
            
            // Draw player
            if (GameState.player && GameState.player.width > 0 && GameState.player.height > 0) {
                Renderer.drawPlayer();
            }
            
            // Draw arc preview
            if (GameState.gameState === 'aiming') {
                Renderer.drawArcPreview();
            }
            
            // Draw lives hearts in tournament mode
            if (GameState.tournamentMode) {
                Renderer.drawLivesHearts();
            }
            
            // Update and draw particles
            Physics.updateParticles();
            if (GameState.particles.length > 0) {
                Renderer.drawParticles();
            }
            
            // Update and draw coin
            if (GameState.coin) {
                Physics.updateCoin();
                Renderer.drawCoin();
            }
            
            // Update UI
            const scoreEl = document.getElementById('score');
            if (scoreEl) {
                let totalScore;
                if (GameState.coin) {
                    const currentLevelScore = Scoring.calculateScore();
                    totalScore = GameState.totalPoints + currentLevelScore;
                } else {
                    totalScore = GameState.totalPoints;
                }
                scoreEl.textContent = `Score: ${totalScore}`;
            }
            const levelCounterEl = document.getElementById('levelCounter');
            if (levelCounterEl && GameState.levelManager) {
                const current = GameState.levelManager.currentLevelIndex + 1;
                const total = GameState.levelManager.getAllLevels().length;
                levelCounterEl.textContent = `Level ${current}/${total}`;
            }
        }
        
        requestAnimationFrame(() => Game.gameLoop());
    },
    
    // Initialize game
    init: function() {
        // Initialize audio manager
        AudioManager.init();
        
        // Initialize level manager
        GameState.levelManager = new LevelManager();
        
        // Initialize canvas
        CanvasManager.init();
        CanvasManager.setupCanvas();
        
        // Load coin sprite if path is specified in config
        if (GameConfig.COIN_SPRITE_PATH) {
            GameObjects.loadCoinSprite(GameConfig.COIN_SPRITE_PATH);
        }
        
        // Load player animations if configured
        if (GameConfig.PLAYER_ANIMATION) {
            GameObjects.loadPlayerAnimation(GameConfig.PLAYER_ANIMATION);
        }
        
        // Initialize editor
        if (typeof LevelEditor !== 'undefined' && LevelEditor.init) {
            LevelEditor.init();
        }
        
        // Setup input handlers
        InputHandler.setupEventListeners();
        
        // Show start screen instead of main menu immediately
        GameFlow.showStartScreen();
        
        // Setup menu event listeners
        GameFlow.setupMenuListeners();
        
        // Start game loop
        this.gameLoop();
    }
};

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Game.init());
} else {
    // DOM is already ready, call immediately but with small delay to ensure everything is initialized
    setTimeout(() => Game.init(), 0);
}

