# ARCMAN: Final Settlement - Arcade Game

A retro pixel-art space game with glowing neon effects, inspired by classic arcade shooters. Launch coins through space to reach the Settlement Zone! Features a complete audio system, multiple game modes, and blockchain integration.

## Project Summary

### What the project is

ARCMAN: Final Settlement is a browser-based arcade game in a retro pixel-art style with neon visuals. The player launches a "coin" along a ballistic trajectory, progresses through levels, and can finalize results on-chain. The project combines a frontend game with a complete audio system, a backend for score signing, smart contracts for verification and leaderboards, and NFT completion certificates. Features include player statistics tracking, game mode-specific leaderboards, and ERC-721 NFT minting.

### What problem it solves

* Implements physics-based arcade gameplay (drag → launch).
* Supports a multi-level system with progression and a built-in level editor.
* Calculates and validates scoring with multipliers, bonuses, and penalties.
* Tracks comprehensive player statistics (games played, best scores, completion times, achievements).
* Signs results on the server and submits them to a smart contract for on-chain finalization.
* Maintains separate leaderboards for each game mode (Immortal and Tournament).
* Mints ERC-721 NFT completion certificates (one per game mode).

### Which files are involved

**Frontend**

* `index.html` — main HTML, UI, styles, canvas, start screen, menus, level editor.
* `js/` — modular game code (organized into focused modules):
  * `config.js` — game configuration & constants
  * `canvas.js` — canvas setup & responsive handling
  * `audio.js` — audio system management
  * `state.js` — game state management
  * `gameObjects.js` — object initialization & level loading
  * `physics.js` — physics engine & collision detection
  * `renderer.js` — all drawing/rendering functions
  * `scoring.js` — scoring system
  * `ui.js` — UI update functions
  * `gameFlow.js` — game mode handlers & flow control
  * `levelEditor.js` — level editor system
  * `input.js` — input/event handlers
  * `statistics.js` — player statistics management
  * `web3.js` — Web3 wallet integration and contract interactions
  * `leaderboard.js` — leaderboard data fetching and formatting
  * `nft.js` — NFT minting functionality
  * `quizzes.js` — quiz questions and answers data
  * `quiz.js` — quiz system management for Tournament mode
  * `infoScreens.js` — educational info-screen content (Arc / USDC / Circle facts)
  * `infoManager.js` — info-screen scheduling and display (Tournament & Immortal)
  * `main.js` — main game loop & initialization
* `levels.js` — level structure, default levels, `LevelManager`, loading and saving custom levels.
* `communityLevels.js` — bundled community-submitted levels (loaded alongside `levels.js`)

**Assets**

* `audio/` — audio files directory (menu music, gameplay music, sound effects)
* `images/` — image assets:
  * Menu background (`menu-background.png`)
  * Start screen background (`start-background.png`)
  * Coin sprite (optional PNG, e.g., `coin.png`)
  * Player animation frames (optional PNG sequences, e.g., `player/player-{n}.png`, `player/player-throw-{n}.png`)

**Backend**

* `server.js` — Express server with a **session-based anti-cheat** score flow (`/api/session/start` → `/api/session/event` → `/api/session/finalize`); the server computes the score from validated events and ECDSA-signs it for the smart contract (signature includes game mode). Also hosts `/api/submit-level` (Telegram notification for community levels) and `/api/health`.
* `package.json` — dependencies and run scripts (`npm start`, `npm run dev`)
* `.env` — environment variables: `PRIVATE_KEY` (server signer), optional `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` (level submissions), optional `PORT` (default 3000)

**Blockchain**

* `contract.sol` — Solidity contract for signature verification, best score storage, and game mode-specific leaderboards
* `nftContract.sol` — ERC-721 NFT contract for minting game completion certificates

### Constraints

* All gameplay logic runs client-side; only the final result is recorded on-chain.
* Level coordinates are defined in relative values (0–1) and scaled to the current screen size.
* Custom levels are stored in `localStorage`.
* Server-side signing uses ECDSA signing with ethers.js for secure score verification.
* The **final score is computed by the server** from validated in-game events (not submitted by the client), with anti-cheat checks: per-level object caps, a minimum time per level, session IP binding, and a finalize cooldown.
* Proper on-chain finalization requires the backend server to be running.
* The game targets a fullscreen canvas and prefers landscape orientation on mobile devices.
* Audio system requires user interaction to unlock (handled by start screen).
* Audio files are optional - game continues gracefully if files are missing.

