// Scores on the chain, and the ranking built back out of them.
//
// Two jobs, both consequences of the same decision: on Arc the gas is USDC, and
// a player who has just finished their first run has none.
//
//   1. We send the transaction. The server has already signed the score; the
//      contract checks that signature and does not care who pays. A player
//      needs a wallet and nothing in it.
//   2. We keep the ranking. The contract no longer sorts a hundred players in
//      storage — that cost ten times the price of the score itself — so the
//      order is worked out here, by reading what the contract announced.
//
// The ranking is rebuilt from the chain, never from our own database: if this
// server is wiped, the leaderboard comes back. What is cached is only a copy.
//
// Without configuration every endpoint answers 503 and the game falls back to
// showing nothing. The rest of the backend is unaffected.

const { ethers } = require('ethers');
const { sharedRelay } = require('./relay.js');

const SCORE_ABI = [
    'function finalizeScore((address player, uint256 score, uint256 levelId, uint256 nonce, string gameMode) scoreData, bytes signature)',
    'function getPlayerScore(address player, string gameMode) view returns (uint256 bestScore, uint256 levelId, uint256 timestamp)',
    'function serverSigner() view returns (address)',
    'event NewBestScore(address indexed player, uint256 score, uint256 levelId, string gameMode, uint256 timestamp)',
];

// How long a cached ranking is served before the chain is read again, and how
// many blocks are asked for at a time — public nodes refuse very wide ranges.
const RANKING_TTL_MS = 60 * 1000;
const LOG_WINDOW = 9_000;

function readConfig(env) {
    const required = {
        contractAddress: env.SCORE_CONTRACT_ADDRESS,
        rpcUrl: env.ARC_RPC_URL,
        relayerKey: env.RELAYER_KEY,
    };
    const missing = Object.entries(required).filter(([, value]) => !value).map(([name]) => name);
    return {
        ...required,
        missing,
        // The block the contract was deployed in. Reading from zero works but
        // wastes a great many requests once the chain is old.
        firstBlock: Number(env.SCORE_FIRST_BLOCK || 0),
    };
}

/**
 * Ask for one range of logs, narrowing the window until the node accepts it.
 *
 * Public nodes disagree about how much history they will hand over at once, and
 * say so only by refusing. Halving and retrying finds their limit without us
 * having to know it.
 */
async function logsBetween(contract, from, to, log) {
    let window = to - from + 1;
    const found = [];
    let at = from;

    while (at <= to) {
        const end = Math.min(at + window - 1, to);
        try {
            found.push(...await contract.queryFilter(contract.filters.NewBestScore(), at, end));
            at = end + 1;
        } catch (error) {
            if (window <= 200) throw error;
            window = Math.floor(window / 4);
            log.log(`Node refused ${end - at + 1} blocks of history; trying ${window}`);
        }
    }
    return found;
}

/**
 * Keeps every player's best score, read from the chain and kept up to date.
 *
 * NewBestScore is only emitted when a player beats their own record, so the
 * last one for a player is their best — there is nothing to compare, only the
 * latest to keep. That is also why this can read forward from where it left
 * off instead of walking the whole chain again.
 */
function createRanking(contract, provider, config, log) {
    const best = new Map();          // "player:mode" -> row
    let scannedTo = config.firstBlock - 1;

    return {
        get rows() { return [...best.values()]; },
        get scannedTo() { return scannedTo; },

        async refresh() {
            const latest = await provider.getBlockNumber();
            if (latest <= scannedTo) return;

            for (let from = scannedTo + 1; from <= latest; from += LOG_WINDOW) {
                const to = Math.min(from + LOG_WINDOW - 1, latest);
                for (const entry of await logsBetween(contract, from, to, log)) {
                    const { player, score, levelId, gameMode, timestamp } = entry.args;
                    best.set(`${player.toLowerCase()}:${gameMode}`, {
                        player,
                        score: score.toString(),
                        levelId: Number(levelId),
                        gameMode,
                        timestamp: Number(timestamp),
                    });
                }
                scannedTo = to;
            }
            log.log(`Ranking up to block ${scannedTo}: ${best.size} entries`);
        },
    };
}

function registerScoreRoutes(app, options) {
    const { sessions, getIp, signScore, log = console } = options;
    const config = readConfig(process.env);

    if (config.missing.length) {
        log.error(`SCOREBOARD UNAVAILABLE — missing ${config.missing.join(', ')}`);
        app.use('/api/leaderboard', (req, res) => res.status(503).json({ error: 'Leaderboard unavailable' }));
        return { isReady: () => false };
    }

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const contract = new ethers.Contract(config.contractAddress, SCORE_ABI, provider);
    const relay = sharedRelay({ provider, key: config.relayerKey });

    log.log(`Scores ready: contract ${config.contractAddress}, relayer ${relay.address}`);

    const ranking = createRanking(contract, provider, config, log);
    let freshAt = 0;
    let reading = null;

    async function rows() {
        if (freshAt && Date.now() - freshAt < RANKING_TTL_MS) return ranking.rows;
        // One read at a time: a burst of visitors must not each start their own
        // walk over the chain.
        if (!reading) {
            reading = ranking.refresh()
                .then(() => { freshAt = Date.now(); })
                .finally(() => { reading = null; });
        }
        try {
            await reading;
        } catch (error) {
            log.error('Ranking read failed:', error.message);
            // What we already have beats nothing; only a cold start can fail.
            if (!freshAt) throw error;
        }
        return ranking.rows;
    }

    // --- the ranking ------------------------------------------------------

    app.get('/api/leaderboard', async (req, res) => {
        try {
            const gameMode = String(req.query.gameMode || 'Tournament');
            const count = Math.min(Math.max(Number(req.query.count) || 100, 1), 500);

            const board = (await rows())
                .filter(row => row.gameMode === gameMode)
                .sort((a, b) => (BigInt(b.score) > BigInt(a.score) ? 1 : BigInt(b.score) < BigInt(a.score) ? -1 : a.timestamp - b.timestamp))
                .slice(0, count);

            res.json({
                gameMode,
                players: board.map(row => row.player),
                scores: board.map(row => row.score),
                updatedAt: freshAt,
            });
        } catch (error) {
            res.status(503).json({ error: 'Leaderboard unavailable' });
        }
    });

    // --- sending a score --------------------------------------------------

    /**
     * Put a finished run on the chain at our expense.
     *
     * The caller has already signed the score; this only pays for it. Errors
     * are returned rather than thrown, so the caller can tell the player what
     * happened without the run being lost.
     */
    async function submit({ scoreData, signature }) {
        const receipt = await relay.send(async ({ wallet, gasPrice, nonce }) => {
            const tx = await contract.connect(wallet).finalizeScore(scoreData, signature, { gasPrice, nonce });
            log.log(`Score for ${scoreData.player}: sent ${tx.hash}`);
            return tx.wait();
        });
        // The chain has moved; read it again on the next request rather than
        // guessing what changed.
        freshAt = 0;
        return receipt;
    }

    return {
        isReady: () => true,
        submit,
        contractAddress: config.contractAddress,
        relayerAddress: relay.address,
    };
}

module.exports = { registerScoreRoutes };
