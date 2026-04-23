// Quiz Management Module
const QuizManager = {
    currentQuiz: null,
    quizAnswered: false,
    
    // Check if quiz should be shown for this level
    shouldShowQuiz: function(levelId) {
        // Quizzes appear after levels 2, 4, 6, 8, 10
        // levelId is 1-indexed, so we check for levels 2, 4, 6, 8, 10
        const quizLevels = [2, 4, 6, 8, 10];
        return GameState.tournamentMode && quizLevels.includes(levelId);
    },
    
    // Get quiz data for a specific level
    getQuizForLevel: function(levelId) {
        // Map level ID to quiz index (level 2 -> quiz 0, level 4 -> quiz 1, etc.)
        const levelToQuizIndex = {
            2: 0,
            4: 1,
            6: 2,
            8: 3,
            10: 4
        };
        
        const quizIndex = levelToQuizIndex[levelId];
        if (quizIndex !== undefined && QUIZZES && QUIZZES[quizIndex]) {
            return QUIZZES[quizIndex];
        }
        return null;
    },
    
    // Show quiz screen
    showQuiz: function(quizData) {
        if (!quizData) return;
        
        this.currentQuiz = quizData;
        this.quizAnswered = false;
        
        const quizScreen = document.getElementById('quizScreen');
        if (!quizScreen) {
            console.error('Quiz screen element not found');
            return;
        }
        
        // Update quiz content
        const questionEl = document.getElementById('quizQuestion');
        const answer1El = document.getElementById('quizAnswer1');
        const answer2El = document.getElementById('quizAnswer2');
        const answer3El = document.getElementById('quizAnswer3');
        const skipBtn = document.getElementById('quizSkip');
        const resultMessage = document.getElementById('quizResultMessage');
        
        if (questionEl) questionEl.textContent = quizData.question;
        if (answer1El) answer1El.textContent = quizData.answers[0];
        if (answer2El) answer2El.textContent = quizData.answers[1];
        if (answer3El) answer3El.textContent = quizData.answers[2];
        
        // Reset button states
        if (answer1El) {
            answer1El.classList.remove('correct', 'incorrect', 'disabled');
            answer1El.disabled = false;
        }
        if (answer2El) {
            answer2El.classList.remove('correct', 'incorrect', 'disabled');
            answer2El.disabled = false;
        }
        if (answer3El) {
            answer3El.classList.remove('correct', 'incorrect', 'disabled');
            answer3El.disabled = false;
        }
        
        // Hide result message
        if (resultMessage) {
            resultMessage.textContent = '';
            resultMessage.style.display = 'none';
        }
        
        // Show skip button (always available)
        if (skipBtn) {
            skipBtn.style.display = 'block';
            // Check if player has full lives
            if (GameState.tournamentLives >= GameConfig.MAX_TOURNAMENT_LIVES) {
                skipBtn.textContent = 'Skip (You have full lives)';
            } else {
                skipBtn.textContent = 'Skip';
            }
        }
        
        // Show quiz screen
        quizScreen.style.display = 'flex';
        
        // Setup event listeners
        this.setupQuizListeners();
    },
    
    // Setup event listeners for quiz buttons
    setupQuizListeners: function() {
        const answer1El = document.getElementById('quizAnswer1');
        const answer2El = document.getElementById('quizAnswer2');
        const answer3El = document.getElementById('quizAnswer3');
        const skipBtn = document.getElementById('quizSkip');
        const continueBtn = document.getElementById('quizContinue');
        
        // Remove existing listeners by cloning
        if (answer1El) {
            const newBtn = answer1El.cloneNode(true);
            answer1El.parentNode.replaceChild(newBtn, answer1El);
            newBtn.addEventListener('click', () => this.handleQuizAnswer(0));
        }
        
        if (answer2El) {
            const newBtn = answer2El.cloneNode(true);
            answer2El.parentNode.replaceChild(newBtn, answer2El);
            newBtn.addEventListener('click', () => this.handleQuizAnswer(1));
        }
        
        if (answer3El) {
            const newBtn = answer3El.cloneNode(true);
            answer3El.parentNode.replaceChild(newBtn, answer3El);
            newBtn.addEventListener('click', () => this.handleQuizAnswer(2));
        }
        
        if (skipBtn) {
            const newBtn = skipBtn.cloneNode(true);
            skipBtn.parentNode.replaceChild(newBtn, skipBtn);
            newBtn.addEventListener('click', () => this.skipQuiz());
        }
        
        if (continueBtn) {
            const newBtn = continueBtn.cloneNode(true);
            continueBtn.parentNode.replaceChild(newBtn, continueBtn);
            newBtn.addEventListener('click', () => this.closeQuizAndContinue());
        }
    },
    
    // Handle quiz answer selection
    handleQuizAnswer: function(selectedIndex) {
        if (this.quizAnswered || !this.currentQuiz) return;
        
        this.quizAnswered = true;
        const correctIndex = this.currentQuiz.correctIndex;
        const isCorrect = selectedIndex === correctIndex;
        
        // Disable all answer buttons
        const answer1El = document.getElementById('quizAnswer1');
        const answer2El = document.getElementById('quizAnswer2');
        const answer3El = document.getElementById('quizAnswer3');
        const skipBtn = document.getElementById('quizSkip');
        const resultMessage = document.getElementById('quizResultMessage');
        const continueBtn = document.getElementById('quizContinue');
        
        [answer1El, answer2El, answer3El].forEach((btn, index) => {
            if (btn) {
                btn.disabled = true;
                btn.classList.add('disabled');
                if (index === correctIndex) {
                    btn.classList.add('correct');
                } else if (index === selectedIndex && !isCorrect) {
                    btn.classList.add('incorrect');
                }
            }
        });
        
        // Hide skip button
        if (skipBtn) skipBtn.style.display = 'none';
        
        // Show result message
        if (resultMessage) {
            resultMessage.style.display = 'block';
            if (isCorrect) {
                resultMessage.textContent = 'Correct! +1 Life';
                resultMessage.className = 'quiz-result correct-result';
                this.awardLife();
            } else {
                resultMessage.textContent = `Incorrect. Correct answer: ${this.currentQuiz.answers[correctIndex]}`;
                resultMessage.className = 'quiz-result incorrect-result';
            }
        }
        
        // Show continue button
        if (continueBtn) {
            continueBtn.style.display = 'block';
        }
    },
    
    // Award life for correct answer
    awardLife: function() {
        if (GameState.tournamentLives < GameConfig.MAX_TOURNAMENT_LIVES) {
            GameState.tournamentLives++;
            if (typeof UI !== 'undefined' && UI.updateLivesUI) {
                UI.updateLivesUI();
            }
        }
    },
    
    // Skip quiz
    skipQuiz: function() {
        this.quizAnswered = true;
        this.closeQuizAndContinue();
    },
    
    // Close quiz and continue to next level
    closeQuizAndContinue: function() {
        const quizScreen = document.getElementById('quizScreen');
        if (quizScreen) {
            quizScreen.style.display = 'none';
        }
        
        this.currentQuiz = null;
        this.quizAnswered = false;
        
        // Continue to next level after a short delay
        setTimeout(() => {
            if (typeof GameFlow !== 'undefined' && GameFlow.advanceToNextLevel) {
                GameFlow.advanceToNextLevel();
            }
        }, 300);
    },
    
    // Hide quiz screen
    hideQuiz: function() {
        const quizScreen = document.getElementById('quizScreen');
        if (quizScreen) {
            quizScreen.style.display = 'none';
        }
        this.currentQuiz = null;
        this.quizAnswered = false;
    }
};

