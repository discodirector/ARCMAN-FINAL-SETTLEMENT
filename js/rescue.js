// Rescue Quiz — the one second chance a tournament run gets.
//
// When the last life is gone the run would normally restart from level 1.
// Instead the player is shown a hint and then three questions on that hint's
// topic, and buys their way back in with attention rather than another hour:
//
//   3 of 3 correct — continue from this level with 3 lives
//   2 of 3 correct — continue from this level with 1 life
//   fewer         — the run restarts from the first level
//
// Once per run. The topics live in js/rescueTopics.js and are deliberately
// not the ones asked between levels.

const RescueManager = {
    REWARDS: { 3: 3, 2: 1 },   // correct answers -> lives handed back
    lastTopicId: null,         // so two runs in a row do not draw the same topic

    active: false,
    topic: null,
    index: 0,
    correct: 0,
    answered: false,

    el: function (id) { return document.getElementById(id); },

    // A rescue is offered in tournament mode, once per run, if there is a topic
    available: function () {
        return GameState.tournamentMode
            && !GameState.rescueUsed
            && typeof RESCUE_TOPICS !== 'undefined'
            && RESCUE_TOPICS.length > 0;
    },

    pickTopic: function () {
        const pool = RESCUE_TOPICS.filter(topic => topic.id !== this.lastTopicId);
        const list = pool.length ? pool : RESCUE_TOPICS;
        return list[Math.floor(Math.random() * list.length)];
    },

    start: function () {
        if (!this.available()) return false;

        this.active = true;
        // The drawn topic is translated once here; correctIndex is carried over
        // unchanged, so scoring does not depend on the language.
        const source = this.pickTopic();
        this.lastTopicId = source.id;
        this.topic = I18n.rescueTopic(source);
        this.index = 0;
        this.correct = 0;
        this.answered = false;
        GameState.rescueUsed = true;

        const screen = this.el('rescueScreen');
        if (!screen) {
            console.error('Rescue screen element not found');
            return false;
        }
        screen.style.display = 'flex';
        this.showHint();
        return true;
    },

    // --- hint -------------------------------------------------------------
    showHint: function () {
        const title = this.el('rescueTitle');
        const lead = this.el('rescueLead');
        const hint = this.el('rescueHint');
        const questionWrap = this.el('rescueQuestionWrap');
        const result = this.el('rescueResult');
        const button = this.el('rescueButton');

        if (title) title.textContent = t('rescue.title');
        if (lead) {
            lead.textContent = t('rescue.lead');
            lead.style.display = 'block';
        }
        if (hint) {
            hint.innerHTML = '<b>' + this.topic.title + '</b><br>' + this.topic.hint;
            hint.style.display = 'block';
        }
        if (questionWrap) questionWrap.style.display = 'none';
        if (result) { result.style.display = 'none'; result.textContent = ''; }
        if (button) {
            button.textContent = t('rescue.readIt');
            button.style.display = 'block';
            this.onButton(() => this.showQuestion());
        }
    },

    // --- questions --------------------------------------------------------
    showQuestion: function () {
        const q = this.topic.questions[this.index];
        if (!q) return this.showVerdict();

        this.answered = false;

        const lead = this.el('rescueLead');
        const hint = this.el('rescueHint');
        const questionWrap = this.el('rescueQuestionWrap');
        const progress = this.el('rescueProgress');
        const question = this.el('rescueQuestion');
        const result = this.el('rescueResult');
        const button = this.el('rescueButton');

        if (lead) lead.style.display = 'none';
        if (hint) hint.style.display = 'none';
        if (questionWrap) questionWrap.style.display = 'block';
        if (progress) {
            progress.textContent = t('rescue.progress', {
                current: this.index + 1,
                total: this.topic.questions.length,
                correct: this.correct
            });
        }
        if (question) question.textContent = q.question;
        if (result) { result.style.display = 'none'; result.textContent = ''; }
        if (button) button.style.display = 'none';

        for (let i = 0; i < 3; i++) {
            const btn = this.el('rescueAnswer' + (i + 1));
            if (!btn) continue;
            const fresh = btn.cloneNode(true);
            fresh.textContent = q.answers[i];
            fresh.classList.remove('correct', 'incorrect', 'disabled');
            fresh.disabled = false;
            btn.parentNode.replaceChild(fresh, btn);
            fresh.addEventListener('click', () => this.answer(i));
        }
    },

    answer: function (choice) {
        if (this.answered || !this.topic) return;
        this.answered = true;

        const q = this.topic.questions[this.index];
        const right = choice === q.correctIndex;
        if (right) this.correct++;

        for (let i = 0; i < 3; i++) {
            const btn = this.el('rescueAnswer' + (i + 1));
            if (!btn) continue;
            btn.disabled = true;
            btn.classList.add('disabled');
            if (i === q.correctIndex) btn.classList.add('correct');
            else if (i === choice) btn.classList.add('incorrect');
        }

        const result = this.el('rescueResult');
        if (result) {
            result.style.display = 'block';
            result.className = 'quiz-result ' + (right ? 'correct-result' : 'incorrect-result');
            result.textContent = right
                ? t('rescue.correct')
                : t('rescue.wrong', { answer: q.answers[q.correctIndex] });
        }

        const button = this.el('rescueButton');
        if (button) {
            const last = this.index === this.topic.questions.length - 1;
            button.textContent = last ? t('rescue.seeResult') : t('rescue.next');
            button.style.display = 'block';
            this.onButton(() => {
                this.index++;
                if (this.index >= this.topic.questions.length) this.showVerdict();
                else this.showQuestion();
            });
        }
    },

    // --- verdict ----------------------------------------------------------
    showVerdict: function () {
        const lives = this.REWARDS[this.correct] || 0;
        const total = this.topic.questions.length;

        const title = this.el('rescueTitle');
        const lead = this.el('rescueLead');
        const questionWrap = this.el('rescueQuestionWrap');
        const result = this.el('rescueResult');
        const button = this.el('rescueButton');

        if (questionWrap) questionWrap.style.display = 'none';
        if (title) title.textContent = t('rescue.verdictTitle', { correct: this.correct, total: total });
        if (lead) {
            lead.style.display = 'block';
            lead.textContent = lives
                ? (lives === 1 ? t('rescue.backInOne') : t('rescue.backIn', { lives: lives }))
                : t('rescue.notEnough');
        }
        if (result) {
            result.style.display = 'block';
            result.className = 'quiz-result ' + (lives ? 'correct-result' : 'incorrect-result');
            result.textContent = lives ? t('rescue.rescued') : t('rescue.runOver');
        }
        if (button) {
            button.textContent = lives ? t('rescue.backToLevel') : t('rescue.startOver');
            button.style.display = 'block';
            this.onButton(() => this.finish(lives));
        }
    },

    finish: function (lives) {
        this.hide();

        if (lives > 0) {
            GameState.tournamentLives = lives;
            if (typeof UI !== 'undefined' && UI.updateLivesUI) UI.updateLivesUI();
            // Same as losing an ordinary life: the level is replayed, the score
            // and the anti-cheat session carry on untouched.
            if (typeof GameFlow !== 'undefined' && GameFlow.resetRound) GameFlow.resetRound();
        } else if (typeof GameFlow !== 'undefined' && GameFlow.restartTournamentFromFirst) {
            GameFlow.restartTournamentFromFirst();
        }
    },

    // Buttons are re-created rather than re-bound, so a stale handler from an
    // earlier step can never fire on the current one.
    onButton: function (handler) {
        const button = this.el('rescueButton');
        if (!button) return;
        const fresh = button.cloneNode(true);
        button.parentNode.replaceChild(fresh, button);
        fresh.addEventListener('click', handler);
    },

    hide: function () {
        const screen = this.el('rescueScreen');
        if (screen) screen.style.display = 'none';
        this.active = false;
        this.topic = null;
        this.index = 0;
        this.correct = 0;
        this.answered = false;
    }
};

if (typeof window !== 'undefined') {
    window.RescueManager = RescueManager;
}
