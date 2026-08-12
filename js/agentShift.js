// Agent Shift — the player sets a policy, the agent works the shift.
//
// The player does not aim here. They configure spending limits, start the
// shift, and watch. When the agent hits a limit it stops and logs why —
// it never works around its own policy. Getting unstuck costs the player
// time, which is the point: deciding up front is cheaper than intervening.
//
// Pure logic. Rendering and input live in the page that drives it.
// Requires AgentSolver (js/agent.js) for aiming.

const AgentShift = {
    // Every number here has a public source — see the constants registry.
    GAS_PER_TX: 0.005,          // arc.io, weekly average transaction cost
    DEFAULT_POLICY: {           // Circle's recommended starting limits
        perTx: 1.00,
        shift: 5.00,
        maxPrice: 0.30          // the discovery filter: what the agent will shop for
    },

    // Real prices from the Circle Agent Marketplace. Each specialist covers
    // one category; Voice Briefing is the premium generalist that can cover
    // anything. Specialists go offline for stretches — "a service stays
    // discoverable only while reachable" — and when the specialist for a job
    // is down, the only thing left is the $5.553 one. That is what makes a
    // loose price criterion cost real money instead of being free.
    SERVICES: [
        { id: 'ai-research',     name: 'AI Research',      covers: ['WEB_SEARCH_RESEARCH'], price: 0.022, downRate: 0.30 },
        { id: 'crypto-analysis', name: 'Crypto Analysis',  covers: ['FINANCIAL_ANALYSIS'],  price: 0.041, downRate: 0.30 },
        { id: 'social',          name: 'Social Analytics', covers: ['SOCIAL_INTELLIGENCE'], price: 0.051, downRate: 0.30 },
        { id: 'meeting-prep',    name: 'Meeting Prep',     covers: ['INFRASTRUCTURE'],      price: 0.102, downRate: 0.25 },
        { id: 'domain-search',   name: 'Domain Search',    covers: ['INFRASTRUCTURE'],      price: 0.301, downRate: 0.15 },
        { id: 'voice-briefing',  name: 'Voice Briefing',   covers: ['*'],                   price: 5.553, downRate: 0.00 }
    ],

    OUTAGE_SLOT_S: 2.5,         // how long a service stays down once it drops

    DURATION_S: 60,
    TASK_EVERY_S: 3.6,     // paced to the settlement animation, not faster than the agent can work
    DEADLINE_S: 14,             // a task expires if it waits this long
    OTP_COST_S: 5,              // the human is not free

    // --- deterministic RNG so a shift can be replayed from a seed ---
    rng: function (seed) {
        let a = seed >>> 0;
        return function () {
            a = (a + 0x6D2B79F5) >>> 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    },

    create: function (opts) {
        opts = opts || {};
        const random = this.rng(opts.seed || 4815162342);
        const policy = Object.assign({}, this.DEFAULT_POLICY, opts.policy);

        return {
            random: random,
            policy: policy,
            outages: this.buildOutages(this.rng((opts.seed || 4815162342) ^ 0x9E3779B9)),
            levels: opts.levels || [],
            // Tutorial hooks: a fixed task list instead of random arrivals,
            // a shorter clock, no deadlines, and services forced up or down
            // so a lesson can be staged reliably.
            script: opts.script ? opts.script.slice() : null,
            duration: opts.duration || this.DURATION_S,
            noExpire: !!opts.noExpire,
            availability: opts.availability || null,
            clock: 0,               // seconds since shift start
            nextTaskAt: 0,
            nextSearchAt: 0,
            taskCounter: 0,
            queue: [],
            current: null,
            status: 'idle',         // idle | searching | settling | blocked | done
            blocked: null,          // { task, reason, needed }
            otpUntil: null,         // set while the human is in the loop
            spent: 0,
            gasSpent: 0,
            earned: 0,
            completed: 0,
            expired: 0,
            stops: 0,
            log: []
        };
    },

    say: function (shift, kind, text) {
        shift.log.push({ at: shift.clock, kind: kind, text: text });
        if (shift.log.length > 200) shift.log.shift();
    },

    // A task is one job the agent is paid to complete: find a service that
    // can do it, pay for it, then settle onchain (that settlement is the shot).
    //
    // The task names the cheapest tier that can do the job, not a specific
    // service. What the agent actually buys is its own decision, and that is
    // where the player's criterion shows up in the margin.
    spawnTask: function (shift) {
        const specialists = this.SERVICES.filter(s => s.covers[0] !== '*');
        let pick;
        if (shift.script) {
            if (!shift.script.length) return null;          // scripted run is out of work
            const entry = shift.script.shift();
            pick = specialists.filter(s => s.covers[0] === entry.category)[0] || specialists[0];
        } else {
            pick = specialists[Math.floor(shift.random() * specialists.length)];
        }

        shift.taskCounter++;
        const task = {
            id: shift.taskCounter,
            category: pick.covers[0],
            // What the client pays, tied to the job — not to what the agent
            // decides to spend on it.
            reward: +(pick.price * 3 + 0.04).toFixed(3),
            arrivedAt: shift.clock,
            expiresAt: shift.clock + this.DEADLINE_S,
            level: shift.levels[(shift.taskCounter - 1) % shift.levels.length]
        };
        shift.queue.push(task);
        this.say(shift, 'task', `Task #${task.id} — needs ${task.category}, pays $${task.reward.toFixed(3)}`);
        return task;
    },

    // Outages are stretches, not coin flips per request: a service that is
    // down stays down for a while, which is when the fallback actually bites.
    buildOutages: function (random) {
        const slots = Math.ceil(this.DURATION_S / this.OUTAGE_SLOT_S) + 2;
        const map = {};
        this.SERVICES.forEach(s => {
            map[s.id] = [];
            for (let i = 0; i < slots; i++) map[s.id].push(random() < s.downRate);
        });
        return map;
    },

    isUp: function (shift, service) {
        if (shift.availability && shift.availability[service.id] !== undefined) {
            return shift.availability[service.id];
        }
        const slot = Math.floor(shift.clock / this.OUTAGE_SLOT_S);
        return !shift.outages[service.id][slot];
    },

    // Discovery: cheapest service that can do this job, is answering right
    // now, and is under the player's price criterion.
    findService: function (shift, task) {
        const candidates = this.SERVICES
            .filter(s => s.covers[0] === '*' || s.covers.indexOf(task.category) !== -1)
            .filter(s => s.price <= shift.policy.maxPrice)
            .sort((a, b) => a.price - b.price);
        for (const s of candidates) {
            if (this.isUp(shift, s)) return s;
        }
        return null;
    },

    // Cheapest service that could have done this job, ignoring availability —
    // the yardstick for calling out an overpay.
    fairPrice: function (task) {
        const s = this.SERVICES.filter(s => s.covers.indexOf(task.category) !== -1)
            .sort((a, b) => a.price - b.price)[0];
        return s ? s.price : 0;
    },

    // Policy is enforced BEFORE the payment goes out. The agent cannot
    // raise its own limits, and it does not retry around them.
    checkPolicy: function (shift, service) {
        const cost = service.price + this.GAS_PER_TX;
        if (cost > shift.policy.perTx) {
            return { ok: false, reason: 'per_tx_limit', needed: cost };
        }
        if (shift.spent + cost > shift.policy.shift) {
            return { ok: false, reason: 'shift_budget', needed: shift.spent + cost };
        }
        return { ok: true, cost: cost };
    },

    // Raising a limit requires the human. In the real CLI this is an emailed
    // OTP that the agent must never receive; here the player types it in.
    applyOtp: function (shift, newPerTx) {
        shift.policy.perTx = newPerTx;
        shift.otpUntil = shift.clock + this.OTP_COST_S;
        shift.blocked = null;
        shift.status = 'idle';
        this.say(shift, 'human', `Human raised per-transaction limit to $${newPerTx.toFixed(2)} — ${this.OTP_COST_S}s of the shift gone`);
    },

    // The human read a prompt. The shift did not wait for them.
    charge: function (shift, seconds, why) {
        shift.clock += seconds;
        this.say(shift, 'human', `${why} — ${seconds}s of the shift gone`);
    },

    // The human rejected the payment at the wallet: nothing left the account,
    // and the job goes back on the board with the money untouched.
    revoke: function (shift) {
        const task = shift.current;
        if (!task) return;
        shift.current = null;
        shift.status = 'idle';
        shift.queue.push(task);
        shift.nextSearchAt = shift.clock + 3;   // do not re-ask on the next poll
        this.say(shift, 'human', `Payment for task #${task.id} rejected — nothing left the wallet`);
    },

    expireStale: function (shift) {
        for (let i = shift.queue.length - 1; i >= 0; i--) {
            if (shift.clock > shift.queue[i].expiresAt) {
                const t = shift.queue.splice(i, 1)[0];
                shift.expired++;
                this.say(shift, 'expired', `Task #${t.id} expired — nobody picked it up in time`);
            }
        }
    },

    margin: function (shift) {
        if (shift.earned <= 0) return 0;
        return (shift.earned - shift.spent) / shift.earned;
    },

    // One step of the shift. `dt` is seconds since the previous step.
    // `hooks.fire(task)` is called when the agent commits to a payment and
    // needs the settlement shot taken; the page reports the outcome back
    // through settle()/miss().
    step: function (shift, dt, hooks) {
        if (shift.status === 'done') return;

        shift.clock += dt;
        if (shift.clock >= shift.duration && shift.status !== 'settling') {
            shift.status = 'done';
            this.say(shift, 'end', `Shift over — ${shift.completed} done, margin ${(this.margin(shift) * 100).toFixed(1)}%`);
            return;
        }

        while (shift.clock >= shift.nextTaskAt) {
            if (this.spawnTask(shift) === null) { shift.nextTaskAt = Infinity; break; }
            shift.nextTaskAt += this.TASK_EVERY_S;
        }
        if (!shift.noExpire) this.expireStale(shift);

        // The human is dealing with the OTP — the agent waits.
        if (shift.otpUntil !== null) {
            if (shift.clock < shift.otpUntil) return;
            shift.otpUntil = null;
        }

        if (shift.status === 'blocked' || shift.status === 'settling') return;
        if (!shift.queue.length) { shift.status = 'idle'; return; }

        // Discovery is paced — the agent polls the marketplace, it does not
        // spin on it.
        if (shift.clock < shift.nextSearchAt) return;
        shift.nextSearchAt = shift.clock + 0.4;

        const task = shift.queue[0];
        const service = this.findService(shift, task);
        if (!service) {
            shift.status = 'searching';
            if (task.searchNote === undefined || shift.clock - task.searchNote > 2.5) {
                task.searchNote = shift.clock;
                this.say(shift, 'search', `Nothing under $${shift.policy.maxPrice.toFixed(2)} answering for task #${task.id}`);
            }
            return;
        }

        const verdict = this.checkPolicy(shift, service);
        if (!verdict.ok) {
            shift.status = 'blocked';
            shift.stops++;
            shift.blocked = { task: task, service: service, reason: verdict.reason, needed: verdict.needed };
            const why = verdict.reason === 'per_tx_limit'
                ? `${service.name} costs $${(service.price + this.GAS_PER_TX).toFixed(3)}, over the $${shift.policy.perTx.toFixed(2)} per-transaction limit`
                : `would take the shift past its $${shift.policy.shift.toFixed(2)} budget`;
            this.say(shift, 'blocked', `STOPPED on task #${task.id}: ${why}`);
            return;
        }

        // The agent has chosen. Nothing has left the account yet — the page
        // takes it from here and calls commit() when the payment goes out.
        shift.queue.shift();
        task.service = service;
        shift.current = task;
        shift.status = 'settling';
        if (hooks && hooks.fire) hooks.fire(task);
    },

    // The payment goes out: straight away when the human has delegated it,
    // or after they approve it at the wallet.
    commit: function (shift, task) {
        shift.spent += task.service.price + this.GAS_PER_TX;
        shift.gasSpent += this.GAS_PER_TX;
        const fair = this.fairPrice(task);
        const overpay = task.service.price > fair
            ? ` — a $${fair.toFixed(3)} service would have done, but it is offline` : '';
        this.say(shift, 'pay', `Paid $${task.service.price.toFixed(3)} for ${task.service.name} `
            + `+ $${this.GAS_PER_TX} gas${overpay}`);
    },

    // The settlement landed.
    settle: function (shift) {
        const task = shift.current;
        if (!task) return;
        shift.earned += task.reward;
        shift.completed++;
        shift.current = null;
        shift.status = 'idle';
        this.say(shift, 'done', `Task #${task.id} settled — +$${task.reward.toFixed(3)}`);
    },

    // The settlement did not land. The money is already spent — that is the
    // whole reason the policy is set before the shift rather than during it.
    miss: function (shift) {
        const task = shift.current;
        if (!task) return;
        shift.current = null;
        shift.status = 'idle';
        this.say(shift, 'miss', `Task #${task.id} — settlement missed, $${(task.service.price + this.GAS_PER_TX).toFixed(3)} spent for nothing`);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AgentShift };
}
if (typeof window !== 'undefined') {
    window.AgentShift = AgentShift;
}
