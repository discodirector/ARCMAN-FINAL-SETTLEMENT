// Info Screen Management Module
const InfoManager = {
    currentInfo: null,

    shouldShowInfo: function(levelId) {
        const infoLevels = [1, 3, 5, 7, 9];
        return (GameState.tournamentMode || GameState.immortalMode) && infoLevels.includes(levelId);
    },

    getInfoForLevel: function(levelId) {
        const levelToInfoIndex = { 1: 0, 3: 1, 5: 2, 7: 3, 9: 4 };
        const idx = levelToInfoIndex[levelId];
        if (idx !== undefined && INFO_SCREENS && INFO_SCREENS[idx]) {
            return INFO_SCREENS[idx];
        }
        return null;
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
        if (textEl) textEl.textContent = infoData.text;

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
