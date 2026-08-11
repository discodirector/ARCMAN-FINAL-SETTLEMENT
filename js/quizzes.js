// Quiz Data - Questions and Answers
// This file contains all quiz questions for Tournament mode
// Quizzes appear after levels 2, 4, 6, 8, and 10
// Each quiz checks the info screen shown one level earlier (see infoScreens.js)
// Content verified against Arc / Circle public materials as of July 2026

const QUIZZES = [
    {
        id: 1, // For level 2
        question: "What is Arc?",
        answers: [
            "A Layer-2 rollup that settles on Ethereum",
            "An EVM-compatible Layer-1 built by Circle for stablecoin finance",
            "A closed payment API with no blockchain behind it"
        ],
        correctIndex: 1
    },
    {
        id: 2, // For level 4
        question: "Which asset do you pay gas with on Arc?",
        answers: [
            "ETH",
            "USDC",
            "ARC"
        ],
        correctIndex: 1
    },
    {
        id: 3, // For level 6
        question: "How fast is finality on Arc?",
        answers: [
            "About 10 minutes, like Bitcoin",
            "A few minutes, once enough confirmations pile up",
            "Sub-second and deterministic — finalized blocks are never reorged"
        ],
        correctIndex: 2
    },
    {
        id: 4, // For level 8
        question: "What happens to the fees you pay on Arc?",
        answers: [
            "They are converted into ARC at the protocol level, then partly burned",
            "They are paid straight to Circle as company revenue",
            "They are refunded to the sender at the end of each block"
        ],
        correctIndex: 0
    },
    {
        id: 5, // For level 10
        question: "Which use case is Arc betting on most heavily?",
        answers: [
            "Gaming and metaverse worlds",
            "The agentic economy — AI agents paying and settling with each other",
            "Fully anonymous peer-to-peer transfers"
        ],
        correctIndex: 1
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
