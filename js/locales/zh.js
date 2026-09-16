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
        tournamentHighlight: '本模式中你有 10 条生命。答对问答题可以恢复生命——即使全部用完，最后一轮问答也能让你重返赛程。'
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
        returnToMenu: '返回主菜单'
    },

    claim: {
        headline: '奖励：{amount} USDC',
        remaining: '奖池中还剩 {count} 份奖励',

        stepWallet: '验证钱包',
        walletButton: '连接并签名',
        stepX: '验证 X',
        xButton: '用 X 登录',
        stepSend: '领取奖励',
        sendButton: '领取',

        walletWaiting: '请查看钱包：签名不收费，也不会转移任何资产。',
        walletRejected: '你拒绝了签名。没有签名，我们无法确认这是你的钱包。',
        walletFailed: '无法验证该钱包，请重试。',

        xWaiting: '正在等待 X 登录……',
        xVerified: 'X 账号已验证。',
        xVerifiedAs: '已验证为 @{handle}。',
        xCancelled: '登录已取消。',
        xNotPremium: '奖励仅发放给 X Premium 账号。',
        xTooNew: '该 X 账号注册不满六个月。',
        xAgeUnknown: '无法确认该 X 账号的注册时间。',
        xClaimed: '该 X 账号已领取过奖励。',
        xFailed: '无法连接到 X，请重试。',
        popupBlocked: '浏览器拦截了登录窗口，请允许弹出窗口后重试。',

        sending: '正在发送奖励，需要几秒钟。',
        paid: '{amount} USDC 正在发往你的钱包，无需支付 gas 费，已由我们代付。',
        sendFailed: '奖励未能发送，未产生任何花费，请重试。',
        viewTransaction: '查看交易',

        walletClaimed: '该钱包已领取过奖励。',
        alreadyClaimed: '该账号已领取过奖励。',
        ipLimit: '此网络下领取的奖励已过多。',
        poolEmpty: '奖池目前已用完，不过你依然完成了课程。',
        paused: '奖励目前已暂停发放。',
        needWallet: '请先验证钱包。',
        needX: '请先验证 X 账号。',
        expired: '本次领取已过期，请重新完成一轮课程后再领取。',
        quizNeeded: '领取奖励需要在 20 道题中答对 {needed} 道，你答对了 {correct} 道。再玩一遍，慢慢答题。',
        failed: '奖励领取失败。'
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
        provingWallet: '请查看钱包：签名只用于证明钱包属于你，不会转移任何资产。',
        gettingSignature: '正在获取服务器签名……',
        submitting: '正在提交交易……',
        successTitle: '✅ 分数已上链！',
        successText: '你的分数已成功记录到链上。',
        viewTx: '在区块浏览器中查看交易',
        errorTitle: '❌ 出错了',
        close: '关闭',
        failed: '分数上链失败'
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
        txWouldFail: '该交易将会失败，请检查你的分数数据。'
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
        '1a': {
            question: 'Arc 背后是哪家公司？',
            answers: [
                'Tether，USDT 的发行方',
                'Coinbase，Base 的运营方',
                'Circle，USDC 的发行方'
            ]
        },
        '1b': {
            question: 'Arc 是专为什么而设计的？',
            answers: [
                'NFT 交易市场',
                '匿名交易',
                '稳定币金融'
            ]
        },
        '1c': {
            question: '这款游戏的分数和证书在哪里结算？',
            answers: [
                '以太坊主网上，经由跨链桥合约',
                'Arc 测试网上，游玩不花一分钱',
                'Arc 主网上，用真实 USDC 支付'
            ]
        },
        '2a': {
            question: '在 Arc 上，一笔交易平均大约花多少钱？',
            answers: [
                '约 5 美元',
                '约 0.005 美元',
                '约 0.5 美元'
            ]
        },
        '2b': {
            question: '用 USDC 支付 Gas，能让人们做到什么？',
            answers: [
                '从所付的 Gas 中赚取利息',
                '把手续费当普通开支做预算',
                '小额转账可免手续费'
            ]
        },
        '2c': {
            question: 'Arc 用 USDC 收取 Gas，避免了什么？',
            answers: [
                '必须用钱包才能发起付款',
                '用价格波动的代币付手续费',
                '把交易公布在公开账本上'
            ]
        },
        '3a': {
            question: 'Malachite 是什么？',
            answers: [
                'Tendermint BFT 的 Rust 实现',
                'Arc 的工作量证明挖矿算法',
                'Circle 为 Arc 运营的区块浏览器'
            ]
        },
        '3b': {
            question: 'Arc 采用哪种执行层？',
            answers: [
                'Solana 运行时',
                'Geth',
                'Reth'
            ]
        },
        '3c': {
            question: '在 Arc 上，已提交的区块何时算最终确定？',
            answers: [
                '立即，无需等待任何确认',
                '等一小时的挑战期结束之后',
                '等六个确认之后，和比特币一样'
            ]
        },
        '4a': {
            question: '在 Arc 上支付 Gas 用的是 ARC 代币吗？',
            answers: [
                '只在大额付款时 Gas 才用 ARC',
                '是，自主网上线起 Gas 就用 ARC',
                '不是，Gas 仍以 USDC 支付'
            ]
        },
        '4b': {
            question: 'Arc 主网上线时发行了 ARC 代币吗？',
            answers: [
                '发行了，ARC 当天就上线了',
                '发行了，但 ARC 仅限验证者使用',
                '没有，ARC 尚未发行'
            ]
        },
        '4c': {
            question: '按照 ARC 的设计，转换为 ARC 的手续费流向哪里？',
            answers: [
                '验证者和质押者，其中一部分被销毁',
                'Circle 的股东，作为季度分红发放',
                '退回给发起这些交易的用户'
            ]
        },
        '5a': {
            question: '「代理经济」指的是什么？',
            answers: [
                '银行用会计软件取代后台办公人员',
                '人们雇用人类代理替自己交易加密货币',
                'AI 智能体自行购买算力、数据和服务'
            ]
        },
        '5b': {
            question: '智能体的支付需要小到什么程度？',
            answers: [
                '至少一美元',
                '小于一美分',
                '十美元或更多'
            ]
        },
        '5c': {
            question: '哪个开放标准被点名用于结算智能体支付？',
            answers: [
                'x402',
                'SWIFT MT103',
                'ERC-721'
            ]
        },
        '6a': {
            question: 'x402 让哪个 HTTP 状态码重获新生？',
            answers: [
                '404 Not Found',
                '402 Payment Required',
                '500 Internal Server Error'
            ]
        },
        '6b': {
            question: '在 x402 交互中，由谁在链上验证付款？',
            answers: [
                '服务器（server）',
                '客户端（client）',
                'facilitator（促成方）'
            ]
        },
        '6c': {
            question: 'x402 客户端付款之后会做什么？',
            answers: [
                '重发原来的请求',
                '在服务器上开设账户',
                '等待邮件发来的收据'
            ]
        },
        '7a': {
            question: '卡组织网络通常对每笔交易收取多少费用？',
            answers: [
                '几美分再加一定比例',
                '固定的月费',
                '一美元以下不收费'
            ]
        },
        '7b': {
            question: '用银行卡收取一美分，会出什么问题？',
            answers: [
                '钱要一个月才能到账',
                '银行卡被当作可疑欺诈冻结',
                '收款成本比收益还高'
            ]
        },
        '7c': {
            question: '是什么让按次付费成为可能？',
            answers: [
                '成本仅为一美分零头的转账',
                '通过邮件寄出的月度账单',
                '发卡机构设定的信用额度'
            ]
        },
        '8a': {
            question: 'Circle 的可编程钱包如何保护签名私钥？',
            answers: [
                '用 MPC 在多方之间拆分',
                '用 SMS 发给智能体的所有者',
                '打印成 QR 码存进银行金库'
            ]
        },
        '8b': {
            question: '智能体能花多少钱，由什么决定？',
            answers: [
                '智能体自己的判断',
                '网络设定的每日上限',
                '所有者签署的额度'
            ]
        },
        '8c': {
            question: '智能体会持有钱包的私钥吗？',
            answers: [
                '会，一旦获得信任',
                '只在付款过程中',
                '不会，永远不会'
            ]
        },
        '9a': {
            question: 'CCTP 对源链上的 USDC 做了什么？',
            answers: [
                '销毁它',
                '锁定它',
                '复制它'
            ]
        },
        '9b': {
            question: 'Circle Gateway 为智能体提供了什么？',
            answers: [
                '跨所有链的统一余额',
                '每条链上各一个钱包',
                'Circle 银行的信用额度'
            ]
        },
        '9c': {
            question: '为什么使用 CCTP 时，不存在需要信任的跨链桥代币？',
            answers: [
                'USDC 始终只存在于一条链上',
                '所有封装代币都由跨链桥承保',
                '原生 USDC 直接在目标链上铸造'
            ]
        },
        '10a': {
            question: 'USDC 的储备以什么形式持有？',
            answers: [
                '比特币、以太币等加密货币',
                'Circle 及其合作伙伴的股份',
                '现金和短期美国国债'
            ]
        },
        '10b': {
            question: '储备鉴证报告多久发布一次？',
            answers: [
                '每十年',
                '每年',
                '每月'
            ]
        },
        '10c': {
            question: 'USDC 的储备与谁的资金分开存放？',
            answers: [
                '美国财政部的',
                'Arc 验证者的',
                'Circle 自有的'
            ]
        },
        '11a': {
            question: '通过 Circle Mint 赎回时，USDC 会怎样？',
            answers: [
                '被冻结到下一个工作日',
                '转给排队的下一位买家',
                '在美元转出时被销毁'
            ]
        },
        '11b': {
            question: 'USDC 什么时候可以铸造和赎回？',
            answers: [
                '只在美国银行营业时间',
                '全天候，每天都可以',
                '每周一次，批量处理'
            ]
        },
        '11c': {
            question: '一家企业向 Circle Mint 电汇 1,000 美元，会铸造多少 USDC？',
            answers: [
                '正好 1,000 USDC',
                '由市场决定',
                '约 990 USDC'
            ]
        },
        '12a': {
            question: 'EURC 锚定哪种货币？',
            answers: [
                '欧元',
                '日元',
                '英镑'
            ]
        },
        '12b': {
            question: 'EURC 以什么作为支撑？',
            answers: [
                '一篮子欧洲银行股票',
                '与 USDC 相同的储备模式',
                '一套调节 EURC 供应量的算法'
            ]
        },
        '12c': {
            question: '为什么 Arc 从设计之初就支持多种货币？',
            answers: [
                '美元手续费对美国以外的人太贵',
                '单一货币的网络会止步于第一道国境',
                '监管要求每条链承载三种货币'
            ]
        },
        '13a': {
            question: 'Arc 的外汇引擎在哪里报价？',
            answers: [
                '链上',
                '钱包里',
                '链下'
            ]
        },
        '13b': {
            question: '普通的货币兑换为什么会出问题？',
            answers: [
                '一方先付出，在风险敞口中等待',
                '汇率一整年都固定不变',
                '双方必须先持有同一种货币'
            ]
        },
        '13c': {
            question: '如果 Arc 外汇兑换的一条腿无法结算，另一条腿会怎样？',
            answers: [
                '在队列里等上一周',
                '也不会发生',
                '先结算，稍后再退款'
            ]
        },
        '14a': {
            question: 'Arc 上的每笔交易都使用机密转账吗？',
            answers: [
                '是，每笔转账都保密',
                '不是，需要主动选择',
                '仅限 10,000 美元以上的转账'
            ]
        },
        '14b': {
            question: '在机密转账中，什么依然可见？',
            answers: [
                '地址',
                '什么都不可见',
                '金额'
            ]
        },
        '14c': {
            question: '必要时，谁能看到机密转账的细节？',
            answers: [
                '任何愿意付一小笔费用的竞争对手',
                '各方选择向其披露的审计师或监管机构',
                '谁都看不到，连交易双方也不行'
            ]
        },
        '15a': {
            question: '以下哪一家是 Arc 的创始验证者之一？',
            answers: [
                'Binance',
                'Mastercard',
                'OpenAI'
            ]
        },
        '15b': {
            question: '验证者在 Arc 上负责什么工作？',
            answers: [
                '设定 USDC 的价格',
                '审批新用户账户',
                '给交易排序'
            ]
        },
        '15c': {
            question: 'Arc 的验证者集合之后有什么计划？',
            answers: [
                '交给一家公司独自掌管',
                '过渡到开放质押',
                '用矿工取代验证者'
            ]
        },
        '16a': {
            question: '为什么周五发出的电汇可能要闲置到周一？',
            answers: [
                '银行每月只结算一次电汇',
                '代理行有各自的截止时间',
                '每笔电汇都须经法院批准'
            ]
        },
        '16b': {
            question: '稳定币转账什么时候可以结算？',
            answers: [
                '任何时刻，周末也可以',
                '只在银行营业时间',
                '只在工作日'
            ]
        },
        '16c': {
            question: '稳定币付款方在发送前就能知道什么？',
            answers: [
                '要付的手续费',
                '明天的汇率',
                '收款方的余额'
            ]
        },
        '17a': {
            question: 'Arc 的测试网从何时开始运行？',
            answers: [
                '2026 年 9 月',
                '2025 年 10 月',
                '2024 年 3 月'
            ]
        },
        '17b': {
            question: '在 Arc 测试网和公开上线之间，还经历了什么？',
            answers: [
                '一场代币空投活动',
                '第二个付费测试网',
                '一个私有主网'
            ]
        },
        '17c': {
            question: '大约有多少机构和开发者参与了 Arc 的私有主网？',
            answers: [
                '大约十家',
                '一百多家',
                '上百万家'
            ]
        },
        '18a': {
            question: '转错地址的已结算转账，客服能撤销吗？',
            answers: [
                '不能，追不回来',
                '能，三十天内可以',
                '能，只要证明是失误'
            ]
        },
        '18b': {
            question: '是什么让已结算转账中的错误无法挽回？',
            answers: [
                '让结算变快的那种最终性',
                '各钱包应用为用户设定的规则',
                '网络对每笔大额转账附加的延迟'
            ]
        },
        '18c': {
            question: '消费限额和测试网为什么存在？',
            answers: [
                '好让你事前检查，因为没有事后',
                '好让每个人的转账都更便宜',
                '好让金额对公众隐藏起来'
            ]
        },
        '19a': {
            question: '以下哪一项对 Arc 来说仍在前方？',
            answers: [
                'USDC 作为 Gas',
                'ARC 代币',
                '快速最终性'
            ]
        },
        '19b': {
            question: 'ARC 旨在推动哪一种过渡？',
            answers: [
                '从权益证明（PoS）到工作量证明（PoW）',
                '从权威证明（PoA）到权益证明（PoS）',
                '从一层（Layer-1）到二层（Layer-2）网络'
            ]
        },
        '19c': {
            question: 'Arc 公共主网上线时具备什么？',
            answers: [
                '以 ARC 支付 Gas，首日即全面开放质押',
                '采用工作量证明挖矿，以 ETH 支付 Gas',
                '以 USDC 支付 Gas，由许可制创始验证者运行'
            ]
        },
        '20a': {
            question: '按照这款游戏的说法，支付何时才算完成？',
            answers: [
                '发出时',
                '成为最终态时',
                '收款方看到时'
            ]
        },
        '20b': {
            question: '什么是结算？',
            answers: [
                '发送方签署付款的那一刻',
                '网络报出手续费的那一刻',
                '付款再也无法被撤销的那一刻'
            ]
        },
        '20c': {
            question: '是什么让 Arc 上的结算能以机器的速度到来？',
            answers: [
                '稳定币 Gas 加上亚秒级的确定性最终性',
                '更大的区块和更长的确认等待时间',
                '直接接入链上的 Visa 等卡组织网络'
            ]
        }
    },

    rescueTopics: {
        stablecoin: {
            title: '稳定币究竟是什么',
            hint: '稳定币是一种代表着有人真实持有的资金的代币。USDC 可以一比一赎回：把代币交还给发行方，你就能拿回一美元。让价格稳在一美元的正是这个承诺，而不是交易行为——也正因如此，持有 USDC 是对一美元的索取权，而不是发行公司的股份。',
            questions: [
                {
                    question: '稳定币代表的是什么？',
                    answers: [
                        '有人真实持有的资金',
                        '网络上的算力',
                        '一家科技公司的股份'
                    ]
                },
                {
                    question: '想用 USDC 换回一美元，要把它交给谁？',
                    answers: [
                        '任意一个验证者',
                        '一家交易所',
                        '代币的发行方'
                    ]
                },
                {
                    question: '是什么让 USDC 的价格稳在一美元？',
                    answers: [
                        '每天庞大的交易量',
                        '全体持有者每天投票',
                        '一比一赎回的承诺'
                    ]
                },
                {
                    question: '持有 USDC，你拥有的是对什么的索取权？',
                    answers: [
                        '股份',
                        '利润',
                        '一美元'
                    ]
                },
                {
                    question: '赎回一枚 USDC 能拿回多少美元？',
                    answers: [
                        '正好一美元',
                        '一美元，扣除手续费',
                        '按最近成交价'
                    ]
                }
            ]
        },
        gas: {
            title: 'Gas，以及计价货币为何重要',
            hint: 'Gas 是网络处理你这笔交易所收取的费用。在多数链上它以波动的代币支付，所以在你还在犹豫的时候，折算成美元的成本就已经变了。Arc 用 USDC 收取 Gas，把一项无法预测的成本变成了普通的支出条目——每笔大约半美分。',
            questions: [
                {
                    question: '谁收取 Gas？',
                    answers: [
                        '处理这笔交易的网络',
                        '收款的那个人',
                        '上架钱包应用的应用商店'
                    ]
                },
                {
                    question: '在多数链上，你还在犹豫时，Gas 折算成美元的成本会怎样？',
                    answers: [
                        '随代币价格变动',
                        '一夜之间降到零',
                        '锁定一小时不变'
                    ]
                },
                {
                    question: 'Arc 用什么收取 Gas？',
                    answers: [
                        'ARC',
                        'ETH',
                        'USDC'
                    ]
                },
                {
                    question: '在 Arc 上，每笔交易的 Gas 大约多少？',
                    answers: [
                        '大约五十美分',
                        '大约五美分',
                        '大约半美分'
                    ]
                },
                {
                    question: 'USDC Gas 把一项无法预测的成本变成了什么？',
                    answers: [
                        '可交易的资产',
                        '普通的支出条目',
                        '可抵税的扣除项'
                    ]
                }
            ]
        },
        finality: {
            title: '一笔支付何时才算真的完成',
            hint: '当一笔交易再也无法被撤销时，它才算最终确定。有些链只能让这件事变得「很可能」，所以你要等确认数——刚被接受的区块仍可能被替换，这种替换叫作重组。Arc 的共识让最终性在一秒之内变成确定的事实，因此没有什么可等的。',
            questions: [
                {
                    question: '一笔交易何时才算最终确定？',
                    answers: [
                        '再也无法被撤销时',
                        '钱包显示出它时',
                        '手续费付清时'
                    ]
                },
                {
                    question: '在最终性只是「很可能」的链上，用户要等什么？',
                    answers: [
                        '一份每日报告',
                        '一张客服工单',
                        '更多的确认数'
                    ]
                },
                {
                    question: '刚被接受的区块被替换，这叫作什么？',
                    answers: [
                        '回滚',
                        '分叉',
                        '重组'
                    ]
                },
                {
                    question: 'Arc 让最终性变成确定的事实需要多久？',
                    answers: [
                        '大约十分钟',
                        '不到一秒',
                        '大约一小时'
                    ]
                },
                {
                    question: '在 Arc 上，你需要等多少个确认？',
                    answers: [
                        '三十个',
                        '六个',
                        '零个'
                    ]
                }
            ]
        },
        keys: {
            title: '钱包、私钥，以及谁有权花钱',
            hint: '钱包并不保管钱——它保管的是授权动用这笔钱的私钥，谁拿到私钥，谁就拥有这笔资金。正因如此，任何正经的客服都绝不会索要你的助记词；也正因如此，严肃的托管方案会把私钥在多方之间拆分，让任何一方都无法独自签名。',
            questions: [
                {
                    question: '谁掌控着钱包里的资金？',
                    answers: [
                        '拿到私钥的人',
                        '核验用户身份的银行',
                        '开发钱包应用的人'
                    ]
                },
                {
                    question: '关于钱包，以下哪项说法正确？',
                    answers: [
                        '它存着整条区块链的副本',
                        '它把代币保存在本地文件里',
                        '它保管的是私钥，而不是钱本身'
                    ]
                },
                {
                    question: '谁会向你索要助记词？',
                    answers: [
                        '正经的客服都不会',
                        '网络的验证者',
                        '你的钱包客服团队'
                    ]
                },
                {
                    question: '在严肃的托管方案中，一方能独自签名吗？',
                    answers: [
                        '不能，私钥被拆分，谁都不行',
                        '能，只要等待一小段时间',
                        '能，份额较大的一方总是可以'
                    ]
                },
                {
                    question: '钱包里的私钥授权的是什么？',
                    answers: [
                        '查看余额',
                        '动用资金',
                        '更改网络手续费'
                    ]
                }
            ]
        },
        agents: {
            title: '为自己付费的程序',
            hint: '智能体是一个带预算的程序。它边工作边付款——一次搜索、一份数据源、一次模型调用——金额小到银行卡根本无法承载，因为几美分的固定手续费会比所买的东西还贵。让这一切安全的不是信任，而是它的所有者签署的消费限额。',
            questions: [
                {
                    question: '在这里，智能体指的是什么？',
                    answers: [
                        '一个带预算的程序',
                        '为你效力的人类经纪人',
                        '银行的客服机器人'
                    ]
                },
                {
                    question: '以下哪一项可能是智能体边工作边付费购买的？',
                    answers: [
                        '一次模型调用',
                        '一笔住房贷款',
                        '一份月薪'
                    ]
                },
                {
                    question: '为什么智能体不能用银行卡为单次搜索付款？',
                    answers: [
                        '几美分的手续费比搜索本身还贵',
                        '银行卡根本不能用于任何网上付款',
                        '软件执行搜索向来都是免费的'
                    ]
                },
                {
                    question: '智能体遵守的消费限额由谁签署？',
                    answers: [
                        '验证者',
                        '智能体的所有者',
                        '智能体自己'
                    ]
                },
                {
                    question: '智能体什么时候付款？',
                    answers: [
                        '边工作边付',
                        '只在所有者在线时',
                        '每年预付一次'
                    ]
                }
            ]
        },
        crosschain: {
            title: '需要更换区块链的资金',
            hint: '各条链并不共享一个账本，所以代币无法简单地在它们之间移动。过去的做法是在一条链上把它锁住，再在另一条链上发行一份副本——封装代币——由此留下一池被锁定的资金，而这正是加密史上最大规模攻击的目标。原生转移在一端销毁、在另一端铸造，也就没有可偷的资金池。',
            questions: [
                {
                    question: '为什么代币不能简单地在链之间移动？',
                    answers: [
                        '每条链都禁止外来代币',
                        '各条链并不共享账本',
                        '代币体积太大，搬不动'
                    ]
                },
                {
                    question: '过去「锁定再复制」的做法留下了什么？',
                    answers: [
                        '每笔转账永久附加的手续费',
                        '一池被锁定的资金',
                        '整条链的第二份副本'
                    ]
                },
                {
                    question: '被锁定的跨链桥资金池招来了什么？',
                    answers: [
                        '加密史上最大规模的攻击',
                        '政府提供的存款保险',
                        '最高的质押收益'
                    ]
                },
                {
                    question: '原生转移在目标链上做什么？',
                    answers: [
                        '销毁代币',
                        '铸造代币',
                        '锁定代币'
                    ]
                },
                {
                    question: '为什么原生转移中没有可偷的东西？',
                    answers: [
                        '不存在锁定的资金池',
                        '金额经过了加密',
                        '每笔转账都有保险'
                    ]
                }
            ]
        },
        transparency: {
            title: '不必围观的证明',
            hint: '有两件事必须同时成立。储备必须可被证明，因此独立会计师事务所每月发布鉴证报告，确认储备覆盖了全部流通代币。而企业不能让竞争对手读到自己的发票，因此机密转账把金额对公众隐藏，同时仍可向审计师披露。',
            questions: [
                {
                    question: '储备鉴证报告由谁发布？',
                    answers: [
                        'Circle 自己的市场团队',
                        '独立的会计师事务所',
                        'Arc 网络的验证者'
                    ]
                },
                {
                    question: '储备鉴证报告多久发布一次？',
                    answers: [
                        '每五年',
                        '每月',
                        '从不发布'
                    ]
                },
                {
                    question: '机密转账为企业解决了什么问题？',
                    answers: [
                        'Gas 费用过高',
                        '客户拖欠账单',
                        '竞争对手读到它的发票'
                    ]
                },
                {
                    question: '机密转账把金额对谁隐藏？',
                    answers: [
                        '审计师',
                        '公众',
                        '发送方'
                    ]
                },
                {
                    question: '审计师还能看到机密转账的细节吗？',
                    answers: [
                        '不能，金额永久消失了',
                        '能，仍可向审计师披露',
                        '只有网络投票同意才能'
                    ]
                }
            ]
        },
        network: {
            title: 'Arc 究竟是什么样的网络',
            hint: 'Arc 是一层网络：它自己结算自己的区块，而不是把区块发布到别人的链上。它兼容 EVM，因此为以太坊编写的合约和工具无需改动即可运行。它的公共主网已于 2026 年 9 月上线，但应用仍在测试网上彩排——真实的软件配上一文不值的资金，这里恰恰是找出漏洞的地方。',
            questions: [
                {
                    question: 'Arc 会把自己的区块发布到另一条链上吗？',
                    answers: [
                        '会，发布到以太坊上',
                        '不会，它自己结算自己的区块',
                        '会，发布到比特币上'
                    ]
                },
                {
                    question: '以太坊合约要在 Arc 上运行，需要重写吗？',
                    answers: [
                        '需要，改写成 Arc 自己的语言',
                        '不需要，无需改动即可运行',
                        '需要，必须移植到 Rust'
                    ]
                },
                {
                    question: 'Arc 公共主网何时开放？',
                    answers: [
                        '2025 年 1 月',
                        '尚未开放',
                        '2026 年 9 月'
                    ]
                },
                {
                    question: '应用在 Arc 上正式上线前，在哪里彩排？',
                    answers: [
                        '主网',
                        '没有地方',
                        '测试网'
                    ]
                },
                {
                    question: '为什么测试网是找出漏洞的合适地方？',
                    answers: [
                        '它根本没有验证者',
                        '它运行的是完全不同的软件',
                        '上面的资金一文不值'
                    ]
                }
            ]
        }
    }
});
