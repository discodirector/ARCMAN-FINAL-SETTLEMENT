// Reward claims.
//
// A player who finishes the course can claim a fixed USDC reward, once. This
// module is the part that decides whether they may, and the contract in
// chain/contracts/rewardPool.sol enforces what a server must not be trusted
// with.
//
// A claim passes four gates, in this order:
//
//   1. the course was actually finished — every level completed in one
//      anti-cheat session, no faster than the session rules allow;
//   2. the wallet belongs to the player — they sign a one-off message with it;
//   3. the X account is real — signed in through X, must be Premium and at
//      least six months old;
//   4. neither the wallet nor the X account has claimed before.
//
// Only then does the server sign an EIP-712 claim and relay the transaction
// itself, so the player needs no gas.
//
// What is stored: a ledger of claims in private/claims.json, holding the
// wallet, a salted hash of the X account id, the IP and the transaction. The X
// account id itself is never written down and never reaches the chain — the
// salt lives in the environment, so even a leaked ledger does not reveal which
// accounts took part.
//
// Without configuration (no pool address, no keys, no X app) every endpoint
// answers 503 and the game hides the reward. The rest of the backend is
// unaffected.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { ethers } = require('ethers');
const { sharedRelay } = require('./relay.js');

const ROOT = path.join(__dirname, '..');
const DEFAULT_LEDGER = path.join(ROOT, 'private', 'claims.json');

const POOL_ABI = [
    'function claim(uint256 courseId, address player, bytes32 identityHash, uint256 amount, uint256 deadline, bytes signature)',
    'function maxReward() view returns (uint256)',
    'function poolBalance() view returns (uint256)',
    'function remainingClaims() view returns (uint256)',
    'function paused() view returns (bool)',
    'function signer() view returns (address)',
    'function walletClaimed(uint256, address) view returns (bool)',
    'function identityClaimed(uint256, bytes32) view returns (bool)',
];

const CLAIM_TYPES = {
    Claim: [
        { name: 'courseId', type: 'uint256' },
        { name: 'player', type: 'address' },
        { name: 'identityHash', type: 'bytes32' },
        { name: 'amount', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
    ],
};

// How long a started claim stays open, and how long the signature it produces
// is valid on chain.
const CLAIM_EXPIRY_MS = 30 * 60 * 1000;
const SIGNATURE_TTL_SECONDS = 15 * 60;

function readConfig(env) {
    const required = {
        poolAddress: env.REWARD_POOL_ADDRESS,
        rpcUrl: env.ARC_RPC_URL,
        claimSignerKey: env.CLAIM_SIGNER_KEY,
        relayerKey: env.RELAYER_KEY,
        identitySalt: env.IDENTITY_SALT,
        xClientId: env.X_CLIENT_ID,
        xClientSecret: env.X_CLIENT_SECRET,
        xRedirectUri: env.X_REDIRECT_URI,
    };
    const missing = Object.entries(required).filter(([, value]) => !value).map(([name]) => name);

    return {
        ...required,
        missing,
        courseId: BigInt(env.CLAIM_COURSE_ID || 1),
        minAccountAgeDays: Number(env.CLAIM_MIN_ACCOUNT_AGE_DAYS || 183),
        // Soft, as agreed: a shared office or a family does not look like fraud,
        // but one address funnelling claim after claim does.
        maxClaimsPerIp: Number(env.CLAIM_MAX_PER_IP || 3),
        // How many level quizzes must be answered correctly. 0 means finishing
        // the game is enough, which is the current rule.
        minQuizCorrect: Number(env.CLAIM_MIN_QUIZ_CORRECT || 0),
        ledgerPath: env.CLAIM_LEDGER_PATH || DEFAULT_LEDGER,
        // Overridable so tests can point at a stub instead of X.
        xOauthBase: env.X_OAUTH_BASE || 'https://x.com/i/oauth2/authorize',
        xTokenUrl: env.X_TOKEN_URL || 'https://api.x.com/2/oauth2/token',
        xUserUrl: env.X_USER_URL || 'https://api.x.com/2/users/me',
        gameUrl: env.CLAIM_RETURN_URL || '/',
    };
}

// --- the ledger ----------------------------------------------------------
//
// Small enough to keep in memory and rewrite whole; written through a
// temporary file so a crash mid-write cannot leave a truncated ledger.

function createLedger(filePath, log) {
    let entries = [];
    try {
        entries = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!Array.isArray(entries)) entries = [];
    } catch (error) {
        if (error.code !== 'ENOENT') log.error(`Claim ledger unreadable (${error.message}) — starting empty`);
        entries = [];
    }

    const save = () => {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        const temporary = filePath + '.tmp';
        fs.writeFileSync(temporary, JSON.stringify(entries, null, 2), { mode: 0o600 });
        fs.renameSync(temporary, filePath);
    };

    // Claims are counted per course, exactly as the contract counts them:
    // finishing a second course must not be refused because the first was
    // already rewarded. Entries written before courses existed are course 1.
    const course = (entry) => Number(entry.courseId || 1);

    return {
        all: () => entries,
        byWallet: (courseId, wallet) =>
            entries.find(e => course(e) === Number(courseId) && e.wallet === wallet.toLowerCase()),
        byIdentity: (courseId, identityHash) =>
            entries.find(e => course(e) === Number(courseId) && e.identityHash === identityHash),
        // The per-address limit is deliberately not per course: it is there to
        // slow down one person farming rewards, whatever they are for.
        countByIp: (ip) => entries.filter(e => e.ip === ip).length,
        add(entry) {
            entries.push(entry);
            save();
            return entry;
        },
        update(entry) {
            save();
            return entry;
        },
    };
}

