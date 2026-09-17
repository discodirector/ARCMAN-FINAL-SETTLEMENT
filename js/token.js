// The token address on the menu screen.
//
// Hidden entirely until GameConfig.TOKEN.launched is true, so this file does
// nothing at all before launch day.
//
// Two rules drive how it is drawn, and both come from how people actually lose
// money to a fake token:
//
//   1. The address is shown in full, all 42 characters, and is never
//      abbreviated. "0x54f8…7715" is exactly what an address-poisoning attack
//      defeats: an attacker grinds out an address matching the first and last
//      few characters, and a player comparing only the ends cannot tell them
//      apart. Comparing the middle is the whole defence, so the middle has to
//      be on screen.
//
//   2. A malformed address draws nothing. The checksum is verified first, and
//      if it fails the section stays hidden and the console says why. A
//      mistyped address that still looks plausible is worse than no address:
//      one sends money nowhere, the other sends it to a stranger.
//
// Copying is a button rather than an invitation to retype, since a retyped
// address is a chance to make a mistake that nobody will catch.

const TokenBar = {
    shown: false,

    // --- what we are allowed to show -------------------------------------

    /**
     * The token, if there is one worth showing. Null otherwise, and null is
     * the normal state before launch.
     */
    config: function () {
        const token = (typeof GameConfig !== 'undefined') && GameConfig.TOKEN;
        if (!token || !token.launched) return null;

        const address = (token.address || '').trim();
        if (!this.isValidAddress(address)) {
            // Worth saying out loud: someone set `launched` and then mistyped
            // the address, and the silence would otherwise look like the flag
            // not working.
            console.warn('TOKEN.launched is set but the address is not a valid checksummed address; showing nothing.');
            return null;
        }

        return { ...token, address };
    },

    /**
     * An address must be well-formed *and* pass its EIP-55 checksum. Mixed
     * case is what carries the checksum; an all-lowercase address has none to
     * check, which is legal and common, so it is allowed through.
     */
    isValidAddress: function (address) {
        if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;
        if (typeof ethers === 'undefined' || !ethers.getAddress) return true;
        try {
            ethers.getAddress(address);   // throws on a bad checksum
            return true;
        } catch (error) {
            return false;
        }
    },

    // --- drawing ----------------------------------------------------------

    show: function () {
        const section = document.getElementById('tokenBar');
        if (!section) return;

        const token = this.config();
        if (!token) {
            section.style.display = 'none';
            this.shown = false;
            return;
        }

        const address = document.getElementById('tokenAddress');
        if (address) address.textContent = token.address;

        const label = document.getElementById('tokenLabel');
        if (label) {
            label.textContent = token.symbol
                ? t('token.labelNamed', { symbol: token.symbol })
                : t('token.label');
        }

        this.link('tokenExplorerLink', this.explorerUrl(token), t('token.explorer'));
        this.link('tokenTradeLink', token.tradeUrl, t('token.trade'));
        this.link('tokenVerifyLink', token.verifyUrl, t('token.verify'));

        const warning = document.getElementById('tokenWarning');
        if (warning) warning.textContent = t('token.warning');

        section.style.display = 'block';
        this.shown = true;
    },

    // A link with nothing to point at is removed rather than left dead.
    link: function (id, url, text) {
        const element = document.getElementById(id);
        if (!element) return;
        if (!url) {
            element.style.display = 'none';
            return;
        }
        element.href = url;
        element.textContent = text;
        element.style.display = 'inline-block';
    },

    explorerUrl: function (token) {
        const network = token.network || GameConfig.BLOCKCHAIN.NETWORK;
        const base = network === 'ArcMainnet'
            ? 'https://explorer.arc.io'
            : 'https://explorer.testnet.arc.io';
        return `${base}/token/${token.address}`;
    },

    // --- copying ----------------------------------------------------------

    copy: async function () {
        const token = this.config();
        if (!token) return;

        const button = document.getElementById('tokenCopyButton');
        const say = (key, tone) => {
            if (!button) return;
            button.textContent = t(key);
            button.classList.toggle('copied', tone === 'ok');
            setTimeout(() => {
                button.textContent = t('token.copy');
                button.classList.remove('copied');
            }, 2000);
        };

        try {
            await navigator.clipboard.writeText(token.address);
            say('token.copied', 'ok');
        } catch (error) {
            // Clipboard access needs a secure context and can be refused
            // outright. Selecting the address at least leaves the player one
            // keystroke from copying it themselves.
            if (this.selectAddress()) say('token.copyManually');
            else say('token.copyFailed');
        }
    },

    selectAddress: function () {
        const address = document.getElementById('tokenAddress');
        if (!address || !window.getSelection || !document.createRange) return false;
        try {
            const range = document.createRange();
            range.selectNodeContents(address);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            return true;
        } catch (error) {
            return false;
        }
    },

    setupListeners: function () {
        const button = document.getElementById('tokenCopyButton');
        if (button) button.addEventListener('click', () => this.copy());
    },
};

if (typeof window !== 'undefined') {
    window.TokenBar = TokenBar;
    document.addEventListener('DOMContentLoaded', () => {
        TokenBar.setupListeners();
        TokenBar.show();
        // The label and the link text are written from JavaScript, so a
        // language change has to come back through here.
        if (typeof I18n !== 'undefined') I18n.onChange(() => TokenBar.show());
    });
}
