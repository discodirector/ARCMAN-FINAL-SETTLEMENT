// Tests for repo/rewardPool.sol.
//
// The interesting cases are the dishonest ones: forged signatures, replays,
// claims relayed by strangers, an empty pool, a blocked address.

const { expect } = require('chai');
const { ethers } = require('hardhat');
const { time } = require('@nomicfoundation/hardhat-network-helpers');

const USDC = (n) => BigInt(Math.round(n * 1e6));   // 6 decimals, like Arc USDC
const REWARD = USDC(3);
const COURSE = 1n;

describe('ARCMANRewardPool', function () {
  let usdc, pool, owner, signer, relayer, player, other, stranger;
  let domain;

  const types = {
    Claim: [
      { name: 'courseId', type: 'uint256' },
      { name: 'player', type: 'address' },
      { name: 'identityHash', type: 'bytes32' },
      { name: 'amount', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };

  const identity = (handle) => ethers.keccak256(ethers.toUtf8Bytes('salt:' + handle));

  async function sign(by, { courseId = COURSE, player: who, identityHash, amount = REWARD, deadline }) {
    return by.signTypedData(domain, types, {
      courseId, player: who, identityHash, amount, deadline,
    });
  }

  async function futureDeadline() {
    return BigInt(await time.latest()) + 3600n;
  }

  beforeEach(async function () {
    [owner, signer, relayer, player, other, stranger] = await ethers.getSigners();

    usdc = await (await ethers.getContractFactory('MockUSDC')).deploy();
    pool = await (await ethers.getContractFactory('ARCMANRewardPool'))
      .deploy(await usdc.getAddress(), owner.address, signer.address, REWARD);

    await usdc.mint(await pool.getAddress(), USDC(300));   // the pilot budget

    domain = {
      name: 'ARCMAN Reward Pool',
      version: '1',
      chainId: (await ethers.provider.getNetwork()).chainId,
      verifyingContract: await pool.getAddress(),
    };
  });

  describe('a legitimate claim', function () {
    it('pays the player, not the relayer who sent it', async function () {
      const id = identity('alice');
      const deadline = await futureDeadline();
      const signature = await sign(signer, { player: player.address, identityHash: id, deadline });

      await expect(pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature))
        .to.emit(pool, 'Claimed').withArgs(COURSE, player.address, id, REWARD);

      expect(await usdc.balanceOf(player.address)).to.equal(REWARD);
      expect(await usdc.balanceOf(relayer.address)).to.equal(0n);
      expect(await pool.poolBalance()).to.equal(USDC(297));
      expect(await pool.totalPaid()).to.equal(REWARD);
      expect(await pool.claimCount()).to.equal(1n);
    });

    it('needs no gas from the player', async function () {
      const id = identity('alice');
      const deadline = await futureDeadline();
      const signature = await sign(signer, { player: player.address, identityHash: id, deadline });

      const before = await ethers.provider.getBalance(player.address);
      await pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature);
      const after = await ethers.provider.getBalance(player.address);

      expect(after).to.equal(before);   // the player never sent a transaction
    });

    it('reports what is left before and after', async function () {
      expect(await pool.remainingClaims()).to.equal(100n);

      const id = identity('alice');
      const deadline = await futureDeadline();
      await pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline,
        await sign(signer, { player: player.address, identityHash: id, deadline }));

      expect(await pool.remainingClaims()).to.equal(99n);
    });
  });

  describe('claiming twice', function () {
    let id, deadline, signature;

    beforeEach(async function () {
      id = identity('alice');
      deadline = await futureDeadline();
      signature = await sign(signer, { player: player.address, identityHash: id, deadline });
      await pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature);
    });

    it('rejects the very same claim replayed', async function () {
      await expect(pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature))
        .to.be.revertedWithCustomError(pool, 'WalletAlreadyClaimed');
    });

    it('rejects the same wallet with a second X account', async function () {
      const second = identity('alice-alt');
      const d = await futureDeadline();
      await expect(pool.connect(relayer).claim(COURSE, player.address, second, REWARD, d,
        await sign(signer, { player: player.address, identityHash: second, deadline: d })))
        .to.be.revertedWithCustomError(pool, 'WalletAlreadyClaimed');
    });

    it('rejects the same X account with a fresh wallet', async function () {
      const d = await futureDeadline();
      await expect(pool.connect(relayer).claim(COURSE, other.address, id, REWARD, d,
        await sign(signer, { player: other.address, identityHash: id, deadline: d })))
        .to.be.revertedWithCustomError(pool, 'IdentityAlreadyClaimed');
    });

    it('still allows a different player', async function () {
      const id2 = identity('bob');
      const d = await futureDeadline();
      await pool.connect(relayer).claim(COURSE, other.address, id2, REWARD, d,
        await sign(signer, { player: other.address, identityHash: id2, deadline: d }));
      expect(await usdc.balanceOf(other.address)).to.equal(REWARD);
    });

    it('allows the same person on a different course', async function () {
      const d = await futureDeadline();
      await pool.connect(relayer).claim(2n, player.address, id, REWARD, d,
        await sign(signer, { courseId: 2n, player: player.address, identityHash: id, deadline: d }));
      expect(await usdc.balanceOf(player.address)).to.equal(REWARD * 2n);
    });
  });

  describe('forgery', function () {
    it('rejects a signature from anyone but the backend', async function () {
      const id = identity('mallory');
      const deadline = await futureDeadline();
      await expect(pool.connect(stranger).claim(COURSE, stranger.address, id, REWARD, deadline,
        await sign(stranger, { player: stranger.address, identityHash: id, deadline })))
        .to.be.revertedWithCustomError(pool, 'BadSignature');
    });

    it('rejects a claim whose recipient was swapped after signing', async function () {
      const id = identity('alice');
      const deadline = await futureDeadline();
      const signature = await sign(signer, { player: player.address, identityHash: id, deadline });

      await expect(pool.connect(stranger).claim(COURSE, stranger.address, id, REWARD, deadline, signature))
        .to.be.revertedWithCustomError(pool, 'BadSignature');
    });

    it('rejects a claim whose amount was raised after signing', async function () {
      const id = identity('alice');
      const deadline = await futureDeadline();
      const signature = await sign(signer, { player: player.address, identityHash: id, deadline });

      await expect(pool.connect(relayer).claim(COURSE, player.address, id, USDC(2), deadline, signature))
        .to.be.revertedWithCustomError(pool, 'BadSignature');
    });

    it('rejects an amount above the configured reward even if signed', async function () {
      const id = identity('alice');
      const deadline = await futureDeadline();
      const amount = USDC(300);
      await expect(pool.connect(relayer).claim(COURSE, player.address, id, amount, deadline,
        await sign(signer, { player: player.address, identityHash: id, amount, deadline })))
        .to.be.revertedWithCustomError(pool, 'AmountTooHigh');
    });

    it('rejects a signature for another chain', async function () {
      const id = identity('alice');
      const deadline = await futureDeadline();
      const foreign = { ...domain, chainId: 999n };
      const signature = await signer.signTypedData(foreign, types, {
        courseId: COURSE, player: player.address, identityHash: id, amount: REWARD, deadline,
      });

      await expect(pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature))
        .to.be.revertedWithCustomError(pool, 'BadSignature');
    });

    it('rejects a signature made for another pool contract', async function () {
      const id = identity('alice');
      const deadline = await futureDeadline();
      const twin = await (await ethers.getContractFactory('ARCMANRewardPool'))
        .deploy(await usdc.getAddress(), owner.address, signer.address, REWARD);
      const signature = await signer.signTypedData(
        { ...domain, verifyingContract: await twin.getAddress() }, types,
        { courseId: COURSE, player: player.address, identityHash: id, amount: REWARD, deadline });

      await expect(pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature))
        .to.be.revertedWithCustomError(pool, 'BadSignature');
    });

    it('rejects malformed and malleable signatures', async function () {
      const id = identity('alice');
      const deadline = await futureDeadline();
      const good = await sign(signer, { player: player.address, identityHash: id, deadline });

      await expect(pool.claim(COURSE, player.address, id, REWARD, deadline, '0x1234'))
        .to.be.revertedWithCustomError(pool, 'BadSignature');

      // Flip s to the other half of the curve and v with it — the classic
      // malleability trick that turns one signature into a second valid one.
      // Assembled by hand: ethers itself refuses to serialise a non-canonical s.
      const sig = ethers.Signature.from(good);
      const N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
      const flipped = ethers.concat([
        sig.r,
        ethers.toBeHex(N - BigInt(sig.s), 32),
        ethers.toBeHex(sig.v === 27 ? 28 : 27, 1),
      ]);

      await expect(pool.claim(COURSE, player.address, id, REWARD, deadline, flipped))
        .to.be.revertedWithCustomError(pool, 'BadSignature');
    });

    it('rejects an expired signature', async function () {
      const id = identity('alice');
      const deadline = BigInt(await time.latest()) + 60n;
      const signature = await sign(signer, { player: player.address, identityHash: id, deadline });
      await time.increase(120);

      await expect(pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature))
        .to.be.revertedWithCustomError(pool, 'DeadlinePassed');
    });

    it('rejects claims signed by the old key after a rotation', async function () {
      const id = identity('alice');
      const deadline = await futureDeadline();
      const signature = await sign(signer, { player: player.address, identityHash: id, deadline });

      await pool.connect(owner).setSigner(other.address);

      await expect(pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature))
        .to.be.revertedWithCustomError(pool, 'BadSignature');
    });
  });

  describe('an empty pool', function () {
    it('reverts with PoolEmpty and leaves the claim usable later', async function () {
      await pool.connect(owner).withdraw(owner.address, USDC(300));
      expect(await pool.remainingClaims()).to.equal(0n);

      const id = identity('alice');
      const deadline = await futureDeadline();
      const signature = await sign(signer, { player: player.address, identityHash: id, deadline });

      await expect(pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature))
        .to.be.revertedWithCustomError(pool, 'PoolEmpty');
      expect(await pool.walletClaimed(COURSE, player.address)).to.equal(false);

      // Topped up, the same signature goes through
      await usdc.mint(await pool.getAddress(), USDC(10));
      await pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature);
      expect(await usdc.balanceOf(player.address)).to.equal(REWARD);
    });

    it('reports a partly funded pool honestly', async function () {
      await pool.connect(owner).withdraw(owner.address, USDC(295));
      expect(await pool.remainingClaims()).to.equal(1n);
      expect(await pool.claimable(COURSE, player.address, identity('alice'))).to.equal(true);

      const id = identity('alice');
      const deadline = await futureDeadline();
      await pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline,
        await sign(signer, { player: player.address, identityHash: id, deadline }));

      expect(await pool.remainingClaims()).to.equal(0n);
      expect(await pool.claimable(COURSE, other.address, identity('bob'))).to.equal(false);
    });
  });

  describe('a failing transfer', function () {
    it('rolls the claim back when the player is blocklisted', async function () {
      await usdc.setBlocked(player.address, true);
      const id = identity('alice');
      const deadline = await futureDeadline();
      const signature = await sign(signer, { player: player.address, identityHash: id, deadline });

      await expect(pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature))
        .to.be.revertedWith('Blocklisted');

      expect(await pool.walletClaimed(COURSE, player.address)).to.equal(false);
      expect(await pool.totalPaid()).to.equal(0n);
    });

    it('rejects a token that returns false instead of reverting', async function () {
      await usdc.setReturnFalse(true);
      const id = identity('alice');
      const deadline = await futureDeadline();
      await expect(pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline,
        await sign(signer, { player: player.address, identityHash: id, deadline })))
        .to.be.revertedWithCustomError(pool, 'TransferFailed');
    });
  });

  describe('funding', function () {
    it('accepts money from anyone, by fund() or a plain transfer', async function () {
      await usdc.mint(stranger.address, USDC(50));
      await usdc.connect(stranger).approve(await pool.getAddress(), USDC(50));

      await expect(pool.connect(stranger).fund(USDC(50)))
        .to.emit(pool, 'Funded').withArgs(stranger.address, USDC(50));
      expect(await pool.poolBalance()).to.equal(USDC(350));

      // A fee router will simply transfer, without calling fund()
      await usdc.mint(other.address, USDC(25));
      await usdc.connect(other).transfer(await pool.getAddress(), USDC(25));
      expect(await pool.poolBalance()).to.equal(USDC(375));
      expect(await pool.remainingClaims()).to.equal(125n);
    });

    // On Arc the gas token is USDC itself — one balance, seen either as the
    // chain's own currency or through the ERC-20. A wallet told to "send USDC"
    // therefore sends value and makes no token transfer at all, so a pool that
    // cannot receive value refuses the money outright. That is exactly what
    // happened on the first attempt to fund this pool for real.
    //
    // Here the two are separate tokens, so this can only show that the transfer
    // is accepted rather than reverted; that it then shows up in poolBalance was
    // checked against Arc itself, where the balances are one and the same.
    it('takes a plain transfer instead of refusing it', async function () {
      await expect(stranger.sendTransaction({ to: await pool.getAddress(), value: ethers.parseEther('1') }))
        .to.emit(pool, 'Funded');
    });
  });

  describe('the owner', function () {
    it('keeps strangers out of every privileged call', async function () {
      await expect(pool.connect(stranger).withdraw(stranger.address, USDC(1)))
        .to.be.revertedWithCustomError(pool, 'NotOwner');
      await expect(pool.connect(stranger).setSigner(stranger.address))
        .to.be.revertedWithCustomError(pool, 'NotOwner');
      await expect(pool.connect(stranger).setMaxReward(USDC(100)))
        .to.be.revertedWithCustomError(pool, 'NotOwner');
      await expect(pool.connect(stranger).setPaused(true))
        .to.be.revertedWithCustomError(pool, 'NotOwner');
      await expect(pool.connect(stranger).transferOwnership(stranger.address))
        .to.be.revertedWithCustomError(pool, 'NotOwner');
    });

    it('stops claims while paused', async function () {
      await pool.connect(owner).setPaused(true);
      const id = identity('alice');
      const deadline = await futureDeadline();
      const signature = await sign(signer, { player: player.address, identityHash: id, deadline });

      await expect(pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature))
        .to.be.revertedWithCustomError(pool, 'Paused');
      expect(await pool.claimable(COURSE, player.address, id)).to.equal(false);

      await pool.connect(owner).setPaused(false);
      await pool.connect(relayer).claim(COURSE, player.address, id, REWARD, deadline, signature);
      expect(await usdc.balanceOf(player.address)).to.equal(REWARD);
    });

    it('hands ownership over in two steps', async function () {
      await pool.connect(owner).transferOwnership(other.address);
      expect(await pool.owner()).to.equal(owner.address);   // not yet

      await expect(pool.connect(stranger).acceptOwnership())
        .to.be.revertedWithCustomError(pool, 'NotPendingOwner');

      await pool.connect(other).acceptOwnership();
      expect(await pool.owner()).to.equal(other.address);
      await expect(pool.connect(owner).setPaused(true))
        .to.be.revertedWithCustomError(pool, 'NotOwner');
    });

    it('cannot be set to the zero address anywhere', async function () {
      await expect(pool.connect(owner).setSigner(ethers.ZeroAddress))
        .to.be.revertedWithCustomError(pool, 'ZeroAddress');
      await expect(pool.connect(owner).transferOwnership(ethers.ZeroAddress))
        .to.be.revertedWithCustomError(pool, 'ZeroAddress');
      await expect(pool.connect(owner).withdraw(ethers.ZeroAddress, USDC(1)))
        .to.be.revertedWithCustomError(pool, 'ZeroAddress');
    });

    it('applies a changed reward to later claims', async function () {
      await pool.connect(owner).setMaxReward(USDC(5));
      expect(await pool.remainingClaims()).to.equal(60n);

      const id = identity('alice');
      const deadline = await futureDeadline();
      await pool.connect(relayer).claim(COURSE, player.address, id, USDC(5), deadline,
        await sign(signer, { player: player.address, identityHash: id, amount: USDC(5), deadline }));
      expect(await usdc.balanceOf(player.address)).to.equal(USDC(5));
    });
  });

  describe('the digest', function () {
    it('matches what ethers signs, so the server cannot drift from the contract', async function () {
      const id = identity('alice');
      const deadline = await futureDeadline();
      const expected = ethers.TypedDataEncoder.hash(domain, types, {
        courseId: COURSE, player: player.address, identityHash: id, amount: REWARD, deadline,
      });
      expect(await pool.claimDigest(COURSE, player.address, id, REWARD, deadline)).to.equal(expected);
    });
  });
});
