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
        tournamentHighlight: 'You have 10 lives in this mode. Correct answers in the quiz restore them — and if you lose them all, one last quiz can put you back in.'
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
        returnToMenu: 'Return to Menu'
    },

    claim: {
        headline: 'Reward: {amount} USDC',
        remaining: '{count} rewards left in the pool',

        stepWallet: 'Prove your wallet',
        walletButton: 'Connect & sign',
        stepX: 'Verify with X',
        xButton: 'Sign in with X',
        stepSend: 'Receive the reward',
        sendButton: 'Claim',

        walletWaiting: 'Check your wallet: signing costs nothing and moves nothing.',
        walletRejected: 'You declined the signature. Without it we cannot tell the wallet is yours.',
        walletFailed: 'The wallet could not be checked. Try again.',

        xWaiting: 'Waiting for the X sign-in…',
        xVerified: 'X account verified.',
        xVerifiedAs: 'Verified as @{handle}.',
        xCancelled: 'Sign-in was cancelled.',
        xNotPremium: 'Rewards go to X Premium accounts only.',
        xTooNew: 'This X account is younger than six months.',
        xAgeUnknown: 'The age of this X account could not be checked.',
        xClaimed: 'This X account has already claimed a reward.',
        xFailed: 'X could not be reached. Try again.',
        popupBlocked: 'Your browser blocked the sign-in window. Allow pop-ups and try again.',

        sending: 'Sending the reward. This takes a few seconds.',
        paid: '{amount} USDC is on its way to your wallet. No gas needed — we paid it.',
        sendFailed: 'The reward could not be sent. Nothing was spent; try again.',
        viewTransaction: 'View the transaction',

        walletClaimed: 'This wallet has already claimed a reward.',
        alreadyClaimed: 'A reward has already been claimed for this account.',
        ipLimit: 'Too many rewards have been claimed from this connection.',
        poolEmpty: 'The reward pool is empty right now. You finished the course all the same.',
        paused: 'Rewards are paused at the moment.',
        needWallet: 'Prove your wallet first.',
        needX: 'Verify with X first.',
        expired: 'This claim has expired. Finish a run again to claim.',
        quizNeeded: 'The reward asks for {needed} correct quiz answers out of 20. You have {correct}. Play the course again and take the questions slowly.',
        failed: 'The reward could not be claimed.'
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
        provingWallet: 'Check your wallet: signing proves it is yours and moves nothing.',
        gettingSignature: 'Getting server signature...',
        submitting: 'Submitting transaction...',
        successTitle: '✅ Score Finalized!',
        successText: 'Your score has been successfully recorded on-chain.',
        viewTx: 'View Transaction on Etherscan',
        errorTitle: '❌ Error',
        close: 'Close',
        failed: 'Failed to finalize score on-chain'
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
        txWouldFail: 'Transaction would fail. Please check your score data.'
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
        '1a': {
            question: 'Which company is behind Arc?',
            answers: [
                'Tether, the company that issues USDT',
                'Coinbase, the company that runs Base',
                'Circle, the company that issues USDC'
            ]
        },
        '1b': {
            question: 'What is Arc purpose-built for?',
            answers: [
                'NFT marketplaces',
                'Anonymous trading',
                'Finance built on stablecoins'
            ]
        },
        '1c': {
            question: "Where do this game's scores and certificates settle?",
            answers: [
                'On Ethereum mainnet, through a bridge contract',
                'On Arc Testnet, where playing costs nothing',
                'On Arc mainnet, paid for in real USDC'
            ]
        },
        '2a': {
            question: 'Roughly how much does an average transaction cost on Arc?',
            answers: [
                'About five dollars',
                'About half a cent',
                'About fifty cents'
            ]
        },
        '2b': {
            question: 'What does paying gas in USDC let people do?',
            answers: [
                'Earn interest on the gas they pay',
                'Budget fees like any ordinary cost',
                'Skip fees on small transfers'
            ]
        },
        '2c': {
            question: 'What does Arc avoid by charging gas in USDC?',
            answers: [
                'Needing a wallet to send payments',
                'Fees in a token whose price swings',
                'Publishing transactions on a public ledger'
            ]
        },
        '3a': {
            question: 'What is Malachite?',
            answers: [
                'A Rust implementation of Tendermint BFT',
                'A proof-of-work mining algorithm for Arc',
                'The block explorer Circle runs for Arc'
            ]
        },
        '3b': {
            question: 'Which execution layer does Arc use?',
            answers: [
                'The Solana runtime',
                'Geth',
                'Reth'
            ]
        },
        '3c': {
            question: 'On Arc, when is a committed block final?',
            answers: [
                'Immediately, with no confirmations to wait for',
                'After a one-hour challenge window has passed',
                'After six confirmations, as on Bitcoin'
            ]
        },
        '4a': {
            question: 'Is ARC the token you pay gas with on Arc?',
            answers: [
                'Only for large payments',
                'Yes, since mainnet opened',
                'No, gas stays payable in USDC'
            ]
        },
        '4b': {
            question: "Did Arc's mainnet launch with the ARC token?",
            answers: [
                'Yes, on the same day',
                'Yes, for validators only',
                'No, ARC has not launched yet'
            ]
        },
        '4c': {
            question: "Under ARC's design, where do the fees converted into ARC go?",
            answers: [
                'To validators and stakers, with a portion burned',
                "To Circle's shareholders as a quarterly dividend",
                'Back to the users who sent the transactions'
            ]
        },
        '5a': {
            question: "What does 'the agentic economy' describe?",
            answers: [
                'Banks replacing their back-office staff with accounting software',
                'People hiring human agents to trade crypto on their behalf',
                'AI agents paying for compute, data and services on their own'
            ]
        },
        '5b': {
            question: 'How small do agent payments need to be?',
            answers: [
                'At least a dollar',
                'Smaller than a single cent',
                'Ten dollars or more'
            ]
        },
        '5c': {
            question: 'Which open standard is named for settling agent payments?',
            answers: [
                'x402',
                'SWIFT MT103',
                'ERC-721'
            ]
        },
        '6a': {
            question: 'Which HTTP status code does x402 bring back into use?',
            answers: [
                '404 Not Found',
                '402 Payment Required',
                '500 Internal Server Error'
            ]
        },
        '6b': {
            question: 'In an x402 exchange, who verifies the payment onchain?',
            answers: [
                'The server',
                'The client',
                'A facilitator'
            ]
        },
        '6c': {
            question: 'What does an x402 client do after paying?',
            answers: [
                'Repeats the original request',
                'Opens an account with the server',
                'Waits for an emailed receipt'
            ]
        },
        '7a': {
            question: 'What does a card network typically charge per transaction?',
            answers: [
                'A few cents plus a percentage',
                'A flat monthly fee',
                'Nothing under a dollar'
            ]
        },
        '7b': {
            question: 'What goes wrong when a card is used to collect a single cent?',
            answers: [
                'The money takes a month to arrive',
                'The card is frozen as suspected fraud',
                'Collecting it costs more than it earns'
            ]
        },
        '7c': {
            question: 'What makes pay-per-call pricing possible?',
            answers: [
                'Transfers priced in fractions of a cent',
                'Monthly invoices sent out by email',
                'Credit limits set by the card issuers'
            ]
        },
        '8a': {
            question: "How do Circle's programmable wallets protect the signing key?",
            answers: [
                'It is split across parties using MPC',
                "It is emailed to the agent's owner",
                'It is printed and kept in a bank vault'
            ]
        },
        '8b': {
            question: 'What sets the limit on what an agent can spend?',
            answers: [
                "The agent's own judgement",
                'A daily cap set by the network',
                'The allowance its owner signed'
            ]
        },
        '8c': {
            question: "Does the agent ever hold the wallet's private key?",
            answers: [
                'Yes, once trusted',
                'Only mid-payment',
                'No, never'
            ]
        },
        '9a': {
            question: 'What does CCTP do with USDC on the source chain?',
            answers: [
                'It burns the USDC',
                'It locks it',
                'It copies it'
            ]
        },
        '9b': {
            question: 'What does Circle Gateway give an agent?',
            answers: [
                'One balance across all chains',
                'A separate wallet on every chain',
                "A credit line at Circle's bank"
            ]
        },
        '9c': {
            question: 'Why is there no bridge token to trust with CCTP?',
            answers: [
                'USDC only ever exists on a single chain',
                'Every wrapped token is insured by the bridge',
                'Native USDC is minted on the destination'
            ]
        },
        '10a': {
            question: "What are USDC's reserves held in?",
            answers: [
                'Bitcoin, ether and other crypto',
                'Shares of Circle and its partners',
                'Cash and short-dated US Treasuries'
            ]
        },
        '10b': {
            question: 'How often is the reserve attestation published?',
            answers: [
                'Every decade',
                'Every year',
                'Every month'
            ]
        },
        '10c': {
            question: "Whose money are USDC's reserves kept apart from?",
            answers: [
                "The US Treasury's",
                "The validators'",
                "Circle's own"
            ]
        },
        '11a': {
            question: 'What happens to USDC when it is redeemed through Circle Mint?',
            answers: [
                'It is frozen until the next business day',
                'It is passed on to the next buyer in line',
                'It is burned as the dollars go out'
            ]
        },
        '11b': {
            question: 'When can USDC be minted and redeemed?',
            answers: [
                'Only during US banking hours',
                'Around the clock, every day',
                'Once a week, in batches'
            ]
        },
        '11c': {
            question: 'A business wires $1,000 into Circle Mint. How much USDC is minted?',
            answers: [
                'Exactly 1,000 USDC',
                'The market decides',
                'About 990 USDC'
            ]
        },
        '12a': {
            question: 'Which currency does EURC track?',
            answers: [
                'The euro',
                'The yen',
                'The pound'
            ]
        },
        '12b': {
            question: 'How is EURC backed?',
            answers: [
                'By a basket of European bank shares',
                'With the same reserve model as USDC',
                'By an algorithm that adjusts its supply'
            ]
        },
        '12c': {
            question: 'Why is Arc designed for several currencies at once?',
            answers: [
                'Dollar fees are too expensive for anyone outside the US',
                'A one-currency network stops at the first border',
                'Regulators require every chain to carry three currencies'
            ]
        },
        '13a': {
            question: "Where does Arc's FX engine produce its quotes?",
            answers: [
                'On-chain',
                'In a wallet',
                'Off-chain'
            ]
        },
        '13b': {
            question: 'Why do ordinary currency swaps go wrong?',
            answers: [
                'One side sends and is exposed while it waits',
                'The exchange rate is fixed for a whole year',
                'Both sides must hold the same currency first'
            ]
        },
        '13c': {
            question: 'If one leg of an Arc FX swap cannot settle, what happens to the other?',
            answers: [
                'It waits in a queue for a week',
                'It does not happen either',
                'It settles now and is refunded later'
            ]
        },
        '14a': {
            question: 'Are confidential transfers on Arc used for every transaction?',
            answers: [
                'Yes, every transfer is private',
                'No, they are opt-in',
                'Only for transfers above $10,000'
            ]
        },
        '14b': {
            question: 'In a confidential transfer, what stays visible?',
            answers: [
                'The addresses',
                'Nothing at all',
                'The amount'
            ]
        },
        '14c': {
            question: "Who can see a confidential transfer's details when required?",
            answers: [
                'Any competitor willing to pay a small fee',
                'An auditor or regulator the parties disclose to',
                'Nobody, not even the two parties involved'
            ]
        },
        '15a': {
            question: "Which of these is among Arc's founding validators?",
            answers: [
                'Binance',
                'Mastercard',
                'OpenAI'
            ]
        },
        '15b': {
            question: 'What job do validators do on Arc?',
            answers: [
                'They set the price of USDC',
                'They approve new user accounts',
                'They order the transactions'
            ]
        },
        '15c': {
            question: "What is planned for Arc's validator set later on?",
            answers: [
                'Handing it to a single company',
                'A move to open staking',
                'Replacing validators with miners'
            ]
        },
        '16a': {
            question: 'Why can a wire sent on a Friday sit idle until Monday?',
            answers: [
                'Banks settle wires only once a month',
                'Correspondent banks have cut-off times',
                'Every wire must be approved by a court'
            ]
        },
        '16b': {
            question: 'When can a stablecoin transfer settle?',
            answers: [
                'At any hour, weekends included',
                'Only during banking hours',
                'Only on business days'
            ]
        },
        '16c': {
            question: 'What does a stablecoin sender know before sending?',
            answers: [
                'The fee they will pay',
                "Tomorrow's rate",
                "The recipient's balance"
            ]
        },
        '17a': {
            question: "When did Arc's testnet start running?",
            answers: [
                'September 2026',
                'October 2025',
                'March 2024'
            ]
        },
        '17b': {
            question: "What came between Arc's testnet and its public launch?",
            answers: [
                'A token airdrop campaign',
                'A second, paid testnet',
                'A private mainnet'
            ]
        },
        '17c': {
            question: "Roughly how many builders worked on Arc's private mainnet?",
            answers: [
                'About ten',
                'Over a hundred',
                'Over a million'
            ]
        },
        '18a': {
            question: 'Can a support desk reverse a settled transfer sent to the wrong address?',
            answers: [
                'No, it cannot be pulled back',
                'Yes, within thirty days',
                'Yes, with proof of the mistake'
            ]
        },
        '18b': {
            question: 'What makes a mistake on a settled transfer permanent?',
            answers: [
                'The same finality that makes settlement fast',
                'A rule that each wallet app sets for its users',
                'A delay the network adds to every large transfer'
            ]
        },
        '18c': {
            question: 'Why do spending limits and test networks exist?',
            answers: [
                'So you can check before, because there is no after',
                'So that transfers can be made cheaper for everyone',
                'So that amounts can be hidden from the public'
            ]
        },
        '19a': {
            question: 'Which of these is still ahead for Arc?',
            answers: [
                'USDC as gas',
                'The ARC token',
                'Fast finality'
            ]
        },
        '19b': {
            question: 'Which transition is ARC meant to enable?',
            answers: [
                'From Proof-of-Stake to Proof-of-Work',
                'From Proof-of-Authority to Proof-of-Stake',
                'From a Layer-1 to a Layer-2 network'
            ]
        },
        '19c': {
            question: "What did Arc's public mainnet launch with?",
            answers: [
                'ARC gas and fully open staking from day one',
                'Proof-of-work mining and gas paid in ETH',
                'USDC gas and permissioned founding validators'
            ]
        },
        '20a': {
            question: 'According to this game, when is a payment done?',
            answers: [
                'When it is sent',
                'When it is final',
                'When the recipient sees it'
            ]
        },
        '20b': {
            question: 'What is settlement?',
            answers: [
                'The moment a payment is signed by the sender',
                'The moment the network quotes the fee',
                'The moment a payment can no longer be reversed'
            ]
        },
        '20c': {
            question: 'What lets settlement arrive at machine speed on Arc?',
            answers: [
                'Stablecoin gas and sub-second deterministic finality',
                'Larger blocks and longer waits for confirmations',
                'Card networks connected directly to the chain'
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
                    question: 'What does a stablecoin stand for?',
                    answers: [
                        'Money someone really holds',
                        'Computing power on a network',
                        'A share in a technology company'
                    ]
                },
                {
                    question: 'To get a dollar back for USDC, who do you hand it to?',
                    answers: [
                        'Any validator',
                        'An exchange',
                        'The issuer of the token'
                    ]
                },
                {
                    question: "What keeps USDC's price at a dollar?",
                    answers: [
                        'Heavy trading volume every day',
                        'A daily vote by all the holders',
                        'The promise of one-for-one redemption'
                    ]
                },
                {
                    question: 'Holding USDC gives you a claim on what?',
                    answers: [
                        'Shares',
                        'Profits',
                        'A dollar'
                    ]
                },
                {
                    question: 'How many dollars does redeeming one USDC return?',
                    answers: [
                        'Exactly one',
                        'One, minus fees',
                        'Its last price'
                    ]
                }
            ]
        },
        gas: {
            title: 'Gas, and why the currency matters',
            hint: 'Gas is the fee the network charges to process your transaction. On most chains it is paid in a volatile token, so the cost in dollars moves while you are deciding. Arc charges gas in USDC, which turns an unpredictable cost into an ordinary line item — around half a cent per transaction.',
            questions: [
                {
                    question: 'Who charges gas?',
                    answers: [
                        'The network that processes the transaction',
                        'The person receiving the payment',
                        'The store that listed the wallet app'
                    ]
                },
                {
                    question: 'On most chains, what happens to the dollar cost of gas while you decide?',
                    answers: [
                        "It moves with the token's price",
                        'It drops to zero overnight',
                        'It is locked for an hour'
                    ]
                },
                {
                    question: 'What does Arc charge gas in?',
                    answers: [
                        'ARC',
                        'ETH',
                        'USDC'
                    ]
                },
                {
                    question: 'Roughly what does gas cost per transaction on Arc?',
                    answers: [
                        'Around fifty cents',
                        'Around five cents',
                        'Around half a cent'
                    ]
                },
                {
                    question: 'What does USDC gas turn an unpredictable cost into?',
                    answers: [
                        'A tradable asset',
                        'An ordinary line item',
                        'A tax deduction'
                    ]
                }
            ]
        },
        finality: {
            title: 'When a payment is really done',
            hint: "A transaction is final when it can no longer be undone. Some chains only make that likely, which is why you wait for confirmations — recently accepted blocks can still be replaced, and that replacement is called a reorg. Arc's consensus makes finality definite in under a second, so there is nothing to wait out.",
            questions: [
                {
                    question: 'When is a transaction final?',
                    answers: [
                        'When it can no longer be undone',
                        'When the wallet displays it',
                        'When its fee has been paid'
                    ]
                },
                {
                    question: 'On chains where finality is only likely, what do users wait for?',
                    answers: [
                        'A daily report',
                        'A support ticket',
                        'More confirmations'
                    ]
                },
                {
                    question: 'What is it called when recently accepted blocks are replaced?',
                    answers: [
                        'A rollback',
                        'A fork',
                        'A reorg'
                    ]
                },
                {
                    question: 'How long does Arc take to make finality definite?',
                    answers: [
                        'About ten minutes',
                        'Under a second',
                        'About an hour'
                    ]
                },
                {
                    question: 'On Arc, how many confirmations do you have to wait out?',
                    answers: [
                        'Thirty',
                        'Six',
                        'None'
                    ]
                }
            ]
        },
        keys: {
            title: 'Wallets, keys and who can spend',
            hint: 'A wallet does not hold money — it holds the key that authorises moving it, and whoever has the key has the funds. That is why no honest support desk will ever ask for your seed phrase, and why serious custody splits a key across parties so that neither of them can sign alone.',
            questions: [
                {
                    question: 'Who controls the funds in a wallet?',
                    answers: [
                        'Whoever has the key',
                        'The bank that verified the user',
                        'Whoever built the wallet app'
                    ]
                },
                {
                    question: 'Which of these is true about a wallet?',
                    answers: [
                        'It stores a copy of the whole blockchain',
                        'It keeps the coins in a local file',
                        'It holds a key, not the money itself'
                    ]
                },
                {
                    question: 'Who will ask you for your seed phrase?',
                    answers: [
                        'No honest support desk',
                        "The network's validators",
                        "Your wallet's support team"
                    ]
                },
                {
                    question: 'In serious custody, can one party sign alone?',
                    answers: [
                        'No, the key is split so neither can',
                        'Yes, after a short waiting period',
                        'Yes, the larger party always can'
                    ]
                },
                {
                    question: 'What does the key in a wallet authorise?',
                    answers: [
                        'Viewing the balance',
                        'Moving the funds',
                        'Changing network fees'
                    ]
                }
            ]
        },
        agents: {
            title: 'Programs that pay for themselves',
            hint: 'An agent is a program with a budget. It pays as it works — a search, a data feed, a call to a model — in amounts far too small for a card, where a fixed fee of a few cents would cost more than the thing being bought. What keeps it safe is not trust but the spending limit its owner signed.',
            questions: [
                {
                    question: 'In this sense, what is an agent?',
                    answers: [
                        'A program with a budget',
                        'A human broker working for you',
                        "A bank's customer support bot"
                    ]
                },
                {
                    question: 'Which of these might an agent pay for as it works?',
                    answers: [
                        'A call to a model',
                        'A home mortgage',
                        'A monthly salary'
                    ]
                },
                {
                    question: "Why can't an agent pay for a single search by card?",
                    answers: [
                        'A fee of a few cents costs more than the search',
                        'Cards cannot be used to pay for anything online',
                        'Searches are always free for software to run'
                    ]
                },
                {
                    question: 'Who signs the spending limit an agent works within?',
                    answers: [
                        'The validators',
                        "The agent's owner",
                        'The agent'
                    ]
                },
                {
                    question: 'When does an agent pay?',
                    answers: [
                        'As it works',
                        'Only when its owner is online',
                        'Once a year, in advance'
                    ]
                }
            ]
        },
        crosschain: {
            title: 'Money that has to change chains',
            hint: 'Chains do not share a ledger, so a token cannot simply travel between them. The old answer was to lock it on one chain and issue a copy — a wrapped token — on the other, leaving a pool of locked funds that has been the target of the largest hacks in crypto. Native transfer burns on one side and mints on the other, so there is no pool to steal.',
            questions: [
                {
                    question: "Why can't a token simply travel between chains?",
                    answers: [
                        'Each chain bans foreign tokens',
                        'Chains do not share a ledger',
                        'Tokens are too large to move'
                    ]
                },
                {
                    question: 'What did the old lock-and-copy approach leave behind?',
                    answers: [
                        'A permanent fee on every transfer',
                        'A pool of locked funds',
                        'A second copy of the whole chain'
                    ]
                },
                {
                    question: 'What have pools of locked bridge funds attracted?',
                    answers: [
                        'The largest hacks in crypto',
                        'Government deposit insurance',
                        'The highest staking yields'
                    ]
                },
                {
                    question: 'What does native transfer do on the destination chain?',
                    answers: [
                        'Burns the token',
                        'Mints the token',
                        'Locks the token'
                    ]
                },
                {
                    question: 'Why is there nothing to steal in a native transfer?',
                    answers: [
                        'No pool of locked funds exists',
                        'The amounts are encrypted',
                        'Every transfer is insured'
                    ]
                }
            ]
        },
        transparency: {
            title: 'Proof without an audience',
            hint: 'Two things have to hold at once. Reserves must be provable, so an independent accounting firm publishes a monthly attestation confirming they cover every token in circulation. And a business cannot have competitors reading its invoices, so confidential transfers hide the amount from the public while leaving it disclosable to an auditor.',
            questions: [
                {
                    question: 'Who publishes the reserve attestation?',
                    answers: [
                        "Circle's own marketing team",
                        'An independent accounting firm',
                        'The validators of the Arc network'
                    ]
                },
                {
                    question: 'How often does the reserve attestation come out?',
                    answers: [
                        'Every five years',
                        'Every month',
                        'Never'
                    ]
                },
                {
                    question: 'What problem do confidential transfers solve for a business?',
                    answers: [
                        'Gas fees that are too high',
                        'Customers paying their bills late',
                        'Competitors reading its invoices'
                    ]
                },
                {
                    question: 'A confidential transfer keeps the amount hidden from whom?',
                    answers: [
                        'The auditor',
                        'The public',
                        'The sender'
                    ]
                },
                {
                    question: "Can an auditor still see a confidential transfer's details?",
                    answers: [
                        'No, the amount is gone for good',
                        'Yes, they stay disclosable to an auditor',
                        'Only if the network votes to allow it'
                    ]
                }
            ]
        },
        network: {
            title: 'What kind of network Arc is',
            hint: "Arc is a Layer-1: it settles its own blocks rather than posting them to somebody else's chain. It is EVM-compatible, so contracts and tools written for Ethereum work on it unchanged. Its public mainnet opened in September 2026, but a testnet is still where apps rehearse — the real software with money that is worth nothing, which is exactly where you want to find the bugs.",
            questions: [
                {
                    question: 'Does Arc post its blocks to another chain?',
                    answers: [
                        'Yes, it posts them to Ethereum',
                        'No, it settles its own blocks',
                        'Yes, it posts them to Bitcoin'
                    ]
                },
                {
                    question: 'Do Ethereum contracts need rewriting to run on Arc?',
                    answers: [
                        "Yes, into Arc's own language",
                        'No, they work unchanged',
                        'Yes, they must be ported to Rust'
                    ]
                },
                {
                    question: "When did Arc's public mainnet open?",
                    answers: [
                        'January 2025',
                        'It has not opened yet',
                        'September 2026'
                    ]
                },
                {
                    question: 'Where do apps rehearse before going live on Arc?',
                    answers: [
                        'On mainnet',
                        'Nowhere',
                        'On the testnet'
                    ]
                },
                {
                    question: 'What makes a testnet the right place to find bugs?',
                    answers: [
                        'It has no validators at all',
                        'It runs completely different software',
                        'The money on it is worth nothing'
                    ]
                }
            ]
        }
    }
});
