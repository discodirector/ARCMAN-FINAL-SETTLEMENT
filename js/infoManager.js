// Info Screen Management Module
const InfoManager = {
    currentInfo: null,

    shouldShowInfo: function(levelId) {
        return GameState.tournamentMode && this.getInfoForLevel(levelId) !== null;
    },

    // One screen per level; the screen's id is the level it follows
    getInfoForLevel: function(levelId) {
        if (typeof INFO_SCREENS === 'undefined') return null;
        return INFO_SCREENS.find(screen => screen.id === levelId) || null;
    },

    showInfo: function(infoData) {
        if (!infoData) return;

        this.currentInfo = infoData;

        const screen = document.getElementById('infoScreen');
        if (!screen) {
            console.error('Info screen element not found');
            return;
        }

        const textEl = document.getElementById('infoText');
        if (textEl) textEl.textContent = I18n.infoText(infoData);

        screen.style.display = 'flex';
        this.setupListeners();
    },

    setupListeners: function() {
        const continueBtn = document.getElementById('infoContinue');
        if (continueBtn) {
            const newBtn = continueBtn.cloneNode(true);
            continueBtn.parentNode.replaceChild(newBtn, continueBtn);
            newBtn.addEventListener('click', () => this.closeAndContinue());
        }
    },

    closeAndContinue: function() {
        const screen = document.getElementById('infoScreen');
        if (screen) screen.style.display = 'none';

        this.currentInfo = null;

        // The quiz on this level checks the screen just read, so it comes next
        const currentLevel = GameState.levelManager && GameState.levelManager.getCurrentLevel();
        if (currentLevel && typeof QuizManager !== 'undefined' && QuizManager.shouldShowQuiz(currentLevel.id)) {
            const quizData = QuizManager.getQuizForLevel(currentLevel.id);
            if (quizData) {
                setTimeout(() => {
                    QuizManager.showQuiz(quizData);
                }, 300);
                return;
            }
        }

        setTimeout(() => {
            if (typeof GameFlow !== 'undefined' && GameFlow.advanceToNextLevel) {
                GameFlow.advanceToNextLevel();
            }
        }, 300);
    },

    hideInfo: function() {
        const screen = document.getElementById('infoScreen');
        if (screen) screen.style.display = 'none';
        this.currentInfo = null;
    }
};
