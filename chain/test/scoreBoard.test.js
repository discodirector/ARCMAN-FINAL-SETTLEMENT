const { expect } = require('chai');
const { ethers } = require('hardhat');

// The server signs the bare hash and tells the chain it is 32 bytes long, which
// is what the contract reproduces. Signing the same way here is the only way to
// know the two still agree.
const signScore = (wallet, data, where) => {
    const packed = ethers.solidityPacked(
        ['uint256', 'address', 'address', 'uint256', 'uint256', 'uint256', 'string'],
        [where.chainId, where.board, data.player, data.score, data.levelId, data.nonce, data.gameMode],
    );
    const messageHash = ethers.keccak256(packed);
    const signedHash = ethers.keccak256(
        ethers.solidityPacked(['string', 'bytes32'], ['\x19Ethereum Signed Message:\n32', messageHash]),
    );
    const signature = wallet.signingKey.sign(signedHash);
    return ethers.concat([signature.r, signature.s, signature.v === 27 ? '0x1b' : '0x1c']);
};

const score = (player, points, over = {}) => ({
    player,
    score: points,
    levelId: 20,
    nonce: BigInt(over.nonce ?? Math.floor(Math.random() * 2 ** 48)),
    gameMode: over.gameMode ?? 'Tournament',
});

describe('ARCMANScoreBoard', function () {
    let board, owner, signer, relayer, alice, bob, carol, here;

    beforeEach(async function () {
        [owner, relayer, alice, bob, carol] = await ethers.getSigners();
        signer = ethers.Wallet.createRandom();
        const Board = await ethers.getContractFactory('ARCMANScoreBoard');
        board = await Board.deploy(owner.address, signer.address);
        await board.waitForDeployment();
        here = {
            chainId: (await ethers.provider.getNetwork()).chainId,
            board: await board.getAddress(),
        };
    });

    const sign = (wallet, data) => signScore(wallet, data, here);

    const submit = (data, from = relayer, wallet = signer) =>
        board.connect(from).finalizeScore(data, sign(wallet, data));

    describe('recording a score', function () {
        it('lets anyone send a score the server signed', async function () {
            const data = score(alice.address, 1500n);
            await expect(submit(data))            // sent by the relayer, not Alice
                .to.emit(board, 'ScoreSubmitted')
                .withArgs(alice.address, 1500n, 20n, 'Tournament');

            const [best, levelId] = await board.getPlayerScore(alice.address, 'Tournament');
            expect(best).to.equal(1500n);
            expect(levelId).to.equal(20n);
        });

        it('lets the player send it themselves just as well', async function () {
            await submit(score(alice.address, 900n), alice);
            const [best] = await board.getPlayerScore(alice.address, 'Tournament');
            expect(best).to.equal(900n);
        });

        it('credits the player named in the signature, not the sender', async function () {
            await submit(score(alice.address, 700n), bob);
            const [aliceBest] = await board.getPlayerScore(alice.address, 'Tournament');
            const [bobBest] = await board.getPlayerScore(bob.address, 'Tournament');
            expect(aliceBest).to.equal(700n);
            expect(bobBest).to.equal(0n);
        });

        it('keeps the better of two runs', async function () {
            await submit(score(alice.address, 1000n));
            await submit(score(alice.address, 400n));
            const [best] = await board.getPlayerScore(alice.address, 'Tournament');
            expect(best).to.equal(1000n);
        });

        it('keeps each game mode apart', async function () {
            await submit(score(alice.address, 1000n, { gameMode: 'Tournament' }));
            await submit(score(alice.address, 50n, { gameMode: 'Immortal' }));
            const [tournament] = await board.getPlayerScore(alice.address, 'Tournament');
            const [immortal] = await board.getPlayerScore(alice.address, 'Immortal');
            expect(tournament).to.equal(1000n);
            expect(immortal).to.equal(50n);
        });
    });

    describe('refusals', function () {
        it('refuses a signature from another key', async function () {
            const stranger = ethers.Wallet.createRandom();
            await expect(submit(score(alice.address, 100n), relayer, stranger))
                .to.be.revertedWithCustomError(board, 'BadSignature');
        });

        it('refuses a signature raised to a bigger score', async function () {
            const data = score(alice.address, 100n);
            const signature = sign(signer, data);
            await expect(board.connect(relayer).finalizeScore({ ...data, score: 999999n }, signature))
                .to.be.revertedWithCustomError(board, 'BadSignature');
        });

        it('refuses a signature moved to another player', async function () {
            const data = score(alice.address, 100n);
            const signature = sign(signer, data);
            await expect(board.connect(relayer).finalizeScore({ ...data, player: bob.address }, signature))
                .to.be.revertedWithCustomError(board, 'BadSignature');
        });

        it('refuses the same signature twice', async function () {
            const data = score(alice.address, 100n);
            const signature = sign(signer, data);
            await board.connect(relayer).finalizeScore(data, signature);
            await expect(board.connect(relayer).finalizeScore(data, signature))
                .to.be.revertedWithCustomError(board, 'SignatureAlreadyUsed');
        });

        it('refuses the mirror image of a used signature', async function () {
            const data = score(alice.address, 100n);
            const signature = sign(signer, data);
            await board.connect(relayer).finalizeScore(data, signature);

            // Same signature, flipped into the upper half of the curve. ethers
            // will not build one, so it is assembled by hand.
            const N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
            const raw = ethers.getBytes(signature);
            const s = BigInt(ethers.hexlify(raw.slice(32, 64)));
            const flipped = ethers.concat([
                raw.slice(0, 32),
                ethers.zeroPadValue(ethers.toBeHex(N - s), 32),
                new Uint8Array([raw[64] === 27 ? 28 : 27]),
            ]);
            await expect(board.connect(relayer).finalizeScore(data, flipped))
                .to.be.revertedWithCustomError(board, 'BadSignature');
        });

        it('refuses a signature meant for another board', async function () {
            // The same key signs for both, as it would if one server served a
            // test network and the real one. Play on a test network is free and
            // endless, so a score must not travel between them.
            const Board = await ethers.getContractFactory('ARCMANScoreBoard');
            const elsewhere = await Board.deploy(owner.address, signer.address);
            await elsewhere.waitForDeployment();

            const data = score(alice.address, 5000n);
            const forElsewhere = signScore(signer, data, {
                chainId: here.chainId,
                board: await elsewhere.getAddress(),
            });
            await expect(board.connect(relayer).finalizeScore(data, forElsewhere))
                .to.be.revertedWithCustomError(board, 'BadSignature');
            // and it is perfectly good where it was meant to go
            await expect(elsewhere.connect(relayer).finalizeScore(data, forElsewhere))
                .to.emit(elsewhere, 'ScoreSubmitted');
        });

        it('refuses a score of zero', async function () {
            await expect(submit(score(alice.address, 0n)))
                .to.be.revertedWithCustomError(board, 'ZeroScore');
        });

        it('refuses an empty game mode', async function () {
            await expect(submit(score(alice.address, 10n, { gameMode: '' })))
                .to.be.revertedWithCustomError(board, 'NoGameMode');
        });

        it('refuses the zero address as a player', async function () {
            await expect(submit(score(ethers.ZeroAddress, 10n)))
                .to.be.revertedWithCustomError(board, 'ZeroAddress');
        });

        it('refuses a signature of the wrong length', async function () {
            await expect(board.connect(relayer).finalizeScore(score(alice.address, 10n), '0x1234'))
                .to.be.revertedWithCustomError(board, 'BadSignature');
        });
    });

    describe('the trail the ranking is built from', function () {
        it('announces a new best only when the run beats the old one', async function () {
            await expect(submit(score(alice.address, 500n)))
                .to.emit(board, 'NewBestScore');
            await expect(submit(score(alice.address, 200n)))
                .to.not.emit(board, 'NewBestScore');
            await expect(submit(score(alice.address, 900n)))
                .to.emit(board, 'NewBestScore');
        });

        it('announces every finished run either way', async function () {
            await submit(score(alice.address, 500n));
            await expect(submit(score(alice.address, 200n)))
                .to.emit(board, 'ScoreSubmitted')
                .withArgs(alice.address, 200n, 20n, 'Tournament');
        });

        it('carries everything a ranking needs', async function () {
            await submit(score(alice.address, 300n));
            await submit(score(bob.address, 900n));
            await submit(score(alice.address, 1200n));
            await submit(score(bob.address, 100n));       // no improvement

            const logs = await board.queryFilter(board.filters.NewBestScore());
            const best = new Map();
            for (const log of logs) best.set(log.args.player, log.args.score);
            const ranking = [...best.entries()].sort((a, b) => Number(b[1] - a[1]));

            expect(ranking.map(r => r[0])).to.deep.equal([alice.address, bob.address]);
            expect(ranking.map(r => r[1])).to.deep.equal([1200n, 900n]);
        });
    });

    describe('the keys', function () {
        it('lets the owner change the signing key', async function () {
            const next = ethers.Wallet.createRandom();
            await expect(board.connect(owner).setServerSigner(next.address))
                .to.emit(board, 'SignerChanged')
                .withArgs(signer.address, next.address);

            await submit(score(alice.address, 100n), relayer, next);
            const [best] = await board.getPlayerScore(alice.address, 'Tournament');
            expect(best).to.equal(100n);
        });

        it('stops honouring the old key once it is replaced', async function () {
            await board.connect(owner).setServerSigner(ethers.Wallet.createRandom().address);
            await expect(submit(score(alice.address, 100n)))
                .to.be.revertedWithCustomError(board, 'BadSignature');
        });

        it('lets nobody else change it', async function () {
            await expect(board.connect(alice).setServerSigner(alice.address))
                .to.be.revertedWithCustomError(board, 'NotOwner');
        });

        it('refuses the zero address as a signer', async function () {
            await expect(board.connect(owner).setServerSigner(ethers.ZeroAddress))
                .to.be.revertedWithCustomError(board, 'ZeroAddress');
        });

        it('hands over ownership in two steps', async function () {
            await board.connect(owner).transferOwnership(alice.address);
            expect(await board.owner()).to.equal(owner.address);   // not yet

            await expect(board.connect(bob).acceptOwnership())
                .to.be.revertedWithCustomError(board, 'NotPendingOwner');

            await board.connect(alice).acceptOwnership();
            expect(await board.owner()).to.equal(alice.address);
            expect(await board.pendingOwner()).to.equal(ethers.ZeroAddress);
        });
    });
});
