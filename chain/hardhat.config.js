// Contracts live here, separate from the game server: `npm install` in the
// repository root must not drag a compiler toolchain onto the production box.
//
//   cd chain && npm install && npm test
//
// Deploying needs a key, which is passed in the environment and never written
// to a file in the repository:
//
//   DEPLOYER_KEY=0x… OWNER=0x… SIGNER=0x… npx hardhat run scripts/deploy.js --network arcTestnet
require('@nomicfoundation/hardhat-toolbox');

const deployer = process.env.DEPLOYER_KEY ? [process.env.DEPLOYER_KEY] : [];

module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      // Arc is young: paris keeps the bytecode off opcodes it may not support.
      evmVersion: 'paris',
    },
  },
  networks: {
    arcTestnet: {
      url: process.env.ARC_TESTNET_RPC || 'https://rpc.testnet.arc.io',
      chainId: 5042002,
      accounts: deployer,
      // Arc silently drops transactions priced under 20 Gwei.
      gasPrice: 25_000_000_000,
    },
    arcMainnet: {
      url: process.env.ARC_MAINNET_RPC || 'https://arc.drpc.org',
      chainId: 5042,
      accounts: deployer,
      gasPrice: 25_000_000_000,
    },
  },
};
