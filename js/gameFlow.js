// Game Flow Module - Game mode management and flow control
const GameFlow = {

    // --- Anti-cheat session helpers ---

    _getApiUrl: function() {
        return GameConfig.BLOCKCHAIN.API_URL || '';
    },

    startSession: async function(player, gameMode) {
        try {
            const apiUrl = this._getApiUrl();
            const response = await fetch(`${apiUrl}/api/session/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player, gameMode }),
                signal: AbortSignal.timeout(5000)
            });
            if (!response.ok) return null;
            const data = await response.json();
            if (data.success) {
                GameState.sessionId = data.sessionId;
                console.log('Session started:', data.sessionId);
                return data.sessionId;
            }
        } catch (e) {
            console.warn('Failed to start session:', e.message);
        }
        return null;
    },

    sendSessionEvent: function(eventType) {
        if (!GameState.sessionId) return;
        const apiUrl = this._getApiUrl();
        fetch(`${apiUrl}/api/session/event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: GameState.sessionId,
                eventType
            })
        }).then(resp => {
            if (!resp.ok) resp.json().then(d => console.warn('Session event rejected:', eventType, d.error)).catch(() => {});
        }).catch(e => console.warn('Session event failed:', e.message));
    },

    // --- End anti-cheat helpers ---

    // Finalize round
    finalizeRound: function() {
        // Prevent double-finalization
        if (GameState.gameState === 'finalized' || GameState.isAdvancing || GameState.gameMode === null) {
            return;
        }
        
        // Agent Shift keeps its own books — no scoring, no level progression.
        if (GameState.agentShiftMode && typeof AgentMode !== 'undefined') {
            AgentMode.onSettled();
            return;
        }

        GameState.gameState = 'finalized';

        // Notify server of level completion
        this.sendSessionEvent('levelComplete');
        
        // Calculate final score with multiplier
        // Base points: 100 for level completion + 10 per slippage cloud + 10 per barrier hit
        const basePoints = 100 + (GameState.slippageCloudsPassed * 10) + (GameState.barrierHits * 10);
        const finalScore = Math.floor(basePoints * GameState.multiplier);
        GameState.levelPoints = finalScore;
        GameState.totalPoints += finalScore;
        
        // Store the final score
        GameState.score = finalScore;
        
        // Track level score for game completion stats
        GameState.levelScores.push(finalScore);
        if (finalScore > GameState.bestLevelScore) {
            GameState.bestLevelScore = finalScore;
        }
        
        // Track game-wide totals for statistics
        GameState.totalGatesPassed += GameState.gatesPassed;
        GameState.totalCloudsPassed += GameState.slippageCloudsPassed;
        GameState.totalBarriersHit += GameState.barrierHits;
        
        // Stop coin updates to prevent boundary checks from overwriting finalized state
        GameState.coin = null;
        
        // Show finalized flash (only if not already showing)
        const flash = document.getElementById('finalizedFlash');
        if (flash && flash.style.display !== 'flex') {
            flash.style.display = 'flex';
            setTimeout(() => {
                flash.style.display = 'none';
            }, 3000);
        }
        
        // Show level completion summary screen
        if (typeof Scoring !== 'undefined' && Scoring.showLevelSummary) {
            Scoring.showLevelSummary();
        }
        
        // Clear any existing advancement timeout (user will manually advance via summary screen)
        if (GameState.levelAdvancementTimeout) {
            clearTimeout(GameState.levelAdvancementTimeout);
            GameState.levelAdvancementTimeout = null;
        }
        
        // Note: Level advancement is now handled by the summary screen's "Continue" button
        // No automatic advancement - user must click "Continue" to proceed
    },
    
    // Restart tournament from first level (when all lives are used)
    restartTournamentFromFirst: async function() {
        if (!GameState.tournamentMode) return;
        
        // Full score/state reset
        GameState.totalPoints = 0;
        GameState.finalScore = 0;
        GameState.levelScores = [];
        GameState.bestLevelScore = 0;
        GameState.totalGatesPassed = 0;
        GameState.totalCloudsPassed = 0;
        GameState.totalBarriersHit = 0;
        GameState.gameStartTime = Date.now();
        GameState.gameCompleted = false;

        // Restart anti-cheat session (old one is now invalid)
        const account = Web3Manager.currentAccount;
        if (account) {
            await this.startSession(account, 'Tournament');
        }
        
        // Reset lives to 5
        GameState.tournamentLives = GameConfig.MAX_TOURNAMENT_LIVES;
        if (typeof UI !== 'undefined' && UI.updateLivesUI) {
            UI.updateLivesUI();
        }
        
        // Reset to first level
        if (GameState.levelManager) {
            GameState.levelManager.setCurrentLevel(0);
            const firstLevel = GameState.levelManager.getCurrentLevel();
            if (firstLevel) {
                if (typeof GameObjects !== 'undefined' && GameObjects.loadLevel) {
                    GameObjects.loadLevel(firstLevel);
                }
                this.resetRound();

                // Notify server of first level start
                this.sendSessionEvent('levelStart');

                if (typeof UI !== 'undefined' && UI.updateLevelUI) {
                    UI.updateLevelUI();
                }
                
            }
        }
    },
    
    // Advance to next level
    advanceToNextLevel: function() {
        if (!GameState.levelManager) {
            console.error('Level manager not initialized');
            return;
        }
        
        // Prevent multiple simultaneous advances
        if (GameState.isAdvancing) {
            console.log('Level advancement already in progress');
            return;
        }
        
        GameState.isAdvancing = true;
        
        // Clear any pending advancement timeout
        if (GameState.levelAdvancementTimeout) {
            clearTimeout(GameState.levelAdvancementTimeout);
            GameState.levelAdvancementTimeout = null;
        }
        
        // Save current level index before advancing
        const currentIndex = GameState.levelManager.currentLevelIndex;
        
        // Check if there's a next level
        const hasNext = GameState.levelManager.nextLevel();
        
        if (hasNext) {
            // Load next level
            const nextLevel = GameState.levelManager.getCurrentLevel();
            if (nextLevel) {
                console.log('Advancing to level:', nextLevel.id, nextLevel.name);

                // Notify server about new level start
                this.sendSessionEvent('levelStart');
                
                // Ensure canvas dimensions are set before loading level
                // loadLevel uses CONFIG.width and CONFIG.height to convert relative coords
                if (GameConfig.CONFIG.width <= 0 || GameConfig.CONFIG.height <= 0) {
                    console.warn('Canvas dimensions invalid, reinitializing');
                    // Canvas not initialized, use window dimensions and update canvas
                    GameConfig.CONFIG.width = window.innerWidth || 800;
                    GameConfig.CONFIG.height = window.innerHeight || 600;
                    
                    // Update canvas size
                    if (CanvasManager.canvas) {
                        CanvasManager.canvas.style.width = GameConfig.CONFIG.width + 'px';
                        CanvasManager.canvas.style.height = GameConfig.CONFIG.height + 'px';
                        
                        const dpr = window.devicePixelRatio || 1;
                        CanvasManager.canvas.width = GameConfig.CONFIG.width * dpr;
                        CanvasManager.canvas.height = GameConfig.CONFIG.height * dpr;
                        
                        CanvasManager.ctx.setTransform(1, 0, 0, 1, 0, 0);
                        CanvasManager.ctx.scale(dpr, dpr);
                    }
                }
                
                // Load the level data (this converts relative to absolute coordinates)
                // This needs to happen before resetRound so gates are loaded first
                if (typeof GameObjects !== 'undefined' && GameObjects.loadLevel) {
                    GameObjects.loadLevel(nextLevel);
                }
                
                // Reset game state (this also resets gates to active, which is what we want)
                // This is safe to call after loadLevel because it only resets game state variables
                this.resetRound();
                
                // Update UI after reset
                if (typeof UI !== 'undefined' && UI.updateLevelUI) {
                    UI.updateLevelUI();
                }
                
                
                console.log('Level advanced successfully');
            } else {
                console.error('Failed to get next level');
                // Revert level index if loading failed
                GameState.levelManager.currentLevelIndex = currentIndex;
            }
        } else {
            // All levels completed!
            console.log('All levels completed!');
            this.handleGameCompletion();
        }
        
        GameState.isAdvancing = false;
    },
    
    // Handle game completion
    handleGameCompletion: function() {
        if (GameState.gameCompleted) {
            return; // Already handled
        }
        
        // Mark game as completed
        GameState.gameCompleted = true;
        GameState.gameEndTime = Date.now();
        GameState.finalScore = GameState.totalPoints;
        GameState.levelsCompleted = GameState.levelManager ? GameState.levelManager.levels.length : 0;
        
        // Calculate completion time
        const completionTime = GameState.gameStartTime 
            ? Math.floor((GameState.gameEndTime - GameState.gameStartTime) / 1000) 
            : 0;
        
        // Calculate average level score
        const averageLevelScore = GameState.levelScores.length > 0
            ? Math.floor(GameState.totalPoints / GameState.levelScores.length)
            : 0;
        
        // Calculate total gates, clouds, and barriers for this game
        const totalGates = GameState.totalGatesPassed || 0;
        const totalClouds = GameState.totalCloudsPassed || 0;
        const totalBarriers = GameState.totalBarriersHit || 0;
        
        // Store completion data
        GameState.completionData = {
            finalScore: GameState.finalScore,
            levelsCompleted: GameState.levelsCompleted,
            completionTime: completionTime,
            bestLevelScore: GameState.bestLevelScore,
            averageLevelScore: averageLevelScore,
            gameMode: GameState.communityMode ? 'Community' : (GameState.immortalMode ? 'Immortal' : (GameState.tournamentMode ? 'Tournament' : 'Unknown')),
            timestamp: GameState.gameEndTime,
            totalGates: totalGates,
            totalClouds: totalClouds,
            totalBarriers: totalBarriers
        };
        
        console.log('Game completed!', GameState.completionData);
        
        // Update player statistics
        if (typeof PlayerStatistics !== 'undefined' && PlayerStatistics.updateStats) {
            PlayerStatistics.updateStats(GameState.completionData);
        }
        
        // Check if this is community mode
        if (GameState.communityMode) {
            // Show simple completion message for community levels
            this.showCommunityCompletionMessage();
        } else {
            // Show game completion screen with NFT minting for regular modes
            this.showGameCompletionScreen();
        }
        
    },
    
    // Show game completion screen
    showGameCompletionScreen: function() {
        const completionScreen = document.getElementById('gameCompletionScreen');
        if (!completionScreen) return;
        
        // Hide level summary if visible
        const levelSummary = document.getElementById('levelSummary');
        if (levelSummary) {
            levelSummary.style.display = 'none';
        }
        
        // Update completion screen data
        const finalScoreEl = document.getElementById('completionFinalScore');
        const levelsCompletedEl = document.getElementById('completionLevelsCompleted');
        const completionTimeEl = document.getElementById('completionTime');
        const bestLevelScoreEl = document.getElementById('completionBestLevelScore');
        const averageLevelScoreEl = document.getElementById('completionAverageLevelScore');
        const gameModeEl = document.getElementById('completionGameMode');
        
        if (finalScoreEl) finalScoreEl.textContent = GameState.finalScore.toLocaleString();
        if (levelsCompletedEl) levelsCompletedEl.textContent = GameState.levelsCompleted;
        
        // Format completion time (MM:SS)
        const minutes = Math.floor(GameState.completionData.completionTime / 60);
        const seconds = GameState.completionData.completionTime % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (completionTimeEl) completionTimeEl.textContent = timeString;
        
        if (bestLevelScoreEl) bestLevelScoreEl.textContent = GameState.bestLevelScore.toLocaleString();
        if (averageLevelScoreEl) averageLevelScoreEl.textContent = GameState.completionData.averageLevelScore.toLocaleString();
        if (gameModeEl) gameModeEl.textContent = GameState.completionData.gameMode;
        
        // Show completion screen
        completionScreen.style.display = 'flex';
        
        // Setup button handlers
        this.setupCompletionScreenButtons();
    },
    
    // Setup completion screen button handlers
    setupCompletionScreenButtons: function() {
        const returnToMenuBtn = document.getElementById('completionReturnToMenu');
        const finalizeOnchainBtn = document.getElementById('completionFinalizeOnchain');
        
        if (returnToMenuBtn) {
            // Remove existing listeners by cloning
            const newBtn = returnToMenuBtn.cloneNode(true);
            returnToMenuBtn.parentNode.replaceChild(newBtn, returnToMenuBtn);
            
            newBtn.addEventListener('click', () => {
                this.hideGameCompletionScreen();
                this.showMainMenu();
            });
        }
        
        if (finalizeOnchainBtn) {
            // Remove existing listeners by cloning
            const newBtn = finalizeOnchainBtn.cloneNode(true);
            finalizeOnchainBtn.parentNode.replaceChild(newBtn, finalizeOnchainBtn);
            
            newBtn.addEventListener('click', () => {
                this.hideGameCompletionScreen();
                this.showOnchainFinalizationScreen();
            });
        }
        
        const mintNFTBtn = document.getElementById('completionMintNFT');
        if (mintNFTBtn) {
            const newBtn = mintNFTBtn.cloneNode(true);
            mintNFTBtn.parentNode.replaceChild(newBtn, mintNFTBtn);
            
            newBtn.addEventListener('click', () => {
                this.hideGameCompletionScreen();
                this.showNFTMintingScreen();
            });
        }
    },
    
    // Hide game completion screen
    hideGameCompletionScreen: function() {
        const completionScreen = document.getElementById('gameCompletionScreen');
        if (completionScreen) {
            completionScreen.style.display = 'none';
        }
    },
    
    // Show community completion message
    showCommunityCompletionMessage: function() {
        const communityCompletionPopup = document.getElementById('communityCompletionPopup');
        if (!communityCompletionPopup) {
            // If popup doesn't exist, create it dynamically or use alert as fallback
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification("You've completed all community-created levels. Come back later for new ones, superhero!", 10000);
            } else {
                alert("You've completed all community-created levels. Come back later for new ones, superhero!");
            }
            // Return to menu after a delay
            setTimeout(() => {
                this.showMainMenu();
            }, 2000);
            return;
        }
        
        // Hide level summary if visible
        const levelSummary = document.getElementById('levelSummary');
        if (levelSummary) {
            levelSummary.style.display = 'none';
        }
        
        // Show popup
        communityCompletionPopup.style.display = 'flex';
        
        // Setup return to menu button
        const returnToMenuBtn = document.getElementById('communityCompletionReturnToMenu');
        if (returnToMenuBtn) {
            // Remove existing listeners by cloning
            const newBtn = returnToMenuBtn.cloneNode(true);
            returnToMenuBtn.parentNode.replaceChild(newBtn, returnToMenuBtn);
            
            newBtn.addEventListener('click', () => {
                this.hideCommunityCompletionMessage();
                this.showMainMenu();
            });
        }
    },
    
    // Hide community completion message
    hideCommunityCompletionMessage: function() {
        const communityCompletionPopup = document.getElementById('communityCompletionPopup');
        if (communityCompletionPopup) {
            communityCompletionPopup.style.display = 'none';
        }
    },
    
    // Show statistics screen
    showStatisticsScreen: function() {
        const statsScreen = document.getElementById('statisticsScreen');
        if (!statsScreen) {
            console.error('Statistics screen element not found');
            return;
        }
        
        // Hide main menu if visible
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu && !mainMenu.classList.contains('hidden')) {
            mainMenu.classList.add('hidden');
        }
        
        // Hide other screens
        this.hideAudioOptions();
        
        // Update statistics display
        if (typeof PlayerStatistics !== 'undefined' && PlayerStatistics.getFormattedStats) {
            const formatted = PlayerStatistics.getFormattedStats();
            
            // Overview Section
            const gamesPlayedEl = document.getElementById('statsGamesPlayed');
            const gamesCompletedEl = document.getElementById('statsGamesCompleted');
            const completionRateEl = document.getElementById('statsCompletionRate');
            
            if (gamesPlayedEl) gamesPlayedEl.textContent = formatted.gamesPlayed;
            if (gamesCompletedEl) gamesCompletedEl.textContent = formatted.gamesCompleted;
            if (completionRateEl) completionRateEl.textContent = formatted.completionRate;
            
            // Best Scores Section
            const bestFinalScoreEl = document.getElementById('statsBestFinalScore');
            const bestLevelScoreEl = document.getElementById('statsBestLevelScore');
            const averageFinalScoreEl = document.getElementById('statsAverageFinalScore');
            const totalLifetimePointsEl = document.getElementById('statsTotalLifetimePoints');
            
            if (bestFinalScoreEl) bestFinalScoreEl.textContent = formatted.bestFinalScore;
            if (bestLevelScoreEl) bestLevelScoreEl.textContent = formatted.bestLevelScore;
            if (averageFinalScoreEl) averageFinalScoreEl.textContent = formatted.averageFinalScore;
            if (totalLifetimePointsEl) totalLifetimePointsEl.textContent = formatted.totalLifetimePoints;
            
            // Performance Section
            const totalLevelsEl = document.getElementById('statsTotalLevels');
            const avgLevelsPerGameEl = document.getElementById('statsAvgLevelsPerGame');
            const fastestTimeEl = document.getElementById('statsFastestTime');
            const avgTimeEl = document.getElementById('statsAvgTime');
            
            if (totalLevelsEl) totalLevelsEl.textContent = formatted.totalLevelsCompleted;
            if (avgLevelsPerGameEl) avgLevelsPerGameEl.textContent = formatted.averageLevelsPerGame;
            if (fastestTimeEl) fastestTimeEl.textContent = formatted.fastestCompletionTime;
            if (avgTimeEl) avgTimeEl.textContent = formatted.averageCompletionTime;
            
            // Achievements Section
            const totalGatesEl = document.getElementById('statsTotalGates');
            const totalCloudsEl = document.getElementById('statsTotalClouds');
            const totalBarriersEl = document.getElementById('statsTotalBarriers');
            const perfectGamesEl = document.getElementById('statsPerfectGames');
            
            if (totalGatesEl) totalGatesEl.textContent = formatted.totalGatesPassed;
            if (totalCloudsEl) totalCloudsEl.textContent = formatted.totalCloudsPassed;
            if (totalBarriersEl) totalBarriersEl.textContent = formatted.totalBarriersHit;
            if (perfectGamesEl) perfectGamesEl.textContent = formatted.perfectGames;
            
            // Game Mode Stats
            const immortalPlayedEl = document.getElementById('statsImmortalPlayed');
            const immortalCompletedEl = document.getElementById('statsImmortalCompleted');
            const tournamentPlayedEl = document.getElementById('statsTournamentPlayed');
            const tournamentCompletedEl = document.getElementById('statsTournamentCompleted');
            
            if (immortalPlayedEl) immortalPlayedEl.textContent = formatted.immortalGamesPlayed;
            if (immortalCompletedEl) immortalCompletedEl.textContent = formatted.immortalGamesCompleted;
            if (tournamentPlayedEl) tournamentPlayedEl.textContent = formatted.tournamentGamesPlayed;
            if (tournamentCompletedEl) tournamentCompletedEl.textContent = formatted.tournamentGamesCompleted;
            
            // Last Game
            const lastGameDateEl = document.getElementById('statsLastGameDate');
            const lastGameModeEl = document.getElementById('statsLastGameMode');
            const lastGameScoreEl = document.getElementById('statsLastGameScore');
            
            if (lastGameDateEl) lastGameDateEl.textContent = formatted.lastGameDate;
            if (lastGameModeEl) lastGameModeEl.textContent = formatted.lastGameMode;
            if (lastGameScoreEl) lastGameScoreEl.textContent = formatted.lastGameScore;
        }
        
        // Show statistics screen
        statsScreen.style.display = 'flex';
        
        // Setup button handlers
        this.setupStatisticsScreenButtons();
    },
    
    // Setup statistics screen button handlers
    setupStatisticsScreenButtons: function() {
        const closeBtn = document.getElementById('statsClose');
        const resetBtn = document.getElementById('statsReset');
        
        if (closeBtn) {
            // Remove existing listeners by cloning
            const newBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newBtn, closeBtn);
            
            newBtn.addEventListener('click', () => {
                this.closeStatisticsScreen();
            });
        }
        
        if (resetBtn) {
            // Remove existing listeners by cloning
            const newBtn = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newBtn, resetBtn);
            
            newBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
                    if (typeof PlayerStatistics !== 'undefined' && PlayerStatistics.resetStats) {
                        PlayerStatistics.resetStats();
                        // Refresh the display
                        this.showStatisticsScreen();
                    }
                }
            });
        }
    },
    
    // Hide statistics screen
    hideStatisticsScreen: function() {
        const statsScreen = document.getElementById('statisticsScreen');
        if (statsScreen) {
            statsScreen.style.display = 'none';
        }
    },
    
    // Close statistics screen and return to menu
    closeStatisticsScreen: function() {
        console.log('Closing statistics screen');
        this.hideStatisticsScreen();
        // Show main menu - if we opened stats from menu, we should return to menu
        // If we're in a game (gameMode !== null), the menu button will handle navigation
        this.showMainMenu();
    },
    
    // Show audio options panel
    showAudioOptions: function() {
        const audioOptionsPanel = document.getElementById('audioOptionsPanel');
        if (!audioOptionsPanel) {
            console.error('Audio options panel element not found');
            return;
        }
        
        // Hide main menu if visible
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu && !mainMenu.classList.contains('hidden')) {
            mainMenu.classList.add('hidden');
        }
        
        // Hide other screens
        this.hideGameCompletionScreen();
        this.hideStatisticsScreen();
        this.hideLeaderboardScreen();
        
        // Show audio options panel
        audioOptionsPanel.classList.remove('hidden');
        
        // Update volume slider values to current settings
        const musicVolumeSlider = document.getElementById('musicVolumeSlider');
        const soundVolumeSlider = document.getElementById('soundVolumeSlider');
        const musicVolumeValue = document.getElementById('musicVolumeValue');
        const soundVolumeValue = document.getElementById('soundVolumeValue');
        
        if (musicVolumeSlider && musicVolumeValue) {
            const currentVolume = Math.round(AudioManager.musicVolume * 100);
            musicVolumeSlider.value = currentVolume;
            musicVolumeValue.textContent = currentVolume + '%';
        }
        
        if (soundVolumeSlider && soundVolumeValue) {
            const currentVolume = Math.round(AudioManager.soundVolume * 100);
            soundVolumeSlider.value = currentVolume;
            soundVolumeValue.textContent = currentVolume + '%';
        }
    },
    
    // Hide audio options panel
    hideAudioOptions: function() {
        const audioOptionsPanel = document.getElementById('audioOptionsPanel');
        if (audioOptionsPanel) {
            audioOptionsPanel.classList.add('hidden');
        }
    },
    
    // Show leaderboard screen
    showLeaderboardScreen: async function() {
        const leaderboardScreen = document.getElementById('leaderboardScreen');
        if (!leaderboardScreen) {
            console.error('Leaderboard screen element not found');
            return;
        }
        
        // Hide main menu if visible
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu && !mainMenu.classList.contains('hidden')) {
            mainMenu.classList.add('hidden');
        }
        
        // Hide other screens
        this.hideGameCompletionScreen();
        this.hideStatisticsScreen();
        this.hideAudioOptions();
        
        // Show leaderboard screen
        leaderboardScreen.style.display = 'flex';
        
        // Set default game mode based on completion data if available, otherwise Immortal
        const defaultGameMode = GameState.completionData?.gameMode || 'Immortal';
        
        // Set active mode button
        const modeButtons = document.querySelectorAll('.leaderboard-mode-btn');
        modeButtons.forEach(btn => {
            if (btn.getAttribute('data-mode') === defaultGameMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show screen first so buttons are accessible
        leaderboardScreen.style.display = 'flex';
        
        // Setup leaderboard listeners (buttons must be visible)
        this.setupLeaderboardListeners();
        
        // Load leaderboard data (default to top 10, default game mode)
        await this.loadLeaderboard(10, defaultGameMode);
    },
    
    // Hide leaderboard screen
    hideLeaderboardScreen: function() {
        const leaderboardScreen = document.getElementById('leaderboardScreen');
        if (leaderboardScreen) {
            leaderboardScreen.style.display = 'none';
        }
    },
    
    // Close leaderboard screen and return to menu
    closeLeaderboardScreen: function() {
        console.log('Closing leaderboard screen');
        this.hideLeaderboardScreen();
        this.showMainMenu();
    },
    
    // Show NFT minting screen
    showNFTMintingScreen: async function() {
        const nftScreen = document.getElementById('nftMintingScreen');
        if (!nftScreen) {
            console.error('NFT minting screen element not found');
            return;
        }
        
        // Hide main menu if visible
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu && !mainMenu.classList.contains('hidden')) {
            mainMenu.classList.add('hidden');
        }
        
        // Reset UI state first to clear any stale data
        this.resetNFTMintingUI();
        
        // Update NFT preview with game data
        if (GameState.completionData) {
            const metadata = NFTManager.generateMetadata(GameState.completionData);
            
            // Update preview name
            const previewNameEl = document.getElementById('nftPreviewName');
            if (previewNameEl) {
                previewNameEl.textContent = metadata.name;
            }
            
            // Update attributes
            const attributesEl = document.getElementById('nftAttributes');
            if (attributesEl) {
                attributesEl.innerHTML = '';
                metadata.attributes.forEach(attr => {
                    const attrDiv = document.createElement('div');
                    attrDiv.className = 'nft-attribute';
                    attrDiv.innerHTML = `
                        <span class="nft-attribute-label">${attr.trait_type}:</span>
                        <span class="nft-attribute-value">${attr.value}</span>
                    `;
                    attributesEl.appendChild(attrDiv);
                });
            }
            
            // Update preview image if available
            const previewImageEl = document.getElementById('nftPreviewImage');
            if (previewImageEl) {
                previewImageEl.innerHTML = '';
                if (metadata.image && !metadata.image.startsWith('data:')) {
                    const img = document.createElement('img');
                    img.src = metadata.image;
                    img.alt = 'NFT Preview';
                    previewImageEl.appendChild(img);
                } else {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'nft-placeholder';
                    placeholder.textContent = 'NFT Preview';
                    previewImageEl.appendChild(placeholder);
                }
            }
        }
        
        // Check wallet connection and NFT status (this will update UI based on current game mode)
        await this.updateNFTWalletStatus();
        
        // Show NFT screen
        nftScreen.style.display = 'flex';
        
        // Setup button handlers
        this.setupNFTMintingListeners();
    },
    
    // Reset NFT minting UI to initial state
    resetNFTMintingUI: function() {
        // Hide all sections
        const sections = ['nftMintingSection', 'nftSuccessSection', 'nftErrorSection', 'nftAlreadyMinted'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        
        // Reset button states
        const mintBtn = document.getElementById('nftMintButton');
        if (mintBtn) {
            mintBtn.disabled = false;
            mintBtn.textContent = 'Mint NFT';
        }
        
        const statusText = document.getElementById('nftStatusText');
        if (statusText) {
            statusText.textContent = 'Ready to mint';
        }
        
        // Clear error/success messages
        const errorMessage = document.getElementById('nftErrorMessage');
        if (errorMessage) errorMessage.textContent = '';
        
        const tokenIdEl = document.getElementById('nftTokenId');
        if (tokenIdEl) tokenIdEl.textContent = '';
    },
    
    // Update NFT wallet connection status
    updateNFTWalletStatus: async function() {
        const walletNotConnected = document.getElementById('nftWalletNotConnected');
        const walletConnected = document.getElementById('nftWalletConnected');
        const walletAddressEl = document.getElementById('nftWalletAddress');
        const mintingSection = document.getElementById('nftMintingSection');
        const alreadyMinted = document.getElementById('nftAlreadyMinted');
        const existingTokenIdEl = document.getElementById('nftExistingTokenId');
        const viewTokenLink = document.getElementById('nftViewTokenLink');
        
        // Reset sections first
        if (mintingSection) mintingSection.style.display = 'none';
        if (alreadyMinted) alreadyMinted.style.display = 'none';
        
        if (Web3Manager.isConnected()) {
            if (walletNotConnected) walletNotConnected.style.display = 'none';
            if (walletConnected) walletConnected.style.display = 'block';
            if (walletAddressEl) {
                walletAddressEl.textContent = Web3Manager.formatAddress(Web3Manager.currentAccount);
            }
            
            // Check if player already has NFT for this game mode
            // Always use the current completion data's game mode
            try {
                // Get game mode from current completion data (should be the most recent)
                const gameMode = GameState.completionData?.gameMode || 'Immortal';
                console.log('Checking NFT status for game mode:', gameMode);
                
                const hasNFT = await NFTManager.hasCompletionNFT(Web3Manager.currentAccount, gameMode);
                console.log('Has NFT for', gameMode + ':', hasNFT);
                
                if (hasNFT) {
                    if (mintingSection) mintingSection.style.display = 'none';
                    if (alreadyMinted) alreadyMinted.style.display = 'block';
                    
                    const tokenId = await NFTManager.getPlayerTokenId(Web3Manager.currentAccount, gameMode);
                    console.log('Retrieved token ID:', tokenId, 'for game mode:', gameMode);
                    
                    if (existingTokenIdEl) {
                        existingTokenIdEl.textContent = tokenId && tokenId !== '0' ? tokenId : 'N/A';
                    }
                    
                    if (viewTokenLink) {
                        // Generate block explorer URL for the token
                        if (tokenId && tokenId !== '0') {
                            const tokenUrl = NFTManager.getTokenUrl(tokenId);
                            viewTokenLink.href = tokenUrl;
                            // Ensure link is visible and clickable
                            viewTokenLink.style.display = 'inline';
                            viewTokenLink.style.pointerEvents = 'auto';
                            console.log('Set token URL:', tokenUrl, 'for token ID:', tokenId);
                        } else {
                            // Hide link if token ID is invalid
                            viewTokenLink.href = '#';
                            viewTokenLink.style.display = 'none';
                            console.warn('Invalid token ID:', tokenId, '- hiding block explorer link');
                        }
                    }
                } else {
                    if (alreadyMinted) alreadyMinted.style.display = 'none';
                    if (mintingSection) mintingSection.style.display = 'block';
                }
            } catch (error) {
                console.error('Error checking NFT status:', error);
                // On error, show minting section (allow user to try)
                if (alreadyMinted) alreadyMinted.style.display = 'none';
                if (mintingSection) mintingSection.style.display = 'block';
            }
        } else {
            if (walletNotConnected) walletNotConnected.style.display = 'block';
            if (walletConnected) walletConnected.style.display = 'none';
        }
    },
    
    // Setup NFT minting screen event listeners
    setupNFTMintingListeners: function() {
        const connectWalletBtn = document.getElementById('nftConnectWallet');
        const disconnectWalletBtn = document.getElementById('nftDisconnectWallet');
        const mintBtn = document.getElementById('nftMintButton');
        const closeBtn = document.getElementById('nftClose');
        
        if (connectWalletBtn) {
            const newBtn = connectWalletBtn.cloneNode(true);
            connectWalletBtn.parentNode.replaceChild(newBtn, connectWalletBtn);
            
            newBtn.addEventListener('click', async () => {
                try {
                    await Web3Manager.connectWallet();
                    await this.updateNFTWalletStatus();
                } catch (error) {
                    console.error('Error connecting wallet:', error);
                    this.showNFTError('Failed to connect wallet: ' + error.message);
                }
            });
        }
        
        if (disconnectWalletBtn) {
            const newBtn = disconnectWalletBtn.cloneNode(true);
            disconnectWalletBtn.parentNode.replaceChild(newBtn, disconnectWalletBtn);
            
            newBtn.addEventListener('click', () => {
                Web3Manager.disconnectWallet();
                this.updateNFTWalletStatus();
            });
        }
        
        if (mintBtn) {
            const newBtn = mintBtn.cloneNode(true);
            mintBtn.parentNode.replaceChild(newBtn, mintBtn);
            
            newBtn.addEventListener('click', async () => {
                await this.mintCompletionNFT();
            });
        }
        
        if (closeBtn) {
            const newBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newBtn, closeBtn);
            
            newBtn.addEventListener('click', () => {
                this.closeNFTMintingScreen();
            });
        }
    },
    
    // Mint completion NFT
    mintCompletionNFT: async function() {
        if (!Web3Manager.isConnected()) {
            this.showNFTError('Please connect your wallet first');
            return;
        }
        
        if (!GameState.completionData) {
            this.showNFTError('No completion data available');
            return;
        }
        
        const mintBtn = document.getElementById('nftMintButton');
        const statusText = document.getElementById('nftStatusText');
        const gasInfo = document.getElementById('nftGasInfo');
        const errorSection = document.getElementById('nftErrorSection');
        const successSection = document.getElementById('nftSuccessSection');
        
        // Hide error/success sections
        if (errorSection) errorSection.style.display = 'none';
        if (successSection) successSection.style.display = 'none';
        
        // Disable mint button and show status
        if (mintBtn) {
            mintBtn.disabled = true;
            mintBtn.textContent = 'Minting...';
        }
        if (statusText) {
            statusText.textContent = 'Preparing transaction...';
        }
        
        try {
            // Estimate gas
            if (statusText) statusText.textContent = 'Estimating gas...';
            
            // Prepare game data for minting
            const gameData = {
                finalScore: GameState.completionData.finalScore,
                levelsCompleted: GameState.completionData.levelsCompleted,
                completionTime: GameState.completionData.completionTime,
                gameMode: GameState.completionData.gameMode,
                timestamp: GameState.completionData.timestamp
            };
            
            // Initialize contract if needed
            await NFTManager.initializeContract();
            
            // Estimate gas (we'll do this inside mintNFT, but show status)
            if (statusText) statusText.textContent = 'Minting NFT...';
            
            // Mint NFT
            const result = await NFTManager.mintNFT(gameData);
            
            // Hide error section if previously shown
            const errorSection = document.getElementById('nftErrorSection');
            if (errorSection) errorSection.style.display = 'none';
            
            // Show success
            if (successSection) {
                successSection.style.display = 'block';
                const tokenIdEl = document.getElementById('nftTokenId');
                const txLink = document.getElementById('nftTxLink');
                
                if (tokenIdEl) tokenIdEl.textContent = result.tokenId;
                if (txLink) {
                    txLink.href = NFTManager.getTransactionUrl(result.txHash);
                    txLink.textContent = 'View Transaction';
                }
            }
            
            if (statusText) statusText.textContent = 'NFT minted successfully!';
            if (mintBtn) {
                mintBtn.disabled = true;
                mintBtn.textContent = 'Already Minted';
            }
            
            // Refresh wallet status to show already minted
            // This ensures the UI updates correctly after minting
            await this.updateNFTWalletStatus();
            
        } catch (error) {
            console.error('Error minting NFT:', error);
            this.showNFTError(error.message || 'Failed to mint NFT');
            
            if (mintBtn) {
                mintBtn.disabled = false;
                mintBtn.textContent = 'Mint NFT';
            }
            if (statusText) statusText.textContent = 'Ready to mint';
        }
    },
    
    // Show NFT error
    showNFTError: function(message) {
        console.error('NFT error:', message);
        const errorSection = document.getElementById('nftErrorSection');
        if (errorSection) errorSection.style.display = 'block';
    },
    
    // Hide NFT minting screen
    hideNFTMintingScreen: function() {
        const nftScreen = document.getElementById('nftMintingScreen');
        if (nftScreen) {
            nftScreen.style.display = 'none';
        }
    },
    
    // Close NFT minting screen
    closeNFTMintingScreen: function() {
        this.hideNFTMintingScreen();
        // Return to game completion screen
        this.showGameCompletionScreen();
    },
    
    // Setup leaderboard event listeners
    setupLeaderboardListeners: function() {
        // Use event delegation on the leaderboard content container to avoid cloning issues
        const leaderboardContent = document.querySelector('.leaderboard-content');
        if (!leaderboardContent) {
            console.error('Leaderboard content container not found');
            return;
        }
        
        // Remove existing listener if it exists (by cloning the container)
        // Actually, better approach: use a single event handler with proper checks
        // Check if we've already set up listeners
        if (leaderboardContent.dataset.listenersSetup === 'true') {
            return; // Already set up
        }
        
        // Mark as set up
        leaderboardContent.dataset.listenersSetup = 'true';
        
        // Single event delegation handler for all buttons
        leaderboardContent.addEventListener('click', async (e) => {
            // Game mode selector buttons
            if (e.target.classList.contains('leaderboard-mode-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const clickedBtn = e.target;
                const gameMode = clickedBtn.getAttribute('data-mode');
                
                // Remove active class from all mode buttons
                document.querySelectorAll('.leaderboard-mode-btn').forEach(b => {
                    b.classList.remove('active');
                });
                // Add active class to clicked button
                clickedBtn.classList.add('active');
                
                // Get current count from active filter button
                const activeFilter = document.querySelector('.leaderboard-filter-btn.active');
                const count = activeFilter ? parseInt(activeFilter.getAttribute('data-count')) : 10;
                
                await this.loadLeaderboard(count, gameMode);
                return;
            }
            
            // Filter buttons
            if (e.target.classList.contains('leaderboard-filter-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const clickedBtn = e.target;
                const count = parseInt(clickedBtn.getAttribute('data-count'));
                
                // Remove active class from all filter buttons
                document.querySelectorAll('.leaderboard-filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                // Add active class to clicked button
                clickedBtn.classList.add('active');
                
                // Get current game mode from active mode button
                const activeMode = document.querySelector('.leaderboard-mode-btn.active');
                const gameMode = activeMode ? activeMode.getAttribute('data-mode') : 'Immortal';
                
                await this.loadLeaderboard(count, gameMode);
                return;
            }
            
            // Refresh button
            if (e.target.id === 'leaderboardRefresh') {
                e.preventDefault();
                e.stopPropagation();
                
                const activeFilter = document.querySelector('.leaderboard-filter-btn.active');
                const count = activeFilter ? parseInt(activeFilter.getAttribute('data-count')) : 10;
                const activeMode = document.querySelector('.leaderboard-mode-btn.active');
                const gameMode = activeMode ? activeMode.getAttribute('data-mode') : 'Immortal';
                await this.loadLeaderboard(count, gameMode);
                return;
            }
            
            // Close button
            if (e.target.id === 'leaderboardClose') {
                e.preventDefault();
                e.stopPropagation();
                this.closeLeaderboardScreen();
                return;
            }
        });
        
        // Refresh button
        const refreshBtn = document.getElementById('leaderboardRefresh');
        if (refreshBtn) {
            const newBtn = refreshBtn.cloneNode(true);
            refreshBtn.parentNode.replaceChild(newBtn, refreshBtn);
            
            newBtn.addEventListener('click', async () => {
                const activeFilter = document.querySelector('.leaderboard-filter-btn.active');
                const count = activeFilter ? parseInt(activeFilter.getAttribute('data-count')) : 10;
                const activeMode = document.querySelector('.leaderboard-mode-btn.active');
                const gameMode = activeMode ? activeMode.getAttribute('data-mode') : 'Immortal';
                await this.loadLeaderboard(count, gameMode);
            });
        }
        
        // Close button
        const closeBtn = document.getElementById('leaderboardClose');
        if (closeBtn) {
            const newBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newBtn, closeBtn);
            
            newBtn.addEventListener('click', () => {
                this.closeLeaderboardScreen();
            });
        }
    },
    
    // Load and display leaderboard
    loadLeaderboard: async function(count = 10, gameMode = 'Immortal') {
        const loadingEl = document.getElementById('leaderboardLoading');
        const errorEl = document.getElementById('leaderboardError');
        const listEl = document.getElementById('leaderboardList');
        const playerRankEl = document.getElementById('leaderboardPlayerRank');
        const playerRankValueEl = document.getElementById('leaderboardPlayerRankValue');
        
        // Show loading
        if (loadingEl) loadingEl.style.display = 'block';
        if (errorEl) errorEl.style.display = 'none';
        if (listEl) listEl.innerHTML = '';
        if (playerRankEl) playerRankEl.style.display = 'none';
        
        try {
            // Fetch leaderboard data
            if (typeof Leaderboard === 'undefined') {
                throw new Error('Leaderboard module is not available');
            }
            
            await Leaderboard.fetchLeaderboard(count, gameMode);
            const formatted = Leaderboard.formatLeaderboard();
            
            // Display leaderboard entries
            if (listEl) {
                listEl.innerHTML = '';
                
                if (formatted.length === 0) {
                    listEl.innerHTML = '<div style="text-align: center; color: #ff0; padding: 20px;">No players on leaderboard yet. Be the first!</div>';
                } else {
                    formatted.forEach(entry => {
                        const entryEl = document.createElement('div');
                        entryEl.className = 'leaderboard-entry';
                        if (entry.isCurrentPlayer) {
                            entryEl.classList.add('current-player');
                        }
                        
                        // Rank styling
                        let rankClass = '';
                        if (entry.rank === 1) rankClass = 'top-1';
                        else if (entry.rank === 2) rankClass = 'top-2';
                        else if (entry.rank === 3) rankClass = 'top-3';
                        
                        entryEl.innerHTML = `
                            <div class="leaderboard-rank ${rankClass}">#${entry.rank}</div>
                            <div class="leaderboard-info">
                                <div class="leaderboard-address ${entry.isCurrentPlayer ? 'current-player' : ''}">${Leaderboard.formatAddress(entry.address)}</div>
                                <div class="leaderboard-score">${Leaderboard.formatScore(entry.score)} points</div>
                            </div>
                        `;
                        
                        listEl.appendChild(entryEl);
                    });
                }
            }
            
            // Display player rank if available
            if (Leaderboard.playerRank && playerRankEl && playerRankValueEl) {
                playerRankValueEl.textContent = `#${Leaderboard.playerRank}`;
                playerRankEl.style.display = 'block';
            } else if (playerRankEl) {
                playerRankEl.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            if (errorEl) {
                errorEl.textContent = `Failed to load leaderboard: ${error.message}`;
                errorEl.style.display = 'block';
            }
        } finally {
            if (loadingEl) loadingEl.style.display = 'none';
        }
    },
    
    // Show on-chain finalization screen
    showOnchainFinalizationScreen: function() {
        const onchainScreen = document.getElementById('onchainFinalizationScreen');
        if (!onchainScreen) {
            console.error('On-chain finalization screen not found');
            return;
        }
        
        // Update score display
        const finalScoreEl = document.getElementById('onchainFinalScore');
        const levelsCompletedEl = document.getElementById('onchainLevelsCompleted');
        const gameModeEl = document.getElementById('onchainGameMode');
        
        if (finalScoreEl && GameState.completionData) {
            finalScoreEl.textContent = GameState.completionData.finalScore.toLocaleString();
        }
        if (levelsCompletedEl && GameState.completionData) {
            levelsCompletedEl.textContent = GameState.completionData.levelsCompleted;
        }
        if (gameModeEl && GameState.completionData) {
            gameModeEl.textContent = GameState.completionData.gameMode;
        }
        
        // Reset UI state
        this.resetOnchainUI();
        
        // Check if wallet is already connected
        if (typeof Web3Manager !== 'undefined') {
            // Check wallet availability
            const walletInstalled = Web3Manager.isWalletInstalled();
            
            if (!walletInstalled) {
                // Show helpful message about installing wallet
                console.log('No wallet detected. User needs to install a wallet extension.');
            }
            
            // Try to get existing connection
            Web3Manager.getAccount().then(account => {
                if (account) {
                    this.updateOnchainWalletUI(account);
                }
            }).catch(() => {
                // Wallet not connected, show connect button
            });
        }
        
        // Show screen
        onchainScreen.style.display = 'flex';
        
        // Setup button handlers
        this.setupOnchainButtons();
    },
    
    // Reset on-chain UI to initial state
    resetOnchainUI: function() {
        // Hide all sections except wallet section
        const sections = ['onchainTransactionSection', 'onchainSubmitSection', 'onchainSuccessSection', 'onchainErrorSection'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        
        // Reset button states
        const connectBtn = document.getElementById('onchainConnectWallet');
        if (connectBtn) {
            connectBtn.disabled = false;
            connectBtn.textContent = 'Connect Wallet';
        }
        
        const submitBtn = document.getElementById('onchainSubmitScore');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Finalize Score On-Chain';
        }
        
        const statusText = document.getElementById('onchainStatusText');
        if (statusText) {
            statusText.textContent = '';
        }
        
        // Clear error messages
        const errorMessage = document.getElementById('onchainErrorMessage');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
        
        // Show wallet section
        const walletSection = document.getElementById('onchainWalletSection');
        if (walletSection) walletSection.style.display = 'block';
        const notConnected = document.getElementById('onchainWalletNotConnected');
        const connected = document.getElementById('onchainWalletConnected');
        if (notConnected) notConnected.style.display = 'block';
        if (connected) connected.style.display = 'none';
    },
    
    // Update wallet UI
    updateOnchainWalletUI: function(address) {
        const walletAddressEl = document.getElementById('onchainWalletAddress');
        if (walletAddressEl) {
            walletAddressEl.textContent = Web3Manager.formatAddress(address);
        }
        const notConnected = document.getElementById('onchainWalletNotConnected');
        const connected = document.getElementById('onchainWalletConnected');
        if (notConnected) notConnected.style.display = 'none';
        if (connected) connected.style.display = 'block';
        const submitSection = document.getElementById('onchainSubmitSection');
        if (submitSection) submitSection.style.display = 'block';
    },
    
    // Setup on-chain finalization button handlers
    setupOnchainButtons: function() {
        const connectBtn = document.getElementById('onchainConnectWallet');
        const disconnectBtn = document.getElementById('onchainDisconnectWallet');
        const submitBtn = document.getElementById('onchainSubmitScore');
        const closeBtn = document.getElementById('onchainClose');
        
        if (connectBtn) {
            const newBtn = connectBtn.cloneNode(true);
            connectBtn.parentNode.replaceChild(newBtn, connectBtn);
            
            newBtn.addEventListener('click', async () => {
                try {
                    console.log('Connect wallet button clicked');
                    console.log('Checking wallet availability...');
                    console.log('window.ethereum:', window.ethereum);
                    console.log('isWalletInstalled:', Web3Manager.isWalletInstalled());
                    
                    newBtn.disabled = true;
                    newBtn.textContent = 'Connecting...';
                    
                    // Check if wallet is installed first
                    if (!Web3Manager.isWalletInstalled()) {
                        console.warn('No wallet detected. Available objects:', {
                            ethereum: typeof window.ethereum,
                            web3: typeof window.web3,
                            rabby: typeof window.rabby,
                            metamask: typeof window.metamask
                        });
                        throw new Error('Wallet is not installed. Please install MetaMask or Rabby wallet.');
                    }
                    
                    console.log('Wallet detected, attempting connection...');
                    const account = await Web3Manager.connectWallet();
                    console.log('Wallet connected successfully:', account);
                    this.updateOnchainWalletUI(account);
                } catch (error) {
                    console.error('Wallet connection error:', error);
                    const errorMessage = error.message || 'Failed to connect wallet. Please try again.';
                    this.showOnchainError(errorMessage);
                    newBtn.disabled = false;
                    newBtn.textContent = 'Connect Wallet';
                }
            });
        }
        
        if (disconnectBtn) {
            const newBtn = disconnectBtn.cloneNode(true);
            disconnectBtn.parentNode.replaceChild(newBtn, disconnectBtn);
            
            newBtn.addEventListener('click', () => {
                Web3Manager.disconnectWallet();
                // Reset UI completely to allow reconnection
                this.resetOnchainUI();
            });
        }
        
        if (submitBtn) {
            const newBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newBtn, submitBtn);
            
            newBtn.addEventListener('click', () => {
                this.finalizeScoreOnChain();
            });
        }
        
        if (closeBtn) {
            const newBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newBtn, closeBtn);
            
            newBtn.addEventListener('click', () => {
                this.hideOnchainFinalizationScreen();
                // Return to game completion screen
                this.showGameCompletionScreen();
            });
        }
    },
    
    // Finalize score on-chain (uses session-based anti-cheat flow)
    finalizeScoreOnChain: async function() {
        if (!GameState.completionData) {
            this.showOnchainError('No completion data available');
            return;
        }
        
        if (!Web3Manager.isConnected()) {
            this.showOnchainError('Wallet not connected');
            return;
        }
        
        const submitBtn = document.getElementById('onchainSubmitScore');
        const statusText = document.getElementById('onchainStatusText');
        
        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';
            }
            
            const txSection = document.getElementById('onchainTransactionSection');
            if (txSection) txSection.style.display = 'block';
            if (statusText) {
                statusText.textContent = 'Getting server signature...';
            }
            
            const account = await Web3Manager.getAccount();
            if (!account) {
                throw new Error('No account connected');
            }

            if (!GameState.sessionId) {
                throw new Error(
                    'No game session found. This can happen if you started the game without a wallet connected.\n\n' +
                    'Please connect your wallet, then play through all levels again to record your score.'
                );
            }
            
            // Verify correct network
            const expectedChainId = GameConfig.BLOCKCHAIN.CHAIN_IDS[GameConfig.BLOCKCHAIN.NETWORK];
            if (expectedChainId) {
                try {
                    const network = await Web3Manager.provider.getNetwork();
                    const currentChainId = typeof network.chainId === 'bigint' 
                        ? network.chainId 
                        : BigInt(network.chainId || 0);
                    const expectedChainIdBigInt = BigInt(expectedChainId);
                    
                    if (currentChainId !== expectedChainIdBigInt) {
                        await Web3Manager.checkNetwork();
                        const networkAfter = await Web3Manager.provider.getNetwork();
                        const chainIdAfter = typeof networkAfter.chainId === 'bigint' 
                            ? networkAfter.chainId 
                            : BigInt(networkAfter.chainId || 0);
                        if (chainIdAfter !== expectedChainIdBigInt) {
                            throw new Error(
                                `Please switch to ${GameConfig.BLOCKCHAIN.NETWORK} in your wallet. ` +
                                `Current network: ${currentChainId}, Required: ${expectedChainIdBigInt}`
                            );
                        }
                    }
                } catch (networkError) {
                    throw new Error(
                        `Network error: ${networkError.message}. ` +
                        `Please ensure you're connected to ${GameConfig.BLOCKCHAIN.NETWORK}.`
                    );
                }
            }
            
            // Generate nonce
            const nonceString = Web3Manager.generateNonce();
            let nonceBigInt;
            if (/[a-zA-Z]/.test(nonceString)) {
                const nonceBytes = ethers.toUtf8Bytes(nonceString);
                const nonceHash = ethers.keccak256(nonceBytes);
                nonceBigInt = BigInt(nonceHash);
            } else {
                nonceBigInt = BigInt(nonceString);
            }
            
            // Health check
            const apiUrl = GameConfig.BLOCKCHAIN.API_URL;
            if (!apiUrl || apiUrl.includes('localhost:3000')) {
                try {
                    const healthCheck = await fetch(`${apiUrl}/api/health`, { 
                        method: 'GET',
                        signal: AbortSignal.timeout(2000)
                    });
                    if (!healthCheck.ok) {
                        throw new Error('Server health check failed');
                    }
                } catch (healthError) {
                    throw new Error(
                        'Backend server is not running. Please start it with:\n\n' +
                        '  npm start\n\n' +
                        'Or if using the backend server:\n\n' +
                        '  node server.js\n\n' +
                        'Then refresh this page and try again.'
                    );
                }
            }
            
            // Request session finalization with server-side score computation
            let response;
            try {
                response = await fetch(`${apiUrl}/api/session/finalize`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: GameState.sessionId,
                        nonce: nonceBigInt.toString()
                    }),
                    signal: AbortSignal.timeout(10000)
                });
            } catch (fetchError) {
                if (fetchError.name === 'AbortError') {
                    throw new Error('Request timed out. The server may be slow or unavailable.');
                } else if (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('ERR_CONNECTION_REFUSED')) {
                    throw new Error(
                        'Cannot connect to backend server. Please make sure the server is running:\n\n' +
                        '  npm start\n\n' +
                        'The server should be running on ' + apiUrl
                    );
                }
                throw fetchError;
            }
            
            if (!response.ok) {
                let errorMessage = 'Failed to get server signature';
                try {
                    const error = await response.json();
                    errorMessage = error.error || errorMessage;
                } catch (e) {
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const signed = await response.json();

            // Use the SERVER-COMPUTED score (not the client-side score)
            const serverScore = BigInt(signed.score);
            
            if (statusText) {
                statusText.textContent = 'Submitting transaction...';
            }
            
            const scoreData = {
                player: account,
                score: serverScore,
                levelId: BigInt(GameState.completionData.levelsCompleted),
                nonce: nonceBigInt,
                gameMode: GameState.completionData.gameMode || 'Immortal'
            };
            
            const result = await Web3Manager.submitScore(scoreData, signed.signature);
            
            this.showOnchainSuccess(result.txHash);
            
        } catch (error) {
            console.error('Error finalizing on-chain:', error);
            this.showOnchainError(error.message || 'Failed to finalize score on-chain');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Finalize Score On-Chain';
            }
        }
    },
    
    // Show on-chain success
    showOnchainSuccess: function(txHash) {
        const sections = ['onchainTransactionSection', 'onchainSubmitSection', 'onchainErrorSection'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        const successSection = document.getElementById('onchainSuccessSection');
        if (successSection) successSection.style.display = 'block';
        
        const txLink = document.getElementById('onchainTxLink');
        if (txLink) {
            txLink.href = Web3Manager.getTransactionUrl(txHash);
        }
        
        // Reset submit button state (in case user wants to finalize again for different mode)
        const submitBtn = document.getElementById('onchainSubmitScore');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Finalize Score On-Chain';
        }
    },
    
    // Show on-chain error
    showOnchainError: function(message) {
        console.error('On-chain error:', message);
        const errorSection = document.getElementById('onchainErrorSection');
        if (errorSection) errorSection.style.display = 'block';
    },
    
    // Hide on-chain finalization screen
    hideOnchainFinalizationScreen: function() {
        const onchainScreen = document.getElementById('onchainFinalizationScreen');
        if (onchainScreen) {
            onchainScreen.style.display = 'none';
        }
    },
    
    // Reset round
    resetRound: function() {
        if (GameState.gameMode === null || GameState.gameState === 'menu') {
            return; // Don't reset if we're in menu
        }

        if (GameState.agentShiftMode && typeof AgentMode !== 'undefined') {
            AgentMode.onMissed();
            return;
        }
        
        GameState.gameState = 'aiming';
        GameState.coin = null;
        GameState.initialCoinVelocity = null; // Reset initial velocity
        GameState.coinTrail = [];
        GameState.particles = [];
        GameState.aimStart = null;
        GameState.aimEnd = null;
        GameState.score = 0;
        GameState.multiplier = 1.0;
        GameState.gatesPassed = 0;
        GameState.slippageHits = 0;
        GameState.slippageCloudsPassed = 0;
        GameState.barrierHits = 0;
        GameState.levelPoints = 0;
        
        // Reset all gates to active
        GameState.arcGates.forEach(gate => {
            gate.active = true;
        });
        
        // Reset all barriers (allow them to trigger again)
        GameState.barriers.forEach(barrier => {
            barrier.triggered = false;
        });
        
        // Reset slippage cloud passed flags
        GameState.slippageClouds.forEach(cloud => {
            cloud.passed = false;
        });
    },
    
    // Launch coin
    launchCoin: function() {
        if (!GameState.aimStart || !GameState.aimEnd) return;
        
        const dx = GameState.aimEnd.x - GameState.aimStart.x;
        const dy = GameState.aimEnd.y - GameState.aimStart.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const power = Math.min(distance / (GameConfig.CONFIG.width * 0.06), 3);
        
        // Launch from right side of player (where hand/arm is positioned)
        const launchX = GameState.player.x + GameState.player.width * 0.75;
        const launchY = GameState.player.y + GameState.player.height * 0.3 + GameState.player.floatOffset;
        
        const initialVelX = (dx / distance) * GameConfig.CONFIG.coinSpeed * power * (GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width);
        const initialVelY = (dy / distance) * GameConfig.CONFIG.coinSpeed * power * (GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width);
        
        GameState.coin = {
            x: launchX,
            y: launchY,
            radius: GameConfig.CONFIG.width * 0.015,
            velX: initialVelX,
            velY: initialVelY
        };
        
        // Store initial velocity magnitude for barrier bounce calculations
        GameState.initialCoinVelocity = Math.sqrt(initialVelX * initialVelX + initialVelY * initialVelY);
        
        // Create launch particles
        const launchParticleSpeed = 4 * (GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width);
        for (let i = 0; i < 10; i++) {
            GameState.particles.push({
                x: launchX,
                y: launchY,
                velX: (Math.random() - 0.5) * launchParticleSpeed,
                velY: (Math.random() - 0.5) * launchParticleSpeed,
                life: 30,
                maxLife: 30,
                color: GameConfig.COLORS.yellow
            });
        }
        
        // Play launch sound
        AudioManager.playLaunchSound();
        
        GameState.gameState = 'flying';
    },
    
    // Show start screen
    showStartScreen: function() {
        const startScreen = document.getElementById('startScreen');
        const mainMenu = document.getElementById('mainMenu');
        
        if (startScreen) {
            startScreen.classList.remove('hidden');
        }
        
        if (mainMenu) {
            mainMenu.classList.add('hidden');
        }
        
        // Add click handler to start screen (one-time)
        if (startScreen && !startScreen.dataset.listenerAdded) {
            startScreen.dataset.listenerAdded = 'true';
            startScreen.addEventListener('click', this.handleStartScreenClick.bind(this));
            startScreen.addEventListener('touchstart', this.handleStartScreenClick.bind(this));
        }
    },
    
    // Handle start screen click
    handleStartScreenClick: function(e) {
        e.preventDefault();
        
        // Unlock audio on first interaction
        if (!AudioManager.audioUnlocked) {
            AudioManager.audioUnlocked = true;
            // Try to play and immediately pause to unlock audio context
            if (AudioManager.menuMusic) {
                AudioManager.menuMusic.play().then(() => {
                    // Audio unlocked successfully - pause and reset
                    AudioManager.menuMusic.pause();
                    AudioManager.menuMusic.currentTime = 0;
                    // Now show menu and play music
                    this.hideStartScreen();
                    this.showMainMenu();
                }).catch(() => {
                    // Even if unlock fails, still show menu (audio might work)
                    this.hideStartScreen();
                    this.showMainMenu();
                });
                return; // Wait for promise to resolve before continuing
            }
        }
        
        // Audio already unlocked or no music, just show menu
        this.hideStartScreen();
        this.showMainMenu();
    },
    
    // Hide start screen
    hideStartScreen: function() {
        const startScreen = document.getElementById('startScreen');
        if (startScreen) {
            startScreen.classList.add('hidden');
        }
    },
    
    // Show main menu
    showMainMenu: function() {
        if (GameState.agentShiftMode && typeof AgentMode !== 'undefined') {
            AgentMode.exit();
        }
        GameState.gameMode = null;
        GameState.gameState = 'menu';
        GameState.editorMode = false; // Exit editor mode when returning to menu
        GameState.immortalMode = false;
        GameState.tournamentMode = false;
        GameState.communityMode = false;
        
        // Hide community completion popup if visible
        this.hideCommunityCompletionMessage();
        
        // Reset to default levels when returning to menu
        if (GameState.levelManager) {
            GameState.levelManager.loadDefaultLevels();
        }
        
        const startScreen = document.getElementById('startScreen');
        const menu = document.getElementById('mainMenu');
        const backToMenuBtn = document.getElementById('backToMenu');
        const editor = document.getElementById('levelEditor');
        const summary = document.getElementById('levelSummary');
        
        if (startScreen) {
            startScreen.classList.add('hidden');
        }
        
        if (menu) {
            menu.classList.remove('hidden');
        }
        
        if (backToMenuBtn) {
            backToMenuBtn.style.display = 'none';
        }
        
        const backToEditorBtn = document.getElementById('backToEditor');
        if (backToEditorBtn) {
            backToEditorBtn.style.display = 'none';
        }
        
        if (editor) {
            editor.style.display = 'none';
        }
        
        if (summary) {
            summary.style.display = 'none';
        }
        
        // Hide quiz screen if visible
        if (typeof QuizManager !== 'undefined' && QuizManager.hideQuiz) {
            QuizManager.hideQuiz();
        }
        
        // Hide info screen if visible
        if (typeof InfoManager !== 'undefined' && InfoManager.hideInfo) {
            InfoManager.hideInfo();
        }
        
        // Hide game completion screen if visible
        this.hideGameCompletionScreen();
        
        // Hide statistics screen if visible
        this.hideStatisticsScreen();
        
        // Hide leaderboard screen if visible
        this.hideLeaderboardScreen();
        
        // Hide NFT minting screen if visible
        this.hideNFTMintingScreen();
        
        // Reset level to first level when returning to menu
        if (GameState.levelManager) {
            GameState.levelManager.setCurrentLevel(0);
        }
        
        // Reset game state
        this.resetRound();
        
        // Play menu music
        AudioManager.playMenuMusic();
        
        // Update wallet button status
        this.updateMenuWalletButton();
    },
    
    // Handle wallet button click in menu
    handleMenuWalletClick: async function() {
        const walletButton = document.getElementById('menuWalletButton');
        if (!walletButton) return;
        
        try {
            if (Web3Manager.isConnected()) {
                // Disconnect
                Web3Manager.currentAccount = null;
                Web3Manager.signer = null;
                Web3Manager.contract = null;
                this.updateMenuWalletButton();
            } else {
                // Connect
                walletButton.disabled = true;
                const walletText = walletButton.querySelector('#menuWalletButtonText');
                if (walletText) {
                    walletText.textContent = 'Connecting...';
                }
                
                // Check for file:// protocol first
                if (Web3Manager.isFileProtocol()) {
                    throw new Error('Wallets require HTTP/HTTPS. Please serve the game via a web server (not file://).\n\nQuick fix: Run "python -m http.server 8000" in the project folder, then open http://localhost:8000');
                }
                
                // Wait for wallet to be injected (in case it's still loading)
                console.log('Waiting for wallet injection...');
                const walletAvailable = await Web3Manager.waitForWallet(3000);
                
                if (!Web3Manager.isWalletInstalled()) {
                    // Run diagnostics
                    const diagnosis = Web3Manager.diagnoseWallet();
                    console.error('Wallet detection failed. Diagnosis:', diagnosis);
                    
                    let errorMsg = 'Wallet is not detected. ';
                    if (diagnosis.hasEthereum) {
                        errorMsg += 'window.ethereum exists but may not be a valid wallet provider. ';
                    }
                    errorMsg += 'Please:\n1. Make sure MetaMask or Rabby is installed and enabled\n2. Refresh the page\n3. Check browser console for details';
                    
                    throw new Error(errorMsg);
                }
                
                const account = await Web3Manager.connectWallet();
                console.log('Wallet connected from menu:', account);
                this.updateMenuWalletButton();
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            const errorMessage = error.message || 'Failed to connect wallet. Please try again.';
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification(errorMessage, 3000);
            } else {
                // Fallback to alert if UI module not loaded
                alert(errorMessage);
            }
            this.updateMenuWalletButton();
        } finally {
            if (walletButton) {
                walletButton.disabled = false;
            }
        }
    },
    
    // Update wallet button display
    updateMenuWalletButton: function() {
        const walletButton = document.getElementById('menuWalletButton');
        const walletText = document.getElementById('menuWalletButtonText');
        const walletAddress = document.getElementById('menuWalletButtonAddress');
        
        if (!walletButton) return;
        
        // Check for file:// protocol first
        if (typeof Web3Manager !== 'undefined' && Web3Manager.isFileProtocol()) {
            walletButton.classList.add('file-protocol-warning');
            walletButton.classList.remove('connected');
            if (walletText) {
                walletText.textContent = '⚠️ Use HTTP Server';
                walletText.style.display = 'block';
            }
            if (walletAddress) walletAddress.style.display = 'none';
            walletButton.title = 'Wallets require HTTP/HTTPS. Please use a web server (not file://)';
            return;
        }
        
        // Remove file protocol warning if not applicable
        walletButton.classList.remove('file-protocol-warning');
        
        if (typeof Web3Manager !== 'undefined' && Web3Manager.isConnected()) {
            // Wallet is connected
            walletButton.classList.add('connected');
            if (walletText) walletText.style.display = 'none';
            if (walletAddress) {
                walletAddress.textContent = Web3Manager.formatAddress(Web3Manager.currentAccount);
                walletAddress.style.display = 'block';
            }
        } else {
            // Wallet is not connected
            walletButton.classList.remove('connected');
            if (walletText) {
                walletText.textContent = 'Connect Wallet';
                walletText.style.display = 'block';
            }
            if (walletAddress) walletAddress.style.display = 'none';
        }
    },
    
    // Hide main menu
    hideMainMenu: function() {
        const menu = document.getElementById('mainMenu');
        if (menu) {
            menu.classList.add('hidden');
        }
        
        // Show back to menu button only if in a game mode (not in editor or test mode)
        const backToMenuBtn = document.getElementById('backToMenu');
        const backToEditorBtn = document.getElementById('backToEditor');
        if (backToMenuBtn) {
            if (GameState.gameMode === 'test') {
                backToMenuBtn.style.display = 'none'; // Hide menu button in test mode
            } else if (GameState.gameMode !== 'editor' && GameState.gameMode !== null) {
                backToMenuBtn.style.display = 'block';
            } else {
                backToMenuBtn.style.display = 'none';
            }
        }
        if (backToEditorBtn) {
            // Show back to editor button only in test mode
            backToEditorBtn.style.display = (GameState.gameMode === 'test') ? 'block' : 'none';
        }
    },
    
    // Setup menu event listeners
    setupMenuListeners: function() {
        const menuImmortal = document.getElementById('menuImmortal');
        const menuTournament = document.getElementById('menuTournament');
        const menuEditor = document.getElementById('menuEditor');
        const backToMenuBtn = document.getElementById('backToMenu');
        
        if (menuImmortal) {
            menuImmortal.addEventListener('click', this.startImmortalMode.bind(this));
        }
        
        if (menuTournament) {
            menuTournament.addEventListener('click', this.startTournamentMode.bind(this));
        }
        
        const menuCommunity = document.getElementById('menuCommunity');
        if (menuCommunity) {
            menuCommunity.addEventListener('click', this.startCommunityMode.bind(this));
        }
        
        if (menuEditor) {
            menuEditor.addEventListener('click', this.startEditorMode.bind(this));
        }
        
        const menuStatistics = document.getElementById('menuStatistics');
        if (menuStatistics) {
            menuStatistics.addEventListener('click', () => {
                console.log('Statistics button clicked');
                this.showStatisticsScreen();
            });
            console.log('Statistics button event listener attached');
        } else {
            console.error('Statistics button not found in DOM');
        }
        
        const menuLeaderboard = document.getElementById('menuLeaderboard');
        if (menuLeaderboard) {
            menuLeaderboard.addEventListener('click', () => {
                console.log('Leaderboard button clicked');
                this.showLeaderboardScreen();
            });
            console.log('Leaderboard button event listener attached');
        } else {
            console.error('Leaderboard button not found in DOM');
        }
        
        // Setup Audio Options button
        const menuAudio = document.getElementById('menuAudio');
        if (menuAudio) {
            menuAudio.addEventListener('click', () => {
                this.showAudioOptions();
            });
        }
        
        // Setup Audio Options close button
        const audioOptionsClose = document.getElementById('audioOptionsClose');
        if (audioOptionsClose) {
            audioOptionsClose.addEventListener('click', () => {
                this.hideAudioOptions();
                this.showMainMenu();
            });
        }
        
        // Setup volume controls
        const musicVolumeSlider = document.getElementById('musicVolumeSlider');
        const soundVolumeSlider = document.getElementById('soundVolumeSlider');
        const musicVolumeValue = document.getElementById('musicVolumeValue');
        const soundVolumeValue = document.getElementById('soundVolumeValue');
        
        if (musicVolumeSlider && musicVolumeValue) {
            // Set initial value from AudioManager
            const initialMusicVolume = Math.round(AudioManager.musicVolume * 100);
            musicVolumeSlider.value = initialMusicVolume;
            musicVolumeValue.textContent = initialMusicVolume + '%';
            
            musicVolumeSlider.addEventListener('input', (e) => {
                const volume = parseInt(e.target.value) / 100;
                AudioManager.setMusicVolume(volume);
                musicVolumeValue.textContent = e.target.value + '%';
            });
        }
        
        if (soundVolumeSlider && soundVolumeValue) {
            // Set initial value from AudioManager
            const initialSoundVolume = Math.round(AudioManager.soundVolume * 100);
            soundVolumeSlider.value = initialSoundVolume;
            soundVolumeValue.textContent = initialSoundVolume + '%';
            
            soundVolumeSlider.addEventListener('input', (e) => {
                const volume = parseInt(e.target.value) / 100;
                AudioManager.setSoundVolume(volume);
                soundVolumeValue.textContent = e.target.value + '%';
            });
        }
        
        // Setup wallet button
        const menuWalletButton = document.getElementById('menuWalletButton');
        if (menuWalletButton) {
            menuWalletButton.addEventListener('click', async () => {
                await this.handleMenuWalletClick();
            });
            // Check if wallet is already connected
            this.updateMenuWalletButton();
            
            // Listen for wallet account changes
            if (typeof Web3Manager !== 'undefined') {
                Web3Manager.setupAccountListener(() => {
                    this.updateMenuWalletButton();
                });
            }
        }
        
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => {
                // Return to menu
                if (GameState.editorMode && typeof LevelEditor !== 'undefined' && LevelEditor.toggleEditor) {
                    LevelEditor.toggleEditor(false);
                }
                this.showMainMenu();
                this.resetRound();
            });
        }
        
        // Setup back to editor button
        const backToEditorBtn = document.getElementById('backToEditor');
        if (backToEditorBtn) {
            backToEditorBtn.addEventListener('click', () => {
                // Return to editor from test mode
                if (GameState.gameMode === 'test' && typeof LevelEditor !== 'undefined' && LevelEditor.returnToEditor) {
                    LevelEditor.returnToEditor();
                }
            });
        }
    },
    
    // Start Immortal Mode
    startImmortalMode: async function() {
        GameState.gameMode = 'immortal';
        GameState.immortalMode = true;
        GameState.tournamentMode = false;
        GameState.communityMode = false;
        GameState.gameState = 'aiming';
        
        // Load default levels
        if (GameState.levelManager) {
            GameState.levelManager.loadDefaultLevels();
        }
        
        // Reset game completion state
        GameState.resetGame();
        GameState.gameStartTime = Date.now();
        GameState.gameCompleted = false;
        GameState.levelScores = [];
        GameState.totalGatesPassed = 0;
        GameState.totalCloudsPassed = 0;
        GameState.totalBarriersHit = 0;

        // Start anti-cheat session (must await so sessionId is set before first levelStart)
        const account = Web3Manager.currentAccount;
        if (account) {
            await this.startSession(account, 'Immortal');
        }
        
        this.hideMainMenu();
        
        // Play gameplay music
        AudioManager.playGameplayMusic();
        
        // Setup canvas but skip automatic game object initialization (we'll do it manually)
        CanvasManager.setupCanvas(true);
        
        // Load first level
        if (GameState.levelManager) {
            GameState.levelManager.setCurrentLevel(0);
            const firstLevel = GameState.levelManager.getCurrentLevel();
            if (firstLevel) {
                if (typeof GameObjects !== 'undefined' && GameObjects.loadLevel) {
                    GameObjects.loadLevel(firstLevel);
                }
                // Initialize stars for the level
                if (typeof GameObjects !== 'undefined' && GameObjects.initStars) {
                    GameObjects.initStars();
                }
                this.resetRound();

                // Notify server of first level start
                this.sendSessionEvent('levelStart');

                if (typeof UI !== 'undefined' && UI.updateLevelUI) {
                    UI.updateLevelUI();
                }
                
                // Show mode description on first level (before tutorial)
                if (GameState.levelManager.currentLevelIndex === 0) {
                    this.showModeDescription('immortal');
                }
            }
        } else {
            console.error('Level manager not initialized');
        }
        
        console.log('Immortal mode started. Game objects:', {
            player: GameState.player,
            gates: GameState.arcGates.length,
            clouds: GameState.slippageClouds.length,
            settlement: !!GameState.settlementZone,
            stars: GameState.stars.length,
            config: { width: GameConfig.CONFIG.width, height: GameConfig.CONFIG.height }
        });
    },
    
    // Start Tournament Mode
    startTournamentMode: async function() {
        GameState.gameMode = 'tournament';
        GameState.tournamentMode = true;
        GameState.immortalMode = false;
        GameState.communityMode = false;
        GameState.gameState = 'aiming';
        
        // Load default levels
        if (GameState.levelManager) {
            GameState.levelManager.loadDefaultLevels();
        }
        
        // Reset lives to 5 when starting tournament mode
        GameState.tournamentLives = GameConfig.MAX_TOURNAMENT_LIVES;
        
        // Play gameplay music
        AudioManager.playGameplayMusic();
        
        // Reset game completion state
        GameState.resetGame();
        GameState.gameStartTime = Date.now();
        GameState.gameCompleted = false;
        GameState.levelScores = [];
        GameState.totalGatesPassed = 0;
        GameState.totalCloudsPassed = 0;
        GameState.totalBarriersHit = 0;

        // Start anti-cheat session (must await so sessionId is set before first levelStart)
        const account = Web3Manager.currentAccount;
        if (account) {
            await this.startSession(account, 'Tournament');
        }
        
        this.hideMainMenu();
        
        // Setup canvas but skip automatic game object initialization (we'll do it manually)
        CanvasManager.setupCanvas(true);
        
        // Load first level
        if (GameState.levelManager) {
            GameState.levelManager.setCurrentLevel(0);
            const firstLevel = GameState.levelManager.getCurrentLevel();
            if (firstLevel) {
                if (typeof GameObjects !== 'undefined' && GameObjects.loadLevel) {
                    GameObjects.loadLevel(firstLevel);
                }
                // Initialize stars for the level
                if (typeof GameObjects !== 'undefined' && GameObjects.initStars) {
                    GameObjects.initStars();
                }
                this.resetRound();

                // Notify server of first level start
                this.sendSessionEvent('levelStart');

                if (typeof UI !== 'undefined' && UI.updateLevelUI) {
                    UI.updateLevelUI();
                }
                
                // Show mode description on first level (before tutorial)
                if (GameState.levelManager.currentLevelIndex === 0) {
                    this.showModeDescription('tournament');
                }
            }
        } else {
            console.error('Level manager not initialized');
        }
        
        console.log('Tournament mode started. Game objects:', {
            player: GameState.player,
            gates: GameState.arcGates.length,
            clouds: GameState.slippageClouds.length,
            settlement: !!GameState.settlementZone,
            stars: GameState.stars.length,
            config: { width: GameConfig.CONFIG.width, height: GameConfig.CONFIG.height },
            lives: GameState.tournamentLives
        });
    },
    
    // Start Community Levels Mode
    startCommunityMode: function() {
        GameState.gameMode = 'community';
        GameState.communityMode = true;
        GameState.immortalMode = false;
        GameState.tournamentMode = false;
        GameState.gameState = 'aiming'; // Set game state to aiming
        
        // Reset game completion state
        GameState.resetGame();
        GameState.gameStartTime = Date.now();
        GameState.gameCompleted = false;
        GameState.levelScores = [];
        GameState.totalGatesPassed = 0;
        GameState.totalCloudsPassed = 0;
        GameState.totalBarriersHit = 0;
        
        this.hideMainMenu();
        
        // Play gameplay music
        AudioManager.playGameplayMusic();
        
        // Setup canvas but skip automatic game object initialization (we'll do it manually)
        CanvasManager.setupCanvas(true);
        
        // Load community levels
        if (GameState.levelManager) {
            GameState.levelManager.loadCommunityLevels();
            
            // Check if there are any community levels
            if (GameState.levelManager.levels.length === 0) {
                // No community levels available
                if (typeof UI !== 'undefined' && UI.showNotification) {
                    UI.showNotification('No community levels available yet. Check back later!', 5000);
                } else {
                    alert('No community levels available yet. Check back later!');
                }
                this.showMainMenu();
                return;
            }
            
            GameState.levelManager.setCurrentLevel(0);
            const firstLevel = GameState.levelManager.getCurrentLevel();
            if (firstLevel) {
                if (typeof GameObjects !== 'undefined' && GameObjects.loadLevel) {
                    GameObjects.loadLevel(firstLevel);
                }
                // Initialize stars for the level
                if (typeof GameObjects !== 'undefined' && GameObjects.initStars) {
                    GameObjects.initStars();
                }
                this.resetRound();
                if (typeof UI !== 'undefined' && UI.updateLevelUI) {
                    UI.updateLevelUI();
                }
            }
        } else {
            console.error('Level manager not initialized');
        }
        
        console.log('Community mode started. Game objects:', {
            player: GameState.player,
            gates: GameState.arcGates.length,
            clouds: GameState.slippageClouds.length,
            settlement: !!GameState.settlementZone,
            stars: GameState.stars.length,
            config: { width: GameConfig.CONFIG.width, height: GameConfig.CONFIG.height }
        });
    },
    
    // Show game mode description popup on first level (before tutorial)
    showModeDescription: function(mode) {
        const modeDescriptionPopup = document.getElementById('modeDescriptionPopup');
        if (!modeDescriptionPopup) return;
        
        const descriptionTextEl = document.getElementById('modeDescriptionText');
        const descriptionHighlightEl = document.getElementById('modeDescriptionHighlight');
        if (!descriptionTextEl || !descriptionHighlightEl) return;
        
        // Set description text based on mode
        let mainText = '';
        let highlightText = '';
        if (mode === 'immortal') {
            mainText = 'You are <span style="color: #0ff; text-shadow: 0 0 20px #0ff; font-weight: bold;">Arc Man</span>. Your mission: finalize the stablecoin transaction. Launch the token in an arc and hit the Settlement Zone.\n\nScore points, compete with others, climb the Leaderboard, and mint your final NFT.';
            highlightText = 'In this mode, you have infinite lives. Practice and enjoy!';
        } else if (mode === 'tournament') {
            mainText = 'You are <span style="color: #0ff; text-shadow: 0 0 20px #0ff; font-weight: bold;">Arc Man</span>. Your mission: finalize the stablecoin transaction. Launch the token in an arc and hit the Settlement Zone.\n\nScore points, compete with others, climb the Leaderboard, and mint your final NFT.';
            highlightText = 'You have 5 lives in this mode. Correct answers in the quiz will restore them.';
        }
        
        descriptionTextEl.innerHTML = mainText;
        descriptionHighlightEl.textContent = highlightText;
        
        // Center the popup vertically and horizontally
        modeDescriptionPopup.style.display = 'flex';
        modeDescriptionPopup.style.alignItems = 'center';
        modeDescriptionPopup.style.justifyContent = 'center';
        
        // Setup close button
        const closeBtn = document.getElementById('modeDescriptionClose');
        if (closeBtn) {
            const newBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newBtn, closeBtn);
            
            newBtn.addEventListener('click', () => {
                modeDescriptionPopup.style.display = 'none';
                // Show tutorial after closing mode description
                this.showTutorial();
            });
        }
    },
    
    // Show tutorial popup on first level
    showTutorial: function() {
        const tutorialPopup = document.getElementById('tutorialPopup');
        if (!tutorialPopup) return;
        
        // Draw objects on tutorial canvases
        this.drawTutorialObjects();
        
        // Show popup
        tutorialPopup.style.display = 'block';
        
        // Setup close button
        const closeBtn = document.getElementById('tutorialClose');
        if (closeBtn) {
            const newBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newBtn, closeBtn);
            
            newBtn.addEventListener('click', () => {
                tutorialPopup.style.display = 'none';
            });
        }
    },
    
    // Draw tutorial object images on canvas elements
    drawTutorialObjects: function() {
        const canvasSize = 80;
        
        // Draw Slippage Cloud
        const cloudCanvas = document.getElementById('tutorialCloud');
        if (cloudCanvas) {
            const ctx = cloudCanvas.getContext('2d');
            ctx.clearRect(0, 0, canvasSize, canvasSize);
            const centerX = canvasSize / 2;
            const centerY = canvasSize / 2;
            const radius = 30;
            
            // Glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = GameConfig.COLORS.magenta;
            
            // Cloud gradient
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(255, 0, 255, 0.6)');
            gradient.addColorStop(1, 'rgba(255, 0, 255, 0.2)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Distortion lines
            ctx.strokeStyle = GameConfig.COLORS.magenta;
            ctx.lineWidth = 2;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(angle) * radius * 0.7,
                    centerY + Math.sin(angle) * radius * 0.7
                );
                ctx.stroke();
            }
            ctx.shadowBlur = 0;
        }
        
        // Draw Arc Gate
        const gateCanvas = document.getElementById('tutorialGate');
        if (gateCanvas) {
            const ctx = gateCanvas.getContext('2d');
            ctx.clearRect(0, 0, canvasSize, canvasSize);
            const centerX = canvasSize / 2;
            const centerY = canvasSize / 2;
            const width = 50;
            const height = 40;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            
            // Glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = GameConfig.COLORS.magenta;
            
            const pillarWidth = 6;
            const archRadius = width / 2 - pillarWidth / 2;
            const archHeight = 15;
            const pillarTopY = -height / 2 + archHeight;
            const pillarBottomY = height / 2;
            
            // Draw left pillar
            ctx.strokeStyle = GameConfig.COLORS.magenta;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-width / 2, pillarTopY);
            ctx.lineTo(-width / 2, pillarBottomY);
            ctx.stroke();
            
            // Draw right pillar
            ctx.beginPath();
            ctx.moveTo(width / 2, pillarTopY);
            ctx.lineTo(width / 2, pillarBottomY);
            ctx.stroke();
            
            // Draw arch
            ctx.beginPath();
            ctx.arc(0, pillarTopY, archRadius, Math.PI, 0, false);
            ctx.stroke();
            
            // Inner portal
            ctx.fillStyle = GameConfig.COLORS.magenta;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(0, pillarTopY, archRadius - 2, Math.PI, 0, false);
            ctx.lineTo(width / 2 - pillarWidth / 2 - 2, pillarTopY);
            ctx.lineTo(width / 2 - pillarWidth / 2 - 2, pillarBottomY - 2);
            ctx.lineTo(-width / 2 + pillarWidth / 2 + 2, pillarBottomY - 2);
            ctx.lineTo(-width / 2 + pillarWidth / 2 + 2, pillarTopY);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
            
            ctx.restore();
            ctx.shadowBlur = 0;
        }
        
        // Draw Barrier
        const barrierCanvas = document.getElementById('tutorialBarrier');
        if (barrierCanvas) {
            const ctx = barrierCanvas.getContext('2d');
            ctx.clearRect(0, 0, canvasSize, canvasSize);
            const centerX = canvasSize / 2;
            const centerY = canvasSize / 2;
            const width = 50;
            const height = 20;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(45 * Math.PI / 180); // Rotate 45 degrees
            
            // Glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = GameConfig.COLORS.yellow;
            
            // Barrier rectangle
            ctx.fillStyle = GameConfig.COLORS.yellow;
            ctx.globalAlpha = 0.8;
            ctx.fillRect(-width / 2, -height / 2, width, height);
            
            // Border
            ctx.strokeStyle = GameConfig.COLORS.yellow;
            ctx.lineWidth = 2;
            ctx.strokeRect(-width / 2, -height / 2, width, height);
            
            // Warning lines
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-width / 2 + 5, 0);
            ctx.lineTo(width / 2 - 5, 0);
            ctx.moveTo(0, -height / 2 + 5);
            ctx.lineTo(0, height / 2 - 5);
            ctx.stroke();
            
            ctx.globalAlpha = 1;
            ctx.restore();
            ctx.shadowBlur = 0;
        }
        
        // Draw Settlement Zone
        const settlementCanvas = document.getElementById('tutorialSettlement');
        if (settlementCanvas) {
            const ctx = settlementCanvas.getContext('2d');
            ctx.clearRect(0, 0, canvasSize, canvasSize);
            const centerX = canvasSize / 2;
            const centerY = canvasSize / 2;
            const width = 50;
            const height = 40;
            
            // Glow effect
            ctx.shadowBlur = 20;
            ctx.shadowColor = GameConfig.COLORS.cyan;
            
            // Settlement zone rectangle
            ctx.fillStyle = GameConfig.COLORS.cyan;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
            
            // Border
            ctx.strokeStyle = GameConfig.COLORS.cyan;
            ctx.lineWidth = 3;
            ctx.globalAlpha = 1;
            ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
            
            // Checkmark
            ctx.strokeStyle = GameConfig.COLORS.cyan;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX - width / 4, centerY);
            ctx.lineTo(centerX - width / 8, centerY + height / 4);
            ctx.lineTo(centerX + width / 4, centerY - height / 4);
            ctx.stroke();
            
            ctx.shadowBlur = 0;
        }
    },
    
    // Start Editor Mode
    startEditorMode: function() {
        GameState.gameMode = 'editor';
        GameState.immortalMode = false;
        GameState.tournamentMode = false;
        GameState.gameState = 'aiming'; // Allow editor to function
        
        this.hideMainMenu();
        if (typeof LevelEditor !== 'undefined' && LevelEditor.toggleEditor) {
            LevelEditor.toggleEditor(true);
        }
        
        // Hide back to menu button when in editor (editor has its own close button)
        const backToMenuBtn = document.getElementById('backToMenu');
        if (backToMenuBtn) {
            backToMenuBtn.style.display = 'none';
        }
    }
};

