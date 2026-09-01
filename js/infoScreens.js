// Educational Info Screens Data
// One screen after every level. The screen for level N sets up the quiz that
// follows it immediately (see quizzes.js — same id, same level).
// Content verified against Arc / Circle / x402 public materials as of September 2026

const INFO_SCREENS = [
    {
        id: 1, // After level 1
        text: "Arc is an open Layer-1 blockchain from Circle, the company that issues USDC. It is EVM-compatible and purpose-built for stablecoin finance. Today Arc runs as a public testnet — the same network this game is played on."
    },
    {
        id: 2, // After level 2
        text: "On Arc, gas is paid in USDC instead of a volatile token. Fees are quoted directly in dollars and average around $0.005 per transaction, so anyone can budget them like a normal cost."
    },
    {
        id: 3, // After level 3
        text: "Arc pairs Malachite — a Rust implementation of Tendermint BFT — with a Reth execution layer. On the public testnet blocks land roughly every 0.5 seconds, and finality is deterministic and sub-second: no reorgs, no waiting for confirmations."
    },
    {
        id: 4, // After level 4
        text: "ARC is the network's native token, but it is not the gas token. Protocol fees paid in stablecoins are converted into ARC automatically, then split between staking rewards and a permanent burn. ARC has not launched yet."
    },
    {
        id: 5, // After level 5
        text: "Arc's biggest bet is the agentic economy — AI agents paying for compute, data and services on their own. That needs payments smaller than a cent, settled in USDC over open standards like x402."
    },
    {
        id: 6, // After level 6
        text: "x402 is that open standard. It revives HTTP status code 402, 'Payment Required': instead of an error, the server answers with a price. The client pays in USDC and repeats the request, and a facilitator verifies the payment onchain. No account, no card, no human in the loop."
    },
    {
        id: 7, // After level 7
        text: "Card rails cannot price a single API call. They charge a fixed fee per transaction — roughly a few cents plus a percentage — so anything worth a cent costs more to collect than it earns. Stablecoin rails price a transfer in fractions of a cent, which is what makes pay-per-call possible."
    },
    {
        id: 8, // After level 8
        text: "A program that pays needs an account of its own. Circle's programmable wallets never hand the agent a private key: the key is split across parties using MPC, and the agent spends only inside the allowance you signed. It can spend from the account. It can never take the account."
    },
    {
        id: 9, // After level 9
        text: "USDC does not travel between chains as a wrapped copy. CCTP burns it on the source chain and mints native USDC on the destination, so there is no bridge token to trust. Circle Gateway puts a unified balance on top, so an agent sees one balance instead of a wallet per chain."
    },
    {
        id: 10, // After level 10
        text: "This whole game is one idea: a payment is not done when it is sent, it is done when it is final. Settlement is the moment it can no longer be reversed. Stablecoin gas plus sub-second deterministic finality is what lets that moment arrive at machine speed — which is exactly what you have been aiming at."
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INFO_SCREENS };
}
if (typeof window !== 'undefined') {
    window.INFO_SCREENS = INFO_SCREENS;
}
