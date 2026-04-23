# ARCMAN: Final Settlement - Complete Project Description

## Project Overview

**ARCMAN: Final Settlement** is a browser-based retro pixel-art arcade game with neon glow effects and blockchain integration. Players launch coins along ballistic trajectories through space, navigating obstacles to reach settlement zones. The game features a complete audio system, multiple game modes, a level editor, and on-chain score finalization.

**Project Type**: Browser-based arcade game with Web3 integration  
**Style**: Retro pixel-art with neon/cyberpunk aesthetics  
**Platform**: Web (desktop and mobile responsive)

---

## Current Project State

### ✅ Recently Implemented Features

1. **Complete Audio System** (fully functional)
   - Menu music (plays in main menu)
   - Gameplay music (plays during gameplay)
   - Launch sound effect (when coin is launched)
   - Gate sound effect (when passing through Arc Gates)
   - Settlement sound effect (when entering Settlement Zone)
   - Miss sound effect (when coin hits screen boundaries)

2. **Click to Start Screen**
   - Splash screen before main menu
   - Unlocks audio on first user interaction
   - Custom background image support (`images/start-background.png`)
   - Title at top, "Click to Start" at bottom

3. **Audio Unlock System**
   - Handles browser autoplay policies
   - Unlocks audio on first user interaction (start screen click)
   - Graceful fallback if audio files don't exist

4. **Code Reorganization** ✅
   - Successfully reorganized monolithic `game.js` (3011 lines) into 13 focused modules
   - All code now in `js/` directory using namespace pattern
   - Improved maintainability and navigation
   - Original `game.js` kept for reference (not used in production)

---

## File Structure

```
Test/
├── audio/                          # Audio files directory
│   ├── menu-music.mp3             # Main menu background music
│   ├── gameplay-music.mp3         # In-game background music
│   ├── launch.mp3                  # Coin launch sound effect
│   ├── gate.mp3                   # Arc Gate pass-through sound
│   ├── settlement.mp3              # Settlement Zone entry sound
│   └── miss.mp3                   # Boundary hit/miss sound
│
├── images/                         # Image assets
│   ├── menu-background.png        # Main menu background
│   └── start-background.png       # Start screen background
│
├── js/                             # Modular game code (13 modules)
│   ├── config.js                  # Game configuration & constants
│   ├── canvas.js                  # Canvas setup & responsive handling
│   ├── audio.js                   # Audio system management
│   ├── state.js                   # Game state management
│   ├── gameObjects.js             # Object initialization & level loading
│   ├── physics.js                 # Physics engine & collision detection
│   ├── renderer.js                # All drawing/rendering functions
│   ├── scoring.js                 # Scoring system
│   ├── ui.js                      # UI update functions
│   ├── gameFlow.js                # Game mode handlers & flow control
│   ├── levelEditor.js             # Level editor system
│   ├── input.js                   # Input/event handlers
│   └── main.js                    # Main game loop & initialization
│
├── index.html                      # Main HTML file (UI, styles, menus)
├── levels.js                      # Level data and LevelManager
├── server.js                      # Express backend server
├── contract.sol                   # Solidity smart contract
├── package.json                   # Node.js dependencies
├── game.js                        # Legacy file (kept for reference, not used)
├── README.md                      # Project documentation
└── PROJECT_DESCRIPTION.md         # This file
```

---

## Core Architecture

> **Note**: The codebase has been reorganized into a modular structure (13 modules in `js/` directory) for better maintainability. The original monolithic `game.js` (3011 lines) has been split into focused modules using the namespace pattern.

### Frontend Structure

The game uses a **modular namespace pattern** for better organization and maintainability:

#### `index.html`
- Main HTML structure
- CSS styles (retro neon theme, responsive design)
- UI elements:
  - Game canvas
  - Start screen (`#startScreen`)
  - Main menu (`#mainMenu`)
  - Level editor (`#levelEditor`)
  - Game UI (score, multiplier, status)
  - Level completion summary screen
- Script tags load modules in dependency order

#### Modular Game Code (`js/` directory)

**Core Modules:**
- `js/config.js` - Game configuration, constants, and color definitions (namespace: `GameConfig`)
- `js/canvas.js` - Canvas initialization, responsive setup, and resize handling (namespace: `CanvasManager`)
- `js/state.js` - Centralized game state management (all game variables) (namespace: `GameState`)
- `js/main.js` - Main game loop and initialization (namespace: `Game`)

