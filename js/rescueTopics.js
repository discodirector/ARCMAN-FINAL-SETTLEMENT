// Rescue Quiz Topics: the second chance a player gets after losing every life.
//
// One topic is drawn per rescue. The player reads the hint first, then answers
// three of that topic's five questions, picked by the server; the hint contains
// everything needed to answer all five, so a player who reads carefully gets
// back into the run.
//
// These questions are deliberately separate from the per-level quizzes in
// js/quizzes.js, since a player who has just failed should not be re-asked what
// they already answered on the way here.
//
// The correct answers are not in this file: the server draws the topic, picks
// the questions, grades every answer against private/answer-key.json and
// decides the lives handed back.
//
// Content verified against Arc / Circle / x402 public materials as of September 2026

const RESCUE_TOPICS = [
    {
        id: "stablecoin",
        title: "What a stablecoin actually is",
        hint: "A stablecoin is a token that stands for money someone really holds. USDC is redeemable one-for-one: hand a token back to the issuer and you get a dollar. That promise, not trading, is what keeps the price at a dollar — and it is why holding USDC is a claim on a dollar, not a share of the company that issues it.",
        questions: [
            {
                question: "What does a stablecoin stand for?",
                answers: [
                    "Money someone really holds",
                    "Computing power on a network",
                    "A share in a technology company"
                ]
            },
            {
                question: "To get a dollar back for USDC, who do you hand it to?",
                answers: [
                    "Any validator",
                    "An exchange",
                    "The issuer of the token"
                ]
            },
            {
                question: "What keeps USDC's price at a dollar?",
                answers: [
                    "Heavy trading volume every day",
                    "A daily vote by all the holders",
                    "The promise of one-for-one redemption"
                ]
            },
            {
                question: "Holding USDC gives you a claim on what?",
                answers: [
                    "Shares",
                    "Profits",
                    "A dollar"
                ]
            },
            {
                question: "How many dollars does redeeming one USDC return?",
                answers: [
                    "Exactly one",
                    "One, minus fees",
                    "Its last price"
                ]
            }
        ]
    },
    {
        id: "gas",
        title: "Gas, and why the currency matters",
        hint: "Gas is the fee the network charges to process your transaction. On most chains it is paid in a volatile token, so the cost in dollars moves while you are deciding. Arc charges gas in USDC, which turns an unpredictable cost into an ordinary line item — around half a cent per transaction.",
        questions: [
            {
                question: "Who charges gas?",
                answers: [
                    "The network that processes the transaction",
                    "The person receiving the payment",
                    "The store that listed the wallet app"
                ]
            },
            {
                question: "On most chains, what happens to the dollar cost of gas while you decide?",
                answers: [
                    "It moves with the token's price",
                    "It drops to zero overnight",
                    "It is locked for an hour"
                ]
            },
            {
                question: "What does Arc charge gas in?",
                answers: [
                    "ARC",
                    "ETH",
                    "USDC"
                ]
            },
            {
                question: "Roughly what does gas cost per transaction on Arc?",
                answers: [
                    "Around fifty cents",
                    "Around five cents",
                    "Around half a cent"
                ]
            },
            {
                question: "What does USDC gas turn an unpredictable cost into?",
                answers: [
                    "A tradable asset",
                    "An ordinary line item",
                    "A tax deduction"
                ]
            }
        ]
    },
    {
        id: "finality",
        title: "When a payment is really done",
        hint: "A transaction is final when it can no longer be undone. Some chains only make that likely, which is why you wait for confirmations — recently accepted blocks can still be replaced, and that replacement is called a reorg. Arc's consensus makes finality definite in under a second, so there is nothing to wait out.",
        questions: [
            {
                question: "When is a transaction final?",
                answers: [
                    "When it can no longer be undone",
                    "When the wallet displays it",
                    "When its fee has been paid"
                ]
            },
            {
                question: "On chains where finality is only likely, what do users wait for?",
                answers: [
                    "A daily report",
                    "A support ticket",
                    "More confirmations"
                ]
            },
            {
                question: "What is it called when recently accepted blocks are replaced?",
                answers: [
                    "A rollback",
                    "A fork",
                    "A reorg"
                ]
            },
            {
                question: "How long does Arc take to make finality definite?",
                answers: [
                    "About ten minutes",
                    "Under a second",
                    "About an hour"
                ]
            },
            {
                question: "On Arc, how many confirmations do you have to wait out?",
                answers: [
                    "Thirty",
                    "Six",
                    "None"
                ]
            }
        ]
    },
    {
        id: "keys",
        title: "Wallets, keys and who can spend",
        hint: "A wallet does not hold money — it holds the key that authorises moving it, and whoever has the key has the funds. That is why no honest support desk will ever ask for your seed phrase, and why serious custody splits a key across parties so that neither of them can sign alone.",
        questions: [
            {
                question: "Who controls the funds in a wallet?",
                answers: [
                    "Whoever has the key",
                    "The bank that verified the user",
                    "Whoever built the wallet app"
                ]
            },
            {
                question: "Which of these is true about a wallet?",
                answers: [
                    "It stores a copy of the whole blockchain",
                    "It keeps the coins in a local file",
                    "It holds a key, not the money itself"
                ]
            },
            {
                question: "Who will ask you for your seed phrase?",
                answers: [
                    "No honest support desk",
                    "The network's validators",
                    "Your wallet's support team"
                ]
            },
            {
                question: "In serious custody, can one party sign alone?",
                answers: [
                    "No, the key is split so neither can",
                    "Yes, after a short waiting period",
                    "Yes, the larger party always can"
                ]
            },
            {
                question: "What does the key in a wallet authorise?",
                answers: [
                    "Viewing the balance",
                    "Moving the funds",
                    "Changing network fees"
                ]
            }
        ]
    },
    {
        id: "agents",
        title: "Programs that pay for themselves",
        hint: "An agent is a program with a budget. It pays as it works — a search, a data feed, a call to a model — in amounts far too small for a card, where a fixed fee of a few cents would cost more than the thing being bought. What keeps it safe is not trust but the spending limit its owner signed.",
        questions: [
            {
                question: "In this sense, what is an agent?",
                answers: [
                    "A program with a budget",
                    "A human broker working for you",
                    "A bank's customer support bot"
                ]
            },
            {
                question: "Which of these might an agent pay for as it works?",
                answers: [
                    "A call to a model",
                    "A home mortgage",
                    "A monthly salary"
                ]
            },
            {
                question: "Why can't an agent pay for a single search by card?",
                answers: [
                    "A fee of a few cents costs more than the search",
                    "Cards cannot be used to pay for anything online",
                    "Searches are always free for software to run"
                ]
            },
            {
                question: "Who signs the spending limit an agent works within?",
                answers: [
                    "The validators",
                    "The agent's owner",
                    "The agent"
                ]
            },
            {
                question: "When does an agent pay?",
                answers: [
                    "As it works",
                    "Only when its owner is online",
                    "Once a year, in advance"
                ]
            }
        ]
    },
    {
        id: "crosschain",
        title: "Money that has to change chains",
        hint: "Chains do not share a ledger, so a token cannot simply travel between them. The old answer was to lock it on one chain and issue a copy — a wrapped token — on the other, leaving a pool of locked funds that has been the target of the largest hacks in crypto. Native transfer burns on one side and mints on the other, so there is no pool to steal.",
        questions: [
            {
                question: "Why can't a token simply travel between chains?",
                answers: [
                    "Each chain bans foreign tokens",
                    "Chains do not share a ledger",
                    "Tokens are too large to move"
                ]
            },
            {
                question: "What did the old lock-and-copy approach leave behind?",
                answers: [
                    "A permanent fee on every transfer",
                    "A pool of locked funds",
                    "A second copy of the whole chain"
                ]
            },
            {
                question: "What have pools of locked bridge funds attracted?",
                answers: [
                    "The largest hacks in crypto",
                    "Government deposit insurance",
                    "The highest staking yields"
                ]
            },
            {
                question: "What does native transfer do on the destination chain?",
                answers: [
                    "Burns the token",
                    "Mints the token",
                    "Locks the token"
                ]
            },
            {
                question: "Why is there nothing to steal in a native transfer?",
                answers: [
                    "No pool of locked funds exists",
                    "The amounts are encrypted",
                    "Every transfer is insured"
                ]
            }
        ]
    },
    {
        id: "transparency",
        title: "Proof without an audience",
        hint: "Two things have to hold at once. Reserves must be provable, so an independent accounting firm publishes a monthly attestation confirming they cover every token in circulation. And a business cannot have competitors reading its invoices, so confidential transfers hide the amount from the public while leaving it disclosable to an auditor.",
        questions: [
            {
                question: "Who publishes the reserve attestation?",
                answers: [
                    "Circle's own marketing team",
                    "An independent accounting firm",
                    "The validators of the Arc network"
                ]
            },
            {
                question: "How often does the reserve attestation come out?",
                answers: [
                    "Every five years",
                    "Every month",
                    "Never"
                ]
            },
            {
                question: "What problem do confidential transfers solve for a business?",
                answers: [
                    "Gas fees that are too high",
                    "Customers paying their bills late",
                    "Competitors reading its invoices"
                ]
            },
            {
                question: "A confidential transfer keeps the amount hidden from whom?",
                answers: [
                    "The auditor",
                    "The public",
                    "The sender"
                ]
            },
            {
                question: "Can an auditor still see a confidential transfer's details?",
                answers: [
                    "No, the amount is gone for good",
                    "Yes, they stay disclosable to an auditor",
                    "Only if the network votes to allow it"
                ]
            }
        ]
    },
    {
        id: "network",
        title: "What kind of network Arc is",
        hint: "Arc is a Layer-1: it settles its own blocks rather than posting them to somebody else's chain. It is EVM-compatible, so contracts and tools written for Ethereum work on it unchanged. Its public mainnet opened in September 2026, but a testnet is still where apps rehearse — the real software with money that is worth nothing, which is exactly where you want to find the bugs.",
        questions: [
            {
                question: "Does Arc post its blocks to another chain?",
                answers: [
                    "Yes, it posts them to Ethereum",
                    "No, it settles its own blocks",
                    "Yes, it posts them to Bitcoin"
                ]
            },
            {
                question: "Do Ethereum contracts need rewriting to run on Arc?",
                answers: [
                    "Yes, into Arc's own language",
                    "No, they work unchanged",
                    "Yes, they must be ported to Rust"
                ]
            },
            {
                question: "When did Arc's public mainnet open?",
                answers: [
                    "January 2025",
                    "It has not opened yet",
                    "September 2026"
                ]
            },
            {
                question: "Where do apps rehearse before going live on Arc?",
                answers: [
                    "On mainnet",
                    "Nowhere",
                    "On the testnet"
                ]
            },
            {
                question: "What makes a testnet the right place to find bugs?",
                answers: [
                    "It has no validators at all",
                    "It runs completely different software",
                    "The money on it is worth nothing"
                ]
            }
        ]
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RESCUE_TOPICS };
}
if (typeof window !== 'undefined') {
    window.RESCUE_TOPICS = RESCUE_TOPICS;
}
