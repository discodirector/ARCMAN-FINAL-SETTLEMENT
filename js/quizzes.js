// Quiz Data - Questions and Answers
// This file contains all quiz questions for Tournament mode
// Quizzes appear after levels 2, 4, 6, 8, and 10

const QUIZZES = [
    {
        id: 1, // For level 2
        question: "What is the primary role of the Arc blockchain?",
        answers: [
            "An NFT marketplace for digital art",
            "An Economic OS and Layer-1 built for stablecoin finance",
            "A Layer-2 scaling solution for Ethereum"
        ],
        correctIndex: 1
    },
    {
        id: 2, // For level 4
        question: "Which asset is used to pay transaction fees on Arc?",
        answers: [
            "BTC",
            "USDC",
            "ETH"
        ],
        correctIndex: 1
    },
    {
        id: 3, // For level 6
        question: "What is the main benefit of using USDC as gas on Arc?",
        answers: [
            "Lower hardware requirements for validators",
            "Predictable, dollar-denominated transaction fees",
            "Full anonymity for all transactions"
        ],
        correctIndex: 1
    },
    {
        id: 4, // For level 8
        question: "Which company is behind both Arc and USDC?",
        answers: [
            "Coinbase",
            "SpaceX",
            "Circle"
        ],
        correctIndex: 2
    },
    {
        id: 5, // For level 10
        question: "What types of use cases was Arc primarily designed for?",
        answers: [
            "GameFi and metaverse applications",
            "Stablecoin payments, onchain settlement, and tokenization",
            "Anonymous peer-to-peer transfers"
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

