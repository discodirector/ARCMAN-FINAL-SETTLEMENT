// Arc Agent Wallet — a simulation, and only a simulation.
//
// No keys, no network, no funds. It exists so the player feels the shape of
// the real thing: a wallet asks before it is connected, asks before it grants
// an allowance, and asks again the moment something falls outside that
// allowance. Those three prompts are the lesson; the balance is scenery.
//
// The page owns the markup (#agentWallet). This file owns the state and the
// request queue. AgentMode decides when to ask.

const AgentWallet = {
    START_BALANCE: 25,
    ADDRESS: '0xA9C74f0B21D8e3C6a5F17b9042Dc8E5137Be3E10',
    NETWORK: 'Arc Sepolia · testnet',
    ATTENTION_S: 1.5,           // what one manual approval costs the shift

    balance: 25,
    connected: false,
    auto: false,                // approvals inside the permission stop asking
    txs: [],
    pending: null,
    nonce: 0,

    el: function (id) { return document.getElementById(id); },

    init: function () {
        const ok = this.el('awApprove');
        if (ok) ok.addEventListener('click', () => this.approve());
        const no = this.el('awReject');
        if (no) no.addEventListener('click', () => this.reject());
        const inp = this.el('awOtpInput');
        if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') this.approve(); });
    },

    short: function () { return this.ADDRESS.slice(0, 6) + '…' + this.ADDRESS.slice(-4); },

    // Cosmetic stand-in for a transaction hash. Counter-based, so a replayed
    // shift shows the same list — nothing in the game depends on it.
    hash: function () {
        this.nonce++;
        let x = (this.nonce * 2654435761) >>> 0;
        let h = '';
        for (let i = 0; i < 5; i++) {
            x = (x * 1664525 + 1013904223) >>> 0;
            h += ('0000000' + x.toString(16)).slice(-8);
        }
        return '0x' + h.slice(0, 6) + '…' + h.slice(-4);
    },

    reset: function () {
        this.balance = this.START_BALANCE;
        this.connected = false;
        this.auto = false;
        this.txs = [];
        this.pending = null;
        this.nonce = 0;
        this.hideRequest();
        this.paint();
    },

    // Each shift is funded the same way, so two shifts can be compared.
    newSession: function () {
        this.balance = this.START_BALANCE;
        this.txs = [];
        this.paint();
    },

    show: function () { const p = this.el('agentWallet'); if (p) p.style.display = 'block'; },
    hide: function () {
        const p = this.el('agentWallet');
        if (p) { p.style.display = 'none'; p.classList.remove('aw-asking'); }
        this.pending = null;
    },

    // --- money ------------------------------------------------------------
    debit: function (amount, label) {
        this.balance -= amount;
        this.txs.unshift({ label: label, amount: -amount, hash: this.hash() });
        if (this.txs.length > 12) this.txs.pop();
        this.paint();
    },

    credit: function (amount, label) {
        this.balance += amount;
        this.txs.unshift({ label: label, amount: amount, hash: this.hash() });
        if (this.txs.length > 12) this.txs.pop();
        this.paint();
    },

    // --- requests ---------------------------------------------------------
    // data: { title, sub, rows: [[label, value]], approve, reject, warn,
    //         code, autoOption, autoLabel }
    // handlers: { approve(ctx), reject() }  — approve may return false to
    // keep the sheet open (a wrong code does exactly that).
    request: function (data, handlers) {
        this.pending = { data: data, handlers: handlers };
        this.show();

        this.el('awTitle').textContent = data.title || '';
        this.el('awSub').innerHTML = data.sub || '';
        this.el('awRows').innerHTML = (data.rows || [])
            .map(r => `<div class="aw-row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
        this.el('awWarn').innerHTML = data.warn || '';
        this.el('awApprove').textContent = data.approve || 'Approve';

        const rejectBtn = this.el('awReject');
        rejectBtn.textContent = data.reject || 'Reject';
        rejectBtn.style.display = data.reject === false ? 'none' : '';

        const otp = this.el('awOtpWrap');
        if (data.code) {
            this.el('awCode').textContent = data.code;
            const inp = this.el('awOtpInput');
            inp.value = '';
            inp.style.borderColor = '#0ff';
            otp.style.display = 'block';
        } else {
            otp.style.display = 'none';
        }

        const autoWrap = this.el('awAutoWrap');
        if (data.autoOption) {
            this.el('awAutoLabel').textContent = data.autoLabel || 'Do not ask again';
            this.el('awAuto').checked = true;
            autoWrap.style.display = 'block';
        } else {
            autoWrap.style.display = 'none';
        }

        this.el('awReq').style.display = 'block';
        this.el('agentWallet').classList.add('aw-asking');
        if (data.code) { const i = this.el('awOtpInput'); if (i) i.focus(); }
    },

    hideRequest: function () {
        const req = this.el('awReq');
        if (req) req.style.display = 'none';
        const p = this.el('agentWallet');
        if (p) p.classList.remove('aw-asking');
    },

    approve: function () {
        const p = this.pending;
        if (!p) return;
        const ctx = {
            auto: p.data.autoOption ? this.el('awAuto').checked : this.auto,
            otp: (this.el('awOtpInput').value || '').trim()
        };
        if (p.handlers && p.handlers.approve && p.handlers.approve(ctx) === false) {
            this.el('awOtpInput').style.borderColor = '#f44';
            return;
        }
        // The handler may have opened the next request already — do not close it.
        if (this.pending === p) { this.pending = null; this.hideRequest(); }
    },

    reject: function () {
        const p = this.pending;
        if (!p) return;
        this.pending = null;
        this.hideRequest();
        if (p.handlers && p.handlers.reject) p.handlers.reject();
    },

    // --- painting ---------------------------------------------------------
    paint: function () {
        const bal = this.el('awBalance');
        if (!bal) return;
        bal.textContent = this.connected ? this.balance.toFixed(3) : '——.———';
        this.el('awAddress').textContent = this.connected ? this.short() : 'not connected';
        this.el('awNet').textContent = this.NETWORK;

        const acts = this.el('awActs');
        if (!acts) return;
        acts.innerHTML = this.txs.slice(0, 6).map(t => {
            const cls = t.amount < 0 ? 'aw-out' : 'aw-in';
            const sign = t.amount < 0 ? '−' : '+';
            return `<div class="aw-act"><span>${t.label}</span>`
                + `<b class="${cls}">${sign}$${Math.abs(t.amount).toFixed(3)}</b>`
                + `<i>${t.hash}</i></div>`;
        }).join('');
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AgentWallet };
}
if (typeof window !== 'undefined') {
    window.AgentWallet = AgentWallet;
}
