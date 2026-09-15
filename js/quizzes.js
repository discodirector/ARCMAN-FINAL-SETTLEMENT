// Quiz Data - Questions and Answers
// Three variants per level. After each level in Tournament mode the server picks
// one of that level's variants, shuffles its answers and grades the reply. Every
// variant checks the info screen shown just before it (infoScreens.js), so any of
// the three is answerable by reading that screen.
//
// Which answer is right is NOT in this file — it ships to every browser. The
// server grades answers against private/answer-key.json, which is deployed like
// .env and never committed. Adding a question means adding its correct answer
// there, as the exact English answer text, under the question's id.
//
// Content verified against Arc / Circle / x402 public materials as of September 2026

const QUIZZES = [
    {
        id: "1a",
        level: 1,
        question: "Which company is behind Arc?",
        answers: [
            "Tether, the company that issues USDT",
            "Coinbase, the company that runs Base",
            "Circle, the company that issues USDC"
        ]
    },
    {
        id: "1b",
        level: 1,
        question: "What is Arc purpose-built for?",
        answers: [
            "NFT marketplaces",
            "Anonymous trading",
            "Finance built on stablecoins"
        ]
    },
    {
        id: "1c",
        level: 1,
        question: "Where do this game's scores and certificates settle?",
        answers: [
            "On Ethereum mainnet, through a bridge contract",
            "On Arc Testnet, where playing costs nothing",
            "On Arc mainnet, paid for in real USDC"
        ]
    },
    {
        id: "2a",
        level: 2,
        question: "Roughly how much does an average transaction cost on Arc?",
        answers: [
            "About five dollars",
            "About half a cent",
            "About fifty cents"
        ]
    },
    {
        id: "2b",
        level: 2,
        question: "What does paying gas in USDC let people do?",
        answers: [
            "Earn interest on the gas they pay",
            "Budget fees like any ordinary cost",
            "Skip fees on small transfers"
        ]
    },
    {
        id: "2c",
        level: 2,
        question: "What does Arc avoid by charging gas in USDC?",
        answers: [
            "Needing a wallet to send payments",
            "Fees in a token whose price swings",
            "Publishing transactions on a public ledger"
        ]
    },
    {
        id: "3a",
        level: 3,
        question: "What is Malachite?",
        answers: [
            "A Rust implementation of Tendermint BFT",
            "A proof-of-work mining algorithm for Arc",
            "The block explorer Circle runs for Arc"
        ]
    },
    {
        id: "3b",
        level: 3,
        question: "Which execution layer does Arc use?",
        answers: [
            "The Solana runtime",
            "Geth",
            "Reth"
        ]
    },
    {
        id: "3c",
        level: 3,
        question: "On Arc, when is a committed block final?",
        answers: [
            "Immediately, with no confirmations to wait for",
            "After a one-hour challenge window has passed",
            "After six confirmations, as on Bitcoin"
        ]
    },
    {
        id: "4a",
        level: 4,
        question: "Is ARC the token you pay gas with on Arc?",
        answers: [
            "Only for large payments",
            "Yes, since mainnet opened",
            "No, gas stays payable in USDC"
        ]
    },
    {
        id: "4b",
        level: 4,
        question: "Did Arc's mainnet launch with the ARC token?",
        answers: [
            "Yes, on the same day",
            "Yes, for validators only",
            "No, ARC has not launched yet"
        ]
    },
    {
        id: "4c",
        level: 4,
        question: "Under ARC's design, where do the fees converted into ARC go?",
        answers: [
            "To validators and stakers, with a portion burned",
            "To Circle's shareholders as a quarterly dividend",
            "Back to the users who sent the transactions"
        ]
    },
    {
        id: "5a",
        level: 5,
        question: "What does 'the agentic economy' describe?",
        answers: [
            "Banks replacing their back-office staff with accounting software",
            "People hiring human agents to trade crypto on their behalf",
            "AI agents paying for compute, data and services on their own"
        ]
    },
    {
        id: "5b",
        level: 5,
        question: "How small do agent payments need to be?",
        answers: [
            "At least a dollar",
            "Smaller than a single cent",
            "Ten dollars or more"
        ]
    },
    {
        id: "5c",
        level: 5,
        question: "Which open standard is named for settling agent payments?",
        answers: [
            "x402",
            "SWIFT MT103",
            "ERC-721"
        ]
    },
    {
        id: "6a",
        level: 6,
        question: "Which HTTP status code does x402 bring back into use?",
        answers: [
            "404 Not Found",
            "402 Payment Required",
            "500 Internal Server Error"
        ]
    },
    {
        id: "6b",
        level: 6,
        question: "In an x402 exchange, who verifies the payment onchain?",
        answers: [
            "The server",
            "The client",
            "A facilitator"
        ]
    },
    {
        id: "6c",
        level: 6,
        question: "What does an x402 client do after paying?",
        answers: [
            "Repeats the original request",
            "Opens an account with the server",
            "Waits for an emailed receipt"
        ]
    },
    {
        id: "7a",
        level: 7,
        question: "What does a card network typically charge per transaction?",
        answers: [
            "A few cents plus a percentage",
            "A flat monthly fee",
            "Nothing under a dollar"
        ]
    },
    {
        id: "7b",
        level: 7,
        question: "What goes wrong when a card is used to collect a single cent?",
        answers: [
            "The money takes a month to arrive",
            "The card is frozen as suspected fraud",
            "Collecting it costs more than it earns"
        ]
    },
    {
        id: "7c",
        level: 7,
        question: "What makes pay-per-call pricing possible?",
        answers: [
            "Transfers priced in fractions of a cent",
            "Monthly invoices sent out by email",
            "Credit limits set by the card issuers"
        ]
    },
    {
        id: "8a",
        level: 8,
        question: "How do Circle's programmable wallets protect the signing key?",
        answers: [
            "It is split across parties using MPC",
            "It is emailed to the agent's owner",
            "It is printed and kept in a bank vault"
        ]
    },
    {
        id: "8b",
        level: 8,
        question: "What sets the limit on what an agent can spend?",
        answers: [
            "The agent's own judgement",
            "A daily cap set by the network",
            "The allowance its owner signed"
        ]
    },
    {
        id: "8c",
        level: 8,
        question: "Does the agent ever hold the wallet's private key?",
        answers: [
            "Yes, once trusted",
            "Only mid-payment",
            "No, never"
        ]
    },
    {
        id: "9a",
        level: 9,
        question: "What does CCTP do with USDC on the source chain?",
        answers: [
            "It burns the USDC",
            "It locks it",
            "It copies it"
        ]
    },
    {
        id: "9b",
        level: 9,
        question: "What does Circle Gateway give an agent?",
        answers: [
            "One balance across all chains",
            "A separate wallet on every chain",
            "A credit line at Circle's bank"
        ]
    },
    {
        id: "9c",
        level: 9,
        question: "Why is there no bridge token to trust with CCTP?",
        answers: [
            "USDC only ever exists on a single chain",
            "Every wrapped token is insured by the bridge",
            "Native USDC is minted on the destination"
        ]
    },
    {
        id: "10a",
        level: 10,
        question: "What are USDC's reserves held in?",
        answers: [
            "Bitcoin, ether and other crypto",
            "Shares of Circle and its partners",
            "Cash and short-dated US Treasuries"
        ]
    },
    {
        id: "10b",
        level: 10,
        question: "How often is the reserve attestation published?",
        answers: [
            "Every decade",
            "Every year",
            "Every month"
        ]
    },
    {
        id: "10c",
        level: 10,
        question: "Whose money are USDC's reserves kept apart from?",
        answers: [
            "The US Treasury's",
            "The validators'",
            "Circle's own"
        ]
    },
    {
        id: "11a",
        level: 11,
        question: "What happens to USDC when it is redeemed through Circle Mint?",
        answers: [
            "It is frozen until the next business day",
            "It is passed on to the next buyer in line",
            "It is burned as the dollars go out"
        ]
    },
    {
        id: "11b",
        level: 11,
        question: "When can USDC be minted and redeemed?",
        answers: [
            "Only during US banking hours",
            "Around the clock, every day",
            "Once a week, in batches"
        ]
    },
    {
        id: "11c",
        level: 11,
        question: "A business wires $1,000 into Circle Mint. How much USDC is minted?",
        answers: [
            "Exactly 1,000 USDC",
            "The market decides",
            "About 990 USDC"
        ]
    },
    {
        id: "12a",
        level: 12,
        question: "Which currency does EURC track?",
        answers: [
            "The euro",
            "The yen",
            "The pound"
        ]
    },
    {
        id: "12b",
        level: 12,
        question: "How is EURC backed?",
        answers: [
            "By a basket of European bank shares",
            "With the same reserve model as USDC",
            "By an algorithm that adjusts its supply"
        ]
    },
    {
        id: "12c",
        level: 12,
        question: "Why is Arc designed for several currencies at once?",
        answers: [
            "Dollar fees are too expensive for anyone outside the US",
            "A one-currency network stops at the first border",
            "Regulators require every chain to carry three currencies"
        ]
    },
    {
        id: "13a",
        level: 13,
        question: "Where does Arc's FX engine produce its quotes?",
        answers: [
            "On-chain",
            "In a wallet",
            "Off-chain"
        ]
    },
    {
        id: "13b",
        level: 13,
        question: "Why do ordinary currency swaps go wrong?",
        answers: [
            "One side sends and is exposed while it waits",
            "The exchange rate is fixed for a whole year",
            "Both sides must hold the same currency first"
        ]
    },
    {
        id: "13c",
        level: 13,
        question: "If one leg of an Arc FX swap cannot settle, what happens to the other?",
        answers: [
            "It waits in a queue for a week",
            "It does not happen either",
            "It settles now and is refunded later"
        ]
    },
    {
        id: "14a",
        level: 14,
        question: "Are confidential transfers on Arc used for every transaction?",
        answers: [
            "Yes, every transfer is private",
            "No, they are opt-in",
            "Only for transfers above $10,000"
        ]
    },
    {
        id: "14b",
        level: 14,
        question: "In a confidential transfer, what stays visible?",
        answers: [
            "The addresses",
            "Nothing at all",
            "The amount"
        ]
    },
    {
        id: "14c",
        level: 14,
        question: "Who can see a confidential transfer's details when required?",
        answers: [
            "Any competitor willing to pay a small fee",
            "An auditor or regulator the parties disclose to",
            "Nobody, not even the two parties involved"
        ]
    },
    {
        id: "15a",
        level: 15,
        question: "Which of these is among Arc's founding validators?",
        answers: [
            "Binance",
            "Mastercard",
            "OpenAI"
        ]
    },
    {
        id: "15b",
        level: 15,
        question: "What job do validators do on Arc?",
        answers: [
            "They set the price of USDC",
            "They approve new user accounts",
            "They order the transactions"
        ]
    },
    {
        id: "15c",
        level: 15,
        question: "What is planned for Arc's validator set later on?",
        answers: [
            "Handing it to a single company",
            "A move to open staking",
            "Replacing validators with miners"
        ]
    },
    {
        id: "16a",
        level: 16,
        question: "Why can a wire sent on a Friday sit idle until Monday?",
        answers: [
            "Banks settle wires only once a month",
            "Correspondent banks have cut-off times",
            "Every wire must be approved by a court"
        ]
    },
    {
        id: "16b",
        level: 16,
        question: "When can a stablecoin transfer settle?",
        answers: [
            "At any hour, weekends included",
            "Only during banking hours",
            "Only on business days"
        ]
    },
    {
        id: "16c",
        level: 16,
        question: "What does a stablecoin sender know before sending?",
        answers: [
            "The fee they will pay",
            "Tomorrow's rate",
            "The recipient's balance"
        ]
    },
    {
        id: "17a",
        level: 17,
        question: "When did Arc's testnet start running?",
        answers: [
            "September 2026",
            "October 2025",
            "March 2024"
        ]
    },
    {
        id: "17b",
        level: 17,
        question: "What came between Arc's testnet and its public launch?",
        answers: [
            "A token airdrop campaign",
            "A second, paid testnet",
            "A private mainnet"
        ]
    },
    {
        id: "17c",
        level: 17,
        question: "Roughly how many builders worked on Arc's private mainnet?",
        answers: [
            "About ten",
            "Over a hundred",
            "Over a million"
        ]
    },
    {
        id: "18a",
        level: 18,
        question: "Can a support desk reverse a settled transfer sent to the wrong address?",
        answers: [
            "No, it cannot be pulled back",
            "Yes, within thirty days",
            "Yes, with proof of the mistake"
        ]
    },
    {
        id: "18b",
        level: 18,
        question: "What makes a mistake on a settled transfer permanent?",
        answers: [
            "The same finality that makes settlement fast",
            "A rule that each wallet app sets for its users",
            "A delay the network adds to every large transfer"
        ]
    },
    {
        id: "18c",
        level: 18,
        question: "Why do spending limits and test networks exist?",
        answers: [
            "So you can check before, because there is no after",
            "So that transfers can be made cheaper for everyone",
            "So that amounts can be hidden from the public"
        ]
    },
    {
        id: "19a",
        level: 19,
        question: "Which of these is still ahead for Arc?",
        answers: [
            "USDC as gas",
            "The ARC token",
            "Fast finality"
        ]
    },
    {
        id: "19b",
        level: 19,
        question: "Which transition is ARC meant to enable?",
        answers: [
            "From Proof-of-Stake to Proof-of-Work",
            "From Proof-of-Authority to Proof-of-Stake",
            "From a Layer-1 to a Layer-2 network"
        ]
    },
    {
        id: "19c",
        level: 19,
        question: "What did Arc's public mainnet launch with?",
        answers: [
            "ARC gas and fully open staking from day one",
            "Proof-of-work mining and gas paid in ETH",
            "USDC gas and permissioned founding validators"
        ]
    },
    {
        id: "20a",
        level: 20,
        question: "According to this game, when is a payment done?",
        answers: [
            "When it is sent",
            "When it is final",
            "When the recipient sees it"
        ]
    },
    {
        id: "20b",
        level: 20,
        question: "What is settlement?",
        answers: [
            "The moment a payment is signed by the sender",
            "The moment the network quotes the fee",
            "The moment a payment can no longer be reversed"
        ]
    },
    {
        id: "20c",
        level: 20,
        question: "What lets settlement arrive at machine speed on Arc?",
        answers: [
            "Stablecoin gas and sub-second deterministic finality",
            "Larger blocks and longer waits for confirmations",
            "Card networks connected directly to the chain"
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
