// Quiz Data - Questions and Answers
// One quiz after every level in Tournament mode, shown right after that level's
// info screen. Quiz N checks the screen the player has just read (infoScreens.js).
//
// Which answer is right is NOT in this file — it ships to every browser. The
// server grades answers against private/answer-key.json, which is deployed like
// .env and never committed. Adding a quiz means adding its correct answer there,
// as the exact English answer text.
// Content verified against Arc / Circle / x402 public materials as of September 2026

const QUIZZES = [
    {
        id: 1, // For level 1
        question: "What is Arc?",
        answers: [
            "A Layer-2 rollup that settles on Ethereum",
            "An EVM-compatible Layer-1 built by Circle for stablecoin finance",
            "A closed payment API with no blockchain behind it"
        ]
    },
    {
        id: 2, // For level 2
        question: "Which asset do you pay gas with on Arc?",
        answers: [
            "ETH",
            "USDC",
            "ARC"
        ]
    },
    {
        id: 3, // For level 3
        question: "How fast is finality on Arc?",
        answers: [
            "About 10 minutes, like Bitcoin",
            "A few minutes, once enough confirmations pile up",
            "Sub-second and deterministic — finalized blocks are never reorged"
        ]
    },
    {
        id: 4, // For level 4
        question: "How is ARC designed to relate to the fees paid on Arc?",
        answers: [
            "Fees are converted into ARC for validators and stakers, and a portion is burned",
            "ARC replaced USDC as the gas token when mainnet opened",
            "Fees go straight to Circle as company revenue"
        ]
    },
    {
        id: 5, // For level 5
        question: "Which use case is Arc betting on most heavily?",
        answers: [
            "Gaming and metaverse worlds",
            "The agentic economy — AI agents paying and settling with each other",
            "Fully anonymous peer-to-peer transfers"
        ]
    },
    {
        id: 6, // For level 6
        question: "In x402, what does a server's HTTP 402 response mean?",
        answers: [
            "The request failed and should not be retried",
            "Here is the price — pay it in USDC and send the request again",
            "The client must first register an account and add a card"
        ]
    },
    {
        id: 7, // For level 7
        question: "Why can't card rails charge for a single API call?",
        answers: [
            "Card networks are offline at night",
            "A fixed fee per transaction costs more than the call is worth",
            "Cards cannot process payments from software, only from people"
        ]
    },
    {
        id: 8, // For level 8
        question: "What does an agent get when you give it a Circle wallet?",
        answers: [
            "The private key, so it can move everything in the account",
            "The right to spend inside the allowance you signed — never the key itself",
            "A seed phrase it stores for you in plain text"
        ]
    },
    {
        id: 9, // For level 9
        question: "How does USDC move between chains with CCTP?",
        answers: [
            "It is locked in a bridge and a wrapped copy is issued",
            "It is burned on the source chain and minted natively on the destination",
            "It is sold for the destination chain's own token and bought back"
        ]
    },
    {
        id: 10, // For level 10
        question: "What sits behind every USDC in circulation?",
        answers: [
            "A dollar of reserves — cash and short-dated Treasuries, attested monthly",
            "A basket of other cryptocurrencies held by Circle",
            "An algorithm that mints and burns to defend the price"
        ]
    },
    {
        id: 11, // For level 11
        question: "How does new USDC come into existence?",
        answers: [
            "It is mined by validators as a block reward",
            "Someone pays dollars to Circle and the same amount is minted; redeeming burns it",
            "Traders buy it on an exchange until the supply grows"
        ]
    },
    {
        id: 12, // For level 12
        question: "Does Circle issue anything other than a dollar stablecoin?",
        answers: [
            "No — USDC is the only one",
            "Yes — EURC, a euro stablecoin with the same reserve model",
            "Yes, but only tokens pegged to gold"
        ]
    },
    {
        id: 13, // For level 13
        question: "What does Arc's FX engine settle inside a single contract?",
        answers: [
            "Both legs of the currency swap, or neither",
            "One leg now and the other at the end of the day",
            "The trade fee, while the currencies move by wire"
        ]
    },
    {
        id: 14, // For level 14
        question: "What do Arc's confidential transfers hide?",
        answers: [
            "Everything — the network keeps no record at all",
            "The amount, while addresses stay visible and details can be disclosed on request",
            "The sender's identity, while the amount is public"
        ]
    },
    {
        id: 15, // For level 15
        question: "Who validates blocks on Arc today?",
        answers: [
            "Anyone who stakes enough tokens, from day one",
            "A permissioned set of known institutions, opening up over time",
            "Circle alone, with no other validators planned"
        ]
    },
    {
        id: 16, // For level 16
        question: "Why can a cross-border bank transfer take days?",
        answers: [
            "The money physically travels between countries",
            "It hops through correspondent banks with their own cut-off times and weekends",
            "Regulators manually approve every payment"
        ]
    },
    {
        id: 17, // For level 17
        question: "Who used Arc before its public mainnet opened?",
        answers: [
            "Nobody — the network was switched on for the first time at launch",
            "Over a hundred institutions and builders, on testnet and then a private mainnet",
            "Only retail players in games like this one"
        ]
    },
    {
        id: 18, // For level 18
        question: "You send USDC to the wrong address. What can be done?",
        answers: [
            "Nothing — a settled transfer has no chargeback",
            "Circle reverses it if you file a support ticket",
            "Validators roll back the block on request"
        ]
    },
    {
        id: 19, // For level 19
        question: "What stage is Arc at right now?",
        answers: [
            "Public mainnet since September 2026, with the ARC token still ahead",
            "A testnet with no mainnet date announced",
            "Mainnet running with ARC as its gas token"
        ]
    },
    {
        id: 20, // For level 20
        question: "When is a payment actually settled?",
        answers: [
            "When the sender clicks send",
            "When the transaction shows up in the mempool",
            "When it is final and can no longer be reversed"
        ]
    }
];


// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QUIZZES };
}
// Make QUIZZES accessible globally in browser
if (typeof window !== 'undefined') {
    window.QUIZZES = QUIZZES;
}