**Game Systems:**
- `js/audio.js` - Complete audio system (music and sound effects) (namespace: `AudioManager`)
- `js/physics.js` - Physics engine, collision detection, and particle system (namespace: `Physics`)
- `js/renderer.js` - All drawing functions (11 render functions) (namespace: `Renderer`)
- `js/gameObjects.js` - Object initialization, level loading, and star generation (namespace: `GameObjects`)
- `js/scoring.js` - Scoring calculations and level summary display (namespace: `Scoring`)
- `js/ui.js` - UI update functions (namespace: `UI`)

**Game Flow:**
- `js/gameFlow.js` - Game mode management (immortal, tournament, editor), level progression, round management (namespace: `GameFlow`)
- `js/input.js` - Input handling (mouse, touch, keyboard events) (namespace: `InputHandler`)
- `js/levelEditor.js` - Complete level editor system (namespace: `LevelEditor`)

**Module Dependencies:**
1. `levels.js` - Level data (no dependencies)
2. `js/config.js` - Configuration (no dependencies)
3. `js/canvas.js` - Canvas setup (depends on config)
4. `js/audio.js` - Audio system (no dependencies)
5. `js/state.js` - Game state (depends on config)
6. `js/gameObjects.js` - Object management (depends on state, config)
7. `js/physics.js` - Physics engine (depends on state, config, audio)
8. `js/renderer.js` - Rendering (depends on state, config, canvas)
9. `js/scoring.js` - Scoring (depends on state)
10. `js/ui.js` - UI updates (depends on state)
11. `js/gameFlow.js` - Game flow (depends on all above)
12. `js/levelEditor.js` - Level editor (depends on state, config)
13. `js/input.js` - Input handling (depends on state, gameFlow)
14. `js/main.js` - Main loop (depends on all modules)

All modules use **namespace objects** (e.g., `GameState`, `Physics`, `Renderer`) to avoid global variable pollution. No build step required - works with simple `<script>` tags.

**Key Components (organized across modules):**

1. **AudioManager** (`js/audio.js`)
   - Manages all audio playback
   - Handles audio unlocking for browser autoplay policies
   - Properties: `menuMusic`, `gameplayMusic`, `launchSound`, `gateSound`, `settlementSound`, `missSound`
   - Methods: `init()`, `playMenuMusic()`, `playGameplayMusic()`, `playLaunchSound()`, `playGateSound()`, `playSettlementSound()`, `playMissSound()`

2. **Game Configuration** (`js/config.js`)
   - `BASE_CONFIG`: Base dimensions and physics constants
   - `CONFIG`: Scaled configuration for current screen size
   - Color definitions and constants

3. **Game State Management** (`js/state.js`)
   - `gameMode`: null (menu), 'immortal', 'tournament', 'editor'
   - `gameState`: 'aiming', 'flying', 'finalized', 'menu', 'failed'
   - All game variables (player, coin, arrays, etc.)
   - State machine handles transitions between modes

4. **Game Objects** (`js/gameObjects.js`)
   - Object initialization and level loading
   - `player`: Player character position and dimensions
   - `coin`: Active coin with physics (position, velocity, radius)
   - `arcGates[]`: Array of arc gates (boost multipliers)
   - `slippageClouds[]`: Array of slippage clouds (slow down coins)
   - `barriers[]`: Wall barriers (bounce physics)
   - `lifeRestores[]`: Life restoration objects
   - `settlementZone`: Final destination zone
   - `stars[]`: Background star particles
   - `particles[]`: Visual effect particles

5. **Physics System** (`js/physics.js`)
   - Gravity-based trajectory physics
   - Collision detection (gates, clouds, barriers, settlement zone)
   - Boundary checking (off-screen detection)
   - Coin trail rendering
   - Particle system updates

6. **Rendering Functions** (`js/renderer.js`)
   - `drawStars()`: Background stars
   - `drawPlayer()`: Player character
   - `drawCoin()`: Coin with trail
   - `drawArcGate()`: Arc gates with glow effects
   - `drawSlippageCloud()`: Slippage clouds
   - `drawBarrier()`: Wall barriers
   - `drawSettlementZone()`: Settlement zone with pulsing effect
   - `drawParticles()`: Particle effects
   - All 11 drawing functions

