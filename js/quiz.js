// Quiz Management Module
//
// The quiz after each level is graded by the server. The browser knows the
// questions and the wording of the answers, never which one is right:
//   1. /api/quiz/level/start opens the quiz for a level this session completed,
//      picks one of that level's question variants and returns it with the order
//      to show its answers in (shuffled per session);
//   2. /api/quiz/level/answer grades the chosen position and says which position
//      was right, so the screen can show it.
// If the server cannot be reached the quiz does not count: no life is given,
// and the player simply continues.
const QuizManager = {
    currentQuiz: null,    // { level }: which level's quiz is on screen
    question: null,       // the variant the server picked: { id, level, question, answers }
    quizAnswered: false,
    order: null,          // server order: order[position] = index into the source answers
    request: 0,           // bumped whenever the screen closes, so late responses are ignored

    // Check if quiz should be shown for this level
    shouldShowQuiz: function(levelId) {
        return GameState.tournamentMode && this.getQuizForLevel(levelId) !== null;
    },

    // The quiz for a level, if that level has any question variants. Which
    // variant is asked is up to the server, so this only names the level.
    getQuizForLevel: function(levelId) {
        if (typeof QUIZZES === 'undefined') return null;
        return QUIZZES.some(quiz => quiz.level === levelId) ? { level: levelId } : null;
    },

    answerButtons: function() {
        return [1, 2, 3].map(n => document.getElementById('quizAnswer' + n));
    },

    // Show quiz screen
    showQuiz: async function(quizData) {
        if (!quizData) return;

        this.currentQuiz = quizData;
        this.question = null;
        this.quizAnswered = false;
        this.order = null;
        const request = ++this.request;

        const quizScreen = document.getElementById('quizScreen');
        if (!quizScreen) {
            console.error('Quiz screen element not found');
            return;
        }

        const questionEl = document.getElementById('quizQuestion');
        const skipBtn = document.getElementById('quizSkip');
        const continueBtn = document.getElementById('quizContinue');
        const resultMessage = document.getElementById('quizResultMessage');

        // The question stays blank until the server says which variant to ask
        if (questionEl) questionEl.textContent = '…';

        // Answers stay blank and locked until the server says in which order to show them
        this.answerButtons().forEach(btn => {
            if (!btn) return;
            btn.textContent = '…';
            btn.classList.remove('correct', 'incorrect');
            btn.classList.add('disabled');
            btn.disabled = true;
        });

        if (resultMessage) {
            resultMessage.textContent = '';
            resultMessage.style.display = 'none';
        }
        if (continueBtn) continueBtn.style.display = 'none';

        // Show skip button (always available)
        if (skipBtn) {
            skipBtn.style.display = 'block';
            if (GameState.tournamentLives >= GameConfig.MAX_TOURNAMENT_LIVES) {
                skipBtn.textContent = t('quizUi.skipFullLives');
            } else {
                skipBtn.textContent = t('quizUi.skip');
            }
        }

        quizScreen.style.display = 'flex';
        this.setupQuizListeners();

        const opened = await this.openOnServer(quizData.level);
        if (request !== this.request) return;   // the screen was closed meanwhile

        this.showRewardProgress(quizData.level, opened && opened.correctSoFar);

        const question = opened && QUIZZES.find(q => q.id === opened.questionId);
        if (!question) {
            this.showUnavailable();
            return;
        }

        // Wording comes from the active language pack, in source order
        this.question = question;
        this.order = opened.order;
        const text = I18n.quiz(question);
        if (questionEl) questionEl.textContent = text.question;
        this.answerButtons().forEach((btn, position) => {
            if (!btn) return;
            btn.textContent = text.answers[this.order[position]];
            btn.classList.remove('disabled');
            btn.disabled = false;
        });
    },

    // What answering is worth, said while there are still questions to answer.
    // The reward asks for a number of correct answers, and a player who only
    // learns that on the completion screen has already lost it. The Skip
    // button is right there, and nothing used to argue with it.
    showRewardProgress: function (levelId, correctSoFar) {
        const note = document.getElementById('quizRewardNote');
        if (!note) return;

        const needed = Number(GameState.rewardQuizNeeded || 0);
        if (!needed || typeof correctSoFar !== 'number') {
            note.style.display = 'none';
            return;
        }

        const correct = correctSoFar;
        // This question and the ones after it: the run is on level levelId, so
        // levelId - 1 questions are behind it.
        const left = Math.max(0, (GameState.levelManager ? GameState.levelManager.levels.length : 20) - (levelId - 1));

        note.classList.toggle('unreachable', correct + left < needed);
        note.textContent = correct + left < needed
            ? t('quizUi.rewardLost')
            : t('quizUi.rewardProgress', { correct, needed });
        note.style.display = 'block';
    },

    // Open the quiz on the server. The level-complete event is sent a moment
    // earlier without waiting, so a "not completed yet" answer is retried briefly.
    openOnServer: async function(levelId) {
        if (!GameState.sessionId) return null;
        for (let attempt = 0; attempt < 4; attempt++) {
            const { ok, status, data } = await GameFlow.apiPost('/api/quiz/level/start', {
                sessionId: GameState.sessionId,
                levelId
            });
            if (ok && data && data.questionId && Array.isArray(data.order)) return data;
            if (status !== 409 || !data || !/not completed/i.test(data.error || '')) {
                console.warn('Quiz could not be opened:', status, data && data.error);
                return null;
            }
            await new Promise(resolve => setTimeout(resolve, 600));
        }
        return null;
    },

    // Setup event listeners for quiz buttons
    setupQuizListeners: function() {
        const skipBtn = document.getElementById('quizSkip');
        const continueBtn = document.getElementById('quizContinue');

        // Remove existing listeners by cloning
        this.answerButtons().forEach((btn, position) => {
            if (!btn) return;
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => this.handleQuizAnswer(position));
        });

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

    // Handle quiz answer selection. Position is the button as shown on screen
    handleQuizAnswer: async function(position) {
        if (this.quizAnswered || !this.currentQuiz || !this.question || !this.order) return;

        this.quizAnswered = true;
        const request = this.request;
        const question = this.question;

        const buttons = this.answerButtons();
        buttons.forEach(btn => {
            if (!btn) return;
            btn.disabled = true;
            btn.classList.add('disabled');
        });

        const skipBtn = document.getElementById('quizSkip');
        if (skipBtn) skipBtn.style.display = 'none';

        const { ok, data } = await GameFlow.apiPost('/api/quiz/level/answer', {
            sessionId: GameState.sessionId,
            levelId: question.level,
            choice: position
        });
        if (request !== this.request) return;

        if (!ok || !data || typeof data.correct !== 'boolean') {
            console.warn('Quiz answer could not be graded:', data && data.error);
            this.showUnavailable();
            return;
        }

        const isCorrect = data.correct;
        this.showRewardProgress(question.level + 1, data.correctSoFar);

        buttons.forEach((btn, index) => {
            if (!btn) return;
            if (index === data.correctPosition) {
                btn.classList.add('correct');
            } else if (index === position && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        const resultMessage = document.getElementById('quizResultMessage');
        if (resultMessage) {
            resultMessage.style.display = 'block';
            if (isCorrect) {
                // With a quiz after every level, full lives are common, so don't promise one we can't give
                const gainedLife = GameState.tournamentLives < GameConfig.MAX_TOURNAMENT_LIVES;
                resultMessage.textContent = gainedLife ? t('quizUi.correctLife') : t('quizUi.correct');
                resultMessage.className = 'quiz-result correct-result';
                this.awardLife();
            } else {
                const correctText = I18n.quiz(question).answers[this.order[data.correctPosition]];
                resultMessage.textContent = t('quizUi.incorrect', { answer: correctText });
                resultMessage.className = 'quiz-result incorrect-result';
            }
        }

        const continueBtn = document.getElementById('quizContinue');
        if (continueBtn) continueBtn.style.display = 'block';
    },

    // The server could not open or grade the quiz: it does not count, the run goes on
    showUnavailable: function() {
        this.quizAnswered = true;
        this.answerButtons().forEach(btn => {
            if (!btn) return;
            btn.disabled = true;
            btn.classList.add('disabled');
        });

        const resultMessage = document.getElementById('quizResultMessage');
        if (resultMessage) {
            resultMessage.style.display = 'block';
            resultMessage.className = 'quiz-result incorrect-result';
            resultMessage.textContent = t('quizUi.unavailable');
        }

        const skipBtn = document.getElementById('quizSkip');
        if (skipBtn) skipBtn.style.display = 'none';
        const continueBtn = document.getElementById('quizContinue');
        if (continueBtn) continueBtn.style.display = 'block';
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
        this.hideQuiz();

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
        this.request++;
        this.currentQuiz = null;
        this.question = null;
        this.quizAnswered = false;
        this.order = null;
    }
};
