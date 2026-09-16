// End-to-end test of the reward claim, against the real server.
//
//   cd chain && npm install && npx hardhat compile      # once, for the artifacts
//   node server/claim-flow-test.mjs
//
// It starts everything it needs and cleans up after itself: a local chain, the
// pool contract funded with mock USDC, a stand-in for X that answers like the
// real one, and the game server pointed at all three. Nothing touches the real
// network, the real X, or the production ledger.
//
// The run takes about three minutes: the anti-cheat rules require a real
// course to take at least three seconds a level, and the test plays by them.

import { spawn } from 'node:child_process';
import { readFileSync, rmSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import net from 'node:net';
import { ethers } from 'ethers';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// Ports are taken fresh every run: a leftover chain from an earlier run would
// otherwise answer instead of ours, with a state the test does not expect.
const freePort = () => new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
        const { port } = probe.address();
        probe.close(() => resolve(port));
    });
});

const CHAIN_PORT = await freePort();
const X_PORT = await freePort();
const GAME_PORT = await freePort();
const RPC = `http://127.0.0.1:${CHAIN_PORT}`;
const GAME = `http://127.0.0.1:${GAME_PORT}`;

// Hardhat's well-known development keys. Public on purpose; worthless.
const KEYS = {
    deployer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    claimSigner: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    relayer: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
    owner: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
};

let passed = 0;
const failures = [];

function check(name, condition, detail) {
    if (condition) {
        passed++;
        console.log(`  ok   ${name}`);
    } else {
        failures.push(name);
        console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`);
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function post(path, body) {
    const response = await fetch(GAME + path, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    });
    return { status: response.status, data: await response.json().catch(() => null) };
}

async function waitFor(url, label, tries = 60) {
    for (let i = 0; i < tries; i++) {
        try {
            const response = await fetch(url);
            if (response.status < 500) return true;
        } catch (e) { /* not up yet */ }
        await sleep(500);
    }
    throw new Error(`${label} did not come up`);
}

// --- a stand-in for X ----------------------------------------------------
//
// Answers the two endpoints the claim service calls. The account it describes
// is switched between requests, which is how the "not Premium" and "too new"
// cases are tested.

let xAccount = null;

function startXStub() {
    const server = http.createServer((req, res) => {
        const url = new URL(req.url, `http://localhost:${X_PORT}`);
        if (req.method === 'POST' && url.pathname === '/token') {
            res.writeHead(200, { 'content-type': 'application/json' });
            return res.end(JSON.stringify({ access_token: 'stub-token', token_type: 'bearer' }));
        }
        if (req.method === 'GET' && url.pathname === '/users/me') {
            res.writeHead(200, { 'content-type': 'application/json' });
            return res.end(JSON.stringify({ data: xAccount }));
        }
        res.writeHead(404).end();
    });
    return new Promise(resolve => server.listen(X_PORT, () => resolve(server)));
}

const premiumAccount = (id, username = 'player') => ({
    id, username,
    verified: true,
    verified_type: 'blue',
    created_at: new Date(Date.now() - 400 * 86400000).toISOString(),
});

// --- the chain -----------------------------------------------------------

async function startChain() {
    const node = spawn('npx', ['hardhat', 'node', '--port', String(CHAIN_PORT)], {
        cwd: join(ROOT, 'chain'),
        stdio: 'ignore',
    });
    // Asked over plain fetch rather than through ethers, whose own retries
    // outlive the check and go on logging after the test has moved on.
    for (let i = 0; i < 60; i++) {
        try {
            const response = await fetch(RPC, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] }),
            });
            if (response.ok) return node;
        } catch (e) { /* not up yet */ }
        await sleep(500);
    }
    throw new Error('local chain did not start');
}

// The file and the contract inside it are named differently, as Hardhat lays
// artifacts out by both.
function artifact(file, name) {
    return JSON.parse(readFileSync(
        join(ROOT, 'chain', 'artifacts', 'contracts', `${file}.sol`, `${name}.json`), 'utf8'
    ));
}

