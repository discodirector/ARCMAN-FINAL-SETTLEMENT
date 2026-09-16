// A run that starts without a wallet must still be able to put its score
// on-chain: the player names the wallet at the end by signing for it. This
// plays a whole course against a running server and checks that path, plus the
// refusals that keep someone else's wallet out of it.
//
//   node server/finalize-flow-test.mjs [http://localhost:3000]

import { ethers } from 'ethers';

const base = process.argv[2] || 'http://localhost:3000';
const MIN_SECONDS_PER_LEVEL = 3;
const wait = ms => new Promise(r => setTimeout(r, ms));

let passed = 0, failed = 0;
const check = (name, ok, detail) => {
    if (ok) { passed++; console.log(`  ok   ${name}`); }
    else { failed++; console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`); }
};

const post = async (path, body) => {
    const response = await fetch(base + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    let data = null;
    try { data = await response.json(); } catch { /* empty body */ }
    return { status: response.status, data };
};

const playCourse = async () => {
    const started = await post('/api/session/start', { gameMode: 'Tournament' });
    if (started.status !== 200) throw new Error('session start failed: ' + JSON.stringify(started.data));
    const { sessionId, totalLevels, walletMessage } = started.data;

    for (let i = 0; i < totalLevels; i++) {
        const start = await post('/api/session/event', { sessionId, eventType: 'levelStart' });
        if (start.status !== 200) throw new Error('levelStart: ' + JSON.stringify(start.data));
        await wait((MIN_SECONDS_PER_LEVEL + 0.1) * 1000);
        const done = await post('/api/session/event', { sessionId, eventType: 'levelComplete' });
        if (done.status !== 200) throw new Error('levelComplete: ' + JSON.stringify(done.data));
    }
    return { sessionId, walletMessage };
};

console.log(`\nFinalization after a walletless run — against ${base}\n`);

const health = await fetch(base + '/api/health').then(r => r.json()).catch(() => null);
if (!health) { console.error(`No server at ${base}. Start it with: node server.js`); process.exit(1); }

console.log('Playing a course (about a minute)…');
const { sessionId, walletMessage } = await playCourse();

check('a walletless run is offered a message to sign', typeof walletMessage === 'string' && walletMessage.includes(sessionId), walletMessage);

// Without a wallet the score cannot be signed — that is the bug this fixes.
const tooEarly = await post('/api/session/finalize', { sessionId, nonce: 'abc123' });
check('finalizing before naming a wallet is refused', tooEarly.status === 400, JSON.stringify(tooEarly.data));

const player = ethers.Wallet.createRandom();
const stranger = ethers.Wallet.createRandom();

// Someone else's address with your signature, and your address with theirs.
const mismatched = await post('/api/session/wallet', {
    sessionId, address: stranger.address, signature: await player.signMessage(walletMessage),
});
check('a signature that does not match the address is refused', mismatched.status === 401, JSON.stringify(mismatched.data));

const forged = await post('/api/session/wallet', {
    sessionId, address: player.address, signature: await player.signMessage('ARCMAN — score finalization\n\nSession: somebody-else'),
});
check('a signature over another message is refused', forged.status === 401, JSON.stringify(forged.data));

const attached = await post('/api/session/wallet', {
    sessionId, address: player.address, signature: await player.signMessage(walletMessage),
});
check('the player can name their own wallet', attached.status === 200 && attached.data.player === player.address, JSON.stringify(attached.data));

const again = await post('/api/session/wallet', {
    sessionId, address: player.address, signature: await player.signMessage(walletMessage),
});
check('naming the same wallet twice is harmless', again.status === 200, JSON.stringify(again.data));

const hijack = await post('/api/session/wallet', {
    sessionId, address: stranger.address, signature: await stranger.signMessage(walletMessage),
});
check('a second, different wallet cannot take the run', hijack.status === 409, JSON.stringify(hijack.data));

const finalized = await post('/api/session/finalize', { sessionId, nonce: 'run-' + Date.now() });
check('the run is finalized for the named wallet', finalized.status === 200 && finalized.data.success, JSON.stringify(finalized.data));
check('the score is a real number', Number(finalized.data && finalized.data.score) > 0, JSON.stringify(finalized.data && finalized.data.score));

const relayed = finalized.data && finalized.data.relayed;
if (relayed) {
    check('the score went on-chain at our expense', typeof finalized.data.txHash === 'string' && finalized.data.txHash.length === 66, finalized.data.txHash);

    const board = await fetch(`${base}/api/leaderboard?gameMode=Tournament`).then(r => r.json());
    const seat = board.players.findIndex(p => p.toLowerCase() === player.address.toLowerCase());
    check('the ranking, read back from the chain, holds the player', seat >= 0, JSON.stringify(board.players));
    check('with the score the server computed', String(board.scores[seat]) === String(finalized.data.score), `${board.scores[seat]} vs ${finalized.data.score}`);
} else {
    check('the signature is handed back to be sent by the player', typeof finalized.data?.signature === 'string' && finalized.data.signature.length === 132, finalized.data?.signature);
}

const twice = await post('/api/session/finalize', { sessionId, nonce: 'again' });
check('asking again returns the same run rather than signing a second one',
    twice.status === 200 && String(twice.data.score) === String(finalized.data.score)
        && (!relayed || twice.data.txHash === finalized.data.txHash),
    JSON.stringify(twice.data));

const late = await post('/api/session/wallet', {
    sessionId, address: player.address, signature: await player.signMessage(walletMessage),
});
check('a finalized run cannot change its wallet', late.status === 400, JSON.stringify(late.data));

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
