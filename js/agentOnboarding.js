// Agent Shift onboarding — three lessons, one at a time, each shown before
// it is explained. The player watches the thing happen, then reads why.
//
// Data only: the page decides how to render cards and run the shift.

const AgentOnboarding = {
    STEPS: [
        {
            id: 'intro',
            card: {
                title: 'You are not aiming in this mode',
                body: 'You hire a worker instead — a program with its own wallet. You set the rules it '
                    + 'spends by, then watch it work a shift.<br><br>That is what an agent is. Not a clever '
                    + 'program. A program you trust with a budget.',
                button: 'Show me one'
            }
        },
        {
            id: 'connect',
            card: {
                title: 'A worker that pays needs an account',
                body: 'So the first thing you do is open a wallet for it. In Circle\'s stack that is an '
                    + '<b>Agent Wallet</b>: the signing key is split in two, one share yours and one Circle\'s, '
                    + 'and no transaction goes out without both. The agent can spend from the account. '
                    + 'It can never take the account.<br><br>'
                    + 'The wallet you are about to see is a drawing — no keys, no network, no funds. It will '
                    + 'never ask you for a seed phrase, and neither should a real one.',
                button: 'Open the wallet'
            },
            wallet: 'connect',
            after: {
                title: 'Connecting is not handing over the keys',
                body: 'All you approved was a look at the address and the balance. The agent still cannot '
                    + 'move a cent — that takes a second approval, and it is the one that matters.<br><br>'
                    + 'Next: sign what it is allowed to spend.',
                button: 'Sign the permission'
            }
        },
        {
            id: 'watch',
            banner: 'Three simple jobs. Nothing to do — watch.',
            run: {
                grant: true,
                shift: {
                    script: [
                        { category: 'WEB_SEARCH_RESEARCH' },
                        { category: 'FINANCIAL_ANALYSIS' },
                        { category: 'SOCIAL_INTELLIGENCE' }
                    ],
                    policy: { perTx: 6, shift: 20, maxPrice: 6 },
                    duration: 90,
                    noExpire: true,
                    // Nothing goes offline during the first lesson: three jobs,
                    // three cheap specialists, so the fee counter lands on
                    // exactly $0.015 and the card below can name that number.
                    availability: {
                        'ai-research': true, 'crypto-analysis': true, 'social': true,
                        'meeting-prep': true, 'domain-search': true, 'voice-briefing': true
                    }
                },
                until: s => s.completed >= 3
            },
            after: {
                title: 'One approval, three payments',
                body: 'You signed the permission, then approved the first payment yourself. The other two '
                    + 'went out without you — inside the limits you signed, the agent does not need to ask. '
                    + 'That is delegation: not trust in the program, a ceiling on it.<br><br>'
                    + 'And the fee counter reads about <b>$0.015</b> — three transactions at roughly '
                    + '<b>$0.005</b>, paid in USDC, the same asset as the payment. No separate gas token to '
                    + 'hold, and the fee does not swing with a token price, which is why a treasury can '
                    + 'budget for it.',
                button: 'And my part?'
            }
        },
        {
            id: 'policy',
            card: {
                title: 'Three numbers, and they are yours',
                body: 'The permission you signed in the wallet is three numbers.<br><br>'
                    + '<b>Per-transaction limit</b> — the ceiling on any single payment.<br>'
                    + '<b>Shift budget</b> — the total the agent may spend before it stops.<br>'
                    + '<b>Price criterion</b> — how expensive a service it is allowed to shop for.<br><br>'
                    + 'The agent reads these. It can never change them. Circle\'s recommended starting point '
                    + 'is $1 per transaction and $5 per day.<br><br>'
                    + 'Now let us set the per-transaction limit deliberately too low and see what happens.',
                button: 'Set it to $0.10'
            }
        },
        {
            id: 'stop',
            banner: 'One job — and the cheap service for it is offline.',
            run: {
                shift: {
                    script: [{ category: 'INFRASTRUCTURE' }],
                    policy: { perTx: 0.10, shift: 20, maxPrice: 6 },
                    duration: 120,
                    noExpire: true,
                    availability: { 'meeting-prep': false }   // forces the pricier fallback
                },
                until: s => s.stops >= 1 && s.completed >= 1
            },
            after: {
                title: 'It stopped instead of working around you',
                body: 'The only service that could do the job cost more than your per-transaction limit. '
                    + 'The agent stopped and wrote down why. It did not split the payment, retry it, or raise '
                    + 'its own limit — it cannot do any of those.<br><br>'
                    + 'Raising the limit went through the wallet and needed a code that was sent to you, '
                    + 'not to the agent. It cost <b>five seconds</b> of the shift. In a real shift '
                    + 'those seconds are jobs that expire while you type.<br><br>'
                    + 'This is the whole point: the limits are worth thinking about <b>before</b> the shift, '
                    + 'because during it they cost you time.',
                button: 'Let me run a real one'
            }
        },
        {
            id: 'free',
            card: {
                title: 'Your shift',
                body: 'Sixty seconds. Jobs arrive every couple of seconds and expire if nobody picks them up.<br><br>'
                    + 'Services drop offline for stretches. When the specialist for a job is down, the only '
                    + 'thing left that can do it is a <b>$5.553</b> generalist — and your price criterion decides '
                    + 'whether the agent is allowed to buy it.<br><br>'
                    + 'Too tight and the agent idles while jobs burn. Too loose and it pays $5.553 for a job '
                    + 'worth sixteen cents. Set your rules.',
                button: 'Set my policy'
            }
        }
    ],

    // What the simulated wallet says when it pops up. All four are prompts a
    // real agent wallet has an equivalent of: connect, allowance, payment,
    // and the step-up that only the human can clear.
    requests: {
        connect: function (wallet) {
            return {
                title: 'Connection request',
                sub: 'ARCMAN — Agent Shift trainer',
                rows: [
                    ['Network', wallet.NETWORK],
                    ['Account', wallet.short()],
                    ['Balance', wallet.START_BALANCE.toFixed(2) + ' USDC'],
                    ['Grants', 'read address and balance']
                ],
                approve: 'Connect',
                reject: 'Not now',
                warn: 'Simulated wallet: no keys, no network, no funds. It will never ask for a seed '
                    + 'phrase &mdash; and neither will a real one.'
            };
        },

        grant: function (policy, opts) {
            opts = opts || {};
            return {
                title: 'Spending permission',
                sub: 'Spender: ARCMAN Shift Worker <span class="aw-tag">agent</span>',
                rows: [
                    ['Token', 'USDC'],
                    ['Per transaction', '$' + policy.perTx.toFixed(2)],
                    ['Total this shift', '$' + policy.shift.toFixed(2)],
                    ['Shops up to', '$' + policy.maxPrice.toFixed(2) + ' / service'],
                    ['Expires in', (opts.duration || 60) + 's']
                ],
                approve: 'Sign permission',
                reject: 'Cancel',
                autoOption: !!opts.autoOption,
                autoLabel: 'Let it pay without asking, inside these limits',
                warn: 'The agent may spend up to these amounts without asking again. It cannot raise them: '
                    + 'only you can, and that takes a code sent to you.'
            };
        },

        payment: function (task, api) {
            const s = task.service;
            return {
                title: 'Payment request',
                sub: 'x402 &middot; pay-per-call &middot; task #' + task.id,
                rows: [
                    ['To', s.name],
                    ['Amount', '$' + s.price.toFixed(3) + ' USDC'],
                    ['Network fee', '$' + api.GAS_PER_TX.toFixed(3) + ' USDC'],
                    ['Total', '$' + (s.price + api.GAS_PER_TX).toFixed(3)]
                ],
                approve: 'Approve payment',
                reject: 'Reject',
                autoOption: true,
                autoLabel: 'Approve payments like this automatically',
                warn: 'Reading this cost the shift a second and a half. That is the trade: approve every '
                    + 'payment yourself, or set the limits once and let it work.'
            };
        },

        otp: function (shift, code) {
            const b = shift.blocked;
            const rows = b.reason === 'per_tx_limit'
                ? [['Service', b.service.name],
                   ['Costs', '$' + b.needed.toFixed(3)],
                   ['Your limit', '$' + shift.policy.perTx.toFixed(2)],
                   ['New limit', '$' + (Math.ceil(b.needed * 100) / 100).toFixed(2)]]
                : [['Task', '#' + b.task.id],
                   ['Shift budget', '$' + shift.policy.shift.toFixed(2)],
                   ['Would reach', '$' + b.needed.toFixed(2)]];
            return {
                title: 'Limit change needs you',
                sub: 'The agent stopped and asked. It cannot clear this itself.',
                rows: rows,
                code: code,
                approve: 'Confirm',
                reject: 'Leave the limit alone',
                warn: 'Never give this code to the agent &mdash; you type it yourself. An agent that asks '
                    + 'you for it is not behaving correctly. And the shift clock is still running.'
            };
        }
    },

    // Reads the finished shift and says what the numbers mean.
    debrief: function (shift, api) {
        const margin = api.margin(shift) * 100;
        const lines = [];
        lines.push(`Completed <b>${shift.completed}</b> jobs, earned <b>$${shift.earned.toFixed(2)}</b>, `
            + `spent <b>$${shift.spent.toFixed(2)}</b> of which <b>$${shift.gasSpent.toFixed(3)}</b> was gas. `
            + `Gross margin <b>${margin.toFixed(1)}%</b>.`);

        let verdict;
        if (margin < 0) {
            verdict = 'Your price criterion let the agent buy the expensive generalist when the cheap '
                + 'specialist was offline. It kept working and it kept losing money on every one of those '
                + 'jobs. A criterion is not a safety limit — it is a shopping instruction.';
        } else if (shift.expired >= 4) {
            verdict = 'Your rules were tight enough that the agent spent the shift waiting. Nothing was '
                + 'overpaid, and most of the work went to nobody. Idle is also a cost.';
        } else if (shift.stops >= 3) {
            verdict = 'You spent the shift being interrupted. Every stop was a limit you could have set '
                + 'correctly before starting, and each one cost five seconds you did not get back.';
        } else if (margin >= 79.8) {
            verdict = 'Above 79.8% — the gross margin a real agent service reported at Circle\'s '
                + 'nanopayments hackathon. You set the rules and then let the thing work.';
        } else {
            verdict = 'A working shift: the agent stayed inside your rules and turned a margin. The '
                + 'benchmark to beat is 79.8%, reported by a real agent service at Circle\'s hackathon.';
        }
        lines.push(verdict);
        return { title: 'Shift over', body: lines.join('<br><br>') };
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AgentOnboarding };
}
if (typeof window !== 'undefined') {
    window.AgentOnboarding = AgentOnboarding;
}