// --- X ---------------------------------------------------------------------

function base64url(buffer) {
    return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Exchange the OAuth code for a token, then read the account. Returns the
 * fields the rules care about; the access token is used once and dropped, and
 * the account id never leaves this function unhashed.
 */
async function fetchXAccount(config, code, codeVerifier) {
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.xRedirectUri,
        code_verifier: codeVerifier,
    });
    const basic = Buffer.from(`${config.xClientId}:${config.xClientSecret}`).toString('base64');

    const tokenResponse = await fetch(config.xTokenUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            authorization: `Basic ${basic}`,
        },
        body,
    });
    if (!tokenResponse.ok) {
        throw new Error(`X token exchange failed (${tokenResponse.status})`);
    }
    const token = await tokenResponse.json();
    if (!token.access_token) throw new Error('X token exchange returned no token');

    const fields = 'verified,verified_type,created_at,is_identity_verified';
    const userResponse = await fetch(`${config.xUserUrl}?user.fields=${fields}`, {
        headers: { authorization: `Bearer ${token.access_token}` },
    });
    if (!userResponse.ok) {
        throw new Error(`X account lookup failed (${userResponse.status})`);
    }
    const user = (await userResponse.json()).data;
    if (!user || !user.id) throw new Error('X account lookup returned nothing');
    return user;
}

/// Why an account may not claim, or null if it may.
function accountProblem(user, config) {
    // Premium shows as a verified_type of blue; business and government
    // accounts are verified too and are at least as hard to mass-produce.
    const paid = user.verified === true && ['blue', 'business', 'government'].includes(user.verified_type);
    if (!paid) return 'not_premium';

    if (!user.created_at) return 'age_unknown';
    const ageDays = (Date.now() - new Date(user.created_at).getTime()) / 86_400_000;
    if (!Number.isFinite(ageDays)) return 'age_unknown';
    if (ageDays < config.minAccountAgeDays) return 'too_new';

    return null;
}

// --- routes ----------------------------------------------------------------

