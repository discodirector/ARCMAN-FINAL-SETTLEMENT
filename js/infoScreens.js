// Educational Info Screens Data
// One screen after every level. The screen for level N sets up the quiz that
// follows it immediately (see quizzes.js — same id, same level).
// Content verified against Arc / Circle / x402 public materials as of September 2026

const INFO_SCREENS = [
    {
        id: 1, // After level 1
        text: "Arc is an open Layer-1 blockchain from Circle, the company that issues USDC. It is EVM-compatible and purpose-built for stablecoin finance. Its public mainnet opened on 16 September 2026; this game's scores and certificates still settle on Arc Testnet, where playing costs nothing."
    },
    {
        id: 2, // After level 2
        text: "On Arc, gas is paid in USDC instead of a volatile token. Fees are quoted directly in dollars and average around $0.005 per transaction, so anyone can budget them like a normal cost."
    },
    {
        id: 3, // After level 3
        text: "Arc pairs Malachite — a Rust implementation of Tendermint BFT — with a Reth execution layer. Finality is deterministic and sub-second: once a block is committed it is final, with no reorgs and no confirmations to wait for. It is one of the properties Arc's public mainnet opened with."
    },
    {
        id: 4, // After level 4
        text: "ARC is Arc's planned coordination token — not its gas, which stays payable in USDC. By design, protocol fees are converted into ARC and routed to validators and stakers, with a portion burned. Mainnet opened without it: ARC has not launched, and Circle describes any token plans as exploratory."
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
        text: "Every USDC is backed by a dollar of reserves — cash and short-dated US Treasuries, held apart from Circle's own money. A Big Four firm publishes a monthly attestation confirming the reserves cover every token in circulation. That is the boring part, and it is the part that makes the rest work."
    },
    {
        id: 11, // After level 11
        text: "USDC is not mined or traded into existence. Through Circle Mint a business wires dollars in and the same amount of USDC is minted; redeem it and the tokens are burned as the dollars go back out. One in, one out, 24/7 — no market maker sets the price of a dollar."
    },
    {
        id: 12, // After level 12
        text: "A stablecoin does not have to be a dollar. Circle also issues EURC, a euro token with the same reserve model, and Arc is designed for several currencies at once — because a payment network that only speaks one currency stops at the first border."
    },
    {
        id: 13, // After level 13
        text: "Swapping currencies is where payments usually break: one side sends and then waits, exposed, for the other. Arc's FX engine quotes off-chain and settles both legs inside a single contract, so either both transfers happen or neither does. No leg is ever left hanging."
    },
    {
        id: 14, // After level 14
        text: "A public ledger is a problem for a business — competitors can read every invoice. Arc's answer is opt-in confidential transfers: amounts are encrypted while addresses stay visible, and the parties can disclose the details to an auditor or regulator when required. Private from rivals, not from the law."
    },
    {
        id: 15, // After level 15
        text: "Someone has to order the transactions. Arc's mainnet opened with a permissioned set of founding validators — among them Visa, Mastercard, BlackRock, DTCC and Standard Chartered. It is a deliberate trade: fewer validators at the start, in exchange for names you can hold responsible, with a move to open staking planned later."
    },
    {
        id: 16, // After level 16
        text: "A cross-border wire hops through correspondent banks, each with its own cut-off time, so money can sit idle for days over a weekend. Stablecoin rails do not keep office hours: the same transfer settles in seconds, at any hour, with the fee known before you send."
    },
    {
        id: 17, // After level 17
        text: "Arc did not open cold. Its testnet ran from October 2025, then a private mainnet with over a hundred institutional and ecosystem builders, before the public launch in September 2026. That is how a payment network should be tested: with other people's real processes, before anyone's real money."
    },
    {
        id: 18, // After level 18
        text: "There is no chargeback on a settled transfer. Send to the wrong address and no support desk can pull it back — the same finality that makes settlement fast makes mistakes permanent. That is why spending limits, allowances and test networks exist: you check before, because there is no after."
    },
    {
        id: 19, // After level 19
        text: "Arc's public mainnet went live on 16 September 2026: gas in USDC, sub-second finality, and a permissioned set of founding validators. Still ahead are the ARC token and the move from Proof-of-Authority to Proof-of-Stake it is meant to enable. You walked this road on Arc Testnet while the network was being built — and it ends where mainnet begins."
    },
    {
        id: 20, // After level 20
        text: "This whole game is one idea: a payment is not done when it is sent, it is done when it is final. Settlement is the moment it can no longer be reversed. Stablecoin gas plus sub-second deterministic finality is what lets that moment arrive at machine speed — which is exactly what you have been aiming at."
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INFO_SCREENS };
}
if (typeof window !== 'undefined') {
    window.INFO_SCREENS = INFO_SCREENS;
}