## Features

- **Retro Pixel Art**: Classic arcade aesthetic with neon glow effects and scanline animations
- **Complete Audio System**: 
  - Background music for menu and gameplay
  - Sound effects for all game actions (launch, gates, settlement, miss)
  - Automatic music switching between menu and gameplay
- **Click to Start Screen**: Splash screen that unlocks audio on first interaction
- **Physics-Based Gameplay**: Drag to aim, release to launch coins along curved trajectories
- **Visual Effects**:
  - **USDC Coin Design**: Blue coin with white dollar sign and curved lines, glowing blue trail
  - **Enhanced Trail**: Multi-layer glowing trail that extends across the coin's trajectory
  - **Trail Particles**: Small scattered particles that trail behind the coin during flight
  - **PNG Sprite Support**: Optional PNG sprites for coin and player character
- **Animated Player Character**: PNG sequence animation system supporting multiple animations (idle, throwing)
- **Multi-Level System**: 4+ default levels with automatic progression
- **Game Modes**:
  - **Immortal Mode**: Infinite retries, perfect for practice
  - **Tournament Mode**: Lives-based challenge (5 lives) with quiz system
  - **Level Editor**: Create and edit custom levels
- **Quiz System** (Tournament Mode):
  - Quizzes appear after completing levels 2, 4, 6, 8, and 10
  - Each quiz contains 1 question with 3 answer options
  - Answer correctly to gain +1 life (up to maximum of 5)
  - Skip quizzes if you have full lives or don't need them
  - Topics cover Arc's architecture, USDC as gas, the ARC token, and the agentic economy
  - Each quiz checks the info screen shown one level earlier
  - Questions and answers are easily editable in `js/quizzes.js`
- **Educational Info Screens**:
  - Short Arc / USDC / Circle explainer screens appear after levels 1, 3, 5, 7, and 9
  - Shown in **both** Immortal and Tournament modes (purely informational — no life reward)
  - Content is editable in `js/infoScreens.js`; scheduling lives in `js/infoManager.js`
- **Built-in Level Editor**: Create and edit custom levels with visual placement tools
  - **Drag and Drop**: Move objects by clicking and dragging them with the Select tool
  - **Launch Level**: Test levels directly from the editor without leaving
- **Game Objects**:
  - **Arc Gates**: Boost your multiplier (+0.5x) and trajectory
  - **Slippage Clouds**: Slow down coins and reduce multiplier
  - **Barriers**: Bounce physics with score bonuses
  - **Life Restores**: Restore lives in tournament mode
  - **Settlement Zone**: Final destination to complete the round
- **Scoring System**: Base score (100) + bonuses for clouds passed (10 each) and barriers hit (10 each), multiplied by gate multiplier
- **Final Score Calculation**: Comprehensive score tracking with level-by-level breakdown and game completion statistics
- **Player Statistics**: 
  - Track games played, completed, and abandoned
  - Best scores (final and per-level)
  - Completion times and rates
  - Achievement tracking (gates, clouds, barriers, perfect games)
  - Game mode breakdowns
  - Persistent storage in browser localStorage
- **Blockchain Integration**: 
  - Server-signed score verification with smart contract storage
  - On-chain score finalization with wallet connection (MetaMask, Rabby)
  - Separate leaderboards for each game mode (Immortal/Tournament)
  - Top 10/25/50/100 leaderboard views
  - Player rank tracking
- **NFT Minting**: 
  - ERC-721 completion certificates
  - One NFT per game mode (Immortal and Tournament)
  - Game mode-specific images and metadata
  - Completion date and game mode attributes

## Installation

1. Install dependencies:
```bash
npm install
```

2. Add audio files (optional but recommended):
   - Place audio files in the `audio/` directory:
     - `menu-music.mp3` - Main menu background music
     - `gameplay-music.mp3` - In-game background music
     - `launch.mp3` - Coin launch sound effect
     - `gate.mp3` - Arc Gate pass-through sound
     - `settlement.mp3` - Settlement Zone entry sound
     - `miss.mp3` - Boundary hit/miss sound
   - The game will work without these files but will be silent.

