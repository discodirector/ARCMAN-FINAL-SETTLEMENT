// Canvas Manager Module
const CanvasManager = {
    canvas: null,
    ctx: null,
    scaleX: 1,
    scaleY: 1,
    resizeTimeout: null,
    
    init: function() {
        // Get canvas element
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Game canvas not found');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        
        // Set up resize handler
        this.setupResizeHandler();
    },
    
    setupCanvas: function(skipGameObjects = false) {
        const container = document.getElementById('gameContainer');
        if (!container || !this.canvas) {
            console.error('Game container or canvas not found');
            return;
        }
        
        // Use container dimensions (respects CSS aspect-ratio constraints / letterboxing)
        const containerWidth = container.clientWidth || window.innerWidth || 800;
        const containerHeight = container.clientHeight || window.innerHeight || 600;
        
        // Ensure minimum dimensions
        if (containerWidth <= 0 || containerHeight <= 0) {
            console.warn('Invalid container dimensions, using defaults');
            GameConfig.CONFIG.width = 800;
            GameConfig.CONFIG.height = 600;
        } else {
            GameConfig.CONFIG.width = containerWidth;
            GameConfig.CONFIG.height = containerHeight;
        }
        
        // Set canvas CSS size to match container
        this.canvas.style.width = GameConfig.CONFIG.width + 'px';
        this.canvas.style.height = GameConfig.CONFIG.height + 'px';
        
        // Set canvas internal resolution to match viewport (for crisp rendering on high-DPI displays)
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = GameConfig.CONFIG.width * dpr;
        this.canvas.height = GameConfig.CONFIG.height * dpr;
        
        // Reset transform and scale context to account for device pixel ratio
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        this.ctx.scale(dpr, dpr);
        
        // Update scale factors (for drawing operations that need it)
        this.scaleX = 1;
        this.scaleY = 1;
        
        // Reinitialize game objects with new dimensions (unless skipped)
        if (!skipGameObjects) {
            // Call callbacks if they exist (will be set by GameObjects module)
            if (typeof GameObjects !== 'undefined' && GameObjects.initGameObjects) {
                GameObjects.initGameObjects();
            }
            if (typeof GameObjects !== 'undefined' && GameObjects.initStars) {
                GameObjects.initStars();
            }
        }
        
        console.log('Canvas setup complete:', { width: GameConfig.CONFIG.width, height: GameConfig.CONFIG.height, dpr, skipGameObjects });
    },
    
    setupResizeHandler: function() {
        // Handle resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.setupCanvas();
                // Check gameState through GameState namespace if it exists
                if (typeof GameState !== 'undefined' && GameState.gameState === 'flying') {
                    // Call resetRound through GameFlow if it exists
                    if (typeof GameFlow !== 'undefined' && GameFlow.resetRound) {
                        GameFlow.resetRound();
                    }
                }
            }, 100);
        });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.setupCanvas();
                // Check gameState through GameState namespace if it exists
                if (typeof GameState !== 'undefined' && GameState.gameState === 'flying') {
                    // Call resetRound through GameFlow if it exists
                    if (typeof GameFlow !== 'undefined' && GameFlow.resetRound) {
                        GameFlow.resetRound();
                    }
                }
            }, 100);
        });
    }
};













