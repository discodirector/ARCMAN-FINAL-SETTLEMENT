// Transactions we pay for.
//
// The game sends two kinds on the player's behalf, a reward and a score, and
// both go out from the same wallet. That is the whole reason this is a module
// rather than a few lines inside each service: two transactions built at the
// same moment would be handed the same nonce, and one of them would be thrown
// away without a word. So every send goes through one queue per wallet, no
// matter who asked.
//
// Waiting behind another transaction costs a few seconds, and both kinds are
// far too rare for that to matter.

const { ethers } = require('ethers');

// Arc silently drops anything below a 20 Gwei base fee. No error, no receipt,
// the transaction simply never appears. We never bid below 25.
const MIN_GAS_PRICE = 25_000_000_000n;

const relays = new Map();   // lower-case address -> relay

/**
 * The relay for this key, shared with anyone else who asks for the same one.
 *
 * @param {object} options
 * @param {ethers.Provider} options.provider
 * @param {string} options.key  the relayer's private key
 */
function sharedRelay({ provider, key }) {
    const wallet = new ethers.Wallet(key, provider);
    const id = wallet.address.toLowerCase();

    const existing = relays.get(id);
    if (existing) return existing;

    let queue = Promise.resolve();

    /**
     * Build and send one transaction, once the wallet is free.
     *
     * @param {(context: {wallet: ethers.Wallet, gasPrice: bigint, nonce: number}) => Promise<any>} build
     *        Do the sending *and* the waiting inside here: the next transaction
     *        must not pick its nonce until this one is in a block.
     */
    const send = (build) => {
        const run = async () => {
            const fees = await provider.getFeeData();
            const gasPrice = fees.gasPrice && fees.gasPrice > MIN_GAS_PRICE ? fees.gasPrice : MIN_GAS_PRICE;
            // Asked for explicitly: a node that reports the pending count late
            // would otherwise hand out a nonce that is already spent.
            const nonce = await provider.getTransactionCount(wallet.address, 'latest');
            return build({ wallet, gasPrice, nonce });
        };

        const result = queue.then(run, run);
        queue = result.then(() => undefined, () => undefined);
        return result;
    };

    const relay = { wallet, address: wallet.address, send };
    relays.set(id, relay);
    return relay;
}

module.exports = { sharedRelay, MIN_GAS_PRICE };
