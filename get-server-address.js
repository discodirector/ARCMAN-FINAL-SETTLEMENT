// Helper script to get the server signer address from the private key
// Run: node get-server-address.js

const { ethers } = require('ethers');
const crypto = require('crypto');

// Get private key from environment or generate a new one
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0x' + crypto.randomBytes(32).toString('hex');

try {
    const wallet = new ethers.Wallet(PRIVATE_KEY);
    console.log('\n========================================');
    console.log('Server Signer Address:');
    console.log(wallet.address);
    console.log('========================================\n');
    console.log('Use this address when deploying the contract:');
    console.log(`Constructor argument: "${wallet.address}"\n`);
    
    if (!process.env.PRIVATE_KEY) {
        console.log('⚠️  WARNING: No PRIVATE_KEY environment variable found.');
        console.log('A random private key was generated. This is NOT secure for production!');
        console.log('Set PRIVATE_KEY environment variable with your actual server private key.\n');
    }
} catch (error) {
    console.error('Error generating server signer address:', error.message);
    process.exit(1);
}