function registerClaimRoutes(app, { sessions, getIp, sessionExpiryMs, minSecondsPerLevel, runLooksScripted, log = console }) {
    const config = readConfig(process.env);

    if (config.missing.length) {
        log.error(`REWARDS UNAVAILABLE — missing ${config.missing.join(', ')}`);
        app.use('/api/claim', (req, res) => res.status(503).json({ error: 'Rewards unavailable' }));
        return { isReady: () => false };
    }

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const claimSigner = new ethers.Wallet(config.claimSignerKey);
    const relay = sharedRelay({ provider, key: config.relayerKey });
    const relayer = relay.wallet;
    const pool = new ethers.Contract(config.poolAddress, POOL_ABI, provider);
    const ledger = createLedger(config.ledgerPath, log);

    let domain = null;   // filled in on the first call, then cached

    async function eip712Domain() {
        if (!domain) {
            const network = await provider.getNetwork();
            domain = {
                name: 'ARCMAN Reward Pool',
                version: '1',
                chainId: Number(network.chainId),
                verifyingContract: config.poolAddress,
            };
        }
        return domain;
    }

    // Claims in progress: claimId -> { sessionId, ip, wallet, identityHash, … }
    const pending = new Map();
    setInterval(() => {
        const now = Date.now();
        for (const [claimId, claim] of pending) {
            if (now - claim.startedAt > CLAIM_EXPIRY_MS) pending.delete(claimId);
        }
    }, 5 * 60 * 1000).unref?.();

    log.log(`Rewards ready: pool ${config.poolAddress}, relayer ${relayer.address}, ledger ${ledger.all().length} claims`);

    /// The session must be a finished course, from this address, still alive.
    function completedSession(req, res) {
        const session = sessions.get(req.body && req.body.sessionId);
        if (!session) {
            res.status(404).json({ error: 'Session not found' });
            return null;
        }
        if (session.ip !== getIp(req)) {
            res.status(403).json({ error: 'Session IP mismatch' });
            return null;
        }
        if (Date.now() - session.startTime > sessionExpiryMs) {
            res.status(410).json({ error: 'Session expired' });
            return null;
        }
        const completed = session.levels.filter(level => level && level.completedAt).length;
        if (completed < session.totalLevels) {
            res.status(409).json({ error: `Course not finished: ${completed}/${session.totalLevels}` });
            return null;
        }
        const seconds = (Date.now() - session.startTime) / 1000;
        if (seconds < session.totalLevels * minSecondsPerLevel) {
            res.status(409).json({ error: 'Course finished too quickly' });
            return null;
        }
        if (runLooksScripted && runLooksScripted(session)) {
            res.status(409).json({ error: 'Most levels were finished too quickly to have been played' });
            return null;
        }
        if (config.minQuizCorrect > 0) {
            const correct = Object.values(session.quizzes || {}).filter(quiz => quiz.correct).length;
            if (correct < config.minQuizCorrect) {
                res.status(409).json({
                    error: `Quiz answers needed: ${correct}/${config.minQuizCorrect}`,
                    quizCorrect: correct,
                    quizNeeded: config.minQuizCorrect,
                });
                return null;
            }
        }
        return session;
    }

    const openClaim = (req, res) => {
        const claim = pending.get(req.body && req.body.claimId);
        if (!claim || Date.now() - claim.startedAt > CLAIM_EXPIRY_MS) {
            res.status(404).json({ error: 'Claim not found or expired' });
            return null;
        }
        if (claim.ip !== getIp(req)) {
            res.status(403).json({ error: 'Claim IP mismatch' });
            return null;
        }
        return claim;
    };

    const publicClaim = (claim) => ({
        claimId: claim.claimId,
        wallet: claim.wallet || null,
        xVerified: Boolean(claim.identityHash),
        xHandle: claim.xHandle || null,
        status: claim.status,
        txHash: claim.txHash || null,
        error: claim.error || null,
    });

    // --- what the pool can still pay -------------------------------------

    let poolCache = { at: 0, data: null };

    app.get('/api/claim/pool', async (req, res) => {
        try {
            if (Date.now() - poolCache.at < 30_000 && poolCache.data) return res.json(poolCache.data);

            const [reward, balance, remaining, paused] = await Promise.all([
                pool.maxReward(), pool.poolBalance(), pool.remainingClaims(), pool.paused(),
            ]);
            const data = {
                reward: ethers.formatUnits(reward, 6),
                balance: ethers.formatUnits(balance, 6),
                remainingClaims: Number(remaining),
                open: !paused && remaining > 0n,
                // So the game can warn a player that skipping every question
                // costs them the reward, rather than springing it at the end.
                quizNeeded: config.minQuizCorrect > 0 ? config.minQuizCorrect : 0,
            };
            poolCache = { at: Date.now(), data };
            res.json(data);
        } catch (error) {
            log.error('Pool read failed:', error.message);
            res.status(503).json({ error: 'Pool unreachable' });
        }
    });

    // --- 1. start ---------------------------------------------------------

    app.post('/api/claim/start', (req, res) => {
        const session = completedSession(req, res);
        if (!session) return;

        const ip = getIp(req);
        if (ledger.countByIp(ip) >= config.maxClaimsPerIp) {
            return res.status(429).json({ error: 'Too many claims from this address', reason: 'ip_limit' });
        }

        const claimId = crypto.randomUUID();
        const claim = {
            claimId,
            sessionId: session.sessionId,
            ip,
            startedAt: Date.now(),
            status: 'started',
            // Signed by the player's wallet to prove they hold it
            walletNonce: crypto.randomBytes(16).toString('hex'),
        };
        pending.set(claimId, claim);

        res.json({
            ...publicClaim(claim),
            walletMessage: walletMessage(claim),
        });
    });

    // The exact text the player signs. Says what it is for in plain words, and
    // carries a nonce so one signature cannot be reused for another claim.
    function walletMessage(claim) {
        return [
            'ARCMAN — reward claim',
            '',
            'Signing this proves you hold this wallet.',
            'It does not move any funds.',
            '',
            `Claim: ${claim.claimId}`,
            `Nonce: ${claim.walletNonce}`,
        ].join('\n');
    }

    // --- 2. the wallet ----------------------------------------------------

    app.post('/api/claim/wallet', async (req, res) => {
        const claim = openClaim(req, res);
        if (!claim) return;

        const { address, signature } = req.body || {};
        if (!address || !ethers.isAddress(address) || typeof signature !== 'string') {
            return res.status(400).json({ error: 'Invalid address or signature' });
        }

        let recovered;
        try {
            recovered = ethers.verifyMessage(walletMessage(claim), signature);
        } catch (error) {
            return res.status(400).json({ error: 'Signature could not be read' });
        }
        if (recovered.toLowerCase() !== address.toLowerCase()) {
            return res.status(403).json({ error: 'Signature does not match the wallet' });
        }

        const wallet = ethers.getAddress(address);
        if (ledger.byWallet(config.courseId, wallet)) {
            return res.status(409).json({ error: 'This wallet has already claimed', reason: 'wallet_claimed' });
        }
        try {
            if (await pool.walletClaimed(config.courseId, wallet)) {
                return res.status(409).json({ error: 'This wallet has already claimed', reason: 'wallet_claimed' });
            }
        } catch (error) {
            log.error('walletClaimed check failed:', error.message);
            return res.status(503).json({ error: 'Chain unreachable' });
        }

        claim.wallet = wallet;
        claim.status = claim.identityHash ? 'ready' : 'wallet_verified';
        res.json(publicClaim(claim));
    });

    // --- 3. the X account -------------------------------------------------

    app.post('/api/claim/x/start', (req, res) => {
        const claim = openClaim(req, res);
        if (!claim) return;

        // PKCE, plus a state the callback must return, so a link someone else
        // crafted cannot attach their account to this claim.
        const verifier = base64url(crypto.randomBytes(32));
        const challenge = base64url(crypto.createHash('sha256').update(verifier).digest());
        claim.codeVerifier = verifier;
        claim.state = base64url(crypto.randomBytes(16));

        const url = new URL(config.xOauthBase);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', config.xClientId);
        url.searchParams.set('redirect_uri', config.xRedirectUri);
        url.searchParams.set('scope', 'users.read tweet.read');
        url.searchParams.set('state', `${claim.claimId}.${claim.state}`);
        url.searchParams.set('code_challenge', challenge);
        url.searchParams.set('code_challenge_method', 'S256');

        res.json({ url: url.toString() });
    });

    // X sends the player back here. This is a browser redirect, not an API
    // call, so it answers with a small page that closes itself.
    app.get('/api/claim/x/callback', async (req, res) => {
        const [claimId, state] = String(req.query.state || '').split('.');
        const claim = pending.get(claimId);

        const done = (status, detail) => res.status(status === 'ok' ? 200 : 400).send(closingPage(status, detail));

        if (!claim || !claim.state || claim.state !== state) return done('error', 'unknown_claim');

        // The sign-in can come back twice: a window that looked stuck but had
        // already finished, then the same link opened somewhere else. X spends
        // an authorisation code on first use, so the second attempt fails — and
        // used to report that as a failure, over a verification that had in fact
        // succeeded. Nothing more is needed here, so say so and change nothing.
        if (claim.identityHash) return done('ok', 'already_verified');

        if (req.query.error) return done('error', 'declined');
        if (!req.query.code) return done('error', 'no_code');

        try {
            const user = await fetchXAccount(config, String(req.query.code), claim.codeVerifier);
            const problem = accountProblem(user, config);
            if (problem) {
                claim.error = problem;
                return done('error', problem);
            }

            // Salted so the ledger cannot be turned into a list of participants
            const identityHash = ethers.keccak256(
                ethers.toUtf8Bytes(`${config.identitySalt}:${user.id}`)
            );
            if (ledger.byIdentity(config.courseId, identityHash)) {
                claim.error = 'identity_claimed';
                return done('error', 'identity_claimed');
            }
            if (await pool.identityClaimed(config.courseId, identityHash)) {
                claim.error = 'identity_claimed';
                return done('error', 'identity_claimed');
            }

            claim.identityHash = identityHash;
            claim.xHandle = user.username || null;
            claim.error = null;
            claim.status = claim.wallet ? 'ready' : 'x_verified';
            // The token and the verifier have done their job.
            delete claim.codeVerifier;

            log.log(`Claim ${claim.claimId}: X account accepted (${identityHash.slice(0, 10)}…)`);
            done('ok');
        } catch (error) {
            log.error('X verification failed:', error.message);
            if (!claim.identityHash) claim.error = 'x_failed';   // never undo a success
            done('error', 'x_failed');
        }
    });

    // --- 4. pay -----------------------------------------------------------

    app.post('/api/claim/submit', async (req, res) => {
        const claim = openClaim(req, res);
        if (!claim) return;

        if (!claim.wallet) return res.status(409).json({ error: 'Wallet not verified', reason: 'need_wallet' });
        if (!claim.identityHash) return res.status(409).json({ error: 'X account not verified', reason: 'need_x' });
        if (claim.status === 'paid') return res.json(publicClaim(claim));
        if (claim.sending) return res.status(409).json({ error: 'Claim already being sent' });

        // The session must still be the finished course it was at the start
        const session = sessions.get(claim.sessionId);
        if (!session || session.ip !== getIp(req)) {
            return res.status(409).json({ error: 'Session no longer valid' });
        }

        if (ledger.byWallet(config.courseId, claim.wallet)
            || ledger.byIdentity(config.courseId, claim.identityHash)) {
            return res.status(409).json({ error: 'Already claimed', reason: 'already_claimed' });
        }

        claim.sending = true;
        try {
            const [reward, balance, paused] = await Promise.all([
                pool.maxReward(), pool.poolBalance(), pool.paused(),
            ]);
            if (paused) return res.status(503).json({ error: 'Rewards are paused', reason: 'paused' });
            if (balance < reward) {
                return res.status(409).json({ error: 'The reward pool is empty', reason: 'pool_empty' });
            }

            const deadline = BigInt(Math.floor(Date.now() / 1000) + SIGNATURE_TTL_SECONDS);
            const message = {
                courseId: config.courseId,
                player: claim.wallet,
                identityHash: claim.identityHash,
                amount: reward,
                deadline,
            };
            const signature = await claimSigner.signTypedData(await eip712Domain(), CLAIM_TYPES, message);

            // Written before sending: if the process dies mid-transaction the
            // ledger still shows an attempt, which is the safe way round.
            const entry = ledger.add({
                claimId: claim.claimId,
                courseId: Number(config.courseId),
                wallet: claim.wallet.toLowerCase(),
                identityHash: claim.identityHash,
                ip: claim.ip,
                amount: reward.toString(),
                status: 'sending',
                at: new Date().toISOString(),
            });

            // Sending and waiting happen inside the queue: the next claim must
            // not pick its nonce until this transaction is in a block.
            const receipt = await relay.send(async ({ wallet, gasPrice, nonce }) => {
                const tx = await pool.connect(wallet).claim(
                    message.courseId, message.player, message.identityHash,
                    message.amount, message.deadline, signature,
                    { gasPrice, nonce }
                );
                entry.txHash = tx.hash;
                claim.txHash = tx.hash;
                claim.status = 'sending';
                ledger.update(entry);
                log.log(`Claim ${claim.claimId}: sent ${tx.hash}`);

                return tx.wait();
            });
            if (!receipt || receipt.status !== 1) throw new Error('Transaction reverted');

            entry.status = 'paid';
            entry.block = receipt.blockNumber;
            ledger.update(entry);

            claim.status = 'paid';
            log.log(`Claim ${claim.claimId}: paid in block ${receipt.blockNumber}`);
            res.json(publicClaim(claim));
        } catch (error) {
            log.error(`Claim ${claim.claimId} failed:`, error.message);
            claim.status = 'failed';
            claim.error = 'send_failed';
            res.status(502).json({ error: 'The reward could not be sent', reason: 'send_failed' });
        } finally {
            claim.sending = false;
        }
    });

    app.post('/api/claim/status', (req, res) => {
        const claim = openClaim(req, res);
        if (!claim) return;
        res.json(publicClaim(claim));
    });

    return { isReady: () => true };
}

