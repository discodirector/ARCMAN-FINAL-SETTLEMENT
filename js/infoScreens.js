// Educational Info Screens Data
// Info screens appear after levels 1, 3, 5, 7, 9 in Tournament mode
// Each screen sets up the quiz that follows it (screen 1 -> quiz after level 2, etc.)
// Content verified against Arc / Circle public materials as of July 2026

const INFO_SCREENS = [
    {
        id: 1, // After level 1
        text: "Arc is an open Layer-1 blockchain from Circle, the company that issues USDC. It is EVM-compatible and purpose-built for stablecoin finance. Today Arc runs as a public testnet — the same network this game is played on."
    },
    {
        id: 2, // After level 3
        text: "On Arc, gas is paid in USDC instead of a volatile token. Fees are quoted directly in dollars and average around $0.005 per transaction, so anyone can budget them like a normal cost."
    },
    {
        id: 3, // After level 5
        text: "Arc pairs Malachite — a Rust implementation of Tendermint BFT — with a Reth execution layer. On the public testnet blocks land roughly every 0.5 seconds, and finality is deterministic and sub-second: no reorgs, no waiting for confirmations."
    },
    {
        id: 4, // After level 7
        text: "ARC is the network's native token, but it is not the gas token. Protocol fees paid in stablecoins are converted into ARC automatically, then split between staking rewards and a permanent burn. ARC has not launched yet."
    },
    {
        id: 5, // After level 9
        text: "Arc's biggest bet is the agentic economy — AI agents paying for compute, data and services on their own. That needs payments smaller than a cent, settled in USDC over open standards like x402."
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INFO_SCREENS };
}
if (typeof window !== 'undefined') {
    window.INFO_SCREENS = INFO_SCREENS;
}
