// Scoring System Module
const Scoring = {
    // Calculate and display score
    calculateScore: function() {
        if (!GameState.coin) {
            // Coin is null (level completed), return stored score
            return GameState.score || 0;
        }
        
        // New scoring system:
        // - Level completion: 100 points (awarded when level completes)
        // - Slippage Cloud passed: 10 points each
        // - Barrier collision: 10 points each
        // - Arc Gates: +0.5x multiplier each (applied to final score)
        
        // Calculate current progress (points earned so far, without level completion bonus)
        const cloudPoints = GameState.slippageCloudsPassed * 10;
        const barrierPoints = GameState.barrierHits * 10;
        const currentPoints = cloudPoints + barrierPoints;
        
        // Apply multiplier from Arc Gates for display
        return Math.floor(currentPoints * GameState.multiplier);
    },
    
    // Show level completion summary screen
    showLevelSummary: function() {
        const summaryEl = document.getElementById('levelSummary');
        if (!summaryEl) return;
        
        // Update summary statistics
        const levelPointsEl = document.getElementById('summaryLevelPoints');
        const totalPointsEl = document.getElementById('summaryTotalPoints');
        const gatesEl = document.getElementById('summaryGates');
        const cloudsEl = document.getElementById('summaryClouds');
        const barriersEl = document.getElementById('summaryBarriers');
        
        if (levelPointsEl) levelPointsEl.textContent = GameState.levelPoints;
        if (totalPointsEl) totalPointsEl.textContent = GameState.totalPoints;
        if (gatesEl) gatesEl.textContent = GameState.gatesPassed;
        if (cloudsEl) cloudsEl.textContent = GameState.slippageCloudsPassed;
        if (barriersEl) barriersEl.textContent = GameState.barrierHits * 10; // Display points earned from barriers
        
        // Show the summary screen
        summaryEl.style.display = 'flex';
        
        // Show/hide buttons based on game mode
        const continueBtn = document.getElementById('summaryContinue');
        const returnToEditorBtn = document.getElementById('summaryReturnToEditor');
        
        if (GameState.gameMode === 'test') {
            // In test mode, show "Return to Editor" button and hide "Continue"
            if (continueBtn) continueBtn.style.display = 'none';
            if (returnToEditorBtn) returnToEditorBtn.style.display = 'block';
        } else {
            // In normal game mode, show "Continue" button and hide "Return to Editor"
            if (continueBtn) continueBtn.style.display = 'block';
            if (returnToEditorBtn) returnToEditorBtn.style.display = 'none';
        }
        
        // Wire up continue button
        if (continueBtn) {
            // Remove any existing event listeners by cloning
            const newBtn = continueBtn.cloneNode(true);
            continueBtn.parentNode.replaceChild(newBtn, continueBtn);
            
            newBtn.addEventListener('click', () => {
                summaryEl.style.display = 'none';
                
                if (GameState.levelManager) {
                    const currentLevel = GameState.levelManager.getCurrentLevel();
                    
                    // Check for info screen (levels 1, 3, 5, 7, 9)
                    if (currentLevel && typeof InfoManager !== 'undefined' && InfoManager.shouldShowInfo(currentLevel.id)) {
                        const infoData = InfoManager.getInfoForLevel(currentLevel.id);
                        if (infoData) {
                            setTimeout(() => {
                                InfoManager.showInfo(infoData);
                            }, 300);
                            return;
                        }
                    }
                    
                    // Check for quiz (levels 2, 4, 6, 8, 10 — Tournament mode only)
                    if (GameState.tournamentMode && currentLevel && typeof QuizManager !== 'undefined' && QuizManager.shouldShowQuiz(currentLevel.id)) {
                        const quizData = QuizManager.getQuizForLevel(currentLevel.id);
                        if (quizData) {
                            setTimeout(() => {
                                QuizManager.showQuiz(quizData);
                            }, 300);
                            return;
                        }
                    }
                }
                
                setTimeout(() => {
                    if (typeof GameFlow !== 'undefined' && GameFlow.advanceToNextLevel) {
                        GameFlow.advanceToNextLevel();
                    }
                }, 300);
            });
        }
        
        // Wire up return to editor button
        if (returnToEditorBtn) {
            // Remove any existing event listeners by cloning
            const newBtn = returnToEditorBtn.cloneNode(true);
            returnToEditorBtn.parentNode.replaceChild(newBtn, returnToEditorBtn);
            
            newBtn.addEventListener('click', () => {
                summaryEl.style.display = 'none';
                // Return to editor
                if (typeof LevelEditor !== 'undefined' && LevelEditor.returnToEditor) {
                    LevelEditor.returnToEditor();
                }
            });
        }
    }
};



