// Backend server for signing game scores
// Load environment variables from .env file (if it exists)
require('dotenv').config();

const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

// The server sits behind a reverse proxy on the same machine. Trusting only the
// loopback proxy makes req.ip the player's address from X-Forwarded-For, while a
// request that reaches Node directly cannot spoof it. Without this every player
// shares the proxy's address and the per-session IP binding checks nothing.
app.set('trust proxy', 'loopback');

app.use(cors());
app.use(express.json());

// Only the game itself is public. server.js, the package files, the contracts,
// the server modules and the private answer key live in the same directory and
// must never be served.
for (const dir of ['js', 'images', 'audio']) {
    app.use('/' + dir, express.static(path.join(__dirname, dir)));
}
for (const file of ['index.html', 'levels.js', 'communityLevels.js']) {
    app.get('/' + file, (req, res) => res.sendFile(path.join(__dirname, file)));
}

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const getIp = (req) => req.ip;

// ------------------------------------------------------------
// Anti-cheat: Session-based score verification
// ------------------------------------------------------------

const { DEFAULT_LEVELS } = require('./levels.js');

const sessions = new Map();
const playerActiveSessions = new Map(); // player (lowercase) -> sessionId
const playerLastFinalize = new Map();   // player (lowercase) -> timestamp

const SESSION_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const MAX_ANONYMOUS_SESSIONS_PER_IP = 20;  // walletless runs; oldest is dropped past this
const MIN_SECONDS_PER_LEVEL = 3;
const FINALIZE_COOLDOWN_MS = 60 * 1000;   // 60s between finalizations

const TOTAL_DEFAULT_LEVELS = DEFAULT_LEVELS.length;

// Purge expired sessions every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of sessions) {
        if (now - session.startTime > SESSION_EXPIRY_MS) {
            sessions.delete(sessionId);
            if (playerActiveSessions.get(session.normalizedPlayer) === sessionId) {
                playerActiveSessions.delete(session.normalizedPlayer);
            }
        }
    }
}, 5 * 60 * 1000);

// In production, this should be stored securely (e.g., environment variable, AWS Secrets Manager)
// This should be the private key of the server signer address
// Can be set via:
// 1. .env file: PRIVATE_KEY=0x...
// 2. Environment variable: export PRIVATE_KEY=0x... (Mac/Linux) or set PRIVATE_KEY=0x... (Windows)
// 3. Command line: PRIVATE_KEY=0x... node server.js
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0x' + crypto.randomBytes(32).toString('hex');

// Create wallet from private key
let signerWallet;
try {
    signerWallet = new ethers.Wallet(PRIVATE_KEY);
    console.log('Server signer address:', signerWallet.address);
} catch (error) {
    console.error('Error creating signer wallet:', error);
    process.exit(1);
}

// A made-up key looks like it works — the server signs happily, and every
// score is then rejected on-chain as "Invalid signature", a long way from here
// and with nothing in the logs. Say it at startup instead, and check against
// the contract itself when it can be reached.
if (!process.env.PRIVATE_KEY) {
    console.warn('WARNING: no PRIVATE_KEY set. Scores are signed with a throwaway key and the contract will reject every one of them.');
}

// What a score signature is bound to. Both belong in the signature, so both
// must name the board the game actually talks to.
const SCORE_CONTRACT = process.env.SCORE_CONTRACT_ADDRESS || ethers.ZeroAddress;
const SCORE_CHAIN_ID = BigInt(process.env.SCORE_CHAIN_ID || 0);

if (process.env.SCORE_CONTRACT_ADDRESS && process.env.ARC_RPC_URL) {
    (async () => {
        try {
            const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL);
            const contract = new ethers.Contract(
                process.env.SCORE_CONTRACT_ADDRESS,
                ['function serverSigner() view returns (address)'],
                provider,
            );

            const expected = await contract.serverSigner();
            if (expected.toLowerCase() !== signerWallet.address.toLowerCase()) {
                console.warn(`WARNING: the score contract expects ${expected}, this server signs as ${signerWallet.address}. Every finalization will revert.`);
            } else {
                console.log('Score signer matches the contract.');
            }

            const chainId = (await provider.getNetwork()).chainId;
            if (SCORE_CHAIN_ID !== chainId) {
                console.warn(`WARNING: SCORE_CHAIN_ID is ${SCORE_CHAIN_ID || 'unset'} but the node is on ${chainId}. Every score will be signed for the wrong chain and refused.`);
            }

            provider.destroy();
        } catch (error) {
            console.warn('Could not check the score signer against the contract:', error.message);
        }
    })();
}