// The window X opens lands back here; it tells the player what happened and
// hands the result to the game window that opened it.
function closingPage(status, detail) {
    const message = status === 'ok' ? (detail === 'already_verified'
        ? 'This X account was already verified for this reward. You can close this window and go back to the game.'
        : 'X account verified. You can close this window.') : {
        not_premium: 'This X account is not Premium, so it cannot claim.',
        too_new: 'This X account is too new to claim.',
        age_unknown: 'The age of this X account could not be checked.',
        identity_claimed: 'This X account has already claimed a reward.',
        declined: 'Sign-in was cancelled.',
        unknown_claim: 'This claim is no longer open. Start again from the game.',
        x_failed: 'X could not be reached. Please try again.',
    }[detail] || 'Verification failed.';

    return `<!doctype html><meta charset="utf-8"><title>ARCMAN</title>
<body style="background:#0b0b16;color:#e6e6f0;font:16px/1.5 system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center">
<p style="max-width:28rem;padding:1.5rem">${message}</p>
<script>
  try { window.opener && window.opener.postMessage({ arcmanClaim: ${JSON.stringify(status)}, detail: ${JSON.stringify(detail || null)} }, '*'); } catch (e) {}
  setTimeout(function () { window.close(); }, 2500);
</script>`;
}

module.exports = { registerClaimRoutes, accountProblem, readConfig };
