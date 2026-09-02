// Rescue Quiz Topics — the second chance a player gets after losing every life.
//
// One topic is drawn per rescue. The player reads the hint first, then answers
// that topic's three questions; the hint contains everything needed to answer
// them, so a player who reads carefully gets back into the run.
//
// These questions are deliberately separate from the per-level quizzes in
// js/quizzes.js — a player who has just failed should not be re-asked what
// they already answered on the way here.
//
// Content verified against Arc / Circle / x402 public materials as of September 2026

const RESCUE_TOPICS = [
    {
        id: 'stablecoin',
        title: 'What a stablecoin actually is',
        hint: "A stablecoin is a token that stands for money someone really holds. USDC is redeemable one-for-one: hand a token back to the issuer and you get a dollar. That promise, not trading, is what keeps the price at a dollar — and it is why holding USDC is a claim on a dollar, not a share of the company that issues it.",
        questions: [
            {
                question: "Why does USDC hold its price?",
                answers: [
                    "Traders agree to keep it there",
                    "Every token can be redeemed for a dollar from the issuer",
                    "An algorithm buys and sells it to defend the peg"
                ],
                correctIndex: 1
            },
            {
                question: "Is holding USDC an investment in Circle?",
                answers: [
                    "No — it is a claim on a dollar, not a share of the company",
                    "Yes, holders receive a cut of Circle's profits",
                    "Yes, it works like a corporate bond"
                ],
                correctIndex: 0
            },
            {
                question: "What does one-for-one redemption mean?",
                answers: [
                    "One USDC always buys one of any other token",
                    "New tokens are minted only when others are burned",
                    "Hand back one token, receive one dollar"
                ],
                correctIndex: 2
            }
        ]
    },
    {
        id: 'gas',
        title: 'Gas, and why the currency matters',
        hint: "Gas is the fee the network charges to process your transaction. On most chains it is paid in a volatile token, so the cost in dollars moves while you are deciding. Arc charges gas in USDC, which turns an unpredictable cost into an ordinary line item — around half a cent per transaction.",
        questions: [
            {
                question: "What is gas?",
                answers: [
                    "A deposit returned once the transaction confirms",
                    "The fee the network charges to process a transaction",
                    "A charge collected by your wallet provider"
                ],
                correctIndex: 1
            },
            {
                question: "Why does a business care that gas is paid in a stablecoin?",
                answers: [
                    "The cost stays predictable in dollars",
                    "Transactions are processed faster",
                    "It removes the need to hold a wallet"
                ],
                correctIndex: 0
            },
            {
                question: "On a chain with a volatile gas token, what can happen to your fee while you wait?",
                answers: [
                    "Nothing — fees are fixed in dollars",
                    "It is refunded if the price moves",
                    "It moves with the token's price"
                ],
                correctIndex: 2
            }
        ]
    },
    {
        id: 'finality',
        title: 'When a payment is really done',
        hint: "A transaction is final when it can no longer be undone. Some chains only make that likely, which is why you wait for confirmations — recently accepted blocks can still be replaced, and that replacement is called a reorg. Arc's consensus makes finality definite in under a second, so there is nothing to wait out.",
        questions: [
            {
                question: "What does finality mean?",
                answers: [
                    "The transaction reached the mempool",
                    "The transaction can no longer be reversed",
                    "The fee has been paid in full"
                ],
                correctIndex: 1
            },
            {
                question: "Why do people wait for confirmations on some chains?",
                answers: [
                    "A recent block can still be replaced",
                    "The network is slow to transmit the payment",
                    "The wallet needs time to synchronise"
                ],
                correctIndex: 0
            },
            {
                question: "What is a reorg?",
                answers: [
                    "A wallet re-sorting the tokens it holds",
                    "Rewriting a deployed smart contract",
                    "Recently accepted blocks being replaced by a different chain"
                ],
                correctIndex: 2
            }
        ]
    },
    {
        id: 'keys',
        title: 'Wallets, keys and who can spend',
        hint: "A wallet does not hold money — it holds the key that authorises moving it, and whoever has the key has the funds. That is why no honest support desk will ever ask for your seed phrase, and why serious custody splits a key across parties so that neither of them can sign alone.",
        questions: [
            {
                question: "What does a wallet actually store?",
                answers: [
                    "The coins themselves",
                    "A personal copy of the blockchain",
                    "The key that authorises spending"
                ],
                correctIndex: 2
            },
            {
                question: "Someone from support asks for your seed phrase. What is happening?",
                answers: [
                    "An attempt to take your funds",
                    "A routine identity check",
                    "A standard wallet migration"
                ],
                correctIndex: 0
            },
            {
                question: "What is the point of splitting a signing key between two parties?",
                answers: [
                    "Transactions become cheaper to send",
                    "Neither party can move the funds alone",
                    "The balance is insured twice over"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 'agents',
        title: 'Programs that pay for themselves',
        hint: "An agent is a program with a budget. It pays as it works — a search, a data feed, a call to a model — in amounts far too small for a card, where a fixed fee of a few cents would cost more than the thing being bought. What keeps it safe is not trust but the spending limit its owner signed.",
        questions: [
            {
                question: "What makes an agent's payments different from a card payment?",
                answers: [
                    "The amounts are tiny and nobody is at the checkout",
                    "They can be reversed at any time",
                    "They must be approved at a bank branch"
                ],
                correctIndex: 0
            },
            {
                question: "What stops an agent from spending everything it can reach?",
                answers: [
                    "Nothing — an agent has to be trusted",
                    "A daily phone call from the bank",
                    "The spending limit its owner approved"
                ],
                correctIndex: 2
            },
            {
                question: "Why do machine payments need fees measured in fractions of a cent?",
                answers: [
                    "Networks charge programs more than people",
                    "A fee bigger than the payment makes the trade pointless",
                    "Machines send far more transactions than people do"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 'crosschain',
        title: 'Money that has to change chains',
        hint: "Chains do not share a ledger, so a token cannot simply travel between them. The old answer was to lock it on one chain and issue a copy — a wrapped token — on the other, leaving a pool of locked funds that has been the target of the largest hacks in crypto. Native transfer burns on one side and mints on the other, so there is no pool to steal.",
        questions: [
            {
                question: "What is a wrapped token?",
                answers: [
                    "A token locked on one chain and represented by a copy on another",
                    "A token with its fee included in the transfer",
                    "A token whose amount is hidden from the public"
                ],
                correctIndex: 0
            },
            {
                question: "Why is burn-and-mint safer than a lock-and-wrap bridge?",
                answers: [
                    "It is quicker to program",
                    "Validators approve each transfer by hand",
                    "There is no pool of locked funds to steal"
                ],
                correctIndex: 2
            },
            {
                question: "You send USDC to an address on the wrong chain. What is the likely outcome?",
                answers: [
                    "The network reroutes it to the right chain",
                    "It may be gone for good",
                    "It bounces back after a few blocks"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 'transparency',
        title: 'Proof without an audience',
        hint: "Two things have to hold at once. Reserves must be provable, so an independent accounting firm publishes a monthly attestation confirming they cover every token in circulation. And a business cannot have competitors reading its invoices, so confidential transfers hide the amount from the public while leaving it disclosable to an auditor.",
        questions: [
            {
                question: "What does a monthly attestation report confirm?",
                answers: [
                    "That the reserves cover the tokens in circulation",
                    "Where the token's price is heading",
                    "Who the largest holders are"
                ],
                correctIndex: 0
            },
            {
                question: "Who prepares an attestation?",
                answers: [
                    "The issuer's own finance team",
                    "An independent accounting firm",
                    "The blockchain, automatically"
                ],
                correctIndex: 1
            },
            {
                question: "What do confidential transfers on Arc hide?",
                answers: [
                    "Everything — no record is kept at all",
                    "Only the sender's identity",
                    "The amount, which can still be disclosed to an auditor"
                ],
                correctIndex: 2
            }
        ]
    },
    {
        id: 'network',
        title: 'What kind of network Arc is',
        hint: "Arc is a Layer-1: it settles its own blocks rather than posting them to somebody else's chain. It is EVM-compatible, so contracts and tools written for Ethereum work on it unchanged. And it is still a public testnet — the real software running with money that is worth nothing, which is exactly when you want to find the bugs.",
        questions: [
            {
                question: "What does EVM-compatible mean in practice?",
                answers: [
                    "It shares Ethereum's fees",
                    "Contracts and tools built for Ethereum work on it",
                    "Its blocks are validated by Ethereum"
                ],
                correctIndex: 1
            },
            {
                question: "What is a testnet for?",
                answers: [
                    "Running the real software with money that is worth nothing",
                    "Making real transactions more cheaply",
                    "Trying out wallet passwords safely"
                ],
                correctIndex: 0
            },
            {
                question: "Arc is a Layer-1. What does that mean?",
                answers: [
                    "It is the first release of a Layer-2 network",
                    "It supports only one token",
                    "It settles its own blocks instead of posting them to another chain"
                ],
                correctIndex: 2
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
