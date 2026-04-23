// Game State Management Module
const GameState = {
    // Level Manager
    levelManager: null,
    
    // Game mode
    gameMode: null, // null = menu, 'immortal', 'tournament', 'community', 'editor'
    immortalMode: false,
    tournamentMode: false,
    communityMode: false,
    
    // Game state
    gameState: 'aiming', // aiming, flying, finalized, menu
    player: { x: 0, y: 0, width: 20, height: 30, floatOffset: 0 },
    playerAnimationFrames: {
        idle: [], // Array of loaded idle animation frame images
        throwing: [] // Array of loaded throwing animation frame images
    },
    playerAnimationFrame: 0, // Current frame index
    playerAnimationLastUpdate: 0, // Timestamp of last frame update
    playerAnimationType: 'idle', // Current animation type: 'idle' or 'throwing'
    coin: null,
    coinSpriteImage: null, // Loaded PNG image for coin sprite (optional)
    initialCoinVelocity: null, // Store initial velocity for barrier bounce calculations
    aimStart: null,
    aimEnd: null,
    stars: [],
    arcGates: [],
    slippageClouds: [],
    lifeRestores: [], // Life restoration objects
    barriers: [], // Wall barriers
    settlementZone: null,
    score: 0,
    multiplier: 1.0,
    gatesPassed: 0,
    slippageHits: 0,
    slippageCloudsPassed: 0, // Track clouds passed (for scoring)
    barrierHits: 0, // Track barrier collisions (for scoring)
    totalPoints: 0, // Total points across all completed levels
    levelPoints: 0, // Points earned in current level
    // Game-wide totals for statistics
    totalGatesPassed: 0, // Total gates passed across all levels in current game
    totalCloudsPassed: 0, // Total clouds passed across all levels in current game
    totalBarriersHit: 0, // Total barriers hit across all levels in current game
    coinTrail: [],
    particles: [],
    coinTrailParticleCounter: 0, // Counter to control particle spawn rate
    
    // Tournament mode lives system
    tournamentLives: 5,
    
    // Editor state
    editorMode: false,
    editorTool: 'select',
    selectedObject: null,
    editorLevel: null,
    
    // Level advancement state
    levelAdvancementTimeout: null,
    isAdvancing: false,
    
    // Anti-cheat session tracking
    sessionId: null,            // Server-issued session ID for score verification

    // Game completion tracking
    gameStartTime: null,        // Timestamp when game started
    gameEndTime: null,          // Timestamp when game completed
    finalScore: 0,              // Final total score
    levelsCompleted: 0,         // Number of levels completed
    gameCompleted: false,       // Flag for game completion
    bestLevelScore: 0,          // Best score achieved in a single level
    levelScores: [],            // Array to track scores for each level
    completionData: null,      // Completion statistics object
    
    // Reset state for new round
    resetRound: function() {
        this.coin = null;
        this.initialCoinVelocity = null;
        this.aimStart = null;
        this.aimEnd = null;
        this.coinTrail = [];
        this.particles = [];
        this.coinTrailParticleCounter = 0;
        this.gatesPassed = 0;
        this.slippageHits = 0;
        this.slippageCloudsPassed = 0;
        this.barrierHits = 0;
        this.multiplier = 1.0;
        this.score = 0;
        this.levelPoints = 0;
        
        // Reset barrier hit states
        if (this.barriers) {
            this.barriers.forEach(barrier => {
                barrier.triggered = false;
                barrier.hitFlash = 0;
            });
        }
        
        // Reset life restore collected states
        if (this.lifeRestores) {
            this.lifeRestores.forEach(lifeRestore => {
                lifeRestore.collected = false;
            });
        }
        
        // Reset arc gate active states
        if (this.arcGates) {
            this.arcGates.forEach(gate => {
                gate.active = true;
            });
        }
        
        // Reset settlement zone pulse
        if (this.settlementZone) {
            this.settlementZone.pulse = 0;
        }
    },
    
    // Reset all state for new game
    resetGame: function() {
        this.resetRound();
        this.totalPoints = 0;
        this.tournamentLives = GameConfig.MAX_TOURNAMENT_LIVES;
        this.gameState = 'aiming';
        this.sessionId = null;
        this.gameStartTime = null;
        this.gameEndTime = null;
        this.finalScore = 0;
        this.levelsCompleted = 0;
        this.gameCompleted = false;
        this.bestLevelScore = 0;
        this.levelScores = [];
        this.completionData = null;
        this.totalGatesPassed = 0;
        this.totalCloudsPassed = 0;
        this.totalBarriersHit = 0;
    }
};