7. **Game Modes** (`js/gameFlow.js`)
   - **Immortal Mode**: Infinite retries, no lives system
   - **Tournament Mode**: Lives system (5 lives), level failure handling
   - **Editor Mode**: Level creation and editing
   - Start screen & menu flow management

8. **Level Editor** (`js/levelEditor.js`)
   - Visual object placement
   - Object selection and rotation
   - Level save/load from localStorage
   - Export to DEFAULT_LEVELS format

9. **Scoring System** (`js/scoring.js`)
   - Base: 100 points per level completion
   - Slippage clouds passed: +10 points each
   - Barrier collisions: +10 points each
   - Arc Gates: +0.5x multiplier each
   - Final score = (base + bonuses) × multiplier

**Legacy:**
- `game.js` - Original monolithic file (3011 lines) - kept for reference, not used in production

#### `levels.js`
- `DEFAULT_LEVELS`: Array of default level definitions
- `LevelManager` class: Manages level progression, loading, saving
- Custom levels stored in `localStorage`
- Level data structure:
  ```javascript
  {
    id: number,
    name: string,
    player: { x: 0-1, y: 0-1 },
    arcGates: [{ x, y, width, height, active, rotation }],
    slippageClouds: [{ x, y, radius }],
    barriers: [{ x, y, width, height, rotation }],
    lifeRestores: [{ x, y, radius }],
    settlementZone: { x, y, width, height, rotation }
  }
  ```

### Backend Files

#### `server.js`
- Express server
- `POST /api/finalize`: Signs score data for blockchain submission
- CORS enabled
- HMAC-based signing (demo/prototype)

#### `contract.sol`
- Solidity smart contract
- Score verification
- Leaderboard (top 100)
- Best score storage per player

---

## Audio System Details

### Audio Files Required
All audio files should be placed in the `audio/` directory:

- `menu-music.mp3` - Looping background music for main menu
- `gameplay-music.mp3` - Looping background music during gameplay
- `launch.mp3` - Sound when coin is launched
- `gate.mp3` - Sound when passing through Arc Gates
- `settlement.mp3` - Sound when entering Settlement Zone
- `miss.mp3` - Sound when coin hits screen boundaries (miss)

### Audio Manager Implementation

**Location**: `js/audio.js` (AudioManager namespace)

**Key Features:**
- Automatic music switching (menu ↔ gameplay)
- Sound effect cloning for overlapping sounds
- Volume control (music: 50%, sounds: 70% default)
- Graceful error handling (game continues if audio files missing)
- Browser autoplay policy compliance (unlocks on first user interaction)

**Audio Unlock Flow:**
1. User clicks start screen
2. `handleStartScreenClick()` unlocks audio context
3. Menu music starts playing when menu appears
4. Gameplay music plays when game starts

**Methods:**
- `init()`: Initialize all audio objects
- `playMenuMusic()`: Play menu music, stop gameplay music
- `playGameplayMusic()`: Play gameplay music, stop menu music
- `playLaunchSound()`: Play launch sound effect
- `playGateSound()`: Play gate pass-through sound
- `playSettlementSound()`: Play settlement zone entry sound
- `playMissSound()`: Play boundary hit/miss sound
- `setMusicVolume(volume)`: Adjust music volume (0-1)
- `setSoundVolume(volume)`: Adjust sound effects volume (0-1)

---

## Game Mechanics

### Physics
- **Gravity**: 0.3 (base config)
- **Coin Speed**: 8 (base config)
- **Trajectory**: Ballistic physics with gravity
- **Collision Detection**: Rectangle and circle-based
- **Boundary Check**: Coin goes off-screen at -50 to width+50, height+50

### Game Objects

1. **Arc Gates**
   - Boost multiplier by +0.5x
   - Slight velocity boost (velX × 1.1, velY × 0.9)
   - Deactivate after first pass
   - Play gate sound on collision

2. **Slippage Clouds**
   - Slow down coin (velocity × 0.975)
   - Award 10 points when passed (at level completion)
   - Tracked per cloud to avoid double-counting

3. **Barriers**
   - Bounce physics with velocity preservation
   - Award 10 points per collision (at level completion)
   - Can be triggered multiple times

4. **Settlement Zone**
   - Final destination to complete level
   - Pulsing visual effect
   - Plays settlement sound on entry
   - Triggers level completion

5. **Life Restores**
   - Restore lives in tournament mode
   - Circular collision detection

### Game Flow

