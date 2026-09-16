// The reward claim, as the player sees it.
//
// A player who finishes the course can claim a USDC reward once. Three steps,
// each of which the server checks again on its own:
//
//   1. the wallet — connect it and sign a short message, which proves it is
//      theirs and costs nothing;
//   2. the X account — sign in through X, which must be Premium and at least
//      six months old;
//   3. the reward itself — we send the transaction and pay the gas, so the
//      player needs nothing on the wallet at all.
//
// The whole section stays hidden unless the pool is live and has money in it.
// An empty pool is said out loud rather than dressed up as an error: the
// player did their part and deserves to know why nothing is coming.

const ClaimManager = {
    claimId: null,
    walletMessage: null,
    wallet: null,
    xVerified: false,
    reward: null,
    pool: null,
    busy: false,
    listening: false,

    el: function (id) { return document.getElementById(id); },

    // --- opening ----------------------------------------------------------

    // Called when the completion screen appears. Silent about its own failures:
    // a missing reward is a disappointment, an error message about it is worse.
    show: async function () {
        const section = this.el('claimSection');
        if (!section) return;

        this.reset();
        section.style.display = 'none';

        if (!GameState.sessionId || !GameState.tournamentMode) return;

        const pool = await this.poolStatus();
        if (!pool) return;

        section.style.display = 'block';
        this.reward = pool.reward;
        this.pool = pool;
        this.renderPool();

        if (!pool.open) {
            // Honest, as promised: the pool is empty or paused, and no amount
            // of clicking will change that.
            this.setStage('closed');
            this.say(pool.remainingClaims === 0 ? t('claim.poolEmpty') : t('claim.paused'), 'warn');
            return;
        }

        const started = await this.post('/api/claim/start', { sessionId: GameState.sessionId });
        if (started.status !== 200 || !started.data || !started.data.claimId) {
            // A player who finished the course has earned an explanation. The
            // two refusals we can explain are said out loud, with the steps
            // left on screen and greyed; anything else means this run was never
            // eligible in the first place, and the section quietly goes away.
            if (started.data && started.data.quizNeeded) {
                this.setStage('closed');
                this.say(t('claim.quizNeeded', {
                    needed: started.data.quizNeeded,
                    correct: started.data.quizCorrect,
                }), 'warn');
                return;
            }
            if (started.data && started.data.reason === 'ip_limit') {
                // Shared connections are ordinary — an office, a campus, a phone
                // network. Saying so beats vanishing without a word.
                this.setStage('closed');
                this.say(t('claim.ipLimit'), 'warn');
                return;
            }
            section.style.display = 'none';
            return;
        }

        this.claimId = started.data.claimId;
        this.walletMessage = started.data.walletMessage;
        this.setStage('wallet');
        this.listen();
    },

    hide: function () {
        const section = this.el('claimSection');
        if (section) section.style.display = 'none';
        this.reset();
    },

    reset: function () {
        this.claimId = null;
        this.walletMessage = null;
        this.wallet = null;
        this.xVerified = false;
        this.busy = false;
        this.say('', null);
    },

    // The two lines above the steps: what is on offer and how much of it is left.
    renderPool: function () {
        const section = this.el('claimSection');
        if (!this.pool || !section || section.style.display === 'none') return;

        const headline = this.el('claimHeadline');
        if (headline) headline.textContent = t('claim.headline', { amount: this.pool.reward });

        const remaining = this.el('claimRemaining');
        if (remaining) {
            remaining.textContent = this.pool.open
                ? t('claim.remaining', { count: this.pool.remainingClaims })
                : '';
        }
    },

    poolStatus: async function () {
        try {
            const response = await fetch(GameConfig.BLOCKCHAIN.API_URL + '/api/claim/pool', { cache: 'no-store' });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;   // rewards are simply not on offer today
        }
    },

    // --- step 1: the wallet ------------------------------------------------

    proveWallet: async function () {
        if (this.busy || !this.claimId) return;
        this.busy = true;
        this.say(t('claim.walletWaiting'), null);

        try {
            if (!Web3Manager.isConnected() || !Web3Manager.signer) {
                await Web3Manager.connectWallet();
            }
            if (!Web3Manager.signer) throw new Error('no signer');

            const signature = await Web3Manager.signer.signMessage(this.walletMessage);
            const address = await Web3Manager.signer.getAddress();

            const sent = await this.post('/api/claim/wallet', {
                claimId: this.claimId, address, signature,
            });
            if (sent.status !== 200) return this.fail(sent.data);

            this.wallet = address;
            this.setStage('x');
            this.say('', null);
        } catch (error) {
            // A refused signature is a decision, not a fault: say so plainly.
            const rejected = error && (error.code === 'ACTION_REJECTED' || error.code === 4001);
            this.say(rejected ? t('claim.walletRejected') : t('claim.walletFailed'), 'warn');
        } finally {
            this.busy = false;
        }
    },

    // --- step 2: the X account ---------------------------------------------

    verifyX: async function () {
        if (this.busy || !this.claimId) return;
        this.busy = true;

        try {
            const started = await this.post('/api/claim/x/start', { claimId: this.claimId });
            if (started.status !== 200 || !started.data || !started.data.url) return this.fail(started.data);

            const popup = window.open(started.data.url, 'arcman-x', 'width=600,height=760');
            if (!popup) {
                this.say(t('claim.popupBlocked'), 'warn');
                return;
            }
            this.say(t('claim.xWaiting'), null);
            this.watchForX(popup);
        } catch (error) {
            this.say(t('claim.xFailed'), 'warn');
        } finally {
            this.busy = false;
        }
    },

    // The window X sends the player back to posts a message; the poll is there
    // for the cases it cannot, such as a window closed a moment too early.
    listen: function () {
        if (this.listening) return;
        this.listening = true;
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) return;
            const data = event.data;
            if (!data || typeof data !== 'object' || !data.arcmanClaim) return;
            if (data.arcmanClaim === 'ok') this.onXVerified();
            else this.say(this.xMessage(data.detail), 'warn');
        });
    },

    watchForX: function (popup) {
        const claimId = this.claimId;
        let tries = 0;
        const timer = setInterval(async () => {
            if (this.xVerified || this.claimId !== claimId || ++tries > 150) return clearInterval(timer);

            const status = await this.post('/api/claim/status', { claimId });
            if (status.status !== 200 || !status.data) return;
            if (status.data.xVerified) {
                clearInterval(timer);
                this.onXVerified(status.data.xHandle);
            } else if (status.data.error) {
                clearInterval(timer);
                this.say(this.xMessage(status.data.error), 'warn');
            } else if (popup && popup.closed && tries > 2) {
                clearInterval(timer);
                this.say(t('claim.xCancelled'), 'warn');
            }
        }, 2000);
    },

    onXVerified: function (handle) {
        if (this.xVerified) return;
        this.xVerified = true;
        this.setStage('send');
        this.say(handle ? t('claim.xVerifiedAs', { handle }) : t('claim.xVerified'), 'ok');
    },

    // --- step 3: the reward -------------------------------------------------

    send: async function () {
        if (this.busy || !this.claimId) return;
        this.busy = true;
        this.setStage('sending');
        this.say(t('claim.sending'), null);

        try {
            const sent = await this.post('/api/claim/submit', { claimId: this.claimId }, 90000);
            if (sent.status !== 200 || !sent.data || sent.data.status !== 'paid') return this.fail(sent.data);

            this.setStage('paid');
            this.say(t('claim.paid', { amount: this.reward }), 'ok');

            const link = this.el('claimTxLink');
            if (link && sent.data.txHash) {
                link.href = Web3Manager.getTransactionUrl(sent.data.txHash);
                link.textContent = t('claim.viewTransaction');
                link.style.display = 'inline-block';
            }
        } catch (error) {
            this.setStage('send');
            this.say(t('claim.sendFailed'), 'warn');
        } finally {
            this.busy = false;
        }
    },

    // --- saying what happened ------------------------------------------------

    // Every refusal the server can give, in words a player can act on.
    fail: function (data) {
        const reason = data && (data.reason || data.error);
        const messages = {
            wallet_claimed: 'claim.walletClaimed',
            identity_claimed: 'claim.xClaimed',
            already_claimed: 'claim.alreadyClaimed',
            ip_limit: 'claim.ipLimit',
            pool_empty: 'claim.poolEmpty',
            paused: 'claim.paused',
            need_wallet: 'claim.needWallet',
            need_x: 'claim.needX',
            send_failed: 'claim.sendFailed',
        };
        this.say(t(messages[reason] || 'claim.failed'), 'warn');
        if (reason === 'pool_empty' || reason === 'paused') this.setStage('closed');
    },

    xMessage: function (detail) {
        const messages = {
            not_premium: 'claim.xNotPremium',
            too_new: 'claim.xTooNew',
            age_unknown: 'claim.xAgeUnknown',
            identity_claimed: 'claim.xClaimed',
            declined: 'claim.xCancelled',
            unknown_claim: 'claim.expired',
        };
        return t(messages[detail] || 'claim.xFailed');
    },

    say: function (text, tone) {
        const status = this.el('claimStatus');
        if (!status) return;
        status.textContent = text || '';
        status.className = 'claim-status' + (tone ? ' claim-status-' + tone : '');
        status.style.display = text ? 'block' : 'none';
    },

    // Which step is live: the others are dimmed rather than hidden, so the
    // player can see what is still ahead of them.
    setStage: function (stage) {
        const steps = { wallet: 'claimStepWallet', x: 'claimStepX', send: 'claimStepSend' };
        const order = ['wallet', 'x', 'send'];
        const reached = order.indexOf(stage);

        order.forEach((name, index) => {
            const step = this.el(steps[name]);
            if (!step) return;
            const button = step.querySelector('button');
            const done = reached > index || stage === 'paid';
            const active = reached === index;
            step.classList.toggle('done', done);
            step.classList.toggle('active', active);
            // Only the stage decides: a step reached while a request is still
            // settling must not be left disabled. A second click is harmless —
            // every handler returns early while one is in flight.
            if (button) button.disabled = !active;
        });

        if (stage === 'sending') {
            const button = this.el('claimStepSend') && this.el('claimStepSend').querySelector('button');
            if (button) button.disabled = true;
        }
        if (stage === 'closed' || stage === 'paid') {
            order.forEach(name => {
                const step = this.el(steps[name]);
                const button = step && step.querySelector('button');
                if (button) button.disabled = true;
            });
        }
    },

    // Same helper the rest of the game posts through: it never throws, so a
    // server that is down turns into a message rather than a broken screen.
    post: function (path, body, timeoutMs) {
        return GameFlow.apiPost(path, body, timeoutMs);
    },

    setupListeners: function () {
        const buttons = {
            claimWalletButton: () => this.proveWallet(),
            claimXButton: () => this.verifyX(),
            claimSendButton: () => this.send(),
        };
        Object.entries(buttons).forEach(([id, handler]) => {
            const button = this.el(id);
            if (button) button.addEventListener('click', handler);
        });
    },
};

if (typeof window !== 'undefined') {
    window.ClaimManager = ClaimManager;
    document.addEventListener('DOMContentLoaded', () => {
        ClaimManager.setupListeners();
        // The headline and the count are written from JavaScript, so a language
        // change has to come back through here; the buttons carry data-i18n and
        // are handled by I18n.apply().
        if (typeof I18n !== 'undefined') I18n.onChange(() => ClaimManager.renderPool());
    });
}
