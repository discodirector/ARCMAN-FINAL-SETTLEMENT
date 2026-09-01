// Quiz Data - Questions and Answers
// One quiz after every level in Tournament mode, shown right after that level's
// info screen. Quiz N checks the screen the player has just read (infoScreens.js).
// Content verified against Arc / Circle / x402 public materials as of September 2026

const QUIZZES = [
    {
        id: 1, // For level 1
        question: "What is Arc?",
        answers: [
            "A Layer-2 rollup that settles on Ethereum",
            "An EVM-compatible Layer-1 built by Circle for stablecoin finance",
            "A closed payment API with no blockchain behind it"
        ],
        correctIndex: 1
    },
    {
        id: 2, // For level 2
        question: "Which asset do you pay gas with on Arc?",
        answers: [
            "ETH",
            "USDC",
            "ARC"
        ],
        correctIndex: 1
    },
    {
        id: 3, // For level 3
        question: "How fast is finality on Arc?",
        answers: [
            "About 10 minutes, like Bitcoin",
            "A few minutes, once enough confirmations pile up",
            "Sub-second and deterministic — finalized blocks are never reorged"
        ],
        correctIndex: 2
    },
    {
        id: 4, // For level 4
        question: "What happens to the fees you pay on Arc?",
        answers: [
            "They are converted into ARC at the protocol level, then partly burned",
            "They are paid straight to Circle as company revenue",
            "They are refunded to the sender at the end of each block"
        ],
        correctIndex: 0
    },
    {
        id: 5, // For level 5
        question: "Which use case is Arc betting on most heavily?",
        answers: [
            "Gaming and metaverse worlds",
            "The agentic economy — AI agents paying and settling with each other",
            "Fully anonymous peer-to-peer transfers"
        ],
        correctIndex: 1
    },
    {
        id: 6, // For level 6
        question: "In x402, what does a server's HTTP 402 response mean?",
        answers: [
            "The request failed and should not be retried",
            "Here is the price — pay it in USDC and send the request again",
            "The client must first register an account and add a card"
        ],
        correctIndex: 1
    },
    {
        id: 7, // For level 7
        question: "Why can't card rails charge for a single API call?",
        answers: [
            "Card networks are offline at night",
            "A fixed fee per transaction costs more than the call is worth",
            "Cards cannot process payments from software, only from people"
        ],
        correctIndex: 1
    },
    {
        id: 8, // For level 8
        question: "What does an agent get when you give it a Circle wallet?",
        answers: [
            "The private key, so it can move everything in the account",
            "The right to spend inside the allowance you signed — never the key itself",
            "A seed phrase it stores for you in plain text"
        ],
        correctIndex: 1
    },
    {
        id: 9, // For level 9
        question: "How does USDC move between chains with CCTP?",
        answers: [
            "It is locked in a bridge and a wrapped copy is issued",
            "It is burned on the source chain and minted natively on the destination",
            "It is sold for the destination chain's own token and bought back"
        ],
        correctIndex: 1
    },
    {
        id: 10, // For level 10
        question: "When is a payment actually settled?",
        answers: [
            "When the sender clicks send",
            "When the transaction shows up in the mempool",
            "When it is final and can no longer be reversed"
        ],
        correctIndex: 2
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
