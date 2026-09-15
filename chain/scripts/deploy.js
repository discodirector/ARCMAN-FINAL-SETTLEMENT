// Deploy the reward pool.
//
//   DEPLOYER_KEY=0x… OWNER=0x… SIGNER=0x… \
//     npx hardhat run scripts/deploy.js --network arcTestnet
//
// OWNER should be the multisig or hardware wallet that will hold the money;
// SIGNER is the backend key that signs claims, and must be a different address:
// it lives on a server, and a server can be broken into.
//
// Nothing is written to disk — copy the printed address into the backend
// configuration yourself.

const { ethers, network } = require('hardhat');

// USDC is a predeploy at the same address on Arc mainnet and testnet.
const ARC_USDC = '0x3600000000000000000000000000000000000000';
const REWARD_DECIMALS = 6;

async function main() {
  const usdcAddress = process.env.USDC || ARC_USDC;
  const owner = process.env.OWNER;
  const signer = process.env.SIGNER;
  const reward = ethers.parseUnits(process.env.REWARD || '3', REWARD_DECIMALS);

  if (!owner || !signer) throw new Error('Set OWNER and SIGNER');
  if (owner.toLowerCase() === signer.toLowerCase()) {
    throw new Error('OWNER and SIGNER must differ: the signing key lives on a server');
  }

  const [deployer] = await ethers.getSigners();
  if (!deployer) throw new Error('Set DEPLOYER_KEY');

  // A wrong USDC address would make the pool permanently useless, so check the
  // token actually looks like USDC before spending gas on a deployment.
  const token = new ethers.Contract(
    usdcAddress,
    ['function decimals() view returns (uint8)', 'function symbol() view returns (string)'],
    ethers.provider
  );
  const [decimals, symbol] = await Promise.all([token.decimals(), token.symbol()]);
  if (Number(decimals) !== REWARD_DECIMALS) {
    throw new Error(`Token at ${usdcAddress} has ${decimals} decimals, expected ${REWARD_DECIMALS}`);
  }

  console.log(`network   ${network.name} (chain ${(await ethers.provider.getNetwork()).chainId})`);
  console.log(`token     ${usdcAddress} (${symbol}, ${decimals} decimals)`);
  console.log(`deployer  ${deployer.address}`);
  console.log(`owner     ${owner}`);
  console.log(`signer    ${signer}`);
  console.log(`reward    ${ethers.formatUnits(reward, REWARD_DECIMALS)} ${symbol}`);

  const pool = await (await ethers.getContractFactory('ARCMANRewardPool'))
    .deploy(usdcAddress, owner, signer, reward);
  await pool.waitForDeployment();
  const address = await pool.getAddress();

  console.log(`\npool      ${address}`);
  console.log(`tx        ${pool.deploymentTransaction().hash}`);

  // Read the deployed state back rather than trusting the arguments we sent.
  console.log('\nas deployed:');
  console.log(`  owner           ${await pool.owner()}`);
  // getFunction, because `signer` is also an ethers property name
  console.log(`  signer          ${await pool.getFunction('signer')()}`);
  console.log(`  maxReward       ${ethers.formatUnits(await pool.maxReward(), REWARD_DECIMALS)}`);
  console.log(`  poolBalance     ${ethers.formatUnits(await pool.poolBalance(), REWARD_DECIMALS)}`);
  console.log('\nFund it by sending USDC to the pool address, then check remainingClaims().');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
