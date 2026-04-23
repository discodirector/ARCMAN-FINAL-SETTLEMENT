// Game Objects Management Module
const GameObjects = {
    // Initialize stars
    initStars: function() {
        GameState.stars = [];
        const starCount = Math.floor(GameConfig.BASE_CONFIG.starCount * (GameConfig.CONFIG.width * GameConfig.CONFIG.height) / (GameConfig.BASE_CONFIG.width * GameConfig.BASE_CONFIG.height));
        for (let i = 0; i < starCount; i++) {
            GameState.stars.push({
                x: Math.random() * GameConfig.CONFIG.width,
                y: Math.random() * GameConfig.CONFIG.height,
                size: Math.random() * (GameConfig.CONFIG.width / 400) + 0.5,
                brightness: Math.random()
            });
        }
    },
    
    // Load level data
    loadLevel: function(levelData) {
        if (!levelData) {
            console.error('No level data provided');
            return;
        }

        // Clear existing objects
        GameState.arcGates = [];
        GameState.slippageClouds = [];
        GameState.lifeRestores = [];
        GameState.barriers = [];
        GameState.settlementZone = null;

        // Load player position (relative 0-1 coordinates)
        const sizeScale = GameConfig.PLAYER_SIZE_SCALE || 1.0;
        GameState.player.width = Math.max(30 * sizeScale, GameConfig.CONFIG.width * 0.04 * sizeScale);
        GameState.player.height = Math.max(45 * sizeScale, GameConfig.CONFIG.height * 0.08 * sizeScale);
        GameState.player.x = GameConfig.CONFIG.width * (levelData.player?.x || 0.12);
        GameState.player.y = GameConfig.CONFIG.height * (levelData.player?.y || 0.75);

        // Load arc gates (relative 0-1 coordinates)
        if (levelData.arcGates) {
            levelData.arcGates.forEach(gate => {
                GameState.arcGates.push({
                    x: GameConfig.CONFIG.width * gate.x,
                    y: GameConfig.CONFIG.height * gate.y,
                    width: GameConfig.CONFIG.width * gate.width,
                    height: GameConfig.CONFIG.height * gate.height,
                    active: gate.active !== undefined ? gate.active : true,
                    rotation: gate.rotation || 0 // Preserve rotation
                });
            });
        }

        // Load slippage clouds (relative 0-1 coordinates)
        if (levelData.slippageClouds) {
            levelData.slippageClouds.forEach(cloud => {
                GameState.slippageClouds.push({
                    x: GameConfig.CONFIG.width * cloud.x,
                    y: GameConfig.CONFIG.height * cloud.y,
                    radius: GameConfig.CONFIG.width * cloud.radius
                });
            });
        }

        // Load life restoration objects (relative 0-1 coordinates)
        if (levelData.lifeRestores) {
            levelData.lifeRestores.forEach(lifeRestore => {
                GameState.lifeRestores.push({
                    x: GameConfig.CONFIG.width * lifeRestore.x,
                    y: GameConfig.CONFIG.height * lifeRestore.y,
                    radius: GameConfig.CONFIG.width * (lifeRestore.radius || 0.0167),  // Reduced default size (0.05 / 3)
                    collected: false, // Reset collected state when loading new level
                    pulse: 0
                });
            });
        }

        // Load barriers (relative 0-1 coordinates)
        // size: 'large', 'medium', or 'small'
        if (levelData.barriers) {
            levelData.barriers.forEach(barrier => {
                // Set default height based on size if not specified
                let defaultHeight;
                const size = barrier.size || 'medium';
                if (size === 'large') {
                    defaultHeight = 0.3; // Tallest
                } else if (size === 'medium') {
                    defaultHeight = 0.2; // Medium
                } else { // small
                    defaultHeight = 0.12; // Shortest
                }
                
                GameState.barriers.push({
                    x: GameConfig.CONFIG.width * barrier.x,
                    y: GameConfig.CONFIG.height * barrier.y,
                    width: GameConfig.CONFIG.width * (barrier.width || 0.01), // Barrier thickness
                    height: GameConfig.CONFIG.height * (barrier.height || defaultHeight), // Barrier height (size-dependent)
                    size: size,
                    rotation: barrier.rotation || 0, // Preserve rotation
                    pulse: 0,
                    hitFlash: 0, // For hit animation
                    energyOffset: Math.random() * 100, // Random energy wave offset
                    triggered: false // Track if barrier has been hit (only triggers once)
                });
            });
        }

        // Load settlement zone (relative 0-1 coordinates)
        if (levelData.settlementZone) {
            GameState.settlementZone = {
                x: GameConfig.CONFIG.width * levelData.settlementZone.x,
                y: GameConfig.CONFIG.height * levelData.settlementZone.y,
                width: GameConfig.CONFIG.width * levelData.settlementZone.width,
                height: GameConfig.CONFIG.height * levelData.settlementZone.height,
                rotation: levelData.settlementZone.rotation || 0, // Preserve rotation
                pulse: 0
            };
        }

        // Update UI
        if (typeof UI !== 'undefined' && UI.updateLevelUI) {
            UI.updateLevelUI();
        }
    },
    
    // Load coin sprite image (optional PNG file)
    loadCoinSprite: function(imagePath) {
        return new Promise((resolve, reject) => {
            if (!imagePath) {
                resolve(null);
                return;
            }
            
            const img = new Image();
            img.onload = function() {
                GameState.coinSpriteImage = img;
                console.log('Coin sprite image loaded:', imagePath);
                resolve(img);
            };
            img.onerror = function() {
                console.warn('Failed to load coin sprite image:', imagePath, '- falling back to drawn logo');
                GameState.coinSpriteImage = null;
                resolve(null);
            };
            img.src = imagePath;
        });
    },
    
    // Load a single animation sequence
    loadAnimationSequence: function(config, animationType) {
        return new Promise((resolve, reject) => {
            if (!config || !config.pathPattern || config.frameCount <= 0) {
                resolve([]);
                return;
            }
            
            const frames = [];
            let loadedCount = 0;
            let errorCount = 0;
            const totalFrames = config.frameCount;
            
            // Format frame number based on numbering style
            const formatFrameNumber = (n) => {
                switch (config.numberingStyle) {
                    case 'double':
                        return String(n).padStart(2, '0');
                    case 'triple':
                        return String(n).padStart(3, '0');
                    default: // 'single'
                        return String(n);
                }
            };
            
            // Replace placeholder in path pattern
            const getFramePath = (frameNum) => {
                return config.pathPattern
                    .replace(/{nnn}/g, formatFrameNumber(frameNum))
                    .replace(/{nn}/g, formatFrameNumber(frameNum))
                    .replace(/{n}/g, formatFrameNumber(frameNum));
            };
            
            // Load each frame
            for (let i = 1; i <= totalFrames; i++) {
                const img = new Image();
                const framePath = getFramePath(i);
                
                img.onload = function() {
                    frames[i - 1] = img; // Store at index (i-1)
                    loadedCount++;
                    if (loadedCount + errorCount === totalFrames) {
                        if (loadedCount > 0) {
                            console.log(`Player ${animationType} animation loaded: ${loadedCount}/${totalFrames} frames`);
                            resolve(frames.filter(f => f !== null));
                        } else {
                            console.warn(`Failed to load player ${animationType} animation - all frames failed`);
                            resolve([]);
                        }
                    }
                };
                
                img.onerror = function() {
                    errorCount++;
                    frames[i - 1] = null; // Mark as failed
                    if (loadedCount + errorCount === totalFrames) {
                        if (loadedCount > 0) {
                            console.warn(`Player ${animationType} animation partially loaded: ${loadedCount}/${totalFrames} frames`);
                            resolve(frames.filter(f => f !== null));
                        } else {
                            console.warn(`Failed to load player ${animationType} animation - falling back to drawn character`);
                            resolve([]);
                        }
                    }
                };
                
                img.src = framePath;
            }
        });
    },
    
    // Load all player animations
    loadPlayerAnimation: function(animationConfig) {
        return new Promise((resolve, reject) => {
            if (!animationConfig) {
                GameState.playerAnimationFrames = { idle: [], throwing: [] };
                resolve();
                return;
            }
            
            const promises = [];
            
            // Load idle animation
            if (animationConfig.idle) {
                promises.push(
                    this.loadAnimationSequence(animationConfig.idle, 'idle').then(frames => {
                        GameState.playerAnimationFrames.idle = frames;
                    })
                );
            } else {
                GameState.playerAnimationFrames.idle = [];
            }
            
            // Load throwing animation
            if (animationConfig.throwing) {
                promises.push(
                    this.loadAnimationSequence(animationConfig.throwing, 'throwing').then(frames => {
                        GameState.playerAnimationFrames.throwing = frames;
                    })
                );
            } else {
                GameState.playerAnimationFrames.throwing = [];
            }
            
            Promise.all(promises).then(() => {
                resolve();
            });
        });
    },
    
    // Initialize game objects (legacy function for backwards compatibility)
    initGameObjects: function() {
        if (GameState.levelManager) {
            const currentLevel = GameState.levelManager.getCurrentLevel();
            if (currentLevel) {
                this.loadLevel(currentLevel);
                return;
            }
        }
        
        // Fallback to default layout
        GameState.player.x = GameConfig.CONFIG.width * 0.12;
        GameState.player.y = GameConfig.CONFIG.height * 0.75;
        const sizeScale = GameConfig.PLAYER_SIZE_SCALE || 1.0;
        GameState.player.width = Math.max(30 * sizeScale, GameConfig.CONFIG.width * 0.04 * sizeScale);
        GameState.player.height = Math.max(45 * sizeScale, GameConfig.CONFIG.height * 0.08 * sizeScale);
        
        GameState.arcGates = [
            { x: GameConfig.CONFIG.width * 0.35, y: GameConfig.CONFIG.height * 0.3, width: GameConfig.CONFIG.width * 0.05, height: GameConfig.CONFIG.height * 0.13, active: true }
        ];
        
        GameState.slippageClouds = [
            { x: GameConfig.CONFIG.width * 0.25, y: GameConfig.CONFIG.height * 0.5, radius: GameConfig.CONFIG.width * 0.06 }
        ];
        
        GameState.settlementZone = {
            x: GameConfig.CONFIG.width * 0.85,
            y: GameConfig.CONFIG.height * 0.8,
            width: GameConfig.CONFIG.width * 0.1,
            height: GameConfig.CONFIG.height * 0.13,
            pulse: 0
        };
    }
};

