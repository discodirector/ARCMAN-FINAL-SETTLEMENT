// A full claim, end to end, against a deployed pool — the rehearsal for what
// the backend will do in production.
//
//   POOL=0x… SIGNER_KEY=0x… DEPLOYER_KEY=0x… PLAYER=0x… \
//     npx hardhat run scripts/rehearse.js --network arcTestnet
//
// SIGNER_KEY signs the claim (it is the backend's key); DEPLOYER_KEY relays the
// transaction and pays the gas, exactly as the relayer will. PLAYER is the
// address that should receive the reward — use a throwaway one. Both keys are
// read from the environment and never stored here.
//
// It prints the gas the claim cost, which is what a real claim will cost us.

const { ethers } = require('hardhat');

const DECIMALS = 6;
const COURSE_ID = 1n;

async function main() {
  const poolAddress = process.env.POOL;
  const signerKey = process.env.SIGNER_KEY;
  const player = process.env.PLAYER;
  if (!poolAddress || !signerKey || !player) throw new Error('Set POOL, SIGNER_KEY and PLAYER');

  const [relayer] = await ethers.getSigners();
  const backend = new ethers.Wallet(signerKey);
  const pool = await ethers.getContractAt('ARCMANRewardPool', poolAddress);

  const [onChainSigner, reward, balance, remaining] = await Promise.all([
    pool.getFunction('signer')(),
    pool.maxReward(),
    pool.poolBalance(),
    pool.remainingClaims(),
  ]);

  console.log(`pool       ${poolAddress}`);
  console.log(`balance    ${ethers.formatUnits(balance, DECIMALS)} USDC (${remaining} claims left)`);
  console.log(`reward     ${ethers.formatUnits(reward, DECIMALS)} USDC`);
  console.log(`relayer    ${relayer.address}`);
  console.log(`player     ${player}`);

  if (backend.address.toLowerCase() !== onChainSigner.toLowerCase()) {
    throw new Error(`SIGNER_KEY is ${backend.address}, but the pool trusts ${onChainSigner}`);
  }
  if (balance < reward) throw new Error('Pool is empty — send it USDC first');

  // The identity hash the backend would compute: the X account id salted with a
  // server secret, so the chain never carries the account id itself.
  const identityHash = ethers.keccak256(
    ethers.toUtf8Bytes(`${process.env.IDENTITY_SALT || 'rehearsal-salt'}:${process.env.X_USER_ID || '1234567890'}`)
  );
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

  const domain = {
    name: 'ARCMAN Reward Pool',
    version: '1',
    chainId: (await ethers.provider.getNetwork()).chainId,
    verifyingContract: poolAddress,
  };
  const types = {
    Claim: [
      { name: 'courseId', type: 'uint256' },
      { name: 'player', type: 'address' },
      { name: 'identityHash', type: 'bytes32' },
      { name: 'amount', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };
  const message = { courseId: COURSE_ID, player, identityHash, amount: reward, deadline };
  const signature = await backend.signTypedData(domain, types, message);

  // The contract rebuilds the digest itself; if these differ, the backend and
  // the contract disagree about what is being signed.
  const local = ethers.TypedDataEncoder.hash(domain, types, message);
  const onChain = await pool.claimDigest(COURSE_ID, player, identityHash, reward, deadline);
  console.log(`digest     ${local === onChain ? 'matches the contract' : 'MISMATCH — stop'}`);
  if (local !== onChain) return;

  const before = await new ethers.Contract(
    await pool.usdc(), ['function balanceOf(address) view returns (uint256)'], ethers.provider
  ).balanceOf(player);

  const tx = await pool.connect(relayer).claim(COURSE_ID, player, identityHash, reward, deadline, signature);
  console.log(`\nclaim tx   ${tx.hash}`);
  const receipt = await tx.wait();

  const after = await new ethers.Contract(
    await pool.usdc(), ['function balanceOf(address) view returns (uint256)'], ethers.provider
  ).balanceOf(player);

  const cost = receipt.gasUsed * receipt.gasPrice;
  console.log(`gas used   ${receipt.gasUsed} at ${ethers.formatUnits(receipt.gasPrice, 'gwei')} Gwei`);
  console.log(`gas cost   ${ethers.formatUnits(cost, 18)} USDC`);   // gas is 18-decimal native USDC
  console.log(`player got ${ethers.formatUnits(after - before, DECIMALS)} USDC`);
  console.log(`left       ${await pool.remainingClaims()} claims`);

  // The same signature a second time must fail — the point of the whole design.
  try {
    await pool.connect(relayer).claim.staticCall(COURSE_ID, player, identityHash, reward, deadline, signature);
    console.log('\nREPLAY WOULD SUCCEED — stop and investigate');
  } catch (error) {
    console.log(`\nreplay     rejected (${revertName(error, pool)})`);
  }
}

// Which guard stopped the call — WalletAlreadyClaimed and PoolEmpty mean very
// different things to a player, so decode rather than print "reverted".
function revertName(error, pool) {
  if (error.revert && error.revert.name) return error.revert.name;

  // The revert data turns up in a different field depending on whether the call
  // went through a local node, a provider or ethers itself — look around.
  const seen = new Set();
  const find = (node, depth) => {
    if (!node || depth > 4 || seen.has(node)) return null;
    if (typeof node === 'string') return /^0x[0-9a-fA-F]{8,}$/.test(node) ? node : null;
    if (typeof node !== 'object') return null;
    seen.add(node);
    for (const key of ['data', 'error', 'info', 'value', 'body']) {
      const found = find(node[key], depth + 1);
      if (found) return found;
    }
    return null;
  };

  const data = find(error, 0);
  if (data) {
    try {
      const parsed = pool.interface.parseError(data);
      if (parsed) return parsed.name;
    } catch (e) { /* not one of ours */ }
  }
  return error.shortMessage || 'reverted';
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
