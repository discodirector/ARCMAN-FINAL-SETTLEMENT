// Rescue Quiz: the one second chance a tournament run gets.
//
// When the last life is gone the run would normally restart from level 1.
// Instead the player is shown a hint and then three questions on that hint's
// topic, and buys their way back in with attention rather than another hour:
//
//   3 of 3 correct: continue from this level with 3 lives
//   2 of 3 correct: continue from this level with 1 life
//   fewer         : the run restarts from the first level
//
// Once per run. The topics live in js/rescueTopics.js and are deliberately
// not the ones asked between levels.
//
// The server runs the quiz: it draws the topic, picks three of its questions,
// shuffles each question's answers, grades every answer and hands back the
// verdict and the lives. The browser only shows the wording. If the server
// cannot be reached the rescue cannot be graded, and the run restarts as it did
// before rescues existed.

const RescueManager = {
    active: false,
    topic: null,          // translated topic, questions narrowed to the three the server picked
    orders: null,         // server order per question: orders[i][position] = source answer index
    index: 0,
    correct: 0,
    answered: false,
    verdict: null,        // { correctCount, lives } from the server
    request: 0,           // bumped when the screen closes, so late responses are ignored

    el: function (id) { return document.getElementById(id); },

    // A rescue is offered in tournament mode, once per run, if there is a topic
    available: function () {
        return GameState.tournamentMode
            && !GameState.rescueUsed
            && typeof RESCUE_TOPICS !== 'undefined'
            && RESCUE_TOPICS.length > 0;
    },

    start: async function () {
        if (!this.available()) return false;

        const screen = this.el('rescueScreen');
        if (!screen) {
            console.error('Rescue screen element not found');
            return false;
        }

        this.active = true;
        this.index = 0;
        this.correct = 0;
        this.answered = false;
        this.verdict = null;
        GameState.rescueUsed = true;
        const request = ++this.request;

        const started = GameState.sessionId
            ? await GameFlow.apiPost('/api/quiz/rescue/start', { sessionId: GameState.sessionId })
            : { ok: false, data: { error: 'No session' } };
        if (request !== this.request) return false;

        const source = started.ok && started.data
            && RESCUE_TOPICS.find(topic => topic.id === started.data.topicId);
        const picked = source && started.data.questions;
        if (!source || !Array.isArray(picked) || !Array.isArray(started.data.orders)
            || picked.some(i => !source.questions[i])) {
            console.warn('Rescue could not be started:', started.data && started.data.error);
            screen.style.display = 'flex';
            this.showUnavailable();
            return false;
        }

        // Translated once here, then narrowed to the server's picks; each order
        // refers to the answer positions of its picked question
        const translated = I18n.rescueTopic(source);
        this.topic = Object.assign({}, translated, { questions: picked.map(i => translated.questions[i]) });
        this.orders = started.data.orders;
        this.index = started.data.answered || 0;

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
        const order = this.orders[this.index];

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

        for (let position = 0; position < 3; position++) {
            const btn = this.el('rescueAnswer' + (position + 1));
            if (!btn) continue;
            const fresh = btn.cloneNode(true);
            fresh.textContent = q.answers[order[position]];
            fresh.classList.remove('correct', 'incorrect', 'disabled');
            fresh.disabled = false;
            btn.parentNode.replaceChild(fresh, btn);
            fresh.addEventListener('click', () => this.answer(position));
        }
    },

    answer: async function (position) {
        if (this.answered || !this.topic) return;
        this.answered = true;
        const request = this.request;

        const q = this.topic.questions[this.index];
        const order = this.orders[this.index];

        for (let i = 0; i < 3; i++) {
            const btn = this.el('rescueAnswer' + (i + 1));
            if (!btn) continue;
            btn.disabled = true;
            btn.classList.add('disabled');
        }

        const graded = await GameFlow.apiPost('/api/quiz/rescue/answer', {
            sessionId: GameState.sessionId,
            index: this.index,
            choice: position
        });
        if (request !== this.request) return;

        if (!graded.ok || !graded.data || typeof graded.data.correct !== 'boolean') {
            console.warn('Rescue answer could not be graded:', graded.data && graded.data.error);
            this.showUnavailable();
            return;
        }

        const { correct: right, correctPosition, done } = graded.data;
        if (right) this.correct++;
        if (done) this.verdict = { correctCount: graded.data.correctCount, lives: graded.data.lives };

        for (let i = 0; i < 3; i++) {
            const btn = this.el('rescueAnswer' + (i + 1));
            if (!btn) continue;
            if (i === correctPosition) btn.classList.add('correct');
            else if (i === position) btn.classList.add('incorrect');
        }

        const result = this.el('rescueResult');
        if (result) {
            result.style.display = 'block';
            result.className = 'quiz-result ' + (right ? 'correct-result' : 'incorrect-result');
            result.textContent = right
                ? t('rescue.correct')
                : t('rescue.wrong', { answer: q.answers[order[correctPosition]] });
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
        // The server decides the lives; without its verdict nothing is handed back
        const lives = this.verdict ? this.verdict.lives : 0;
        const correctCount = this.verdict ? this.verdict.correctCount : this.correct;
        const total = this.topic.questions.length;

        const title = this.el('rescueTitle');
        const lead = this.el('rescueLead');
        const questionWrap = this.el('rescueQuestionWrap');
        const result = this.el('rescueResult');
        const button = this.el('rescueButton');

        if (questionWrap) questionWrap.style.display = 'none';
        if (title) title.textContent = t('rescue.verdictTitle', { correct: correctCount, total: total });
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

    // The server could not run the rescue: it cannot be graded, so the run restarts
    showUnavailable: function () {
        const title = this.el('rescueTitle');
        const lead = this.el('rescueLead');
        const hint = this.el('rescueHint');
        const questionWrap = this.el('rescueQuestionWrap');
        const result = this.el('rescueResult');
        const button = this.el('rescueButton');

        if (title) title.textContent = t('rescue.title');
        if (lead) {
            lead.textContent = t('rescue.unavailable');
            lead.style.display = 'block';
        }
        if (hint) hint.style.display = 'none';
        if (questionWrap) questionWrap.style.display = 'none';
        if (result) { result.style.display = 'none'; result.textContent = ''; }
        if (button) {
            button.textContent = t('rescue.startOver');
            button.style.display = 'block';
            this.onButton(() => this.finish(0));
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
        this.request++;
        this.active = false;
        this.topic = null;
        this.orders = null;
        this.index = 0;
        this.correct = 0;
        this.answered = false;
        this.verdict = null;
    }
};

if (typeof window !== 'undefined') {
    window.RescueManager = RescueManager;
}
