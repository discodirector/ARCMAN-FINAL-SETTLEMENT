// Agent Shift mode — menu entry, onboarding and the shift loop.
//
// Drawing is left to the normal game loop: the mode sets GameState the way
// any other mode does and only steps the shift itself. The player does not
// aim in this mode, so gameState is 'agent' — that keeps the aim preview and
// the input handler out of the way while physics keeps running.

const AgentMode = {
    active: false,
    shift: null,
    stepIndex: 0,
    paused: true,
    freeMode: false,
    last: 0,
    otpCode: null,
    solutionCache: {},
    ONBOARDED_KEY: 'arcman_agent_onboarded',

    el: function (id) { return document.getElementById(id); },

    init: function () {
        const btn = this.el('menuAgent');
        if (btn) btn.addEventListener('click', () => this.start());

        const cardBtn = this.el('agentCardBtn');
        if (cardBtn) cardBtn.addEventListener('click', () => { if (this.onCard) this.onCard(); });

        AgentWallet.init();

        ['agentPerTx', 'agentBudget', 'agentMaxPrice'].forEach(id => {
            const s = this.el(id);
            if (s) s.addEventListener('input', () => this.paintSliders());
        });
    },

    // --- lifecycle --------------------------------------------------------
    start: function () {
        this.active = true;
        this.shift = null;
        this.freeMode = false;
        this.paused = true;
        this.solutionCache = {};

        GameState.gameMode = 'agent';
        GameState.gameState = 'agent';      // not 'aiming': the human does not shoot here
        GameState.immortalMode = false;
        GameState.tournamentMode = false;
        GameState.communityMode = false;
        GameState.agentShiftMode = true;
        GameState.coin = null;
        GameState.coinTrail = [];
        GameState.particles = [];

        if (GameState.levelManager) GameState.levelManager.loadDefaultLevels();
        GameFlow.hideMainMenu();
        AudioManager.playGameplayMusic();
        CanvasManager.setupCanvas(true);
        GameObjects.initStars();
        GameObjects.loadLevel(this.levels()[0]);

        const back = this.el('backToMenu');
        if (back) back.style.display = 'block';
        document.body.classList.add('agent-mode');
        this.el('agentLog').innerHTML = '';
        this.renderedLog = 0;

        AgentWallet.reset();
        AgentWallet.show();

        // Returning players go straight to a shift.
        this.stepIndex = 0;
        let seen = false;
        try { seen = localStorage.getItem(this.ONBOARDED_KEY) === '1'; } catch (e) { seen = false; }
        if (seen) {
            this.stepIndex = AgentOnboarding.STEPS.length - 1;   // the "your shift" card
            // They have connected before; the per-shift permission is still signed
            // every time, and that is the approval worth keeping.
            AgentWallet.connected = true;
            AgentWallet.paint();
        }
        this.enterStep();

        this.last = performance.now();
        // No loop of its own: the main game loop ticks this mode right after
        // it steps physics, so shift time and flight time can never drift.
    },

    exit: function () {
        this.active = false;
        this.paused = true;
        GameState.agentShiftMode = false;
        document.body.classList.remove('agent-mode');
        this.hide('agentCard');
        AgentWallet.hide();
    },

    levels: function () {
        return (typeof DEFAULT_LEVELS !== 'undefined' && DEFAULT_LEVELS.length)
            ? DEFAULT_LEVELS
            : (GameState.levelManager ? GameState.levelManager.getAllLevels() : []);
    },

    // --- overlays ---------------------------------------------------------
    show: function (id) { const e = this.el(id); if (e) e.style.display = 'flex'; },
    hide: function (id) { const e = this.el(id); if (e) e.style.display = 'none'; },

    showCard: function (card, onNext, withPolicy) {
        this.el('agentCardTitle').innerHTML = card.title;
        this.el('agentCardBody').innerHTML = card.body;
        this.el('agentCardBtn').textContent = card.button || 'Continue';
        this.el('agentPolicy').style.display = withPolicy ? 'block' : 'none';
        const dots = AgentOnboarding.STEPS.map((s, i) => i === this.stepIndex ? '●' : '○').join(' ');
        this.el('agentDots').textContent = this.freeMode ? '' : dots;
        this.show('agentCard');
        this.paused = true;
        // Cleared on use so a click on a hidden card cannot replay the last step.
        this.onCard = () => { this.hide('agentCard'); this.onCard = null; onNext(); };
    },

    banner: function (text) {
        const b = this.el('agentBanner');
        if (!b) return;
        b.textContent = text || '';
        b.style.opacity = text ? '1' : '0';
    },

    paintSliders: function () {
        const v = id => +this.el(id).value;
        this.el('agentPerTxVal').textContent = '$' + v('agentPerTx').toFixed(2);
        this.el('agentBudgetVal').textContent = '$' + v('agentBudget').toFixed(2);
        this.el('agentMaxPriceVal').textContent = '$' + v('agentMaxPrice').toFixed(2);
    },

    // --- onboarding steps -------------------------------------------------
    enterStep: function () {
        const step = AgentOnboarding.STEPS[this.stepIndex];
        if (!step) return;
        if (step.card) this.showCard(step.card, () => this.beginStep(step), step.id === 'free');
        else this.beginStep(step);
    },

    beginStep: function (step) {
        if (step.id === 'free') {
            this.freeMode = true;
            try { localStorage.setItem(this.ONBOARDED_KEY, '1'); } catch (e) { /* private mode */ }
            this.banner('');
            const policy = {
                perTx: +this.el('agentPerTx').value,
                shift: +this.el('agentBudget').value,
                maxPrice: +this.el('agentMaxPrice').value
            };
            // Every shift is a fresh permission — signing it is the moment the
            // player commits to the three numbers they just set.
            this.requestGrant(policy, { autoOption: true, duration: AgentShift.DURATION_S },
                () => this.startShift(policy),
                () => this.showFreeCard());
            return;
        }
        if (step.wallet) { this.walletStep(step); return; }
        if (!step.run) { this.stepIndex++; this.enterStep(); return; }

        this.banner(step.banner);
        AgentWallet.newSession();
        this.shift = AgentShift.create(Object.assign(
            { levels: this.levels(), seed: 4815162342 }, step.run.shift));
        this.showPolicySliders(this.shift.policy);
        this.el('agentLog').innerHTML = '';
        this.renderedLog = 0;

        if (step.run.grant) {
            // Nothing to watch until the permission is signed, so keep asking.
            const ask = () => this.requestGrant(this.shift.policy, { duration: this.shift.duration },
                () => { this.paused = false; }, ask);
            ask();
            return;
        }
        this.paused = false;
    },

    // The wallet-only steps of the onboarding: no shift runs, the player just
    // approves something.
    walletStep: function (step) {
        this.paused = true;
        AgentWallet.show();
        const data = AgentOnboarding.requests[step.wallet](AgentWallet, AgentShift);
        AgentWallet.request(data, {
            approve: () => {
                if (step.wallet === 'connect') { AgentWallet.connected = true; AgentWallet.paint(); }
                this.finishStep(step);
            },
            // Nothing to do in the trainer without a wallet — ask again.
            reject: () => this.walletStep(step)
        });
    },

    requestGrant: function (policy, opts, onOk, onCancel) {
        this.paused = true;
        AgentWallet.show();
        AgentWallet.request(AgentOnboarding.requests.grant(policy, opts), {
            approve: ctx => { AgentWallet.auto = ctx.auto; onOk(); },
            reject: () => { if (onCancel) onCancel(); }
        });
    },

    showFreeCard: function () {
        const step = AgentOnboarding.STEPS[AgentOnboarding.STEPS.length - 1];
        this.showCard(step.card, () => this.beginStep(step), true);
    },

    finishStep: function (step) {
        this.paused = true;
        this.banner('');
        this.stepIndex++;
        if (step.after) this.showCard(step.after, () => this.enterStep());
        else this.enterStep();
    },

    showPolicySliders: function (p) {
        this.el('agentPerTx').value = Math.min(p.perTx, 6);
        this.el('agentBudget').value = Math.min(p.shift, 20);
        this.el('agentMaxPrice').value = Math.min(p.maxPrice, 6);
        this.paintSliders();
    },

    startShift: function (policy) {
        AgentWallet.newSession();
        this.shift = AgentShift.create({ levels: this.levels(), seed: Date.now() % 100000, policy: policy });
        this.el('agentLog').innerHTML = '';
        this.renderedLog = 0;
        this.paused = false;
    },

    // --- the settlement shot ----------------------------------------------
    // The agent has committed to the payment. If the player has not delegated
    // yet, the wallet asks first — and the shift waits while they read.
    fire: function (task) {
        if (!AgentWallet.auto) {
            this.paused = true;
            const shift = this.shift;
            AgentWallet.request(AgentOnboarding.requests.payment(task, AgentShift), {
                approve: ctx => {
                    AgentWallet.auto = ctx.auto;
                    AgentShift.charge(shift, AgentWallet.ATTENTION_S, 'You approved the payment yourself');
                    this.paused = false;
                    this.doFire(task);
                },
                reject: () => {
                    AgentShift.revoke(shift);
                    this.paused = false;
                }
            });
            return;
        }
        this.doFire(task);
    },

    doFire: function (task) {
        AgentShift.commit(this.shift, task);
        AgentWallet.debit(task.service.price + AgentShift.GAS_PER_TX, task.service.name);
        GameObjects.loadLevel(task.level);
        // The player sprite bobs, and launchCoin adds that offset to the launch
        // point — so a shot fired mid-bob starts somewhere the solver never
        // simulated and can miss by a hair. Settle the sprite for the throw.
        GameState.player.floatOffset = 0;
        GameState.gameState = 'agent';
        GameState.coin = null;
        GameState.coinTrail = [];
        GameState.gatesPassed = 0;
        GameState.slippageCloudsPassed = 0;
        GameState.barrierHits = 0;

        const world = AgentSolver.buildWorld(task.level);
        const key = task.level.id + '@' + Math.round(world.W) + 'x' + Math.round(world.H);
        if (!this.solutionCache[key]) this.solutionCache[key] = AgentSolver.solve(world);
        const best = this.solutionCache[key];
        if (best.failed) { AgentShift.miss(this.shift); return; }

        const aim = AgentSolver.aimFor(world, best);
        GameState.aimStart = aim.aimStart;
        GameState.aimEnd = aim.aimEnd;
        GameFlow.launchCoin();
        GameState.gameState = 'agent';      // launchCoin sets 'flying'; keep input out
        GameState.aimStart = null;
        GameState.aimEnd = null;
    },

    // Called from GameFlow when the engine resolves the shot.
    onSettled: function () {
        if (this.shift) {
            const task = this.shift.current;
            AgentShift.settle(this.shift);
            if (task) AgentWallet.credit(task.reward, 'Task #' + task.id + ' settled');
        }
        GameState.coin = null;
        GameState.gameState = 'agent';
    },

    onMissed: function () {
        if (this.shift) AgentShift.miss(this.shift);
        GameState.coin = null;
        GameState.gameState = 'agent';
    },

    // --- the step-up the agent cannot clear -------------------------------
    // Raising a limit goes through the wallet, and the shift clock keeps
    // running while the player deals with it. That is deliberate.
    showOtp: function () {
        const shift = this.shift;
        this.otpCode = String(Math.floor(100000 + shift.random() * 900000));
        AgentWallet.request(AgentOnboarding.requests.otp(shift, this.otpCode), {
            approve: ctx => {
                if (ctx.otp !== this.otpCode) return false;
                AgentShift.applyOtp(shift, Math.ceil(shift.blocked.needed * 100) / 100);
                this.showPolicySliders(shift.policy);
            },
            reject: () => {
                const t = shift.blocked.task;
                shift.queue = shift.queue.filter(q => q.id !== t.id);
                AgentShift.say(shift, 'human', `Human declined to raise the limit — task #${t.id} dropped`);
                shift.blocked = null;
                shift.status = 'idle';
            }
        });
    },

    // --- loop -------------------------------------------------------------
    // Called once per frame from Game.gameLoop.
    tick: function (now) {
        if (!this.active) return;
        const t = now || performance.now();
        const dt = Math.min(Math.max((t - this.last) / 1000, 0), 0.1);
        this.last = t;

        if (this.shift && !this.paused) {
            const wasBlocked = this.shift.status === 'blocked';
            AgentShift.step(this.shift, dt, { fire: t => this.fire(t) });
            if (!wasBlocked && this.shift.status === 'blocked') this.showOtp();

            const step = AgentOnboarding.STEPS[this.stepIndex];
            if (!this.freeMode && step && step.run && step.run.until(this.shift)) this.finishStep(step);

            if (this.freeMode && this.shift.status === 'done') {
                this.paused = true;
                const d = AgentOnboarding.debrief(this.shift, AgentShift);
                this.showCard({ title: d.title, body: d.body, button: 'Run another shift' },
                    () => this.beginStep({ id: 'free' }), true);
            }
        }

        this.paintHud();
    },

    paintHud: function () {
        if (!this.shift) return;
        const s = this.shift;
        const set = (id, v) => { const e = this.el(id); if (e) e.textContent = v; };
        set('agentClock', Math.max(0, s.duration - s.clock).toFixed(0) + 's');
        set('agentEarned', '$' + s.earned.toFixed(2));
        set('agentSpent', '$' + s.spent.toFixed(2));
        set('agentGas', '$' + s.gasSpent.toFixed(3));
        set('agentMargin', s.earned ? (AgentShift.margin(s) * 100).toFixed(0) + '%' : '—');
        set('agentDone', s.completed);
        set('agentQueue', s.queue.length);

        const log = this.el('agentLog');
        if (!log) return;
        for (; this.renderedLog < s.log.length; this.renderedLog++) {
            const e = s.log[this.renderedLog];
            const p = document.createElement('p');
            p.className = 'agent-t-' + e.kind;
            p.textContent = e.at.toFixed(1) + 's  ' + e.text;
            log.appendChild(p);
            while (log.children.length > 40) log.removeChild(log.firstChild);
        }
        log.scrollTop = log.scrollHeight;
    }
};

if (typeof window !== 'undefined') window.AgentMode = AgentMode;