// Sign a score the way the board checks it.
//
// The chain and the board's own address are part of what is signed: without
// them, a score signed for one board would count on every other board this key
// signs for — and play on a test network is free and endless.
async function signMessage(player, score, levelId, nonce, gameMode) {
    try {
        const packedData = ethers.solidityPacked(
            ['uint256', 'address', 'address', 'uint256', 'uint256', 'uint256', 'string'],
            [SCORE_CHAIN_ID, SCORE_CONTRACT, player, score, levelId, nonce, gameMode || 'Tournament']
        );
        
        // Hash the packed data (this matches contract's keccak256(abi.encodePacked(...)))
        const messageHash = ethers.keccak256(packedData);
        
        // Create Ethereum signed message hash
        // Contract uses: keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash))
        // Note: The contract uses a fixed "32" in the prefix, not the actual length
        const prefix = '\x19Ethereum Signed Message:\n32';
        const ethSignedMessageHash = ethers.keccak256(
            ethers.solidityPacked(
                ['string', 'bytes32'],
                [prefix, messageHash]
            )
        );
        
        // Sign the ethSignedMessageHash directly (not using signMessage which adds its own prefix)
        // We need to manually sign because the contract expects a specific prefix format
        const signature = signerWallet.signingKey.sign(ethSignedMessageHash);
        const signatureBytes = ethers.concat([
            signature.r,
            signature.s,
            signature.v === 27 ? '0x1b' : '0x1c'
        ]);
        
        return {
            messageHash: messageHash,
            ethSignedMessageHash: ethSignedMessageHash,
            signature: signatureBytes,
            signerAddress: signerWallet.address
        };
    } catch (error) {
        console.error('Error signing message:', error);
        throw error;
    }
}

// ------------------------------------------------------------
// Session endpoints (anti-cheat protected)
// ------------------------------------------------------------

/**
 * Does this run look played rather than typed?
 *
 * One or two very quick levels are a good player who saw the angle at once.
 * Most of the course finished that way is something else. The total time of the
 * run is checked separately and catches the blunt cases; this catches a run
 * that paused between levels but never actually played them.
 */
function runLooksScripted(session) {
    const played = session.levels.filter(level => level && level.completedAt);
    if (played.length === 0) return false;
    const fast = played.filter(level => level.fast).length;
    return fast > played.length / 2;
}

// Almost nobody connects a wallet before pressing Play, so a run that wants its
// score on-chain has to be able to name a wallet once it is over. The signature
// over this message is what makes that safe: it is tied to the one session, it
// moves nothing, and it costs nothing.
function sessionWalletMessage(sessionId) {
    return 'ARCMAN — score finalization\n\n'
        + 'Signing this proves you hold this wallet.\n'
        + 'It does not move any funds.\n\n'
        + `Session: ${sessionId}`;
}

