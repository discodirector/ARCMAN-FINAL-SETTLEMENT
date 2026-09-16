// Put the score board on a chain.
//
//   OWNER=0x… SIGNER=0x… DEPLOYER_KEY=0x… npx hardhat run scripts/deployScoreBoard.js --network arcMainnet
//
// OWNER can replace the signing key and hand ownership on; it never touches
// money. SIGNER is the address the game server signs scores with — whoever
// holds that key can write any score, so it must not be the owner as well.
//
// The block number it prints matters: the leaderboard is read back out of this
// contract's events, and the server needs to know where to start looking.

const { ethers, network } = require('hardhat');

async function main() {
    const owner = process.env.OWNER;
    const signer = process.env.SIGNER;

    if (!ethers.isAddress(owner)) throw new Error('OWNER must be an address');
    if (!ethers.isAddress(signer)) throw new Error('SIGNER must be an address');
    if (owner.toLowerCase() === signer.toLowerCase()) {
        throw new Error('OWNER and SIGNER must be different keys: the signing key lives on the server');
    }

    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Network:  ${network.name}`);
    console.log(`Deployer: ${deployer.address} (${ethers.formatUnits(balance, 18)} USDC)`);
    console.log(`Owner:    ${owner}`);
    console.log(`Signer:   ${signer}`);

    const Board = await ethers.getContractFactory('ARCMANScoreBoard');
    const board = await Board.deploy(owner, signer);
    await board.waitForDeployment();

    const address = await board.getAddress();
    const receipt = await board.deploymentTransaction().wait();

    console.log('');
    console.log(`Deployed: ${address}`);
    console.log(`Block:    ${receipt.blockNumber}`);
    console.log('');
    console.log('Put these in the server environment:');
    console.log(`  SCORE_CONTRACT_ADDRESS=${address}`);
    console.log(`  SCORE_FIRST_BLOCK=${receipt.blockNumber}`);
    console.log('');
    console.log('and in js/config.js: CONTRACT_ADDRESS');

    // Read it back rather than trusting the arguments we just passed.
    console.log('');
    console.log('As deployed:');
    console.log(`  owner()        ${await board.owner()}`);
    console.log(`  serverSigner() ${await board.serverSigner()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
