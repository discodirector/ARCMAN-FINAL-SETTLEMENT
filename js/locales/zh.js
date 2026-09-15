// Simplified Chinese language pack.
I18n.register('zh', {
    document: {
        title: 'ARCMAN: Final Settlement — 街机游戏'
    },

    language: {
        label: '语言',
        select: '选择语言'
    },

    start: {
        title: 'ARCMAN: Final Settlement',
        subtitle: '点击开始'
    },

    menu: {
        title: 'ARCMAN: Final Settlement',
        subtitle: '街机游戏',
        tournament: '锦标赛模式',
        community: '社区关卡',
        editor: '关卡编辑器',
        statistics: '统计数据',
        leaderboard: '排行榜',
        audio: '音频设置',
        faucet: 'USDC 水龙头'
    },

    hud: {
        score: '得分：{score}',
        level: '第 {current}/{total} 关',
        lives: '生命：{lives}',
        levelName: '第 {id} 关：{name}',
        menu: '菜单',
        backToEditor: '返回编辑器',
        settlement: '结算'
    },

    mode: {
        tournament: '锦标赛',
        community: '社区',
        test: '测试',
        unknown: '未知',
        title: '模式说明',
        close: '我准备好了',
        tournamentText: '你就是 <span style="color: #0ff; text-shadow: 0 0 20px #0ff; font-weight: bold;">Arc Man</span>。你的任务：完成这笔稳定币交易的最终结算。让代币沿弧线飞出，命中结算区。\n\n赚取分数，与他人一较高下，冲上排行榜，并铸造你的最终 NFT。',
        tournamentHighlight: '本模式中你有 5 条生命。答对问答题可以恢复生命——即使全部用完，最后一轮问答也能让你重返赛程。'
    },

    tutorial: {
        title: '游戏对象指南',
        cloudName: '滑点云',
        cloudText: '陷阱！它会拖慢结算、改变飞行轨迹，并给你 10 分。',
        gateName: 'Arc 之门',
        gateText: '通关得分获得 1.5 倍加成。',
        barrierName: '屏障',
        barrierText: '屏障——你撞上了合规屏障！交易需要重新路由，飞行方向随之改变，并给你 10 分。',
        settlementName: '结算区',
        settlementText: '这就是终点！进入结算区即完成交易的最终结算。',
        close: '明白了！'
    },

    summary: {
        title: '交易已完成结算！',
        levelPoints: '本关得分',
        totalPoints: '总得分',
        gates: '已收集 Arc 之门',
        clouds: '已穿过滑点云',
        barriers: '屏障碰撞次数',
        continue: '继续',
        returnToEditor: '返回编辑器'
    },

    quizUi: {
        title: '答题赢生命',
        questionPlaceholder: '题目将显示在这里',
        answer1: '答案 1',
        answer2: '答案 2',
        answer3: '答案 3',
        skip: '跳过',
        skipFullLives: '跳过（生命已满）',
        continue: '继续',
        correct: '答对了！',
        correctLife: '答对了！+1 生命',
        incorrect: '答错了。正确答案：{answer}',
        unavailable: '测验服务器没有响应，本题不计分。请继续下一关。'
    },

    rescue: {
        title: '生命已耗尽',
        lead: '三道题，隔在你和刚才那场赛程之间。先读完下面这段——答案全在里面。',
        readIt: '我读完了——出题吧',
        progress: '第 {current} 题，共 {total} 题   ·   已答对 {correct} 题',
        correct: '答对了',
        wrong: '答错了——正确答案是：{answer}',
        next: '下一题',
        seeResult: '看看结果如何',
        verdictTitle: '答对 {correct} 题，共 {total} 题',
        backInOne: '你回来了——带着 1 条生命。这是本次赛程唯一一次救援。',
        backIn: '你回来了——带着 {lives} 条生命。这是本次赛程唯一一次救援。',
        notEnough: '还不够。赛程将从第一关重新开始。',
        rescued: '获救',
        runOver: '赛程结束',
        backToLevel: '回到关卡',
        startOver: '重新开始',
        continue: '继续',
        unavailable: '救援测验无法连接服务器，因此无法评分。本轮将从第一关重新开始。'
    },

    infoUi: {
        title: '你知道吗？',
        continue: '继续'
    },

    completion: {
        title: '🎉 游戏通关！🎉',
        finalScore: '最终得分',
        levelsCompleted: '已通过关卡',
        time: '通关用时',
        bestLevelScore: '单关最高分',
        averageLevelScore: '单关平均分',
        gameMode: '游戏模式',
        finalizeOnchain: '上链结算',
        mintNft: '铸造 NFT',
        returnToMenu: '返回主菜单'
    },

    community: {
        title: '🎉 恭喜！🎉',
        text: '你已通关全部社区创作的关卡。稍后再来挑战新关卡吧，超级英雄！',
        returnToMenu: '返回主菜单',
        none: '目前还没有社区关卡，稍后再来看看！'
    },

    stats: {
        title: '玩家统计',
        overview: '总览',
        gamesPlayed: '游戏局数',
        gamesCompleted: '通关局数',
        completionRate: '通关率',
        bestScores: '最佳成绩',
        bestFinalScore: '最高最终得分',
        bestLevelScore: '单关最高分',
        averageFinalScore: '平均最终得分',
        totalLifetimePoints: '累计总分',
        performance: '表现',
        totalLevels: '累计通过关卡',
        avgLevelsPerGame: '每局平均关卡数',
        fastestTime: '最快通关',
        averageTime: '平均用时',
        achievements: '成就',
        totalGates: '累计穿过之门',
        totalClouds: '累计穿过滑点云',
        totalBarriers: '累计撞击屏障',
        perfectGames: '完美通关次数',
        modeStats: '模式统计',
        tournamentPlayed: '锦标赛：已游玩',
        tournamentCompleted: '锦标赛：已通关',
        lastGame: '上一局',
        date: '日期',
        mode: '模式',
        score: '得分',
        never: '从未',
        notAvailable: '暂无',
        reset: '重置统计',
        close: '关闭',
        resetConfirm: '确定要重置全部统计数据吗？此操作无法撤销。'
    },

    leaderboard: {
        title: '🏆 排行榜 🏆',
        top10: '前 10 名',
        top25: '前 25 名',
        top50: '前 50 名',
        top100: '前 100 名',
        yourRank: '你的排名：',
        points: '{score} 分',
        loading: '正在加载排行榜……',
        empty: '排行榜上还没有玩家，来当第一个吧！',
        loadFailed: '加载排行榜失败：{error}',
        refresh: '刷新',
        close: '关闭'
    },

    onchain: {
        title: '将分数上链',
        finalScore: '最终得分',
        levelsCompleted: '已通过关卡',
        gameMode: '游戏模式',
        connectPrompt: '连接钱包，将你的分数记录到链上',
        supportedWallets: '支持的钱包：MetaMask、Rabby',
        noWalletTitle: '还没有钱包？',
        noWalletText: '请安装 <a href="https://metamask.io/download/" target="_blank" style="color: #0ff; text-decoration: underline;">MetaMask</a> 或 <a href="https://rabby.io/" target="_blank" style="color: #0ff; text-decoration: underline;">Rabby</a> 浏览器扩展，然后刷新本页。',
        connectWallet: '连接钱包',
        connecting: '连接中……',
        connected: '已连接：',
        disconnect: '断开连接',
        preparing: '正在准备交易……',
        estimatedGas: '预估 Gas：',
        submit: '将分数上链',
        processing: '处理中……',
        gettingSignature: '正在获取服务器签名……',
        submitting: '正在提交交易……',
        successTitle: '✅ 分数已上链！',
        successText: '你的分数已成功记录到链上。',
        viewTx: '在区块浏览器中查看交易',
        errorTitle: '❌ 出错了',
        close: '关闭',
        failed: '分数上链失败'
    },

    nft: {
        title: '🎨 铸造通关 NFT',
        preview: 'NFT 预览',
        previewName: 'ARCMAN: Final Settlement — 通关证书',
        connectPrompt: '连接钱包以铸造你的通关 NFT',
        supportedWallets: '支持的钱包：MetaMask、Rabby',
        connectWallet: '连接钱包',
        connected: '已连接：',
        alreadyHave: '✓ 你已经拥有一枚通关 NFT！',
        tokenId: '代币 ID：',
        viewOnExplorer: '在区块浏览器中查看',
        disconnect: '断开连接',
        readyToMint: '准备铸造',
        estimatedGas: '预估 Gas：',
        mint: '铸造 NFT',
        minting: '铸造中……',
        preparing: '正在准备交易……',
        estimatingGas: '正在估算 Gas……',
        mintingNft: '正在铸造 NFT……',
        mintedSuccess: 'NFT 铸造成功！',
        alreadyMinted: '已铸造',
        successTitle: '🎉 NFT 铸造成功！🎉',
        successText: '你的通关证书已完成铸造！',
        transaction: '交易：',
        viewTx: '查看交易',
        errorTitle: '❌ 出错了',
        close: '关闭',
        connectFailed: '连接钱包失败：{error}',
        mintFailed: 'NFT 铸造失败'
    },

    audio: {
        title: '音频设置',
        musicVolume: '音乐音量',
        soundVolume: '音效音量',
        close: '关闭'
    },

    wallet: {
        connect: '连接钱包',
        connecting: '连接中……',
        useHttpServer: '⚠️ 请使用 HTTP 服务器',
        notInstalled: '未安装 {wallet}。请先安装 MetaMask 或 Rabby 钱包再继续。',
        noProvider: '未找到钱包插件。请安装 MetaMask 或 Rabby 钱包。',
        noAccounts: '未找到账户。请先解锁钱包。',
        rejected: '连接被拒绝。请在钱包中批准连接请求。',
        pending: '已有一个连接请求待处理，请查看你的钱包。',
        connectFailed: '连接钱包失败，请重试。',
        notConnected: '钱包未连接',
        notDetected: '未检测到钱包。',
        providerInvalid: 'window.ethereum 存在，但可能不是有效的钱包插件。',
        installSteps: '请：\n1. 确认已安装并启用 MetaMask 或 Rabby\n2. 刷新页面\n3. 查看浏览器控制台了解详情',
        switchNetwork: '请在钱包中批准切换到 {network} 网络。',
        switchFailed: '切换到 {network} 失败。请在钱包中手动切换。',
        contractMissing: '合约未初始化。请在配置中设置 CONTRACT_ADDRESS。',
        txWouldFail: '该交易将会失败，请检查你的分数数据。',
        nftExists: '你已经拥有 {mode} 模式的通关 NFT',
        nftInitFailed: 'NFT 合约初始化失败'
    },

    errors: {
        connectWalletFirst: '请先连接钱包',
        noCompletionData: '没有可用的通关数据',
        noAccount: '未连接任何账户',
        noSession: '未找到游戏会话。如果你在未连接钱包的情况下开始游戏，就会出现这种情况。\n\n请连接钱包，然后重新通关所有关卡以记录你的分数。',
        requestTimeout: '请求超时。服务器可能很慢或不可用。',
        signatureFailed: '获取服务器签名失败',
        serverError: '服务器错误：{status} {statusText}',
        leaderboardUnavailable: '排行榜模块不可用'
    },
    editor: {
        title: '关卡编辑器',
        close: '关闭编辑器',
        new: '新建关卡',
        save: '保存关卡',
        delete: '删除关卡',
        export: '导出',
        submit: '提交关卡',
        levelInfo: '关卡信息',
        levelName: '关卡名称：',
        newLevelName: '新关卡',
        levelId: '关卡 ID：',
        idNew: '新建',
        tools: '工具',
        toolSelect: '选择',
        toolGate: 'Arc 之门',
        toolCloud: '滑点云',
        toolLifeRestore: '生命恢复',
        toolBarrierLarge: '屏障（大）',
        toolBarrierMedium: '屏障（中）',
        toolBarrierSmall: '屏障（小）',
        toolSettlement: '结算区',
        toolPlayer: '玩家起点',
        toolDelete: '删除',
        rotate: '旋转所选对象（R）',
        preview: '关卡预览',
        instructions: '点击放置对象。用“选择”工具选中对象后，按 R 或点击“旋转”按 15° 步进旋转。',
        objects: '对象',
        gates: 'Arc 之门：',
        clouds: '滑点云：',
        lifeRestores: '生命恢复：',
        barriers: '屏障：',
        settlementZone: '结算区：',
        levelList: '关卡列表',
        loadingLevels: '正在加载关卡……',
        load: '载入关卡',
        launch: '试玩关卡',
        exportTitle: '导出 DEFAULT_LEVELS',
        exportHint: '复制下面的代码，替换 levels.js 中的 DEFAULT_LEVELS 数组：',
        copy: '复制到剪贴板',
        copied: '代码已复制到剪贴板！',
        copyFailed: '复制失败，请手动选中并复制。',
        needSettlementSave: '保存前请先添加结算区！',
        saved: '关卡已保存！',
        cannotDelete: '无法删除：这是新关卡或默认关卡。',
        exportModalMissing: '未找到导出窗口，代码已输出到控制台。',
        exportUnavailable: '导出功能不可用。请确认 levels.js 已加载。',
        nothingToSubmit: '没有可提交的关卡！',
        needSettlementSubmit: '提交前请先添加结算区！',
        needObjects: '提交前请至少添加一个对象（之门、滑点云、屏障或生命恢复）！',
        submitting: '正在提交关卡……',
        submitted: '关卡提交成功！开发者会进行审核。',
        submitFailed: '关卡提交失败，请稍后再试。',
        nothingToLaunch: '没有可试玩的关卡！',
        deleteConfirm: '要删除这个关卡吗？',
        exportModalMissingWithCode: '未找到导出窗口。代码如下：\n\n',
        needSettlementLaunch: '试玩前请先添加结算区！',
        managerMissing: '关卡管理器尚未初始化！',
        launchFailed: '加载关卡以试玩失败！',
        savedAndLaunching: '关卡已保存，正在启动……'
    },

    levels: {
        1: '首次发射',
        2: '探路者',
        3: '划出一道弧线',
        4: '穿门而过',
        5: '路由',
        6: '两道屏障',
        7: '看着简单',
        8: '风暴预警',
        9: '重重考验',
        10: '足额储备',
        11: '一进一出',
        12: '不只是美元',
        13: '两腿同时落地',
        14: '密封信封',
        15: '谁来签出区块',
        16: '代理行',
        17: '机构流量',
        18: '不可撤回',
        19: '通往主网之路',
        20: '最终结算'
    },

    info: {
        1: 'Arc 是 USDC 发行方 Circle 推出的开放式一层区块链。它兼容 EVM，专为稳定币金融而设计。Arc 公共主网已于 2026 年 9 月 16 日上线；这款游戏的分数和证书目前仍在 Arc 测试网上结算，游玩不花一分钱。',
        2: '在 Arc 上，Gas 用 USDC 支付，而不是波动的代币。手续费直接以美元计价，平均每笔约 0.005 美元，任何人都能像普通开支一样把它列入预算。',
        3: 'Arc 将 Malachite（Tendermint BFT 的 Rust 实现）与 Reth 执行层结合。最终性是确定性的且在一秒以内：区块一经提交即为最终，没有重组，也不必等待确认。Arc 公共主网正是带着这一特性上线的。',
        4: 'ARC 是 Arc 计划中的协调代币，而不是 Gas 代币——Gas 仍以 USDC 支付。按照设计，协议手续费会被转换为 ARC，分配给验证者和质押者，其中一部分会被销毁。主网上线时并没有它：ARC 尚未发行，Circle 称任何代币计划都仍处于探索阶段。',
        5: 'Arc 最大的赌注是代理经济——AI 智能体自行为算力、数据和服务付费。这需要小于一美分的支付，用 USDC 通过 x402 这类开放标准完成结算。',
        6: 'x402 正是这样一个开放标准。它让 HTTP 状态码 402「Payment Required」重获新生：服务器返回的不是错误，而是一个价格。客户端用 USDC 付款后重发请求，由 facilitator 在链上验证付款。无需账户，无需银行卡，全程无需人工介入。',
        7: '银行卡通道无法为一次 API 调用定价。它们按笔收取固定费用——大约几美分再加上一定比例——所以价值一美分的东西，收款成本比收益还高。稳定币通道把一笔转账的成本压到一美分的零头，这才让按次付费成为可能。',
        8: '会付款的程序需要属于自己的账户。Circle 的可编程钱包从不把私钥交给智能体：私钥通过 MPC 在多方之间拆分，智能体只能在你签署的额度内花钱。它可以从账户里花钱，却永远拿不走账户本身。',
        9: 'USDC 跨链时并不是以封装副本的形式移动。CCTP 在源链上销毁它，并在目标链上铸造原生 USDC，因此不存在需要信任的跨链桥代币。Circle Gateway 在此之上提供统一余额，让智能体看到的是一个余额，而不是每条链一个钱包。',
        10: '每一枚 USDC 都有一美元储备支撑——现金和短期美国国债，与 Circle 自有资金分开存放。四大会计师事务所之一每月发布鉴证报告，确认储备覆盖了全部流通代币。这是最枯燥的部分，也正是让其余一切得以成立的部分。',
        11: 'USDC 不是挖出来的，也不是炒出来的。企业通过 Circle Mint 电汇美元进来，就会铸造出等额 USDC；赎回时代币被销毁，美元原路退出。一进一出，全天候运转——没有做市商来决定一美元值多少钱。',
        12: '稳定币不一定非得是美元。Circle 还发行了 EURC，一种采用相同储备模式的欧元代币；而 Arc 从设计之初就支持多种货币——因为只会说一种货币的支付网络，会止步于第一道国境。',
        13: '货币兑换正是支付通常出问题的地方：一方先付出，然后在风险敞口中等待另一方。Arc 的外汇引擎在链下报价，并在同一份合约内结算兑换的两条腿，要么双方转账都发生，要么都不发生。绝不会有一条腿悬在半空。',
        14: '公开账本对企业是个麻烦——竞争对手能读到每一张发票。Arc 的答案是可选的机密转账：金额被加密，地址依然可见，需要时各方可以向审计师或监管机构披露细节。对同行保密，但不对法律保密。',
        15: '总得有人来给交易排序。Arc 主网上线时采用一组许可制的创始验证者——其中包括 Visa、Mastercard、BlackRock、DTCC 和渣打银行。这是一次有意的取舍：起步阶段验证者更少，换来的是你可以追责的具体名字，向开放质押的过渡则计划在之后进行。',
        16: '一笔跨境电汇要在多家代理行之间辗转，每家都有自己的截止时间，所以资金可能因为一个周末就闲置好几天。稳定币通道不看办公时间：同样一笔转账在几秒内完成结算，任何时刻都可以，而且手续费在发送前就已确定。',
        17: 'Arc 并非仓促上线。它的测试网从 2025 年 10 月开始运行，随后是有一百多家机构和生态开发者参与的私有主网，直到 2026 年 9 月才公开上线。支付网络本就该这样测试：用别人真实的业务流程，在任何人真实的资金进入之前。',
        18: '已完成结算的转账没有撤单一说。转错地址，任何客服都追不回来——让结算变快的那种最终性，也让错误变得不可挽回。这正是消费限额、授权额度和测试网存在的理由：你只能事前检查，因为没有事后。',
        19: 'Arc 公共主网已于 2026 年 9 月 16 日上线：Gas 以 USDC 支付，最终性在一秒以内，并由一组许可制的创始验证者运行。仍在前方的是 ARC 代币，以及它旨在推动的从权威证明（PoA）到权益证明（PoS）的过渡。你在网络建设期间走完了 Arc 测试网上的这段路——而它的终点，正是主网的起点。',
        20: '整款游戏只讲一件事：支付不是在发出时完成的，而是在成为最终态时完成的。结算，就是它再也无法被撤销的那一刻。稳定币 Gas 加上亚秒级的确定性最终性，让这一刻能以机器的速度到来——而这正是你一直在瞄准的东西。'
    },

    quiz: {
        1: {
            question: 'Arc 是什么？',
            answers: [
                '在以太坊上结算的二层 Rollup',
                'Circle 为稳定币金融打造的、兼容 EVM 的一层区块链',
                '一个背后没有区块链的封闭支付 API'
            ]
        },
        2: {
            question: '在 Arc 上用什么资产支付 Gas？',
            answers: ['ETH', 'USDC', 'ARC']
        },
        3: {
            question: 'Arc 的最终性有多快？',
            answers: [
                '大约 10 分钟，和比特币差不多',
                '几分钟，等确认数积累到足够为止',
                '亚秒级且确定性的——已最终确认的区块永不重组'
            ]
        },
        4: {
            question: '按照设计，ARC 与在 Arc 上支付的手续费是什么关系？',
            answers: [
                '手续费被转换为 ARC，分配给验证者和质押者，其中一部分被销毁',
                '主网上线时，ARC 取代 USDC 成为 Gas 代币',
                '手续费直接付给 Circle，作为公司收入'
            ]
        },
        5: {
            question: 'Arc 押注最重的是哪一类场景？',
            answers: [
                '游戏与元宇宙世界',
                '代理经济——AI 智能体之间互相付款与结算',
                '完全匿名的点对点转账'
            ]
        },
        6: {
            question: '在 x402 中，服务器返回 HTTP 402 意味着什么？',
            answers: [
                '请求失败，不应重试',
                '这是价格——用 USDC 付款后再发一次请求',
                '客户端必须先注册账户并绑定银行卡'
            ]
        },
        7: {
            question: '为什么银行卡通道无法为一次 API 调用收费？',
            answers: [
                '卡组织网络在夜间停止服务',
                '每笔固定手续费比这次调用本身还贵',
                '银行卡只能处理来自人的付款，不能处理来自软件的付款'
            ]
        },
        8: {
            question: '当你给智能体一个 Circle 钱包时，它得到了什么？',
            answers: [
                '私钥，因此可以转走账户里的一切',
                '在你签署的额度内花钱的权利——但永远拿不到私钥本身',
                '一段助记词，它会以明文替你保存'
            ]
        },
        9: {
            question: 'USDC 通过 CCTP 如何跨链移动？',
            answers: [
                '被锁在跨链桥里，另一端发行一份封装副本',
                '在源链上销毁，在目标链上原生铸造',
                '卖成目标链的原生代币，再买回来'
            ]
        },
        10: {
            question: '每一枚流通中的 USDC 背后是什么？',
            answers: [
                '一美元储备——现金与短期美国国债，每月出具鉴证报告',
                'Circle 持有的一篮子其他加密货币',
                '一套通过铸造和销毁来维持价格的算法'
            ]
        },
        11: {
            question: '新的 USDC 是怎么产生的？',
            answers: [
                '由验证者作为区块奖励挖出来',
                '有人向 Circle 支付美元，就铸造等额代币；赎回时代币被销毁',
                '交易者在交易所买入，直到供应量增加'
            ]
        },
        12: {
            question: 'Circle 除了美元稳定币还发行别的吗？',
            answers: [
                '没有——只有 USDC',
                '有——EURC，一种采用相同储备模式的欧元稳定币',
                '有，但只有锚定黄金的代币'
            ]
        },
        13: {
            question: 'Arc 的外汇引擎在同一份合约内结算什么？',
            answers: [
                '货币兑换的两条腿，要么都成交，要么都不成交',
                '现在结算一条腿，另一条腿留到当天收盘',
                '交易手续费，而货币本身走电汇'
            ]
        },
        14: {
            question: 'Arc 的机密转账隐藏了什么？',
            answers: [
                '一切——网络根本不保留任何记录',
                '金额；地址仍然可见，细节可按需披露',
                '发送方身份，而金额是公开的'
            ]
        },
        15: {
            question: '如今是谁在 Arc 上验证区块？',
            answers: [
                '从第一天起，任何质押足够代币的人',
                '一组许可制的知名机构，并随时间逐步开放',
                '只有 Circle，且不打算引入其他验证者'
            ]
        },
        16: {
            question: '为什么一笔跨境银行转账要花上几天？',
            answers: [
                '钱要在国家之间实际运送',
                '它要经过多家代理行，各有各的截止时间和周末',
                '监管机构手工审批每一笔付款'
            ]
        },
        17: {
            question: '在公共主网开放之前，都是谁在使用 Arc？',
            answers: [
                '没有人——网络在上线当天才第一次启动',
                '一百多家机构和开发者，先在测试网，后在私有主网',
                '只有像这款游戏里的散户玩家'
            ]
        },
        18: {
            question: '你把 USDC 发到了错误的地址。可以怎么办？',
            answers: [
                '无能为力——已结算的转账没有撤单机制',
                '提交客服工单后 Circle 会撤销这笔转账',
                '验证者可以应要求回滚该区块'
            ]
        },
        19: {
            question: 'Arc 现在处于什么阶段？',
            answers: [
                '自 2026 年 9 月起为公共主网，ARC 代币仍在前方',
                '测试网，尚未公布主网日期',
                '主网已运行，以 ARC 作为 Gas 代币'
            ]
        },
        20: {
            question: '一笔支付究竟在什么时候算完成结算？',
            answers: [
                '在发送方点下发送的那一刻',
                '在交易出现在内存池里的时候',
                '在它成为最终态、再也无法撤销的时候'
            ]
        }
    },

    rescueTopics: {
        stablecoin: {
            title: '稳定币究竟是什么',
            hint: '稳定币是一种代表着有人真实持有的资金的代币。USDC 可以一比一赎回：把代币交还给发行方，你就能拿回一美元。让价格稳在一美元的正是这个承诺，而不是交易行为——也正因如此，持有 USDC 是对一美元的索取权，而不是发行公司的股份。',
            questions: [
                {
                    question: 'USDC 为什么能守住价格？',
                    answers: [
                        '交易者们约定把它维持在那个价位',
                        '每一枚代币都能向发行方赎回一美元',
                        '有算法通过买卖来捍卫锚定'
                    ]
                },
                {
                    question: '持有 USDC 算是对 Circle 的投资吗？',
                    answers: [
                        '不算——它是对一美元的索取权，不是公司股份',
                        '算，持有者能分到 Circle 的一部分利润',
                        '算，它的作用类似公司债'
                    ]
                },
                {
                    question: '一比一赎回是什么意思？',
                    answers: [
                        '一枚 USDC 总能买到任意其他代币中的一枚',
                        '只有在销毁其他代币时才会铸造新代币',
                        '交还一枚代币，收到一美元'
                    ]
                }
            ]
        },
        gas: {
            title: 'Gas，以及计价货币为何重要',
            hint: 'Gas 是网络处理你这笔交易所收取的费用。在多数链上它以波动的代币支付，所以在你还在犹豫的时候，折算成美元的成本就已经变了。Arc 用 USDC 收取 Gas，把一项无法预测的成本变成了普通的支出条目——每笔大约半美分。',
            questions: [
                {
                    question: 'Gas 是什么？',
                    answers: [
                        '交易确认后会退还的押金',
                        '网络为处理交易而收取的费用',
                        '钱包服务商收取的一项手续费'
                    ]
                },
                {
                    question: '企业为什么在意 Gas 是用稳定币支付的？',
                    answers: [
                        '成本以美元计始终可预测',
                        '交易处理得更快',
                        '省去了持有钱包的必要'
                    ]
                },
                {
                    question: '在 Gas 代币价格波动的链上，等待期间你的手续费会怎样？',
                    answers: [
                        '不会怎样——手续费以美元固定',
                        '若价格变动会退还给你',
                        '它随代币价格一起变动'
                    ]
                }
            ]
        },
        finality: {
            title: '一笔支付何时才算真的完成',
            hint: '当一笔交易再也无法被撤销时，它才算最终确定。有些链只能让这件事变得「很可能」，所以你要等确认数——刚被接受的区块仍可能被替换，这种替换叫作重组。Arc 的共识让最终性在一秒之内变成确定的事实，因此没有什么可等的。',
            questions: [
                {
                    question: '最终性意味着什么？',
                    answers: [
                        '交易进入了内存池',
                        '交易再也无法被撤销',
                        '手续费已全额支付'
                    ]
                },
                {
                    question: '为什么在有些链上人们要等确认？',
                    answers: [
                        '最近的区块仍有可能被替换',
                        '网络传输这笔支付很慢',
                        '钱包需要时间同步'
                    ]
                },
                {
                    question: '什么是重组（reorg）？',
                    answers: [
                        '钱包重新排列它持有的代币',
                        '改写一份已部署的智能合约',
                        '刚被接受的区块被另一条链替换掉'
                    ]
                }
            ]
        },
        keys: {
            title: '钱包、私钥，以及谁有权花钱',
            hint: '钱包并不保管钱——它保管的是授权动用这笔钱的私钥，谁拿到私钥，谁就拥有这笔资金。正因如此，任何正经的客服都绝不会索要你的助记词；也正因如此，严肃的托管方案会把私钥在多方之间拆分，让任何一方都无法独自签名。',
            questions: [
                {
                    question: '钱包实际存放的是什么？',
                    answers: [
                        '代币本身',
                        '一份属于你的区块链副本',
                        '授权花费资金的私钥'
                    ]
                },
                {
                    question: '有人自称客服，向你索要助记词。这是怎么回事？',
                    answers: [
                        '这是要盗走你资金的企图',
                        '这是常规的身份核验',
                        '这是标准的钱包迁移流程'
                    ]
                },
                {
                    question: '把签名私钥在两方之间拆分，意义何在？',
                    answers: [
                        '发送交易会更便宜',
                        '任何一方都无法独自转移资金',
                        '余额相当于被投保了两次'
                    ]
                }
            ]
        },
        agents: {
            title: '为自己付费的程序',
            hint: '智能体是一个带预算的程序。它边工作边付款——一次搜索、一份数据源、一次模型调用——金额小到银行卡根本无法承载，因为几美分的固定手续费会比所买的东西还贵。让这一切安全的不是信任，而是它的所有者签署的消费限额。',
            questions: [
                {
                    question: '智能体的付款与刷卡付款有何不同？',
                    answers: [
                        '金额极小，而且收银台前没有人',
                        '它们随时可以被撤销',
                        '必须到银行网点获得批准'
                    ]
                },
                {
                    question: '是什么阻止智能体把它能碰到的钱全花光？',
                    answers: [
                        '没有什么——只能选择信任智能体',
                        '银行每天打来的电话',
                        '所有者批准的消费限额'
                    ]
                },
                {
                    question: '为什么机器支付需要低到一美分零头的手续费？',
                    answers: [
                        '网络对程序的收费高于对人的收费',
                        '手续费比支付金额还大，这笔交易就失去了意义',
                        '机器发送的交易远多于人'
                    ]
                }
            ]
        },
        crosschain: {
            title: '需要更换区块链的资金',
            hint: '各条链并不共享一个账本，所以代币无法简单地在它们之间移动。过去的做法是在一条链上把它锁住，再在另一条链上发行一份副本——封装代币——由此留下一池被锁定的资金，而这正是加密史上最大规模攻击的目标。原生转移在一端销毁、在另一端铸造，也就没有可偷的资金池。',
            questions: [
                {
                    question: '什么是封装代币？',
                    answers: [
                        '在一条链上被锁定、并由另一条链上的副本来代表的代币',
                        '转账时已把手续费包含在内的代币',
                        '金额对公众隐藏的代币'
                    ]
                },
                {
                    question: '为什么「销毁并铸造」比「锁定并封装」的跨链桥更安全？',
                    answers: [
                        '它编写起来更快',
                        '验证者会逐笔手工审批转账',
                        '不存在可供盗取的锁定资金池'
                    ]
                },
                {
                    question: '你把 USDC 发到了另一条链上的地址。最可能的结果是什么？',
                    answers: [
                        '网络会把它转送到正确的链上',
                        '它可能就此永远消失',
                        '过几个区块它会自动退回'
                    ]
                }
            ]
        },
        transparency: {
            title: '不必围观的证明',
            hint: '有两件事必须同时成立。储备必须可被证明，因此独立会计师事务所每月发布鉴证报告，确认储备覆盖了全部流通代币。而企业不能让竞争对手读到自己的发票，因此机密转账把金额对公众隐藏，同时仍可向审计师披露。',
            questions: [
                {
                    question: '每月的鉴证报告确认了什么？',
                    answers: [
                        '储备覆盖了流通中的代币',
                        '代币价格的走向',
                        '最大的持有者是谁'
                    ]
                },
                {
                    question: '鉴证报告由谁出具？',
                    answers: [
                        '发行方自己的财务团队',
                        '独立的会计师事务所',
                        '区块链自动生成'
                    ]
                },
                {
                    question: 'Arc 上的机密转账隐藏了什么？',
                    answers: [
                        '一切——完全不留任何记录',
                        '只有发送方的身份',
                        '金额，而它仍可向审计师披露'
                    ]
                }
            ]
        },
        network: {
            title: 'Arc 究竟是什么样的网络',
            hint: 'Arc 是一层网络：它自己结算自己的区块，而不是把区块发布到别人的链上。它兼容 EVM，因此为以太坊编写的合约和工具无需改动即可运行。它的公共主网已于 2026 年 9 月上线，但应用仍在测试网上彩排——真实的软件配上一文不值的资金，这里恰恰是找出漏洞的地方。',
            questions: [
                {
                    question: '兼容 EVM 在实践中意味着什么？',
                    answers: [
                        '它与以太坊共用手续费',
                        '为以太坊构建的合约和工具能在它上面运行',
                        '它的区块由以太坊验证'
                    ]
                },
                {
                    question: '测试网是用来做什么的？',
                    answers: [
                        '用一文不值的资金运行真实的软件',
                        '更便宜地完成真实交易',
                        '安全地试探钱包密码'
                    ]
                },
                {
                    question: 'Arc 是一层网络。这意味着什么？',
                    answers: [
                        '它是某个二层网络的首个版本',
                        '它只支持一种代币',
                        '它自己结算自己的区块，而不是把区块发布到另一条链上'
                    ]
                }
            ]
        }
    }
});
