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
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ------------------------------------------------------------
// Anti-cheat: Session-based score verification
// ------------------------------------------------------------

const { DEFAULT_LEVELS } = require('./levels.js');

const sessions = new Map();
const playerActiveSessions = new Map(); // player (lowercase) -> sessionId
const playerLastFinalize = new Map();   // player (lowercase) -> timestamp

const SESSION_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
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

// Sign message for smart contract verification
async function signMessage(player, score, levelId, nonce, gameMode) {
    try {
        // Create message hash using abi.encodePacked (matching contract.sol format)
        // Contract uses: keccak256(abi.encodePacked(player, score, levelId, nonce, gameMode))
        // We need to manually pack the data to match Solidity's abi.encodePacked
        
        // Better approach: use solidityPacked which matches abi.encodePacked
        const packedData = ethers.solidityPacked(
            ['address', 'uint256', 'uint256', 'uint256', 'string'],
            [player, score, levelId, nonce, gameMode || 'Immortal']
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

// Start a new game session
app.post('/api/session/start', (req, res) => {
    try {
        const { player, gameMode } = req.body;

        if (!player || !gameMode) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!ethers.isAddress(player)) {
            return res.status(400).json({ error: 'Invalid player address' });
        }

        const validGameMode = gameMode || 'Immortal';
        if (validGameMode !== 'Immortal' && validGameMode !== 'Tournament') {
            return res.status(400).json({ error: 'Invalid game mode' });
        }

        const normalizedPlayer = player.toLowerCase();

        // Invalidate any existing session for this player
        const existingSessionId = playerActiveSessions.get(normalizedPlayer);
        if (existingSessionId) {
            sessions.delete(existingSessionId);
        }

        const sessionId = crypto.randomUUID();
        const ip = req.ip || req.connection.remoteAddress;

        const session = {
            sessionId,
            player,                    // original-case address for signing
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
        playerActiveSessions.set(normalizedPlayer, sessionId);

        console.log(`Session started: ${sessionId} for ${player} (${validGameMode})`);
        res.json({ success: true, sessionId, totalLevels: TOTAL_DEFAULT_LEVELS });
    } catch (error) {
        console.error('Error starting session:', error);
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

        const ip = req.ip || req.connection.remoteAddress;
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
            if (timeSinceLevelStart < MIN_SECONDS_PER_LEVEL) {
                return res.status(400).json({ error: 'Level completed too quickly' });
            }
            currentLevel.completedAt = now;
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

        if (session.finalized) {
            return res.status(400).json({ error: 'Session already finalized' });
        }

        const ip = req.ip || req.connection.remoteAddress;
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

        // Mark session as finalized
        session.finalized = true;
        playerLastFinalize.set(session.normalizedPlayer, Date.now());
        playerActiveSessions.delete(session.normalizedPlayer);

        console.log(`Session finalized: ${sessionId}, score=${totalScore}, player=${session.player}`);

        res.json({
            success: true,
            score: totalScore,
            signature: signed.signature,
            signerAddress: signed.signerAddress,
            timestamp: Date.now()
        });
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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


