// English language pack — the canonical key set every other locale mirrors.
I18n.register('en', {
    document: {
        title: 'ARCMAN: Final Settlement - Arcade Game'
    },

    language: {
        label: 'Language',
        select: 'Select language'
    },

    start: {
        title: 'ARCMAN: Final Settlement',
        subtitle: 'Click to Start'
    },

    menu: {
        title: 'ARCMAN: Final Settlement',
        subtitle: 'Arcade Game',
        tournament: 'TOURNAMENT MODE',
        community: 'COMMUNITY LEVELS',
        editor: 'LEVEL EDITOR',
        statistics: 'STATISTIC',
        leaderboard: 'LEADERBOARD',
        audio: 'AUDIO OPTIONS',
        faucet: 'USDC Faucet'
    },

    hud: {
        score: 'Score: {score}',
        level: 'Level {current}/{total}',
        lives: 'Lives: {lives}',
        levelName: 'Level {id}: {name}',
        menu: 'Menu',
        backToEditor: 'Back to Editor',
        settlement: 'SETTLEMENT'
    },

    mode: {
        tournament: 'Tournament',
        community: 'Community',
        test: 'Test',
        unknown: 'Unknown',
        title: 'Mode Description',
        close: "I'm in",
        tournamentText: 'You are <span style="color: #0ff; text-shadow: 0 0 20px #0ff; font-weight: bold;">Arc Man</span>. Your mission: finalize the stablecoin transaction. Launch the token in an arc and hit the Settlement Zone.\n\nScore points, compete with others, climb the Leaderboard, and mint your final NFT.',
        tournamentHighlight: 'You have 5 lives in this mode. Correct answers in the quiz restore them — and if you lose them all, one last quiz can put you back in.'
    },

    tutorial: {
        title: 'Game Objects Guide',
        cloudName: 'Slippage Cloud',
        cloudText: 'A trap! It slows down finalization, changes the trajectory, and gives 10 points.',
        gateName: 'Arc Gate',
        gateText: 'Grants a 1.5× multiplier to your points for completing the level.',
        barrierName: 'Barrier',
        barrierText: 'Barrier — you’ve hit a compliance barrier! The transaction requires routing, the flight direction will change, and it gives 10 points.',
        settlementName: 'Settlement Zone',
        settlementText: 'This is the finish! Entering it finalizes the transaction.',
        close: 'Got It!'
    },

    summary: {
        title: 'Transaction Finalized!',
        levelPoints: 'Level Points',
        totalPoints: 'Total Points',
        gates: 'Arc Gates Collected',
        clouds: 'Slippage Clouds Passed',
        barriers: 'Barrier Collisions',
        continue: 'Continue',
        returnToEditor: 'Return to Editor'
    },

    quizUi: {
        title: 'Play quiz, gain life',
        questionPlaceholder: 'Question will appear here',
        answer1: 'Answer 1',
        answer2: 'Answer 2',
        answer3: 'Answer 3',
        skip: 'Skip',
        skipFullLives: 'Skip (You have full lives)',
        continue: 'Continue',
        correct: 'Correct!',
        correctLife: 'Correct! +1 Life',
        incorrect: 'Incorrect. Correct answer: {answer}',
        unavailable: 'The quiz server did not answer, so this question does not count. Continue to the next level.'
    },

    rescue: {
        title: 'Out of lives',
        lead: 'Three questions stand between you and the run you were having. Read this first — the answers are all in here.',
        readIt: 'I have read it — ask me',
        progress: 'Question {current} of {total}   ·   {correct} right so far',
        correct: 'Correct',
        wrong: 'Wrong — it was: {answer}',
        next: 'Next question',
        seeResult: 'See where that leaves you',
        verdictTitle: '{correct} of {total} correct',
        backInOne: 'Back in — with 1 life. This was the one rescue of the run.',
        backIn: 'Back in — with {lives} lives. This was the one rescue of the run.',
        notEnough: 'Not enough. The run restarts from the first level.',
        rescued: 'Rescued',
        runOver: 'Run over',
        backToLevel: 'Back to the level',
        startOver: 'Start over',
        continue: 'Continue',
        unavailable: 'The rescue quiz could not reach the server, so it cannot be graded. The run restarts from the first level.'
    },

    infoUi: {
        title: 'Did you know?',
        continue: 'Continue'
    },

    completion: {
        title: '🎉 Game Completed! 🎉',
        finalScore: 'Final Score',
        levelsCompleted: 'Levels Completed',
        time: 'Completion Time',
        bestLevelScore: 'Best Level Score',
        averageLevelScore: 'Average Level Score',
        gameMode: 'Game Mode',
        finalizeOnchain: 'Finalize On-Chain',
        mintNft: 'Mint NFT',
        returnToMenu: 'Return to Menu'
    },

    community: {
        title: '🎉 Congratulations! 🎉',
        text: "You've completed all community-created levels. Come back later for new ones, superhero!",
        returnToMenu: 'Return to Menu',
        none: 'No community levels available yet. Check back later!'
    },

    stats: {
        title: 'Player Statistics',
        overview: 'Overview',
        gamesPlayed: 'Games Played',
        gamesCompleted: 'Games Completed',
        completionRate: 'Completion Rate',
        bestScores: 'Best Scores',
        bestFinalScore: 'Best Final Score',
        bestLevelScore: 'Best Level Score',
        averageFinalScore: 'Average Final Score',
        totalLifetimePoints: 'Total Lifetime Points',
        performance: 'Performance',
        totalLevels: 'Total Levels Completed',
        avgLevelsPerGame: 'Avg Levels Per Game',
        fastestTime: 'Fastest Completion',
        averageTime: 'Average Time',
        achievements: 'Achievements',
        totalGates: 'Total Gates Passed',
        totalClouds: 'Total Clouds Passed',
        totalBarriers: 'Total Barriers Hit',
        perfectGames: 'Perfect Games',
        modeStats: 'Game Mode Stats',
        tournamentPlayed: 'Tournament: Played',
        tournamentCompleted: 'Tournament: Completed',
        lastGame: 'Last Game',
        date: 'Date',
        mode: 'Mode',
        score: 'Score',
        never: 'Never',
        notAvailable: 'N/A',
        reset: 'Reset Statistics',
        close: 'Close',
        resetConfirm: 'Are you sure you want to reset all statistics? This cannot be undone.'
    },

    leaderboard: {
        title: '🏆 Leaderboard 🏆',
        top10: 'Top 10',
        top25: 'Top 25',
        top50: 'Top 50',
        top100: 'Top 100',
        yourRank: 'Your Rank:',
        points: '{score} points',
        loading: 'Loading leaderboard...',
        empty: 'No players on leaderboard yet. Be the first!',
        loadFailed: 'Failed to load leaderboard: {error}',
        refresh: 'Refresh',
        close: 'Close'
    },

    onchain: {
        title: 'Finalize Score On-Chain',
        finalScore: 'Final Score',
        levelsCompleted: 'Levels Completed',
        gameMode: 'Game Mode',
        connectPrompt: 'Connect your wallet to finalize your score on-chain',
        supportedWallets: 'Supported wallets: MetaMask, Rabby',
        noWalletTitle: "Don't have a wallet?",
        noWalletText: 'Install <a href="https://metamask.io/download/" target="_blank" style="color: #0ff; text-decoration: underline;">MetaMask</a> or <a href="https://rabby.io/" target="_blank" style="color: #0ff; text-decoration: underline;">Rabby</a> browser extension, then refresh this page.',
        connectWallet: 'Connect Wallet',
        connecting: 'Connecting...',
        connected: 'Connected:',
        disconnect: 'Disconnect',
        preparing: 'Preparing transaction...',
        estimatedGas: 'Estimated Gas:',
        submit: 'Finalize Score On-Chain',
        processing: 'Processing...',
        gettingSignature: 'Getting server signature...',
        submitting: 'Submitting transaction...',
        successTitle: '✅ Score Finalized!',
        successText: 'Your score has been successfully recorded on-chain.',
        viewTx: 'View Transaction on Etherscan',
        errorTitle: '❌ Error',
        close: 'Close',
        failed: 'Failed to finalize score on-chain'
    },

    nft: {
        title: '🎨 Mint Completion NFT',
        preview: 'NFT Preview',
        previewName: 'ARCMAN: Final Settlement - Completion Certificate',
        connectPrompt: 'Connect your wallet to mint your completion NFT',
        supportedWallets: 'Supported wallets: MetaMask, Rabby',
        connectWallet: 'Connect Wallet',
        connected: 'Connected:',
        alreadyHave: '✓ You already have a completion NFT!',
        tokenId: 'Token ID:',
        viewOnExplorer: 'View on Block Explorer',
        disconnect: 'Disconnect',
        readyToMint: 'Ready to mint',
        estimatedGas: 'Estimated gas:',
        mint: 'Mint NFT',
        minting: 'Minting...',
        preparing: 'Preparing transaction...',
        estimatingGas: 'Estimating gas...',
        mintingNft: 'Minting NFT...',
        mintedSuccess: 'NFT minted successfully!',
        alreadyMinted: 'Already Minted',
        successTitle: '🎉 NFT Minted Successfully! 🎉',
        successText: 'Your completion certificate has been minted!',
        transaction: 'Transaction:',
        viewTx: 'View Transaction',
        errorTitle: '❌ Error',
        close: 'Close',
        connectFailed: 'Failed to connect wallet: {error}',
        mintFailed: 'Failed to mint NFT'
    },

    audio: {
        title: 'AUDIO OPTIONS',
        musicVolume: 'Music Volume',
        soundVolume: 'Sound Effects Volume',
        close: 'CLOSE'
    },

    wallet: {
        connect: 'Connect Wallet',
        connecting: 'Connecting...',
        useHttpServer: '⚠️ Use HTTP Server',
        notInstalled: '{wallet} is not installed. Please install MetaMask or Rabby wallet to continue.',
        noProvider: 'No wallet provider found. Please install MetaMask or Rabby wallet.',
        noAccounts: 'No accounts found. Please unlock your wallet.',
        rejected: 'Connection rejected. Please approve the connection request in your wallet.',
        pending: 'Connection request already pending. Please check your wallet.',
        connectFailed: 'Failed to connect wallet. Please try again.',
        notConnected: 'Wallet not connected',
        notDetected: 'Wallet is not detected. ',
        providerInvalid: 'window.ethereum exists but may not be a valid wallet provider. ',
        installSteps: 'Please:\n1. Make sure MetaMask or Rabby is installed and enabled\n2. Refresh the page\n3. Check browser console for details',
        switchNetwork: 'Please approve the network switch to {network} in your wallet.',
        switchFailed: 'Failed to switch to {network}. Please switch manually in your wallet.',
        contractMissing: 'Contract not initialized. Please set CONTRACT_ADDRESS in config.',
        txWouldFail: 'Transaction would fail. Please check your score data.',
        nftExists: 'You already have a completion NFT for {mode} mode',
        nftInitFailed: 'Failed to initialize NFT contract'
    },

    errors: {
        connectWalletFirst: 'Please connect your wallet first',
        noCompletionData: 'No completion data available',
        noAccount: 'No account connected',
        noSession: 'No game session found. This can happen if you started the game without a wallet connected.\n\nPlease connect your wallet, then play through all levels again to record your score.',
        requestTimeout: 'Request timed out. The server may be slow or unavailable.',
        signatureFailed: 'Failed to get server signature',
        serverError: 'Server error: {status} {statusText}',
        leaderboardUnavailable: 'Leaderboard module is not available'
    },
    editor: {
        title: 'Level Editor',
        close: 'Close Editor',
        new: 'New Level',
        save: 'Save Level',
        delete: 'Delete Level',
        export: 'Export',
        submit: 'Submit Level',
        levelInfo: 'Level Info',
        levelName: 'Level Name:',
        newLevelName: 'New Level',
        levelId: 'Level ID:',
        idNew: 'New',
        tools: 'Tools',
        toolSelect: 'Select',
        toolGate: 'Arc Gate',
        toolCloud: 'Slippage Cloud',
        toolLifeRestore: 'Life Restore',
        toolBarrierLarge: 'Barrier (Large)',
        toolBarrierMedium: 'Barrier (Medium)',
        toolBarrierSmall: 'Barrier (Small)',
        toolSettlement: 'Settlement Zone',
        toolPlayer: 'Player Start',
        toolDelete: 'Delete',
        rotate: 'Rotate Selected (R)',
        preview: 'Level Preview',
        instructions: 'Click to place objects. Select tool to select, then press R or click Rotate to rotate (15° steps).',
        objects: 'Objects',
        gates: 'Arc Gates:',
        clouds: 'Slippage Clouds:',
        lifeRestores: 'Life Restores:',
        barriers: 'Barriers:',
        settlementZone: 'Settlement Zone:',
        levelList: 'Level List',
        loadingLevels: 'Loading levels...',
        load: 'Load Level',
        launch: 'Launch Level',
        exportTitle: 'Export DEFAULT_LEVELS',
        exportHint: 'Copy the code below and replace the DEFAULT_LEVELS array in levels.js:',
        copy: 'Copy to Clipboard',
        copied: 'Code copied to clipboard!',
        copyFailed: 'Failed to copy. Please select and copy manually.',
        needSettlementSave: 'Please add a Settlement Zone before saving!',
        saved: 'Level saved!',
        cannotDelete: 'Cannot delete: This is a new level or a default level.',
        exportModalMissing: 'Export modal not found. Code logged to console.',
        exportUnavailable: 'Export function not available. Make sure levels.js is loaded.',
        nothingToSubmit: 'No level to submit!',
        needSettlementSubmit: 'Please add a Settlement Zone before submitting!',
        needObjects: 'Please add at least one object (gate, cloud, barrier, or life restore) before submitting!',
        submitting: 'Submitting level...',
        submitted: 'Level submitted successfully! The developer will review it.',
        submitFailed: 'Failed to submit level. Please try again later.',
        nothingToLaunch: 'No level to launch!',
        deleteConfirm: 'Delete this level?',
        exportModalMissingWithCode: 'Export modal not found. Here is the code:\n\n',
        needSettlementLaunch: 'Please add a Settlement Zone before launching!',
        managerMissing: 'Level manager not initialized!',
        launchFailed: 'Failed to load level for launch!',
        savedAndLaunching: 'Level saved and launching...'
    },

    // --- Level names (levels.js keeps the geometry, this keeps the wording) ---
    levels: {
        1: 'First Launch',
        2: 'Pathfinder',
        3: 'Create an arc',
        4: 'Pass through the gate',
        5: 'Routing',
        6: 'Two barriers',
        7: 'Looks simple',
        8: 'Storm Warning',
        9: 'The Gauntlet',
        10: 'Fully Backed',
        11: 'One In, One Out',
        12: 'Not Only Dollars',
        13: 'Both Legs at Once',
        14: 'Sealed Envelope',
        15: 'Who Signs the Block',
        16: 'Correspondent',
        17: 'Institutional Traffic',
        18: 'No Take-Backs',
        19: 'Road to Mainnet',
        20: 'Final Settlement'
    },

    // --- Educational screens (js/infoScreens.js) ---
    info: {
        1: "Arc is an open Layer-1 blockchain from Circle, the company that issues USDC. It is EVM-compatible and purpose-built for stablecoin finance. Its public mainnet opened on 16 September 2026; this game's scores and certificates still settle on Arc Testnet, where playing costs nothing.",
        2: 'On Arc, gas is paid in USDC instead of a volatile token. Fees are quoted directly in dollars and average around $0.005 per transaction, so anyone can budget them like a normal cost.',
        3: "Arc pairs Malachite — a Rust implementation of Tendermint BFT — with a Reth execution layer. Finality is deterministic and sub-second: once a block is committed it is final, with no reorgs and no confirmations to wait for. It is one of the properties Arc's public mainnet opened with.",
        4: "ARC is Arc's planned coordination token — not its gas, which stays payable in USDC. By design, protocol fees are converted into ARC and routed to validators and stakers, with a portion burned. Mainnet opened without it: ARC has not launched, and Circle describes any token plans as exploratory.",
        5: "Arc's biggest bet is the agentic economy — AI agents paying for compute, data and services on their own. That needs payments smaller than a cent, settled in USDC over open standards like x402.",
        6: "x402 is that open standard. It revives HTTP status code 402, 'Payment Required': instead of an error, the server answers with a price. The client pays in USDC and repeats the request, and a facilitator verifies the payment onchain. No account, no card, no human in the loop.",
        7: 'Card rails cannot price a single API call. They charge a fixed fee per transaction — roughly a few cents plus a percentage — so anything worth a cent costs more to collect than it earns. Stablecoin rails price a transfer in fractions of a cent, which is what makes pay-per-call possible.',
        8: "A program that pays needs an account of its own. Circle's programmable wallets never hand the agent a private key: the key is split across parties using MPC, and the agent spends only inside the allowance you signed. It can spend from the account. It can never take the account.",
        9: 'USDC does not travel between chains as a wrapped copy. CCTP burns it on the source chain and mints native USDC on the destination, so there is no bridge token to trust. Circle Gateway puts a unified balance on top, so an agent sees one balance instead of a wallet per chain.',
        10: "Every USDC is backed by a dollar of reserves — cash and short-dated US Treasuries, held apart from Circle's own money. A Big Four firm publishes a monthly attestation confirming the reserves cover every token in circulation. That is the boring part, and it is the part that makes the rest work.",
        11: 'USDC is not mined or traded into existence. Through Circle Mint a business wires dollars in and the same amount of USDC is minted; redeem it and the tokens are burned as the dollars go back out. One in, one out, 24/7 — no market maker sets the price of a dollar.',
        12: 'A stablecoin does not have to be a dollar. Circle also issues EURC, a euro token with the same reserve model, and Arc is designed for several currencies at once — because a payment network that only speaks one currency stops at the first border.',
        13: "Swapping currencies is where payments usually break: one side sends and then waits, exposed, for the other. Arc's FX engine quotes off-chain and settles both legs inside a single contract, so either both transfers happen or neither does. No leg is ever left hanging.",
        14: "A public ledger is a problem for a business — competitors can read every invoice. Arc's answer is opt-in confidential transfers: amounts are encrypted while addresses stay visible, and the parties can disclose the details to an auditor or regulator when required. Private from rivals, not from the law.",
        15: "Someone has to order the transactions. Arc's mainnet opened with a permissioned set of founding validators — among them Visa, Mastercard, BlackRock, DTCC and Standard Chartered. It is a deliberate trade: fewer validators at the start, in exchange for names you can hold responsible, with a move to open staking planned later.",
        16: 'A cross-border wire hops through correspondent banks, each with its own cut-off time, so money can sit idle for days over a weekend. Stablecoin rails do not keep office hours: the same transfer settles in seconds, at any hour, with the fee known before you send.',
        17: "Arc did not open cold. Its testnet ran from October 2025, then a private mainnet with over a hundred institutional and ecosystem builders, before the public launch in September 2026. That is how a payment network should be tested: with other people's real processes, before anyone's real money.",
        18: 'There is no chargeback on a settled transfer. Send to the wrong address and no support desk can pull it back — the same finality that makes settlement fast makes mistakes permanent. That is why spending limits, allowances and test networks exist: you check before, because there is no after.',
        19: "Arc's public mainnet went live on 16 September 2026: gas in USDC, sub-second finality, and a permissioned set of founding validators. Still ahead are the ARC token and the move from Proof-of-Authority to Proof-of-Stake it is meant to enable. You walked this road on Arc Testnet while the network was being built — and it ends where mainnet begins.",
        20: 'This whole game is one idea: a payment is not done when it is sent, it is done when it is final. Settlement is the moment it can no longer be reversed. Stablecoin gas plus sub-second deterministic finality is what lets that moment arrive at machine speed — which is exactly what you have been aiming at.'
    },

    // --- Per-level quizzes (js/quizzes.js keeps the correct index) ---
    quiz: {
        1: {
            question: 'What is Arc?',
            answers: [
                'A Layer-2 rollup that settles on Ethereum',
                'An EVM-compatible Layer-1 built by Circle for stablecoin finance',
                'A closed payment API with no blockchain behind it'
            ]
        },
        2: {
            question: 'Which asset do you pay gas with on Arc?',
            answers: ['ETH', 'USDC', 'ARC']
        },
        3: {
            question: 'How fast is finality on Arc?',
            answers: [
                'About 10 minutes, like Bitcoin',
                'A few minutes, once enough confirmations pile up',
                'Sub-second and deterministic — finalized blocks are never reorged'
            ]
        },
        4: {
            question: 'How is ARC designed to relate to the fees paid on Arc?',
            answers: [
                'Fees are converted into ARC for validators and stakers, and a portion is burned',
                'ARC replaced USDC as the gas token when mainnet opened',
                'Fees go straight to Circle as company revenue'
            ]
        },
        5: {
            question: 'Which use case is Arc betting on most heavily?',
            answers: [
                'Gaming and metaverse worlds',
                'The agentic economy — AI agents paying and settling with each other',
                'Fully anonymous peer-to-peer transfers'
            ]
        }
,
        6: {
            question: "In x402, what does a server's HTTP 402 response mean?",
            answers: [
                'The request failed and should not be retried',
                'Here is the price — pay it in USDC and send the request again',
                'The client must first register an account and add a card'
            ]
        },
        7: {
            question: "Why can't card rails charge for a single API call?",
            answers: [
                'Card networks are offline at night',
                'A fixed fee per transaction costs more than the call is worth',
                'Cards cannot process payments from software, only from people'
            ]
        },
        8: {
            question: 'What does an agent get when you give it a Circle wallet?',
            answers: [
                'The private key, so it can move everything in the account',
                'The right to spend inside the allowance you signed — never the key itself',
                'A seed phrase it stores for you in plain text'
            ]
        },
        9: {
            question: 'How does USDC move between chains with CCTP?',
            answers: [
                'It is locked in a bridge and a wrapped copy is issued',
                'It is burned on the source chain and minted natively on the destination',
                "It is sold for the destination chain's own token and bought back"
            ]
        },
        10: {
            question: 'What sits behind every USDC in circulation?',
            answers: [
                'A dollar of reserves — cash and short-dated Treasuries, attested monthly',
                'A basket of other cryptocurrencies held by Circle',
                'An algorithm that mints and burns to defend the price'
            ]
        },
        11: {
            question: 'How does new USDC come into existence?',
            answers: [
                'It is mined by validators as a block reward',
                'Someone pays dollars to Circle and the same amount is minted; redeeming burns it',
                'Traders buy it on an exchange until the supply grows'
            ]
        },
        12: {
            question: 'Does Circle issue anything other than a dollar stablecoin?',
            answers: [
                'No — USDC is the only one',
                'Yes — EURC, a euro stablecoin with the same reserve model',
                'Yes, but only tokens pegged to gold'
            ]
        },
        13: {
            question: "What does Arc's FX engine settle inside a single contract?",
            answers: [
                'Both legs of the currency swap, or neither',
                'One leg now and the other at the end of the day',
                'The trade fee, while the currencies move by wire'
            ]
        },
        14: {
            question: "What do Arc's confidential transfers hide?",
            answers: [
                'Everything — the network keeps no record at all',
                'The amount, while addresses stay visible and details can be disclosed on request',
                "The sender's identity, while the amount is public"
            ]
        },
        15: {
            question: 'Who validates blocks on Arc today?',
            answers: [
                'Anyone who stakes enough tokens, from day one',
                'A permissioned set of known institutions, opening up over time',
                'Circle alone, with no other validators planned'
            ]
        },
        16: {
            question: 'Why can a cross-border bank transfer take days?',
            answers: [
                'The money physically travels between countries',
                'It hops through correspondent banks with their own cut-off times and weekends',
                'Regulators manually approve every payment'
            ]
        },
        17: {
            question: 'Who used Arc before its public mainnet opened?',
            answers: [
                'Nobody — the network was switched on for the first time at launch',
                'Over a hundred institutions and builders, on testnet and then a private mainnet',
                'Only retail players in games like this one'
            ]
        },
        18: {
            question: 'You send USDC to the wrong address. What can be done?',
            answers: [
                'Nothing — a settled transfer has no chargeback',
                'Circle reverses it if you file a support ticket',
                'Validators roll back the block on request'
            ]
        },
        19: {
            question: 'What stage is Arc at right now?',
            answers: [
                'Public mainnet since September 2026, with the ARC token still ahead',
                'A testnet with no mainnet date announced',
                'Mainnet running with ARC as its gas token'
            ]
        },
        20: {
            question: 'When is a payment actually settled?',
            answers: [
                'When the sender clicks send',
                'When the transaction shows up in the mempool',
                'When it is final and can no longer be reversed'
            ]
        }
    },

    // --- Rescue quiz topics (js/rescueTopics.js keeps the correct index) ---
    rescueTopics: {
        stablecoin: {
            title: 'What a stablecoin actually is',
            hint: 'A stablecoin is a token that stands for money someone really holds. USDC is redeemable one-for-one: hand a token back to the issuer and you get a dollar. That promise, not trading, is what keeps the price at a dollar — and it is why holding USDC is a claim on a dollar, not a share of the company that issues it.',
            questions: [
                {
                    question: 'Why does USDC hold its price?',
                    answers: [
                        'Traders agree to keep it there',
                        'Every token can be redeemed for a dollar from the issuer',
                        'An algorithm buys and sells it to defend the peg'
                    ]
                },
                {
                    question: 'Is holding USDC an investment in Circle?',
                    answers: [
                        'No — it is a claim on a dollar, not a share of the company',
                        "Yes, holders receive a cut of Circle's profits",
                        'Yes, it works like a corporate bond'
                    ]
                },
                {
                    question: 'What does one-for-one redemption mean?',
                    answers: [
                        'One USDC always buys one of any other token',
                        'New tokens are minted only when others are burned',
                        'Hand back one token, receive one dollar'
                    ]
                }
            ]
        },
        gas: {
            title: 'Gas, and why the currency matters',
            hint: 'Gas is the fee the network charges to process your transaction. On most chains it is paid in a volatile token, so the cost in dollars moves while you are deciding. Arc charges gas in USDC, which turns an unpredictable cost into an ordinary line item — around half a cent per transaction.',
            questions: [
                {
                    question: 'What is gas?',
                    answers: [
                        'A deposit returned once the transaction confirms',
                        'The fee the network charges to process a transaction',
                        'A charge collected by your wallet provider'
                    ]
                },
                {
                    question: 'Why does a business care that gas is paid in a stablecoin?',
                    answers: [
                        'The cost stays predictable in dollars',
                        'Transactions are processed faster',
                        'It removes the need to hold a wallet'
                    ]
                },
                {
                    question: 'On a chain with a volatile gas token, what can happen to your fee while you wait?',
                    answers: [
                        'Nothing — fees are fixed in dollars',
                        'It is refunded if the price moves',
                        "It moves with the token's price"
                    ]
                }
            ]
        },
        finality: {
            title: 'When a payment is really done',
            hint: "A transaction is final when it can no longer be undone. Some chains only make that likely, which is why you wait for confirmations — recently accepted blocks can still be replaced, and that replacement is called a reorg. Arc's consensus makes finality definite in under a second, so there is nothing to wait out.",
            questions: [
                {
                    question: 'What does finality mean?',
                    answers: [
                        'The transaction reached the mempool',
                        'The transaction can no longer be reversed',
                        'The fee has been paid in full'
                    ]
                },
                {
                    question: 'Why do people wait for confirmations on some chains?',
                    answers: [
                        'A recent block can still be replaced',
                        'The network is slow to transmit the payment',
                        'The wallet needs time to synchronise'
                    ]
                },
                {
                    question: 'What is a reorg?',
                    answers: [
                        'A wallet re-sorting the tokens it holds',
                        'Rewriting a deployed smart contract',
                        'Recently accepted blocks being replaced by a different chain'
                    ]
                }
            ]
        },
        keys: {
            title: 'Wallets, keys and who can spend',
            hint: 'A wallet does not hold money — it holds the key that authorises moving it, and whoever has the key has the funds. That is why no honest support desk will ever ask for your seed phrase, and why serious custody splits a key across parties so that neither of them can sign alone.',
            questions: [
                {
                    question: 'What does a wallet actually store?',
                    answers: [
                        'The coins themselves',
                        'A personal copy of the blockchain',
                        'The key that authorises spending'
                    ]
                },
                {
                    question: 'Someone from support asks for your seed phrase. What is happening?',
                    answers: [
                        'An attempt to take your funds',
                        'A routine identity check',
                        'A standard wallet migration'
                    ]
                },
                {
                    question: 'What is the point of splitting a signing key between two parties?',
                    answers: [
                        'Transactions become cheaper to send',
                        'Neither party can move the funds alone',
                        'The balance is insured twice over'
                    ]
                }
            ]
        },
        agents: {
            title: 'Programs that pay for themselves',
            hint: 'An agent is a program with a budget. It pays as it works — a search, a data feed, a call to a model — in amounts far too small for a card, where a fixed fee of a few cents would cost more than the thing being bought. What keeps it safe is not trust but the spending limit its owner signed.',
            questions: [
                {
                    question: "What makes an agent's payments different from a card payment?",
                    answers: [
                        'The amounts are tiny and nobody is at the checkout',
                        'They can be reversed at any time',
                        'They must be approved at a bank branch'
                    ]
                },
                {
                    question: 'What stops an agent from spending everything it can reach?',
                    answers: [
                        'Nothing — an agent has to be trusted',
                        'A daily phone call from the bank',
                        'The spending limit its owner approved'
                    ]
                },
                {
                    question: 'Why do machine payments need fees measured in fractions of a cent?',
                    answers: [
                        'Networks charge programs more than people',
                        'A fee bigger than the payment makes the trade pointless',
                        'Machines send far more transactions than people do'
                    ]
                }
            ]
        },
        crosschain: {
            title: 'Money that has to change chains',
            hint: 'Chains do not share a ledger, so a token cannot simply travel between them. The old answer was to lock it on one chain and issue a copy — a wrapped token — on the other, leaving a pool of locked funds that has been the target of the largest hacks in crypto. Native transfer burns on one side and mints on the other, so there is no pool to steal.',
            questions: [
                {
                    question: 'What is a wrapped token?',
                    answers: [
                        'A token locked on one chain and represented by a copy on another',
                        'A token with its fee included in the transfer',
                        'A token whose amount is hidden from the public'
                    ]
                },
                {
                    question: 'Why is burn-and-mint safer than a lock-and-wrap bridge?',
                    answers: [
                        'It is quicker to program',
                        'Validators approve each transfer by hand',
                        'There is no pool of locked funds to steal'
                    ]
                },
                {
                    question: 'You send USDC to an address on the wrong chain. What is the likely outcome?',
                    answers: [
                        'The network reroutes it to the right chain',
                        'It may be gone for good',
                        'It bounces back after a few blocks'
                    ]
                }
            ]
        },
        transparency: {
            title: 'Proof without an audience',
            hint: 'Two things have to hold at once. Reserves must be provable, so an independent accounting firm publishes a monthly attestation confirming they cover every token in circulation. And a business cannot have competitors reading its invoices, so confidential transfers hide the amount from the public while leaving it disclosable to an auditor.',
            questions: [
                {
                    question: 'What does a monthly attestation report confirm?',
                    answers: [
                        'That the reserves cover the tokens in circulation',
                        "Where the token's price is heading",
                        'Who the largest holders are'
                    ]
                },
                {
                    question: 'Who prepares an attestation?',
                    answers: [
                        "The issuer's own finance team",
                        'An independent accounting firm',
                        'The blockchain, automatically'
                    ]
                },
                {
                    question: 'What do confidential transfers on Arc hide?',
                    answers: [
                        'Everything — no record is kept at all',
                        "Only the sender's identity",
                        'The amount, which can still be disclosed to an auditor'
                    ]
                }
            ]
        },
        network: {
            title: 'What kind of network Arc is',
            hint: "Arc is a Layer-1: it settles its own blocks rather than posting them to somebody else's chain. It is EVM-compatible, so contracts and tools written for Ethereum work on it unchanged. Its public mainnet opened in September 2026, but a testnet is still where apps rehearse — the real software with money that is worth nothing, which is exactly where you want to find the bugs.",
            questions: [
                {
                    question: 'What does EVM-compatible mean in practice?',
                    answers: [
                        "It shares Ethereum's fees",
                        'Contracts and tools built for Ethereum work on it',
                        'Its blocks are validated by Ethereum'
                    ]
                },
                {
                    question: 'What is a testnet for?',
                    answers: [
                        'Running the real software with money that is worth nothing',
                        'Making real transactions more cheaply',
                        'Trying out wallet passwords safely'
                    ]
                },
                {
                    question: 'Arc is a Layer-1. What does that mean?',
                    answers: [
                        'It is the first release of a Layer-2 network',
                        'It supports only one token',
                        'It settles its own blocks instead of posting them to another chain'
                    ]
                }
            ]
        }
    }
});