3. Add background images (optional):
   - `images/menu-background.png` - Main menu background
   - `images/start-background.png` - Start screen background
   - Fallback black backgrounds will be used if images are missing.

4. Add sprite images (optional):
   - **Coin sprite**: `images/coin.png` - Custom PNG sprite for the coin (configured in `js/config.js`)
   - **Player animations**: PNG sequence frames for player character animations:
     - `images/player/player-1.png`, `player-2.png`, etc. - Idle animation frames
     - `images/player/player-throw-1.png`, `player-throw-2.png`, etc. - Throwing animation frames
   - If sprite images are not provided, the game uses drawn graphics (USDC logo for coin, pixel-art character for player)

5. Start the server:
```bash
npm start
```

6. **IMPORTANT**: Open the game through a web server, NOT by double-clicking `index.html`!

   **Option A - Using the backend server:**
   ```bash
   npm start
   # Then open http://localhost:3000 in your browser
   ```
   
   **Option B - Using Python (if you don't need the backend):**
   ```bash
   python -m http.server 8000
   # Then open http://localhost:8000 in your browser
   ```
   
   **Option C - Using Node.js http-server:**
   ```bash
   npx http-server -p 8000
   # Then open http://localhost:8000 in your browser
   ```

   **Why?** Wallet extensions (MetaMask, Rabby) only work with `http://` or `https://` URLs, not `file://` protocol. Opening `index.html` directly won't allow wallet connections.

## Gameplay

1. **Start Screen**: Click anywhere on the start screen to begin (unlocks audio)
2. **Main Menu**: Choose your game mode:
   - **Immortal Mode**: Play through all levels with infinite retries
   - **Tournament Mode**: Challenge yourself with a lives system (5 lives)
   - **Level Editor**: Create and edit custom levels
3. **Aiming**: Click and drag from the player character to aim your shot (player switches to throwing animation while aiming)
4. **Launching**: Release to launch the coin from the player's right side along the glowing arc trajectory
5. **Gameplay**: 
   - Pass through Arc Gates to increase multiplier (+0.5x each)
   - Navigate through Slippage Clouds (they slow you down)
   - Hit Barriers for bonus points (bounce physics)
   - Collect Life Restores in tournament mode
   - Reach the Settlement Zone to complete the level
6. **Scoring**: 
   - Base: 100 points per level
   - Slippage Clouds passed: +10 points each
   - Barrier collisions: +10 points each
   - Final score = (100 + bonuses) × multiplier
7. **Level Progression**: When a level is completed, the game automatically advances to the next level
8. **Quiz System** (Tournament Mode only):
   - After completing levels 2, 4, 6, 8, or 10, a quiz appears
   - Answer the question correctly to gain +1 life
   - Skip the quiz if you have full lives or prefer to continue
   - Quizzes cover Arc's architecture, USDC as gas, the ARC token, and the agentic economy
9. **Game Completion**: After completing all levels, view your final score, completion time, and statistics
10. **On-Chain Finalization**: Click "Finalize On-Chain" to submit your score to the blockchain (requires wallet connection)
11. **NFT Minting**: Click "Mint NFT" to mint a completion certificate NFT (one per game mode: Immortal and Tournament)
12. **Leaderboard**: View top players and your rank - separate leaderboards for Immortal and Tournament modes
13. **Statistics**: Access detailed player statistics from the main menu, including games played, best scores, completion times, and achievements

## Level Editor

The game includes a built-in level editor for creating custom levels:

1. **Open Editor**: Click the "Editor" button in the top-right corner
2. **Select Tool**: Choose from the toolbar:
   - **Select**: Click objects to select them (highlighted in yellow)
   - **Arc Gate**: Click to place an arc gate
   - **Slippage Cloud**: Click to place a slippage cloud
   - **Life Restore**: Click to place a life restoration object
   - **Barrier (Large/Medium/Small)**: Click to place barriers of different sizes
   - **Settlement Zone**: Click to set the settlement zone (required!)
   - **Player Start**: Click to set the player starting position
   - **Delete**: Click objects to remove them
3. **Move Objects**: 
   - Select an object with the Select tool (it will highlight in yellow)
   - Click and hold the left mouse button on the selected object
   - Drag it to the desired position
   - Release to drop it in place
   - Works with all objects: gates, clouds, barriers, settlement zone, player, and life restores
4. **Rotate Objects**: Select an object and press **R** or click "Rotate Selected" to rotate gates, barriers, and settlement zones (15° increments)
5. **Edit Level Info**: Enter a level name and view the level ID
6. **Save Level**: Click "Save Level" to save your custom level (stored in browser localStorage)
7. **Launch Level**: Click "Launch Level" to test your level immediately:
   - Saves the level automatically if not already saved
   - Launches the level in test mode
   - Play through the level to test gameplay
   - Click "Back to Editor" or "Return to Editor" after completion to return to editing
8. **Load Level**: Select a level from the dropdown and click "Load Level" to edit it
9. **New Level**: Click "New Level" to start creating a fresh level
10. **Delete Level**: Click "Delete Level" to remove a custom level (default levels cannot be deleted)
11. **Export Levels**: Click "Export DEFAULT_LEVELS" to copy level data for use in `levels.js`

### Level Requirements

- Each level must have exactly **one Settlement Zone** (required to complete the level)
- At least **one Player Start** position (defaults to bottom-left if not set)
- Any number of Arc Gates and Slippage Clouds (optional)

### Adding New Levels Programmatically

To add levels in code, edit `levels.js` and add to the `DEFAULT_LEVELS` array:

```javascript
{
    id: 5,
    name: "My Custom Level",
    player: { x: 0.12, y: 0.75 },  // Relative coordinates (0-1)
    arcGates: [
        { x: 0.5, y: 0.3, width: 0.05, height: 0.13, active: true }
    ],
    slippageClouds: [
        { x: 0.7, y: 0.6, radius: 0.06 }
    ],
    settlementZone: { x: 0.85, y: 0.8, width: 0.1, height: 0.13 }
}
```

All coordinates are relative (0-1) for responsive scaling across different screen sizes.

## Architecture

> **Note**: The codebase is organized into a modular structure (21 modules in the `js/` directory) using the namespace pattern, instead of one monolithic file.

### Frontend Structure

The game uses a **modular namespace pattern** for better organization and maintainability:

**Core Modules:**
- `js/config.js` - Game configuration, constants, and color definitions
- `js/canvas.js` - Canvas initialization, responsive setup, and resize handling
- `js/state.js` - Centralized game state management (all game variables)
- `js/main.js` - Main game loop and initialization

**Game Systems:**
- `js/audio.js` - Complete audio system (music and sound effects)
- `js/physics.js` - Physics engine, collision detection, particle system, and coin trail particles
- `js/renderer.js` - All drawing functions (includes coin rendering with USDC logo, trail effects, player animations)
- `js/gameObjects.js` - Object initialization, level loading, star generation, sprite loading
- `js/scoring.js` - Scoring calculations and level summary display
- `js/ui.js` - UI update functions

**Game Flow:**
- `js/gameFlow.js` - Game mode management (immortal, tournament, editor), level progression, round management, completion screens, statistics, leaderboard, NFT minting
- `js/input.js` - Input handling (mouse, touch, keyboard events)
- `js/levelEditor.js` - Complete level editor system
- `js/quizzes.js` - Quiz questions and answers data (editable quiz content)
- `js/quiz.js` - Quiz system management for Tournament mode (quiz display, answer handling, life rewards)
- `js/infoScreens.js` - Educational info-screen content (Arc / USDC / Circle facts)
- `js/infoManager.js` - Info-screen scheduling and display (after levels 1, 3, 5, 7, 9 in both modes)

**Blockchain & Statistics:**
- `js/statistics.js` - Player statistics management and localStorage persistence
- `js/web3.js` - Web3 wallet integration (MetaMask, Rabby), contract interactions, network management
- `js/leaderboard.js` - Leaderboard data fetching, formatting, and display
- `js/nft.js` - NFT minting functionality, metadata generation, token management

**Supporting Files:**
- `index.html` - Main game page with start screen, menus, and level editor UI
- `levels.js` - Level data structure, default levels, and level management (`LevelManager` class)
- `communityLevels.js` - Bundled community-submitted levels, loaded alongside `levels.js`

### Module Organization

The codebase is organized into **21 focused modules** (50-600 lines each) instead of one large file. Key modules and their dependencies:

1. **Configuration** (`config.js`) - Pure constants, no dependencies
2. **Canvas** (`canvas.js`) - Canvas operations, depends on `config.js`
3. **Audio** (`audio.js`) - Self-contained audio system
4. **State** (`state.js`) - Game state variables, depends on `config.js`
5. **Game Objects** (`gameObjects.js`) - Object management, depends on `state.js`, `config.js`
6. **Physics** (`physics.js`) - Physics engine, depends on `state.js`, `config.js`, `audio.js`
7. **Renderer** (`renderer.js`) - Drawing functions, depends on `state.js`, `config.js`, `canvas.js`
8. **Scoring** (`scoring.js`) - Scoring logic, depends on `state.js`
9. **UI** (`ui.js`) - UI updates, depends on `state.js`
10. **Game Flow** (`gameFlow.js`) - Game flow control, depends on all other modules
11. **Level Editor** (`levelEditor.js`) - Editor system, depends on `state.js`, `config.js`
12. **Input** (`input.js`) - Event handlers, depends on `state.js`, `gameFlow.js`
13. **Main** (`main.js`) - Initialization and game loop, depends on all modules

All modules use **namespace objects** (e.g., `GameState`, `Physics`, `Renderer`) to avoid global variable pollution.

### Audio System
The game includes a complete audio system managed by the `AudioManager` namespace (`js/audio.js`):
- **Music**: Automatically switches between menu and gameplay music
- **Sound Effects**: Launch, gate pass-through, settlement entry, and miss sounds
- **Browser Compatibility**: Handles autoplay policies by unlocking audio on first user interaction
- **Graceful Degradation**: Game continues to function if audio files are missing

### Backend
`server.js` is an Express server that serves the static game and runs a **session-based, server-authoritative scoring flow** (anti-cheat). The client reports gameplay events; the server validates them, computes the score itself, and ECDSA-signs it for the smart contract.

API endpoints:
- `POST /api/session/start` — begin a session. Body: `{ player, gameMode }` (`gameMode` = `Immortal` | `Tournament`). Returns `{ sessionId, totalLevels }`. Any previous session for the same player is invalidated.
- `POST /api/session/event` — report an event. Body: `{ sessionId, eventType }`, where `eventType` ∈ `levelStart | gatePassed | cloudPassed | barrierHit | levelComplete`. The server enforces per-level object caps (from `DEFAULT_LEVELS`), a minimum time per level, and session IP binding.
- `POST /api/session/finalize` — finish a session. Body: `{ sessionId, nonce }`. Validates that all levels were completed and minimum timings were met, computes the score `Σ floor((100 + clouds·10 + barriers·10) · (1 + gates·0.5))`, then returns `{ score, signature, signerAddress, timestamp }`. Rate-limited to one finalize per player per 60s.
- `POST /api/submit-level` — submit a custom level for approval. Body: `{ level }`. Sends the level JSON to Telegram (if `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` are set). Returns `{ success, telegramSent }`.
- `GET /api/health` — health check, returns `{ status: 'ok' }`.
- `GET /` and static files are served from the project root.

Anti-cheat parameters: 1-hour session expiry, ≥ 3 s per level, 60 s finalize cooldown per player. Environment: `PRIVATE_KEY` (server signer — required for valid signatures), optional `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`, optional `PORT` (default `3000`).

### Smart Contracts
- `contract.sol`: Solidity contract for score verification and leaderboard
  - Uses server-signed validation with game mode support
  - Stores best scores per player per game mode
  - Maintains separate top 100 leaderboards for Immortal and Tournament modes
  - Game mode is included in signature verification
- `nftContract.sol`: ERC-721 NFT contract for completion certificates
  - Allows players to mint one NFT per game mode
  - Stores completion data (score, levels, time, game mode) on-chain
  - Uses OpenZeppelin contracts for security

## Blockchain Integration

The game uses a comprehensive blockchain integration system:

1. **Offchain Gameplay**: All game logic and physics run client-side
2. **Onchain Verification**: After successful runs, scores are:
   - Signed by the backend server (includes game mode in signature)
   - Verified by the smart contract
   - Stored on-chain with game mode-specific leaderboard support
3. **Leaderboards**: 
   - Separate leaderboards for Immortal and Tournament modes
   - Toggle between game modes using mode selector buttons
   - View top 10, 25, 50, or 100 players
   - See your rank in each game mode
   - Real-time updates from blockchain
   - Player highlighting for your own entries
4. **NFT Minting**:
   - Mint completion certificate NFTs after finishing a game
   - One NFT per game mode (Immortal and Tournament)
   - NFTs include completion date and game mode attributes
   - Game mode-specific images (configurable in `js/config.js`)
   - ERC-721 standard compatible
   - Prevents duplicate minting per game mode

## Player Statistics

The game tracks comprehensive player statistics stored in browser localStorage:

- **Overview**: Games played, completed, abandoned, completion rate
- **Best Scores**: Best final score, best level score, average final score, total lifetime points
- **Performance**: Total levels completed, average levels per game, fastest completion time, average completion time
- **Achievements**: Total gates passed, total clouds passed, total barriers hit, perfect games
- **Game Mode Breakdown**: Statistics for Immortal and Tournament modes separately
- **Last Game**: Details about the most recent game session

Access statistics from the main menu "Statistics" button. Statistics persist across browser sessions and can be reset if needed.

## Configuration

### Blockchain Configuration

Contract addresses live in `js/config.js`. The current deployment (Arc Testnet) uses:

```javascript
BLOCKCHAIN: {
    CONTRACT_ADDRESS: '0x1E880c3165f5f2ee6B4d00598C9B5e1BfAC6ED0f',     // Score / leaderboard contract
    NFT_CONTRACT_ADDRESS: '0x6695B1B9d03fB3E94fdC7599abeB97DDF3E9a764', // NFT (ERC-721) contract
    NETWORK: 'ArcTestnet',                  // Arc Testnet (chain ID 5042002)
    API_URL: 'https://arcmangame.com'       // Backend server URL (use http://localhost:3000 locally)
}
```

### NFT Image Configuration

Configure different images for each game mode in `js/config.js`:

```javascript
NFT_IMAGES: {
    Immortal: 'https://your-domain.com/images/nft-immortal.png',
    Tournament: 'https://your-domain.com/images/nft-tournament.png'
}
```

### Environment Setup

Create a `.env` file in the project root:

```
PRIVATE_KEY=0x...              # server signer key (must match the signer the contract expects)
# Optional — enables Telegram notifications for community level submissions:
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
# Optional — server port (default 3000):
PORT=3000
```

`.env` is git-ignored and must never be committed. If `PRIVATE_KEY` is unset, the server generates a throwaway key on startup, so on-chain finalization will fail signature verification.

## Audio Files

The game supports the following audio files (all optional):

**Music (looping):**
- `audio/menu-music.mp3` - Plays in the main menu
- `audio/gameplay-music.mp3` (plus `gameplay-music-1.mp3`, `gameplay-music-2.mp3`, `gameplay-music-3.mp3` variants) - Plays during gameplay
- `audio/editor-music.mp3` - Plays in the level editor

**Sound Effects:**
- `audio/launch.mp3` - Plays when coin is launched
- `audio/gate.mp3` - Plays when passing through Arc Gates
- `audio/settlement.mp3` - Plays when entering Settlement Zone
- `audio/miss.mp3` - Plays when coin hits screen boundaries

All audio files should be placed in the `audio/` directory. The game will work without these files but will be silent.

## Customization

### Coin Sprite

The game supports custom PNG sprites for the coin. By default, it uses a drawn USDC logo (blue circle with white dollar sign and curved lines). To use a custom sprite:

1. Place your coin sprite image in the `images/` directory (e.g., `images/coin.png`)
2. Configure the path in `js/config.js`:
   ```javascript
   COIN_SPRITE_PATH: 'images/coin.png', // Set to null to use drawn USDC logo
   ```

### Player Animations

The game supports PNG sequence animations for the player character. You can configure multiple animations (idle, throwing) in `js/config.js`:

```javascript
PLAYER_ANIMATION: {
    idle: {
        pathPattern: 'images/player/player-{n}.png',
        frameCount: 8,
        frameRate: 8,
        numberingStyle: 'single' // 'single', 'double', or 'triple'
    },
    throwing: {
        pathPattern: 'images/player/player-throw-{n}.png',
        frameCount: 2,
        frameRate: 8,
        numberingStyle: 'single'
    }
}
```

**File naming patterns:**
- `{n}` - Single digit: `player-1.png`, `player-2.png`, etc.
- `{nn}` - Double digit: `player-01.png`, `player-02.png`, etc. (set `numberingStyle: 'double'`)
- `{nnn}` - Triple digit: `player-001.png`, `player-002.png`, etc. (set `numberingStyle: 'triple'`)

**Animation behavior:**
- **Idle animation**: Plays when the player is not actively aiming
- **Throwing animation**: Plays when the player is actively dragging to aim (preparing to throw)
- If animations are not configured, the game uses a drawn pixel-art character

### Player Size

Adjust the player character size in `js/config.js`:

```javascript
PLAYER_SIZE_SCALE: 1.0, // 1.0 = default, 1.5 = 50% bigger, 2.0 = double size, etc.
```

### Quiz Questions

Edit quiz questions and answers in `js/quizzes.js`. The file contains an array of 5 quizzes that appear after levels 2, 4, 6, 8, and 10 in Tournament mode:

```javascript
const QUIZZES = [
    {
        id: 1, // For level 2
        question: "What is Arc?",
        answers: [
            "A Layer-2 rollup that settles on Ethereum",
            "An EVM-compatible Layer-1 built by Circle for stablecoin finance",
            "A closed payment API with no blockchain behind it"
        ],
        correctIndex: 1 // Index of the correct answer (0, 1, or 2)
    },
    // ... more quizzes
];
```

Each quiz object contains:
- `id`: Quiz identifier (matches the level where it appears)
- `question`: The question text
- `answers`: Array of 3 answer options
- `correctIndex`: Index (0-2) of the correct answer in the answers array

## Development

### Code Organization

The project uses a **modular namespace pattern** for maintainability:
- Each module is self-contained with a clear purpose
- Modules communicate through namespace objects (e.g., `GameState`, `Physics`, `Renderer`)
- No build step required - works with simple `<script>` tags
- Easy to navigate and modify individual systems

### Module Dependencies

Scripts must load in dependency order (handled automatically in `index.html`):
1. `levels.js` - Level data (no dependencies)
2. `communityLevels.js` - Community level data (depends on levels)
3. `js/config.js` - Configuration (no dependencies)
4. `js/canvas.js` - Canvas setup (depends on config)
5. `js/audio.js` - Audio system (no dependencies)
6. `js/state.js` - Game state (depends on config)
7. `js/gameObjects.js` - Object management (depends on state, config)
8. `js/physics.js` - Physics engine (depends on state, config, audio)
9. `js/renderer.js` - Rendering (depends on state, config, canvas)
10. `js/scoring.js` - Scoring (depends on state)
11. `js/quizzes.js` - Quiz data (no dependencies)
12. `js/quiz.js` - Quiz management (depends on state, config, quizzes)
13. `js/infoScreens.js` - Info-screen data (no dependencies)
14. `js/infoManager.js` - Info-screen management (depends on state, infoScreens)
15. `js/ui.js` - UI updates (depends on state)
16. `js/statistics.js` - Statistics management (depends on state)
17. `js/web3.js` - Web3 integration (depends on config)
18. `js/leaderboard.js` - Leaderboard (depends on web3)
19. `js/nft.js` - NFT minting (depends on web3, config)
20. `js/gameFlow.js` - Game flow (depends on all above)
21. `js/levelEditor.js` - Level editor (depends on state, config)
22. `js/input.js` - Input handling (depends on state, gameFlow)
23. `js/main.js` - Main loop (depends on all modules)

> `ethers` (v6) is loaded from a CDN `<script>` before the `js/` modules. The order above is wired up in `index.html`.

### Development Commands

For development with auto-reload:
```bash
npm run dev
```

For production:
```bash
npm start
```

## License

MIT