1. **Start Screen** → User clicks → Audio unlocks → **Main Menu**
2. **Main Menu** → Select mode (Immortal/Tournament/Editor)
3. **Gameplay**:
   - Aim by dragging from player
   - Release to launch coin
   - Coin follows ballistic trajectory
   - Collect gates, avoid clouds, hit settlement zone
4. **Level Complete** → Show summary → Auto-advance to next level
5. **Miss/Boundary Hit** → Play miss sound → Retry (immortal) or lose life (tournament)

### Tournament Mode Lives System
- Starts with 5 lives
- Loses 1 life on boundary hit
- Game Over at 0 lives → Restart from Level 1
- Lives displayed as hearts in UI

---

## UI/UX Features

### Start Screen
- Full-screen overlay
- Title: "ARCMAN: Final Settlement" (top center, cyan glow)
- Subtitle: "Click to Start" (bottom center, yellow glow)
- Background image support (`images/start-background.png`)
- Retro scanline effects
- Pulsing glow animations

### Main Menu
- Background image support (`images/menu-background.png`)
- Three mode buttons:
  - **IMMORTAL MODE**: Infinite retries
  - **TOURNAMENT MODE**: Lives-based challenge
  - **LEVEL EDITOR**: Create custom levels
- Retro TV flicker and scanline effects
- Dark overlay for text readability

### In-Game UI
- Score display (top-left)
- Multiplier display (top-left)
- Status text (top-left)
- Level info (top-right): Level name, progress, lives (tournament mode)
- Back to menu button (top-right)

### Level Editor
- Toolbar with object placement tools
- Canvas preview
- Level save/load from localStorage
- Object selection and rotation (R key or button)
- Level export to DEFAULT_LEVELS format

---

## Technical Details

### Responsive Design
- Full viewport canvas (100vw × 100vh)
- Device pixel ratio support for high-DPI displays
- Responsive font sizes using `clamp()`
- Touch event support for mobile
- Orientation change handling

### State Management
- Game state machine with clear transitions
- Level progression tracking
- Score accumulation across levels
- Lives system for tournament mode

### Performance
- RequestAnimationFrame game loop
- Efficient collision detection
- Particle system with life management
- Canvas optimization for high-DPI displays

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browser support
- Touch event handling
- Audio autoplay policy compliance

---

## Blockchain Integration

### On-Chain Finalization Flow
1. Player completes level
2. Score calculated client-side
3. Frontend calls `POST /api/finalize` with score data
4. Server signs score data
5. Frontend submits signed data to smart contract
6. Contract verifies signature and stores score
7. Leaderboard updated

### Smart Contract Features
- Signature verification (Mode B)
- Best score storage per player address
- Top 100 leaderboard
- Score validation

---

## Development Setup

### Prerequisites
- Node.js (for backend server)
- Modern web browser

### Installation
```bash
npm install
```

### Running
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

### File Serving
- Open `index.html` directly in browser, OR
- Serve through web server (recommended for audio/CORS)
- Backend server runs on default port (check `server.js`)

---

## Important Notes

### Audio Files
- All audio files must be in `audio/` directory
- Game gracefully handles missing audio files (logs to console, continues)
- Audio unlocks on first user interaction (start screen click)
- Music automatically switches between menu and gameplay

### Level Coordinates
- All coordinates are relative (0-1) for responsive scaling
- Scaled to current screen dimensions at runtime
- Level editor uses relative coordinates

### Custom Levels
- Stored in browser `localStorage`
- Can be exported to `DEFAULT_LEVELS` format
- Default levels cannot be deleted

### Game Modes
- **Immortal**: No lives, infinite retries, best for practice
- **Tournament**: Lives system, challenge mode, best for competition
- **Editor**: Level creation, no gameplay

### Scoring
- Base: 100 points per level
- Slippage clouds: +10 points each
- Barriers: +10 points each
- Arc Gates: +0.5x multiplier each
- Final = (100 + bonuses) × multiplier

---

## Known Features & Behaviors

### Audio
- ✅ Menu music plays in main menu
- ✅ Gameplay music plays during gameplay
- ✅ Launch sound on coin launch
- ✅ Gate sound on Arc Gate pass-through
- ✅ Settlement sound on Settlement Zone entry
- ✅ Miss sound on boundary hit
- ✅ Audio unlocks on start screen click
- ✅ Music automatically switches between modes