async function deploy(provider) {
    const deployer = new ethers.Wallet(KEYS.deployer, provider);
    const usdcArtifact = artifact('MockUSDC', 'MockUSDC');
    const poolArtifact = artifact('rewardPool', 'ARCMANRewardPool');

    // Nonces are counted here rather than left to the library: the local node
    // reports a pending count that lags behind, and every transaction after the
    // first would be rejected as a repeat.
    let nonce = await provider.getTransactionCount(deployer.address, 'latest');
    const next = () => ({ nonce: nonce++ });

    const usdc = await new ethers.ContractFactory(usdcArtifact.abi, usdcArtifact.bytecode, deployer)
        .deploy(next());
    await usdc.waitForDeployment();

    const pool = await new ethers.ContractFactory(poolArtifact.abi, poolArtifact.bytecode, deployer).deploy(
        await usdc.getAddress(),
        new ethers.Wallet(KEYS.owner).address,
        new ethers.Wallet(KEYS.claimSigner).address,
        3_000_000n,
        next(),
    );
    await pool.waitForDeployment();

    await (await usdc.mint(await pool.getAddress(), 300_000_000n, next())).wait();   // 300 USDC
    // The owner needs gas of its own to withdraw later; the relayer is funded
    // by the local chain already.
    return { usdc, pool };
}

// --- the game server ------------------------------------------------------

function startGameServer(poolAddress, ledgerPath) {
    return spawn('node', ['server.js'], {
        cwd: ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
            ...process.env,
            PORT: String(GAME_PORT),
            PRIVATE_KEY: KEYS.deployer,
            REWARD_POOL_ADDRESS: poolAddress,
            ARC_RPC_URL: RPC,
            CLAIM_SIGNER_KEY: KEYS.claimSigner,
            RELAYER_KEY: KEYS.relayer,
            IDENTITY_SALT: 'test-salt',
            X_CLIENT_ID: 'test-client',
            X_CLIENT_SECRET: 'test-secret',
            X_REDIRECT_URI: `${GAME}/api/claim/x/callback`,
            X_TOKEN_URL: `http://127.0.0.1:${X_PORT}/token`,
            X_USER_URL: `http://127.0.0.1:${X_PORT}/users/me`,
            CLAIM_LEDGER_PATH: ledgerPath,
        },
    });
}

/// Play a whole course the way the game does, respecting the timing rules:
/// the server refuses a level finished in under three seconds, so the test
/// really does take a minute per course.
async function playCourse() {
    const { data: started } = await post('/api/session/start', { gameMode: 'Tournament' });
    const sessionId = started.sessionId;
    for (let level = 0; level < started.totalLevels; level++) {
        await post('/api/session/event', { sessionId, eventType: 'levelStart' });
        await sleep(3100);
        const done = await post('/api/session/event', { sessionId, eventType: 'levelComplete' });
        if (done.status !== 200) throw new Error(`level ${level + 1} was not accepted: ${JSON.stringify(done.data)}`);
    }
    return { sessionId, totalLevels: started.totalLevels, startedAt: Date.now() };
}

/// The browser redirect X would make after the player signs in.
async function completeXSignIn(claimId, state) {
    const response = await fetch(
        `${GAME}/api/claim/x/callback?code=stub-code&state=${encodeURIComponent(claimId + '.' + state)}`
    );
    return { status: response.status, body: await response.text() };
}

const stateFrom = (url) => new URL(url).searchParams.get('state').split('.')[1];

async function claimAs(sessionId, wallet, account) {
    xAccount = account;
    const start = await post('/api/claim/start', { sessionId });
    if (start.status !== 200) return { stage: 'start', ...start };

    const { claimId, walletMessage } = start.data;
    const signature = await wallet.signMessage(walletMessage);
    const walletStep = await post('/api/claim/wallet', { claimId, address: wallet.address, signature });
    if (walletStep.status !== 200) return { stage: 'wallet', claimId, ...walletStep };

    const xStart = await post('/api/claim/x/start', { claimId });
    const callback = await completeXSignIn(claimId, stateFrom(xStart.data.url));
    if (callback.status !== 200) return { stage: 'x', claimId, callback };

    const submit = await post('/api/claim/submit', { claimId });
    return { stage: 'submit', claimId, ...submit };
}