// Start a new game session
app.post('/api/session/start', (req, res) => {
    try {
        const { player, gameMode } = req.body;

        if (!gameMode) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // A wallet is optional: the quizzes need a session for every run, while
        // only a session with a wallet can be finalized on-chain.
        if (player && !ethers.isAddress(player)) {
            return res.status(400).json({ error: 'Invalid player address' });
        }

        const validGameMode = gameMode || 'Tournament';
        if (validGameMode !== 'Immortal' && validGameMode !== 'Tournament') {
            return res.status(400).json({ error: 'Invalid game mode' });
        }

        const normalizedPlayer = player ? player.toLowerCase() : null;
        const ip = getIp(req);

        if (normalizedPlayer) {
            // Invalidate any existing session for this player
            const existingSessionId = playerActiveSessions.get(normalizedPlayer);
            if (existingSessionId) {
                sessions.delete(existingSessionId);
            }
        } else {
            // Bound walletless sessions per address; a shared IP never gets
            // locked out, the oldest run is simply forgotten
            const mine = [...sessions.values()]
                .filter(s => !s.normalizedPlayer && s.ip === ip)
                .sort((a, b) => a.startTime - b.startTime);
            while (mine.length >= MAX_ANONYMOUS_SESSIONS_PER_IP) {
                const dropped = mine.shift();
                sessions.delete(dropped.sessionId);
                // The oldest run is not always an abandoned one — a player who
                // reloads in a second tab, or a whole office behind one address,
                // can push out a run still being played. Worth seeing.
                console.log(`Dropped session ${dropped.sessionId} from ${ip}: `
                    + `${MAX_ANONYMOUS_SESSIONS_PER_IP} walletless runs already held, `
                    + `this one ${Math.round((Date.now() - dropped.startTime) / 1000)}s old`);
            }
        }

        const sessionId = crypto.randomUUID();

        const session = {
            sessionId,
            player: player || null,    // original-case address for signing; null for walletless runs
            normalizedPlayer,          // lowercase for map lookups
            gameMode: validGameMode,
            startTime: Date.now(),
            ip,
            levels: [],                // per-level event tracking
            currentLevelIndex: -1,
            finalized: false,
            totalLevels: TOTAL_DEFAULT_LEVELS,
        };

        sessions.set(sessionId, session);
        if (normalizedPlayer) {
            playerActiveSessions.set(normalizedPlayer, sessionId);
        }

        console.log(`Session started: ${sessionId} for ${player || 'a walletless run'} (${validGameMode})`);
        res.json({
            success: true,
            sessionId,
            totalLevels: TOTAL_DEFAULT_LEVELS,
            // A run that began without a wallet can still adopt one at the end;
            // this is the message that proves the wallet is the player's own.
            walletMessage: player ? null : sessionWalletMessage(sessionId),
        });
    } catch (error) {
        console.error('Error starting session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Name the wallet a finished run belongs to. Only a signature does it: the
// address alone would let anyone hang their score on someone else's wallet.
app.post('/api/session/wallet', (req, res) => {
    try {
        const { sessionId, address, signature } = req.body;

        if (!sessionId || !address || !signature) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid player address' });
        }

        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        if (session.ip !== getIp(req)) {
            return res.status(403).json({ error: 'Session IP mismatch' });
        }
        if (Date.now() - session.startTime > SESSION_EXPIRY_MS) {
            sessions.delete(sessionId);
            return res.status(410).json({ error: 'Session expired' });
        }
        if (session.finalized) {
            return res.status(400).json({ error: 'Session already finalized' });
        }
        if (session.player) {
            // Naming the same wallet twice is a retry, not an error; a different
            // one would quietly move the score, so it is refused.
            if (session.normalizedPlayer !== address.toLowerCase()) {
                return res.status(409).json({ error: 'Session already has a wallet' });
            }
            return res.json({ success: true, player: session.player });
        }

        let signer;
        try {
            signer = ethers.verifyMessage(sessionWalletMessage(sessionId), signature);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid signature' });
        }
        if (signer.toLowerCase() !== address.toLowerCase()) {
            return res.status(401).json({ error: 'Signature does not match the address' });
        }

        const normalizedPlayer = signer.toLowerCase();
        const existingSessionId = playerActiveSessions.get(normalizedPlayer);
        if (existingSessionId && existingSessionId !== sessionId) {
            sessions.delete(existingSessionId);
        }

        session.player = signer;   // checksummed, the form the contract signs over
        session.normalizedPlayer = normalizedPlayer;
        playerActiveSessions.set(normalizedPlayer, sessionId);

        console.log(`Session ${sessionId} claimed by ${signer}`);
        res.json({ success: true, player: signer });
    } catch (error) {
        console.error('Error attaching wallet to session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Record a game event within a session
app.post('/api/session/event', (req, res) => {
    try {
        const { sessionId, eventType } = req.body;

        if (!sessionId || !eventType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session.finalized) {
            return res.status(400).json({ error: 'Session already finalized' });
        }

        const ip = getIp(req);
        if (session.ip !== ip) {
            return res.status(403).json({ error: 'Session IP mismatch' });
        }

        if (Date.now() - session.startTime > SESSION_EXPIRY_MS) {
            sessions.delete(sessionId);
            playerActiveSessions.delete(session.normalizedPlayer);
            return res.status(410).json({ error: 'Session expired' });
        }

        const validEvents = ['levelStart', 'gatePassed', 'cloudPassed', 'barrierHit', 'levelComplete'];
        if (!validEvents.includes(eventType)) {
            return res.status(400).json({ error: 'Invalid event type' });
        }

        const now = Date.now();

        if (eventType === 'levelStart') {
            const levelIndex = session.levels.length;
            if (levelIndex >= session.totalLevels) {
                return res.status(400).json({ error: 'All levels already started' });
            }

            const levelData = DEFAULT_LEVELS[levelIndex];
            if (!levelData) {
                return res.status(400).json({ error: 'Invalid level index' });
            }

            session.currentLevelIndex = levelIndex;
            session.levels.push({
                levelId: levelData.id,
                startedAt: now,
                completedAt: null,
                gatesPassed: 0,
                cloudsPassed: 0,
                barrierHits: 0,
                maxGates: (levelData.arcGates || []).length,
                maxClouds: (levelData.slippageClouds || []).length,
                maxBarriers: (levelData.barriers || []).length,
            });

            return res.json({ success: true });
        }

        // All other events require a level in progress
        if (session.levels.length === 0) {
            return res.status(400).json({ error: 'No level started' });
        }

        const currentLevel = session.levels[session.levels.length - 1];

        if (currentLevel.completedAt) {
            return res.status(400).json({ error: 'Current level already completed' });
        }

        const timeSinceLevelStart = (now - currentLevel.startedAt) / 1000;
        if (timeSinceLevelStart < 0.5) {
            return res.status(400).json({ error: 'Event too fast' });
        }

        if (eventType === 'gatePassed') {
            if (currentLevel.gatesPassed >= currentLevel.maxGates) {
                return res.status(400).json({ error: 'Exceeded max gates for this level' });
            }
            currentLevel.gatesPassed++;
        } else if (eventType === 'cloudPassed') {
            if (currentLevel.cloudsPassed >= currentLevel.maxClouds) {
                return res.status(400).json({ error: 'Exceeded max clouds for this level' });
            }
            currentLevel.cloudsPassed++;
        } else if (eventType === 'barrierHit') {
            if (currentLevel.barrierHits >= currentLevel.maxBarriers) {
                return res.status(400).json({ error: 'Exceeded max barriers for this level' });
            }
            currentLevel.barrierHits++;
        } else if (eventType === 'levelComplete') {
            // A level finished in under three seconds used to be thrown away,
            // and the player was never told: their course quietly became
            // nineteen levels of twenty, and at the end there was no reward and
            // no explanation. It also stopped nobody — a script simply waits.
            // So the level counts, and a suspiciously quick one is marked. What
            // matters is the run as a whole, judged in runLooksScripted below.
            currentLevel.completedAt = now;
            currentLevel.seconds = timeSinceLevelStart;
            currentLevel.fast = timeSinceLevelStart < MIN_SECONDS_PER_LEVEL;
        }

        return res.json({ success: true });
    } catch (error) {
        console.error('Error recording event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Finalize session: server computes score, signs it
app.post('/api/session/finalize', async (req, res) => {
    try {
        const { sessionId, nonce } = req.body;

        if (!sessionId || !nonce) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found or expired' });
        }

        // A run is signed once. If it was signed but the transaction never
        // landed, asking again resends the same signature rather than refusing:
        // the contract spends a signature on use, so a duplicate is harmless
        // and losing the run is not.
        if (session.finalized) {
            if (!session.finalization) {
                return res.status(400).json({ error: 'Session already finalized' });
            }
            try {
                return res.json(await sendScore(session));
            } catch (error) {
                console.error('Resending a score failed:', error.message);
                return res.status(502).json({ error: 'The score could not be sent. Try again.' });
            }
        }

        if (!session.player) {
            return res.status(400).json({ error: 'Session has no wallet' });
        }

        const ip = getIp(req);
        if (session.ip !== ip) {
            return res.status(403).json({ error: 'Session IP mismatch' });
        }

        if (Date.now() - session.startTime > SESSION_EXPIRY_MS) {
            sessions.delete(sessionId);
            playerActiveSessions.delete(session.normalizedPlayer);
            return res.status(410).json({ error: 'Session expired' });
        }

        // Rate limit per player
        const lastFinalize = playerLastFinalize.get(session.normalizedPlayer);
        if (lastFinalize && (Date.now() - lastFinalize) < FINALIZE_COOLDOWN_MS) {
            const remaining = Math.ceil((FINALIZE_COOLDOWN_MS - (Date.now() - lastFinalize)) / 1000);
            return res.status(429).json({ error: `Rate limited. Try again in ${remaining} seconds` });
        }

        // Validate all levels were completed
        const completedLevels = session.levels.filter(l => l.completedAt !== null);
        if (completedLevels.length < session.totalLevels) {
            return res.status(400).json({
                error: `Not all levels completed: ${completedLevels.length}/${session.totalLevels}`
            });
        }

        // Validate total game time
        const totalGameTime = (Date.now() - session.startTime) / 1000;
        const minTotalTime = session.totalLevels * MIN_SECONDS_PER_LEVEL;
        if (totalGameTime < minTotalTime) {
            return res.status(400).json({ error: 'Game completed too quickly' });
        }

        if (runLooksScripted(session)) {
            return res.status(400).json({ error: 'Most levels were finished too quickly to have been played' });
        }

        // --- Server-side score computation ---
        let totalScore = 0;
        for (const level of session.levels) {
            const basePoints = 100 + (level.cloudsPassed * 10) + (level.barrierHits * 10);
            const multiplier = 1.0 + (level.gatesPassed * 0.5);
            totalScore += Math.floor(basePoints * multiplier);
        }

        // Convert nonce to BigInt
        let nonceNum;
        try {
            if (typeof nonce === 'string' && /[a-zA-Z]/.test(nonce)) {
                const nonceBytes = ethers.toUtf8Bytes(nonce);
                const nonceHash = ethers.keccak256(nonceBytes);
                nonceNum = BigInt(nonceHash);
            } else {
                nonceNum = BigInt(nonce);
            }
        } catch (e) {
            return res.status(400).json({ error: 'Invalid nonce format' });
        }

        const scoreNum = BigInt(totalScore);
        const levelIdNum = BigInt(completedLevels.length);

        // Sign the SERVER-COMPUTED score
        const signed = await signMessage(session.player, scoreNum, levelIdNum, nonceNum, session.gameMode);

        // Kept on the session so that a transaction which never lands can be
        // sent again without signing a second, different score.
        session.finalization = {
            scoreData: {
                player: session.player,
                score: scoreNum,
                levelId: levelIdNum,
                nonce: nonceNum,
                gameMode: session.gameMode,
            },
            signature: signed.signature,
            signerAddress: signed.signerAddress,
            score: totalScore,
            txHash: null,
        };

        session.finalized = true;
        playerLastFinalize.set(session.normalizedPlayer, Date.now());
        playerActiveSessions.delete(session.normalizedPlayer);

        console.log(`Session finalized: ${sessionId}, score=${totalScore}, player=${session.player}`);

        try {
            return res.json(await sendScore(session));
        } catch (error) {
            console.error('Sending a score failed:', error.message);
            return res.status(502).json({
                error: 'The score was signed but could not be sent. Try again.',
                score: totalScore,
            });
        }
    } catch (error) {
        console.error('Error in session finalize:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// Send message to Telegram
async function sendTelegramMessage(message) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
        console.warn('Telegram bot token or chat ID not configured. Skipping Telegram notification.');
        return false;
    }
    
    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });
        return response.data.ok === true;
    } catch (error) {
        console.error('Error sending Telegram message:', error.response?.data || error.message);
        return false;
    }
}

// Format level data for Telegram message
function formatLevelMessage(level) {
    const timestamp = new Date().toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const levelId = level.id ? `ID: ${level.id}` : 'New Level (not saved yet)';
    
    // Count objects
    const gatesCount = level.arcGates?.length || 0;
    const cloudsCount = level.slippageClouds?.length || 0;
    const barriersCount = level.barriers?.length || 0;
    const lifeRestoresCount = level.lifeRestores?.length || 0;
    const hasSettlement = level.settlementZone ? 1 : 0;
    
    // Format JSON (escape backticks for Markdown)
    const levelJson = JSON.stringify(level, null, 2).replace(/`/g, '\\`');
    
    const message = `🎮 *Новый уровень на утверждение*

*Название:* ${level.name || 'Unnamed Level'}
*${levelId}*
*Дата:* ${timestamp}

*Статистика:*
• Arc Gates: ${gatesCount}
• Slippage Clouds: ${cloudsCount}
• Barriers: ${barriersCount}
• Life Restores: ${lifeRestoresCount}
• Settlement Zone: ${hasSettlement ? 'Yes' : 'No'}

*Данные уровня:*
\`\`\`json
${levelJson}
\`\`\`

_Используйте эти данные для добавления уровня в игру._`;
    
    return message;
}

// API endpoint to submit level for approval
app.post('/api/submit-level', async (req, res) => {
    try {
        const { level } = req.body;
        
        if (!level) {
            return res.status(400).json({ error: 'Missing level data' });
        }
        
        // Validate level structure
        if (!level.name) {
            return res.status(400).json({ error: 'Level name is required' });
        }
        
        if (!level.settlementZone) {
            return res.status(400).json({ error: 'Settlement zone is required' });
        }
        
        // Format and send Telegram message
        const telegramMessage = formatLevelMessage(level);
        const telegramSent = await sendTelegramMessage(telegramMessage);
        
        // Always return success to client, even if Telegram fails
        // (we don't want to worry players about server-side issues)
        res.json({
            success: true,
            telegramSent: telegramSent,
            timestamp: Date.now()
        });
        
        if (!telegramSent) {
            console.warn('Level submitted but Telegram notification failed. Level data:', JSON.stringify(level, null, 2));
        }
    } catch (error) {
        console.error('Error submitting level:', error);
        // Still return success to not worry the player
        res.json({
            success: true,
            telegramSent: false,
            error: 'Notification may have failed, but level was received',
            timestamp: Date.now()
        });
    }
});

// ------------------------------------------------------------
// Quizzes: graded here, answers never sent to the browser
// ------------------------------------------------------------

const quizService = require('./server/quizService.js').registerQuizRoutes(app, {
    sessions,
    getIp,
    sessionExpiryMs: SESSION_EXPIRY_MS,
});

// Reward claims. Unconfigured, /api/claim/* answers 503 and the game hides the
// reward; the game itself keeps working either way.
const claimService = require('./server/claimService.js').registerClaimRoutes(app, {
    sessions,
    getIp,
    sessionExpiryMs: SESSION_EXPIRY_MS,
    minSecondsPerLevel: MIN_SECONDS_PER_LEVEL,
    runLooksScripted,
});

// Scores on the chain and the ranking read back out of them. Unconfigured, the
// leaderboard answers 503 and a finished run hands its signature to the player
// to send themselves.
const scoreService = require('./server/scoreService.js').registerScoreRoutes(app, {
    sessions,
    getIp,
});

/**
 * Put a finished run on the chain at our expense.
 *
 * Sending twice is safe — the contract spends a signature on use, so a second
 * attempt cannot double-count — which is what lets a failed send be retried.
 */
async function sendScore(session) {
    const record = session.finalization;

    if (record.txHash) {
        return { success: true, score: record.score, txHash: record.txHash, relayed: true };
    }

    if (!scoreService.isReady()) {
        // Nothing to relay with. Hand back what was signed so the player can
        // send it from their own wallet, as they used to.
        return {
            success: true,
            score: record.score,
            relayed: false,
            player: record.scoreData.player,
            levelId: Number(record.scoreData.levelId),
            signature: record.signature,
            signerAddress: record.signerAddress,
        };
    }

    const receipt = await scoreService.submit(record);
    record.txHash = receipt.hash;
    return { success: true, score: record.score, txHash: receipt.hash, relayed: true };
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        quizzes: quizService.isReady() ? 'ok' : 'unavailable',
        rewards: claimService.isReady() ? 'ok' : 'unavailable',
        scores: scoreService.isReady() ? 'ok' : 'unavailable',
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


