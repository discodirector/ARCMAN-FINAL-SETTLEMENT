// How fast a run may be played.
//
// A level finished in under three seconds used to be thrown away, silently, and
// the course quietly became nineteen levels of twenty. That punished a good
// player who saw the angle at once, and stopped no script at all — a script
// simply waits. Now the level counts and is marked, and the run is judged whole.
//
// This plays real courses against a running server, so it takes a few minutes.
//
//   node server/pace-test.mjs [http://localhost:3000]

import { ethers } from 'ethers';

const base = process.argv[2] || 'http://localhost:3000';
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
    return { status: response.status, data: await response.json().catch(() => null) };
};

/**
 * Play a whole course, choosing for each level how long it takes.
 *
 * The gap after a level keeps the run's total time above the separate
 * whole-course rule, so that only the per-level pace is under test.
 */
const playCourse = async (secondsFor) => {
    const started = await post('/api/session/start', { gameMode: 'Tournament' });
    const { sessionId, totalLevels, walletMessage } = started.data;
    const refused = [];

    for (let i = 0; i < totalLevels; i++) {
        await post('/api/session/event', { sessionId, eventType: 'levelStart' });
        const seconds = secondsFor(i);
        await wait(seconds * 1000);
        const done = await post('/api/session/event', { sessionId, eventType: 'levelComplete' });
        if (done.status !== 200) refused.push({ level: i + 1, error: done.data && done.data.error });
        await wait(Math.max(0, 3.2 - seconds) * 1000);   // keep the whole course above its own floor
    }
    // A run names its wallet at the end, as a player does; finalization asks
    // for one before it looks at anything else.
    const wallet = ethers.Wallet.createRandom();
    await post('/api/session/wallet', {
        sessionId, address: wallet.address, signature: await wallet.signMessage(walletMessage),
    });

    return { sessionId, refused };
};

console.log(`\nHow fast a run may be played — against ${base}\n`);
if (!await fetch(base + '/api/health').then(r => r.ok).catch(() => false)) {
    console.error(`No server at ${base}. Start it with: node server.js`);
    process.exit(1);
}

// --- a good player, quick on one level ------------------------------------

console.log('Playing a course with one very quick level (about a minute)…');
const quickOnce = await playCourse(i => (i === 7 ? 0.8 : 3.1));

check('a level finished in under three seconds is still recorded',
    quickOnce.refused.length === 0, JSON.stringify(quickOnce.refused));

const finalized = await post('/api/session/finalize', { sessionId: quickOnce.sessionId, nonce: 'pace-' + Date.now() });
check('one quick level does not spoil the run',
    finalized.status === 400
        ? !/too quickly to have been played/.test(finalized.data.error || '')
        : finalized.status === 200,
    JSON.stringify(finalized.data));

// --- a run that was never really played -----------------------------------

console.log('\nPlaying a course where almost nothing was played (about a minute)…');
const alwaysQuick = await playCourse(i => (i < 4 ? 3.1 : 0.8));

check('those levels are recorded too, not thrown away',
    alwaysQuick.refused.length === 0, JSON.stringify(alwaysQuick.refused));

const refusedRun = await post('/api/session/finalize', { sessionId: alwaysQuick.sessionId, nonce: 'pace-' + Date.now() });
check('a run made mostly of them is refused',
    refusedRun.status === 400 && /too quickly to have been played/.test(refusedRun.data.error || ''),
    JSON.stringify(refusedRun.data));

const refusedClaim = await post('/api/claim/start', { sessionId: alwaysQuick.sessionId });
check('and so is its reward',
    refusedClaim.status === 409 && /too quickly to have been played/.test(refusedClaim.data.error || ''),
    JSON.stringify(refusedClaim.data));

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