// --- the run ---------------------------------------------------------------

async function main() {
    const workDir = mkdtempSync(join(tmpdir(), 'arcman-claim-'));
    const ledgerPath = join(workDir, 'claims.json');
    let chain, xStub, game, poolProvider;

    try {
        console.log('starting a local chain, a stand-in for X and the game server…');
        chain = await startChain();
        xStub = await startXStub();

        const provider = new ethers.JsonRpcProvider(RPC);
        poolProvider = provider;
        const { usdc, pool } = await deploy(provider);
        const poolAddress = await pool.getAddress();

        game = startGameServer(poolAddress, ledgerPath);
        const serverLog = [];
        game.stdout.on('data', d => serverLog.push(String(d)));
        game.stderr.on('data', d => serverLog.push(String(d)));
        await waitFor(`${GAME}/api/health`, 'game server');

        const health = await (await fetch(`${GAME}/api/health`)).json();
        check('health reports rewards ready', health.rewards === 'ok', JSON.stringify(health));

        const poolInfo = await (await fetch(`${GAME}/api/claim/pool`)).json();
        check('pool reports 100 claims of 3 USDC', poolInfo.remainingClaims === 100 && poolInfo.reward === '3.0',
            JSON.stringify(poolInfo));

        // --- an unfinished course cannot claim ---------------------------
        const { data: fresh } = await post('/api/session/start', { gameMode: 'Tournament' });
        const early = await post('/api/claim/start', { sessionId: fresh.sessionId });
        check('an unfinished course is refused', early.status === 409, JSON.stringify(early.data));

        // --- the honest path ---------------------------------------------
        console.log('playing a full course (this takes about a minute)…');
        const course = await playCourse();

        const player = ethers.Wallet.createRandom();
        const result = await claimAs(course.sessionId, player, premiumAccount('x-account-1'));
        check('the claim is paid', result.status === 200 && result.data && result.data.status === 'paid',
            JSON.stringify(result.data || result));

        const balance = await usdc.balanceOf(player.address);
        check('the player received 3 USDC', balance === 3_000_000n, String(balance));
        check('the transaction is reported back', Boolean(result.data && result.data.txHash));

        const afterPool = await (await fetch(`${GAME}/api/claim/pool`)).json();
        check('the pool is one claim lighter', afterPool.remainingClaims === 99, JSON.stringify(afterPool));

        const ledger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : [];
        check('the ledger records the claim as paid', ledger.length === 1 && ledger[0].status === 'paid');
        check('the ledger holds no X account id',
            !JSON.stringify(ledger).includes('x-account-1'), JSON.stringify(ledger[0]));

        // --- the same player again ----------------------------------------
        const again = await claimAs(course.sessionId, player, premiumAccount('x-account-1'));
        check('the same wallet cannot claim twice',
            again.stage === 'wallet' && again.status === 409, JSON.stringify(again));

        const otherWallet = ethers.Wallet.createRandom();
        const sameX = await claimAs(course.sessionId, otherWallet, premiumAccount('x-account-1'));
        check('the same X account cannot claim with a new wallet',
            sameX.stage === 'x' && sameX.callback.status === 400
            && sameX.callback.body.includes('already claimed'), JSON.stringify(sameX.callback && sameX.callback.status));

        // --- accounts that do not qualify ----------------------------------
        const notPremium = await claimAs(course.sessionId, ethers.Wallet.createRandom(), {
            ...premiumAccount('x-account-2'), verified: false, verified_type: 'none',
        });
        check('a non-Premium X account is refused',
            notPremium.stage === 'x' && notPremium.callback.body.includes('not Premium'));

        const tooNew = await claimAs(course.sessionId, ethers.Wallet.createRandom(), {
            ...premiumAccount('x-account-3'),
            created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        });
        check('a young X account is refused',
            tooNew.stage === 'x' && tooNew.callback.body.includes('too new'));

        // --- proving the wallet --------------------------------------------
        xAccount = premiumAccount('x-account-4');
        const start = await post('/api/claim/start', { sessionId: course.sessionId });
        const impostor = ethers.Wallet.createRandom();
        const victim = ethers.Wallet.createRandom();
        const theirSignature = await impostor.signMessage(start.data.walletMessage);
        const swapped = await post('/api/claim/wallet', {
            claimId: start.data.claimId, address: victim.address, signature: theirSignature,
        });
        check('a signature from another wallet is refused', swapped.status === 403, JSON.stringify(swapped.data));

        const otherClaim = await post('/api/claim/start', { sessionId: course.sessionId });
        const foreignSignature = await impostor.signMessage(otherClaim.data.walletMessage);
        const replayed = await post('/api/claim/wallet', {
            claimId: start.data.claimId, address: impostor.address, signature: foreignSignature,
        });
        check('a signature made for another claim is refused', replayed.status === 403, JSON.stringify(replayed.data));

        // --- submitting without the steps ----------------------------------
        const bare = await post('/api/claim/start', { sessionId: course.sessionId });
        const noWallet = await post('/api/claim/submit', { claimId: bare.data.claimId });
        check('submitting without a wallet is refused',
            noWallet.status === 409 && noWallet.data.reason === 'need_wallet', JSON.stringify(noWallet.data));

        const walletOnly = ethers.Wallet.createRandom();
        await post('/api/claim/wallet', {
            claimId: bare.data.claimId,
            address: walletOnly.address,
            signature: await walletOnly.signMessage(bare.data.walletMessage),
        });
        const noX = await post('/api/claim/submit', { claimId: bare.data.claimId });
        check('submitting without X is refused',
            noX.status === 409 && noX.data.reason === 'need_x', JSON.stringify(noX.data));

        // --- a forged callback ----------------------------------------------
        const forged = await completeXSignIn(bare.data.claimId, 'not-the-state');
        check('a callback with the wrong state is refused',
            forged.status === 400 && forged.body.includes('no longer open'));

        const unknown = await post('/api/claim/status', { claimId: crypto.randomUUID() });
        check('an unknown claim is not found', unknown.status === 404);

        // --- an empty pool ----------------------------------------------------
        const owner = new ethers.Wallet(KEYS.owner, provider);
        const remaining = await pool.poolBalance();
        await (await pool.connect(owner).withdraw(owner.address, remaining, {
            nonce: await provider.getTransactionCount(owner.address, 'latest'),
        })).wait();

        const emptyCourse = await playCourse();

        const onEmpty = await claimAs(emptyCourse.sessionId, ethers.Wallet.createRandom(), premiumAccount('x-account-5'));
        check('an empty pool is reported honestly',
            onEmpty.status === 409 && onEmpty.data.reason === 'pool_empty', JSON.stringify(onEmpty.data));

        const emptyInfo = await (await fetch(`${GAME}/api/claim/pool`)).json();
        check('the pool reports itself closed', emptyInfo.open === false, JSON.stringify(emptyInfo));

        const finalLedger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : [];
        check('nothing was written for the failed claim', finalLedger.length === 1, JSON.stringify(finalLedger.length));

        check('the server logged no unexpected error',
            !serverLog.join('').includes('REWARDS UNAVAILABLE'));
    } finally {
        if (game) game.kill();
        if (xStub) xStub.close();
        if (chain) chain.kill();
        if (poolProvider) poolProvider.destroy();   // or its polling keeps the test alive
        rmSync(workDir, { recursive: true, force: true });
    }

    console.log(`\n${passed} passed, ${failures.length} failed`);
    if (failures.length) {
        console.log('failed: ' + failures.join(', '));
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