### Gameplay
- ✅ Physics-based ballistic trajectory
- ✅ Collision detection for all objects
- ✅ Multiplier system via Arc Gates
- ✅ Score calculation with bonuses
- ✅ Level progression
- ✅ Lives system (tournament mode)
- ✅ Boundary detection and miss handling

### UI/UX
- ✅ Start screen with click-to-start
- ✅ Main menu with mode selection
- ✅ In-game UI with score/multiplier/status
- ✅ Level completion summary
- ✅ Level editor with visual tools

---

## Future Enhancement Ideas

- Additional sound effects (barrier bounce, life restore)
- More visual effects and particles
- Additional game modes
- Online leaderboard integration
- Achievement system
- Power-ups and special abilities
- More level variety
- Sound settings menu (volume controls in UI)

---

## Code Organization

The project uses a **modular namespace pattern** for maintainability:
- Each module is self-contained with a clear purpose (50-600 lines each)
- Modules communicate through namespace objects (e.g., `GameState`, `Physics`, `Renderer`)
- No build step required - works with simple `<script>` tags
- Easy to navigate and modify individual systems
- Scripts load in dependency order (handled in `index.html`)

### Module Breakdown

**Core Modules:**
- `js/config.js` - Pure constants, no dependencies
- `js/canvas.js` - Canvas operations, depends on `config.js`
- `js/audio.js` - Self-contained audio system
- `js/state.js` - Game state variables, depends on `config.js`

**System Modules:**
- `js/gameObjects.js` - Object management, depends on `state.js`, `config.js`
- `js/physics.js` - Physics engine, depends on `state.js`, `config.js`, `audio.js`
- `js/renderer.js` - Drawing functions, depends on `state.js`, `config.js`, `canvas.js`
- `js/scoring.js` - Scoring logic, depends on `state.js`
- `js/ui.js` - UI updates, depends on `state.js`

**Flow Modules:**
- `js/gameFlow.js` - Game flow control, depends on all other modules
- `js/levelEditor.js` - Editor system, depends on `state.js`, `config.js`
- `js/input.js` - Event handlers, depends on `state.js`, `gameFlow.js`
- `js/main.js` - Initialization and game loop, depends on all modules

### Key Functions by Module

**Initialization (`js/main.js`, `js/gameObjects.js`):**
- `Game.init()`: Main initialization
- `CanvasManager.setupCanvas()`: Canvas setup and scaling
- `GameObjects.initStars()`: Background stars initialization
- `GameObjects.loadLevel()`: Load level data

**Game Loop (`js/main.js`, `js/physics.js`):**
- `Game.gameLoop()`: Main render loop
- `Physics.updateCoin()`: Coin physics and collision
- `Physics.updateParticles()`: Particle system update

**Rendering (`js/renderer.js`):**
- `Renderer.drawStars()`, `Renderer.drawPlayer()`, `Renderer.drawCoin()`, etc.
- All 11 drawing functions use canvas 2D context

**Game Flow (`js/gameFlow.js`):**
- `GameFlow.showStartScreen()`: Display start screen
- `GameFlow.handleStartScreenClick()`: Start screen interaction
- `GameFlow.showMainMenu()`: Display main menu
- `GameFlow.startImmortalMode()`: Start immortal mode
- `GameFlow.startTournamentMode()`: Start tournament mode
- `GameFlow.startEditorMode()`: Start level editor
- `GameFlow.resetRound()`: Reset current round
- `GameFlow.finalizeRound()`: Complete level

**Audio (`js/audio.js`):**
- `AudioManager` namespace with all audio methods
- Integrated into game flow at appropriate points

---

## Contact & Maintenance

This project description is designed to help continue development in a new chat session. All key implementation details, file structures, and current state are documented above.

**Last Updated**: After code reorganization into 13 modular files

**Key Files to Review for Context:**
1. `js/main.js` - Main game loop and initialization
2. `js/gameFlow.js` - Game mode management and flow control
3. `js/audio.js` - Audio system (AudioManager namespace)
4. `js/state.js` - Game state management
5. `js/physics.js` - Physics engine and collision detection
6. `js/renderer.js` - All rendering functions
7. `index.html` - UI structure and styles (includes script loading order)
8. `levels.js` - Level data structure and LevelManager
9. `README.md` - Project documentation (includes modular architecture details)
10. `game.js` - Legacy monolithic file (kept for reference, not used in production)

