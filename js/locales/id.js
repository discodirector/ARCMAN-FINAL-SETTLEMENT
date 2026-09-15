// Indonesian language pack.
I18n.register('id', {
    document: {
        title: 'ARCMAN: Final Settlement - Game Arkade'
    },

    language: {
        label: 'Bahasa',
        select: 'Pilih bahasa'
    },

    start: {
        title: 'ARCMAN: Final Settlement',
        subtitle: 'Klik untuk Mulai'
    },

    menu: {
        title: 'ARCMAN: Final Settlement',
        subtitle: 'Game Arkade',
        tournament: 'MODE TURNAMEN',
        community: 'LEVEL KOMUNITAS',
        editor: 'EDITOR LEVEL',
        statistics: 'STATISTIK',
        leaderboard: 'PAPAN PERINGKAT',
        audio: 'PENGATURAN AUDIO',
        faucet: 'Faucet USDC'
    },

    hud: {
        score: 'Skor: {score}',
        level: 'Level {current}/{total}',
        lives: 'Nyawa: {lives}',
        levelName: 'Level {id}: {name}',
        menu: 'Menu',
        backToEditor: 'Kembali ke Editor',
        settlement: 'SETELMEN'
    },

    mode: {
        tournament: 'Turnamen',
        community: 'Komunitas',
        test: 'Uji Coba',
        unknown: 'Tidak diketahui',
        title: 'Deskripsi Mode',
        close: 'Saya siap',
        tournamentText: 'Anda adalah <span style="color: #0ff; text-shadow: 0 0 20px #0ff; font-weight: bold;">Arc Man</span>. Misi Anda: menuntaskan setelmen transaksi stablecoin. Luncurkan token dalam lintasan melengkung dan kenai Zona Setelmen.\n\nKumpulkan poin, bersaing dengan pemain lain, naiki Papan Peringkat, dan cetak NFT akhir Anda.',
        tournamentHighlight: 'Di mode ini Anda punya 5 nyawa. Jawaban benar dalam kuis akan memulihkannya — dan jika semuanya habis, satu kuis terakhir masih bisa mengembalikan Anda ke permainan.'
    },

    tutorial: {
        title: 'Panduan Objek Permainan',
        cloudName: 'Awan Slippage',
        cloudText: 'Jebakan! Memperlambat setelmen, mengubah lintasan, dan memberi 10 poin.',
        gateName: 'Gerbang Arc',
        gateText: 'Memberi pengali 1,5× untuk poin penyelesaian level Anda.',
        barrierName: 'Barier',
        barrierText: 'Barier — Anda menabrak barier kepatuhan! Transaksi perlu dirutekan ulang, arah terbang akan berubah, dan Anda mendapat 10 poin.',
        settlementName: 'Zona Setelmen',
        settlementText: 'Ini garis akhirnya! Memasukinya menuntaskan transaksi.',
        close: 'Mengerti!'
    },

    summary: {
        title: 'Transaksi Tuntas!',
        levelPoints: 'Poin Level',
        totalPoints: 'Total Poin',
        gates: 'Gerbang Arc Terkumpul',
        clouds: 'Awan Slippage Dilewati',
        barriers: 'Tabrakan Barier',
        continue: 'Lanjut',
        returnToEditor: 'Kembali ke Editor'
    },

    quizUi: {
        title: 'Jawab kuis, dapat nyawa',
        questionPlaceholder: 'Pertanyaan akan muncul di sini',
        answer1: 'Jawaban 1',
        answer2: 'Jawaban 2',
        answer3: 'Jawaban 3',
        skip: 'Lewati',
        skipFullLives: 'Lewati (nyawa sudah penuh)',
        continue: 'Lanjut',
        correct: 'Benar!',
        correctLife: 'Benar! +1 Nyawa',
        incorrect: 'Salah. Jawaban yang benar: {answer}',
        unavailable: 'Server kuis tidak merespons, jadi soal ini tidak dihitung. Lanjutkan ke level berikutnya.'
    },

    rescue: {
        title: 'Nyawa habis',
        lead: 'Tiga pertanyaan memisahkan Anda dari permainan yang tadi Anda jalani. Baca ini dulu — semua jawabannya ada di sini.',
        readIt: 'Sudah saya baca — tanyakan saja',
        progress: 'Pertanyaan {current} dari {total}   ·   {correct} benar sejauh ini',
        correct: 'Benar',
        wrong: 'Salah — jawabannya: {answer}',
        next: 'Pertanyaan berikutnya',
        seeResult: 'Lihat hasilnya',
        verdictTitle: '{correct} dari {total} benar',
        backInOne: 'Anda kembali — dengan 1 nyawa. Ini satu-satunya penyelamatan dalam permainan ini.',
        backIn: 'Anda kembali — dengan {lives} nyawa. Ini satu-satunya penyelamatan dalam permainan ini.',
        notEnough: 'Belum cukup. Permainan diulang dari level pertama.',
        rescued: 'Terselamatkan',
        runOver: 'Permainan berakhir',
        backToLevel: 'Kembali ke level',
        startOver: 'Mulai dari awal',
        continue: 'Lanjut',
        unavailable: 'Kuis penyelamatan tidak dapat menghubungi server, jadi tidak bisa dinilai. Permainan dimulai ulang dari level pertama.'
    },

    infoUi: {
        title: 'Tahukah Anda?',
        continue: 'Lanjut'
    },

    completion: {
        title: '🎉 Permainan Tamat! 🎉',
        finalScore: 'Skor Akhir',
        levelsCompleted: 'Level Diselesaikan',
        time: 'Waktu Penyelesaian',
        bestLevelScore: 'Skor Level Terbaik',
        averageLevelScore: 'Rata-rata Skor Level',
        gameMode: 'Mode Permainan',
        finalizeOnchain: 'Finalisasi On-Chain',
        mintNft: 'Cetak NFT',
        returnToMenu: 'Kembali ke Menu'
    },

    community: {
        title: '🎉 Selamat! 🎉',
        text: 'Anda telah menyelesaikan semua level buatan komunitas. Datang lagi nanti untuk level baru, pahlawan!',
        returnToMenu: 'Kembali ke Menu',
        none: 'Belum ada level komunitas. Cek lagi nanti!'
    },

    stats: {
        title: 'Statistik Pemain',
        overview: 'Ringkasan',
        gamesPlayed: 'Permainan Dimainkan',
        gamesCompleted: 'Permainan Diselesaikan',
        completionRate: 'Tingkat Penyelesaian',
        bestScores: 'Skor Terbaik',
        bestFinalScore: 'Skor Akhir Terbaik',
        bestLevelScore: 'Skor Level Terbaik',
        averageFinalScore: 'Rata-rata Skor Akhir',
        totalLifetimePoints: 'Total Poin Sepanjang Masa',
        performance: 'Performa',
        totalLevels: 'Total Level Diselesaikan',
        avgLevelsPerGame: 'Rata-rata Level per Permainan',
        fastestTime: 'Penyelesaian Tercepat',
        averageTime: 'Waktu Rata-rata',
        achievements: 'Pencapaian',
        totalGates: 'Total Gerbang Dilewati',
        totalClouds: 'Total Awan Dilewati',
        totalBarriers: 'Total Barier Tertabrak',
        perfectGames: 'Permainan Sempurna',
        modeStats: 'Statistik Mode',
        tournamentPlayed: 'Turnamen: Dimainkan',
        tournamentCompleted: 'Turnamen: Diselesaikan',
        lastGame: 'Permainan Terakhir',
        date: 'Tanggal',
        mode: 'Mode',
        score: 'Skor',
        never: 'Belum pernah',
        notAvailable: 'T/A',
        reset: 'Setel Ulang Statistik',
        close: 'Tutup',
        resetConfirm: 'Yakin ingin menyetel ulang semua statistik? Tindakan ini tidak bisa dibatalkan.'
    },

    leaderboard: {
        title: '🏆 Papan Peringkat 🏆',
        top10: 'Top 10',
        top25: 'Top 25',
        top50: 'Top 50',
        top100: 'Top 100',
        yourRank: 'Peringkat Anda:',
        points: '{score} poin',
        loading: 'Memuat papan peringkat...',
        empty: 'Belum ada pemain di papan peringkat. Jadilah yang pertama!',
        loadFailed: 'Gagal memuat papan peringkat: {error}',
        refresh: 'Muat Ulang',
        close: 'Tutup'
    },

    onchain: {
        title: 'Finalisasi Skor On-Chain',
        finalScore: 'Skor Akhir',
        levelsCompleted: 'Level Diselesaikan',
        gameMode: 'Mode Permainan',
        connectPrompt: 'Hubungkan dompet Anda untuk memfinalisasi skor on-chain',
        supportedWallets: 'Dompet yang didukung: MetaMask, Rabby',
        noWalletTitle: 'Belum punya dompet?',
        noWalletText: 'Pasang ekstensi peramban <a href="https://metamask.io/download/" target="_blank" style="color: #0ff; text-decoration: underline;">MetaMask</a> atau <a href="https://rabby.io/" target="_blank" style="color: #0ff; text-decoration: underline;">Rabby</a>, lalu muat ulang halaman ini.',
        connectWallet: 'Hubungkan Dompet',
        connecting: 'Menghubungkan...',
        connected: 'Terhubung:',
        disconnect: 'Putuskan',
        preparing: 'Menyiapkan transaksi...',
        estimatedGas: 'Perkiraan Gas:',
        submit: 'Finalisasi Skor On-Chain',
        processing: 'Memproses...',
        gettingSignature: 'Mengambil tanda tangan server...',
        submitting: 'Mengirim transaksi...',
        successTitle: '✅ Skor Difinalisasi!',
        successText: 'Skor Anda berhasil dicatat on-chain.',
        viewTx: 'Lihat Transaksi di Block Explorer',
        errorTitle: '❌ Kesalahan',
        close: 'Tutup',
        failed: 'Gagal memfinalisasi skor on-chain'
    },

    nft: {
        title: '🎨 Cetak NFT Penyelesaian',
        preview: 'Pratinjau NFT',
        previewName: 'ARCMAN: Final Settlement - Sertifikat Penyelesaian',
        connectPrompt: 'Hubungkan dompet Anda untuk mencetak NFT penyelesaian',
        supportedWallets: 'Dompet yang didukung: MetaMask, Rabby',
        connectWallet: 'Hubungkan Dompet',
        connected: 'Terhubung:',
        alreadyHave: '✓ Anda sudah punya NFT penyelesaian!',
        tokenId: 'ID Token:',
        viewOnExplorer: 'Lihat di Block Explorer',
        disconnect: 'Putuskan',
        readyToMint: 'Siap dicetak',
        estimatedGas: 'Perkiraan gas:',
        mint: 'Cetak NFT',
        minting: 'Mencetak...',
        preparing: 'Menyiapkan transaksi...',
        estimatingGas: 'Memperkirakan gas...',
        mintingNft: 'Mencetak NFT...',
        mintedSuccess: 'NFT berhasil dicetak!',
        alreadyMinted: 'Sudah Dicetak',
        successTitle: '🎉 NFT Berhasil Dicetak! 🎉',
        successText: 'Sertifikat penyelesaian Anda telah dicetak!',
        transaction: 'Transaksi:',
        viewTx: 'Lihat Transaksi',
        errorTitle: '❌ Kesalahan',
        close: 'Tutup',
        connectFailed: 'Gagal menghubungkan dompet: {error}',
        mintFailed: 'Gagal mencetak NFT'
    },

    audio: {
        title: 'PENGATURAN AUDIO',
        musicVolume: 'Volume Musik',
        soundVolume: 'Volume Efek Suara',
        close: 'TUTUP'
    },

    wallet: {
        connect: 'Hubungkan Dompet',
        connecting: 'Menghubungkan...',
        useHttpServer: '⚠️ Gunakan Server HTTP',
        notInstalled: '{wallet} belum terpasang. Pasang dompet MetaMask atau Rabby untuk melanjutkan.',
        noProvider: 'Penyedia dompet tidak ditemukan. Pasang dompet MetaMask atau Rabby.',
        noAccounts: 'Akun tidak ditemukan. Buka kunci dompet Anda.',
        rejected: 'Koneksi ditolak. Setujui permintaan koneksi di dompet Anda.',
        pending: 'Permintaan koneksi sudah menunggu. Periksa dompet Anda.',
        connectFailed: 'Gagal menghubungkan dompet. Silakan coba lagi.',
        notConnected: 'Dompet belum terhubung',
        notDetected: 'Dompet tidak terdeteksi. ',
        providerInvalid: 'window.ethereum ada, tetapi mungkin bukan penyedia dompet yang valid. ',
        installSteps: 'Silakan:\n1. Pastikan MetaMask atau Rabby sudah terpasang dan aktif\n2. Muat ulang halaman\n3. Periksa konsol peramban untuk detailnya',
        switchNetwork: 'Setujui pergantian jaringan ke {network} di dompet Anda.',
        switchFailed: 'Gagal beralih ke {network}. Ganti jaringan secara manual di dompet Anda.',
        contractMissing: 'Kontrak belum diinisialisasi. Atur CONTRACT_ADDRESS di konfigurasi.',
        txWouldFail: 'Transaksi akan gagal. Periksa data skor Anda.',
        nftExists: 'Anda sudah punya NFT penyelesaian untuk mode {mode}',
        nftInitFailed: 'Gagal menginisialisasi kontrak NFT'
    },

    errors: {
        connectWalletFirst: 'Hubungkan dompet Anda terlebih dahulu',
        noCompletionData: 'Data penyelesaian tidak tersedia',
        noAccount: 'Tidak ada akun yang terhubung',
        noSession: 'Sesi permainan tidak ditemukan. Ini bisa terjadi jika Anda memulai permainan tanpa dompet yang terhubung.\n\nHubungkan dompet Anda, lalu mainkan kembali seluruh level untuk mencatat skor Anda.',
        requestTimeout: 'Permintaan melewati batas waktu. Server mungkin lambat atau tidak tersedia.',
        signatureFailed: 'Gagal mengambil tanda tangan server',
        serverError: 'Kesalahan server: {status} {statusText}',
        leaderboardUnavailable: 'Modul papan peringkat tidak tersedia'
    },
    editor: {
        title: 'Editor Level',
        close: 'Tutup Editor',
        new: 'Level Baru',
        save: 'Simpan Level',
        delete: 'Hapus Level',
        export: 'Ekspor',
        submit: 'Kirim Level',
        levelInfo: 'Info Level',
        levelName: 'Nama Level:',
        newLevelName: 'Level Baru',
        levelId: 'ID Level:',
        idNew: 'Baru',
        tools: 'Alat',
        toolSelect: 'Pilih',
        toolGate: 'Gerbang Arc',
        toolCloud: 'Awan Slippage',
        toolLifeRestore: 'Pemulih Nyawa',
        toolBarrierLarge: 'Barier (Besar)',
        toolBarrierMedium: 'Barier (Sedang)',
        toolBarrierSmall: 'Barier (Kecil)',
        toolSettlement: 'Zona Setelmen',
        toolPlayer: 'Titik Awal Pemain',
        toolDelete: 'Hapus',
        rotate: 'Putar Objek Terpilih (R)',
        preview: 'Pratinjau Level',
        instructions: 'Klik untuk menempatkan objek. Gunakan alat Pilih untuk memilih objek, lalu tekan R atau klik Putar untuk memutarnya (langkah 15°).',
        objects: 'Objek',
        gates: 'Gerbang Arc:',
        clouds: 'Awan Slippage:',
        lifeRestores: 'Pemulih Nyawa:',
        barriers: 'Barier:',
        settlementZone: 'Zona Setelmen:',
        levelList: 'Daftar Level',
        loadingLevels: 'Memuat level...',
        load: 'Muat Level',
        launch: 'Jalankan Level',
        exportTitle: 'Ekspor DEFAULT_LEVELS',
        exportHint: 'Salin kode di bawah dan ganti array DEFAULT_LEVELS di levels.js:',
        copy: 'Salin ke Papan Klip',
        copied: 'Kode disalin ke papan klip!',
        copyFailed: 'Gagal menyalin. Silakan pilih dan salin secara manual.',
        needSettlementSave: 'Tambahkan Zona Setelmen sebelum menyimpan!',
        saved: 'Level tersimpan!',
        cannotDelete: 'Tidak bisa dihapus: ini level baru atau level bawaan.',
        exportModalMissing: 'Jendela ekspor tidak ditemukan. Kode dicetak ke konsol.',
        exportUnavailable: 'Fungsi ekspor tidak tersedia. Pastikan levels.js sudah dimuat.',
        nothingToSubmit: 'Tidak ada level untuk dikirim!',
        needSettlementSubmit: 'Tambahkan Zona Setelmen sebelum mengirim!',
        needObjects: 'Tambahkan setidaknya satu objek (gerbang, awan, barier, atau pemulih nyawa) sebelum mengirim!',
        submitting: 'Mengirim level...',
        submitted: 'Level berhasil dikirim! Pengembang akan meninjaunya.',
        submitFailed: 'Gagal mengirim level. Silakan coba lagi nanti.',
        nothingToLaunch: 'Tidak ada level untuk dijalankan!',
        deleteConfirm: 'Hapus level ini?',
        exportModalMissingWithCode: 'Jendela ekspor tidak ditemukan. Ini kodenya:\n\n',
        needSettlementLaunch: 'Tambahkan Zona Setelmen sebelum menjalankan!',
        managerMissing: 'Pengelola level belum diinisialisasi!',
        launchFailed: 'Gagal memuat level untuk dijalankan!',
        savedAndLaunching: 'Level tersimpan, sedang dijalankan...'
    },

    levels: {
        1: 'Peluncuran Pertama',
        2: 'Perintis Jalur',
        3: 'Buat sebuah lengkungan',
        4: 'Lewati gerbangnya',
        5: 'Perutean',
        6: 'Dua barier',
        7: 'Kelihatannya mudah',
        8: 'Peringatan Badai',
        9: 'Rintangan Berlapis',
        10: 'Dijamin Penuh',
        11: 'Satu Masuk, Satu Keluar',
        12: 'Bukan Hanya Dolar',
        13: 'Kedua Kaki Sekaligus',
        14: 'Amplop Tersegel',
        15: 'Siapa yang Menandatangani Blok',
        16: 'Bank Koresponden',
        17: 'Lalu Lintas Institusional',
        18: 'Tak Bisa Ditarik Kembali',
        19: 'Jalan Menuju Mainnet',
        20: 'Setelmen Akhir'
    },

    info: {
        1: 'Arc adalah blockchain Layer-1 terbuka dari Circle, perusahaan penerbit USDC. Arc kompatibel dengan EVM dan dibangun khusus untuk keuangan berbasis stablecoin. Mainnet publik Arc dibuka pada 16 September 2026; skor dan sertifikat game ini masih diselesaikan di Arc Testnet, tempat bermain tidak memakan biaya.',
        2: 'Di Arc, gas dibayar dengan USDC, bukan token yang harganya bergejolak. Biaya dikutip langsung dalam dolar dan rata-rata sekitar $0,005 per transaksi, sehingga siapa pun bisa menganggarkannya seperti biaya biasa.',
        3: 'Arc memadukan Malachite — implementasi Tendermint BFT dalam Rust — dengan lapisan eksekusi Reth. Finalitasnya deterministik dan di bawah satu detik: begitu blok dikomit, blok itu final, tanpa reorg dan tanpa menunggu konfirmasi. Inilah salah satu sifat yang dibawa mainnet publik Arc saat dibuka.',
        4: 'ARC adalah token koordinasi yang direncanakan untuk Arc — bukan token gas, karena gas tetap dibayar dengan USDC. Menurut rancangannya, biaya protokol dikonversi menjadi ARC dan disalurkan ke validator dan staker, dengan sebagian dibakar. Mainnet dibuka tanpanya: ARC belum diluncurkan, dan Circle menyebut rencana token apa pun masih bersifat eksploratif.',
        5: 'Taruhan terbesar Arc adalah ekonomi agentik — agen AI yang membayar sendiri komputasi, data, dan layanan. Itu memerlukan pembayaran di bawah satu sen, diselesaikan dalam USDC lewat standar terbuka seperti x402.',
        6: 'x402 adalah standar terbuka tersebut. Ia menghidupkan kembali kode status HTTP 402, "Payment Required": alih-alih galat, server menjawab dengan harga. Klien membayar dalam USDC lalu mengulang permintaannya, dan sebuah fasilitator memverifikasi pembayaran on-chain. Tanpa akun, tanpa kartu, tanpa manusia di tengahnya.',
        7: 'Jalur kartu tidak bisa menetapkan harga untuk satu panggilan API. Mereka mengenakan biaya tetap per transaksi — kira-kira beberapa sen ditambah persentase — sehingga sesuatu yang bernilai satu sen lebih mahal untuk ditagih daripada hasilnya. Jalur stablecoin menghargai satu transfer dalam pecahan sen, dan itulah yang membuat bayar-per-panggilan menjadi mungkin.',
        8: 'Program yang membayar butuh akunnya sendiri. Dompet terprogram Circle tidak pernah menyerahkan kunci privat kepada agen: kunci itu dipecah di antara beberapa pihak menggunakan MPC, dan agen hanya membelanjakan dalam batas yang Anda tanda tangani. Ia bisa membelanjakan dari akun itu. Ia tidak akan pernah bisa mengambil akunnya.',
        9: 'USDC tidak berpindah antar-chain sebagai salinan terbungkus. CCTP membakarnya di chain asal dan mencetak USDC asli di chain tujuan, jadi tidak ada token jembatan yang perlu dipercaya. Circle Gateway menambahkan saldo terpadu di atasnya, sehingga sebuah agen melihat satu saldo, bukan satu dompet per chain.',
        10: 'Setiap USDC didukung satu dolar cadangan — kas dan surat utang negara AS bertenor pendek, disimpan terpisah dari uang milik Circle sendiri. Sebuah firma Big Four menerbitkan atestasi bulanan yang memastikan cadangan itu menutupi seluruh token yang beredar. Itu bagian yang membosankan, dan justru bagian itulah yang membuat sisanya bisa berjalan.',
        11: 'USDC tidak ditambang, juga tidak lahir dari perdagangan. Lewat Circle Mint, sebuah bisnis mentransfer dolar masuk dan USDC dicetak dalam jumlah yang sama; saat ditebus, token dibakar sementara dolarnya keluar kembali. Satu masuk, satu keluar, 24/7 — tidak ada market maker yang menentukan harga satu dolar.',
        12: 'Stablecoin tidak harus berupa dolar. Circle juga menerbitkan EURC, token euro dengan model cadangan yang sama, dan Arc dirancang untuk beberapa mata uang sekaligus — karena jaringan pembayaran yang hanya bicara satu mata uang akan berhenti di perbatasan pertama.',
        13: 'Pertukaran mata uang adalah titik di mana pembayaran biasanya patah: satu pihak mengirim lalu menunggu, terekspos, menanti pihak lain. Mesin FX Arc mengutip harga di luar chain dan menyelesaikan kedua kaki transaksi di dalam satu kontrak, sehingga kedua transfer terjadi atau tidak sama sekali. Tidak ada kaki yang menggantung.',
        14: 'Buku besar publik adalah masalah bagi bisnis — pesaing bisa membaca setiap faktur. Jawaban Arc adalah transfer rahasia yang bersifat opsional: nominal dienkripsi sementara alamat tetap terlihat, dan para pihak dapat mengungkap detailnya kepada auditor atau regulator bila diperlukan. Tertutup dari pesaing, tidak dari hukum.',
        15: 'Seseorang harus mengurutkan transaksi. Mainnet Arc dibuka dengan himpunan validator pendiri yang berizin — di antaranya Visa, Mastercard, BlackRock, DTCC, dan Standard Chartered. Ini pertukaran yang disengaja: lebih sedikit validator di awal, ditukar dengan nama-nama yang bisa Anda mintai tanggung jawab, dengan peralihan ke staking terbuka yang direncanakan belakangan.',
        16: 'Transfer lintas negara melompat lewat bank koresponden, masing-masing dengan batas waktu operasionalnya sendiri, sehingga uang bisa menganggur berhari-hari saat akhir pekan. Jalur stablecoin tidak mengenal jam kantor: transfer yang sama selesai dalam hitungan detik, kapan saja, dengan biaya yang sudah diketahui sebelum Anda mengirim.',
        17: 'Arc tidak dibuka begitu saja. Testnet-nya berjalan sejak Oktober 2025, lalu mainnet privat dengan lebih dari seratus pembangun dari institusi dan ekosistem, sebelum peluncuran publik pada September 2026. Begitulah seharusnya sebuah jaringan pembayaran diuji: dengan proses nyata milik orang lain, sebelum uang nyata siapa pun masuk.',
        18: 'Tidak ada chargeback untuk transfer yang sudah tuntas. Salah kirim alamat dan tidak ada meja bantuan yang bisa menariknya kembali — finalitas yang membuat setelmen cepat juga membuat kesalahan menjadi permanen. Karena itulah batas belanja, izin nominal, dan jaringan uji ada: Anda memeriksa sebelumnya, karena tidak ada sesudahnya.',
        19: 'Mainnet publik Arc aktif pada 16 September 2026: gas dalam USDC, finalitas di bawah satu detik, dan himpunan validator pendiri yang berizin. Yang masih di depan adalah token ARC dan peralihan dari Proof-of-Authority ke Proof-of-Stake yang hendak diwujudkannya. Anda menempuh jalan ini di Arc Testnet selagi jaringannya dibangun — dan jalan itu berakhir tepat di tempat mainnet dimulai.',
        20: 'Seluruh game ini adalah satu gagasan: sebuah pembayaran belum selesai ketika dikirim, ia selesai ketika sudah final. Setelmen adalah saat ia tidak lagi bisa dibatalkan. Gas berbasis stablecoin ditambah finalitas deterministik di bawah satu detik itulah yang membuat saat tersebut tiba dalam kecepatan mesin — dan persis itulah yang selama ini Anda bidik.'
    },

    quiz: {
        1: {
            question: 'Apa itu Arc?',
            answers: [
                'Rollup Layer-2 yang menyelesaikan setelmen di Ethereum',
                'Layer-1 kompatibel EVM buatan Circle untuk keuangan stablecoin',
                'API pembayaran tertutup tanpa blockchain di belakangnya'
            ]
        },
        2: {
            question: 'Aset apa yang dipakai membayar gas di Arc?',
            answers: ['ETH', 'USDC', 'ARC']
        },
        3: {
            question: 'Seberapa cepat finalitas di Arc?',
            answers: [
                'Sekitar 10 menit, seperti Bitcoin',
                'Beberapa menit, setelah konfirmasi terkumpul cukup banyak',
                'Di bawah satu detik dan deterministik — blok yang sudah final tidak pernah direorg'
            ]
        },
        4: {
            question: 'Bagaimana ARC dirancang berkaitan dengan biaya yang dibayar di Arc?',
            answers: [
                'Biaya dikonversi menjadi ARC untuk validator dan staker, dan sebagian dibakar',
                'ARC menggantikan USDC sebagai token gas saat mainnet dibuka',
                'Biaya dibayarkan langsung ke Circle sebagai pendapatan perusahaan'
            ]
        },
        5: {
            question: 'Kasus penggunaan mana yang paling dipertaruhkan Arc?',
            answers: [
                'Dunia gaming dan metaverse',
                'Ekonomi agentik — agen AI yang saling membayar dan menyelesaikan setelmen',
                'Transfer antarpengguna yang sepenuhnya anonim'
            ]
        },
        6: {
            question: 'Dalam x402, apa arti respons HTTP 402 dari server?',
            answers: [
                'Permintaan gagal dan tidak perlu diulang',
                'Ini harganya — bayar dalam USDC lalu kirim ulang permintaannya',
                'Klien harus mendaftar akun dan menambahkan kartu terlebih dahulu'
            ]
        },
        7: {
            question: 'Mengapa jalur kartu tidak bisa menagih satu panggilan API?',
            answers: [
                'Jaringan kartu tidak beroperasi pada malam hari',
                'Biaya tetap per transaksi lebih mahal daripada nilai panggilannya',
                'Kartu hanya bisa memproses pembayaran dari manusia, bukan dari perangkat lunak'
            ]
        },
        8: {
            question: 'Apa yang didapat sebuah agen ketika Anda memberinya dompet Circle?',
            answers: [
                'Kunci privat, sehingga ia bisa memindahkan seluruh isi akun',
                'Hak membelanjakan dalam batas yang Anda tanda tangani — bukan kuncinya',
                'Frasa pemulihan yang disimpannya untuk Anda dalam teks biasa'
            ]
        },
        9: {
            question: 'Bagaimana USDC berpindah antar-chain lewat CCTP?',
            answers: [
                'Dikunci di jembatan lalu salinan terbungkusnya diterbitkan',
                'Dibakar di chain asal dan dicetak secara asli di chain tujuan',
                'Dijual untuk token asli chain tujuan lalu dibeli kembali'
            ]
        },
        10: {
            question: 'Apa yang berada di balik setiap USDC yang beredar?',
            answers: [
                'Satu dolar cadangan — kas dan surat utang negara bertenor pendek, diatestasi bulanan',
                'Sekeranjang kripto lain yang dipegang Circle',
                'Algoritme yang mencetak dan membakar demi mempertahankan harga'
            ]
        },
        11: {
            question: 'Bagaimana USDC baru muncul?',
            answers: [
                'Ditambang oleh validator sebagai imbalan blok',
                'Seseorang membayar dolar ke Circle dan jumlah yang sama dicetak; penebusan membakarnya',
                'Trader membelinya di bursa sampai pasokannya bertambah'
            ]
        },
        12: {
            question: 'Apakah Circle menerbitkan sesuatu selain stablecoin dolar?',
            answers: [
                'Tidak — hanya USDC',
                'Ya — EURC, stablecoin euro dengan model cadangan yang sama',
                'Ya, tetapi hanya token yang dipatok ke emas'
            ]
        },
        13: {
            question: 'Apa yang diselesaikan mesin FX Arc di dalam satu kontrak?',
            answers: [
                'Kedua kaki pertukaran mata uang, atau tidak sama sekali',
                'Satu kaki sekarang dan satunya di akhir hari',
                'Biaya transaksinya, sementara mata uangnya dikirim lewat transfer bank'
            ]
        },
        14: {
            question: 'Apa yang disembunyikan transfer rahasia di Arc?',
            answers: [
                'Segalanya — jaringan sama sekali tidak menyimpan catatan',
                'Nominalnya, sementara alamat tetap terlihat dan detail bisa diungkap bila diminta',
                'Identitas pengirim, sementara nominalnya publik'
            ]
        },
        15: {
            question: 'Siapa yang memvalidasi blok di Arc saat ini?',
            answers: [
                'Siapa pun yang men-staking cukup token, sejak hari pertama',
                'Himpunan berizin berisi institusi yang dikenal, yang membuka diri seiring waktu',
                'Circle sendirian, tanpa rencana menambah validator lain'
            ]
        },
        16: {
            question: 'Mengapa transfer bank lintas negara bisa memakan waktu berhari-hari?',
            answers: [
                'Uangnya berpindah secara fisik antarnegara',
                'Ia melompat lewat bank koresponden dengan batas waktu dan akhir pekan masing-masing',
                'Regulator menyetujui setiap pembayaran secara manual'
            ]
        },
        17: {
            question: 'Siapa yang memakai Arc sebelum mainnet publiknya dibuka?',
            answers: [
                'Tidak ada — jaringan baru dinyalakan pertama kali saat peluncuran',
                'Lebih dari seratus institusi dan pembangun, di testnet lalu di mainnet privat',
                'Hanya pemain ritel di game seperti ini'
            ]
        },
        18: {
            question: 'Anda mengirim USDC ke alamat yang salah. Apa yang bisa dilakukan?',
            answers: [
                'Tidak ada — transfer yang sudah tuntas tidak punya chargeback',
                'Circle membatalkannya jika Anda mengajukan tiket dukungan',
                'Validator memutar balik blok itu atas permintaan'
            ]
        },
        19: {
            question: 'Arc sedang berada di tahap apa sekarang?',
            answers: [
                'Mainnet publik sejak September 2026, dengan token ARC yang masih di depan',
                'Testnet tanpa tanggal mainnet yang diumumkan',
                'Mainnet yang berjalan dengan ARC sebagai token gas'
            ]
        },
        20: {
            question: 'Kapan sebuah pembayaran benar-benar tuntas?',
            answers: [
                'Ketika pengirim menekan tombol kirim',
                'Ketika transaksinya muncul di mempool',
                'Ketika ia final dan tidak lagi bisa dibatalkan'
            ]
        }
    },

    rescueTopics: {
        stablecoin: {
            title: 'Apa sebenarnya stablecoin itu',
            hint: 'Stablecoin adalah token yang mewakili uang yang benar-benar dipegang seseorang. USDC bisa ditebus satu banding satu: serahkan kembali sebuah token kepada penerbitnya dan Anda mendapat satu dolar. Janji itulah — bukan perdagangan — yang menjaga harganya tetap satu dolar, dan itu pula sebabnya memegang USDC adalah klaim atas satu dolar, bukan kepemilikan saham perusahaan penerbitnya.',
            questions: [
                {
                    question: 'Mengapa harga USDC bertahan?',
                    answers: [
                        'Para trader sepakat mempertahankannya di situ',
                        'Setiap token bisa ditebus satu dolar dari penerbitnya',
                        'Sebuah algoritme membeli dan menjualnya untuk mempertahankan patokan'
                    ]
                },
                {
                    question: 'Apakah memegang USDC berarti berinvestasi di Circle?',
                    answers: [
                        'Bukan — itu klaim atas satu dolar, bukan saham perusahaan',
                        'Ya, pemegangnya menerima bagian dari laba Circle',
                        'Ya, cara kerjanya seperti obligasi korporasi'
                    ]
                },
                {
                    question: 'Apa arti penebusan satu banding satu?',
                    answers: [
                        'Satu USDC selalu bisa membeli satu token lain apa pun',
                        'Token baru hanya dicetak ketika token lain dibakar',
                        'Serahkan satu token, terima satu dolar'
                    ]
                }
            ]
        },
        gas: {
            title: 'Gas, dan mengapa mata uangnya penting',
            hint: 'Gas adalah biaya yang dikenakan jaringan untuk memproses transaksi Anda. Di sebagian besar chain, gas dibayar dengan token yang bergejolak, sehingga biayanya dalam dolar berubah selagi Anda menimbang keputusan. Arc menagih gas dalam USDC, yang mengubah biaya tak terduga menjadi pos pengeluaran biasa — sekitar setengah sen per transaksi.',
            questions: [
                {
                    question: 'Apa itu gas?',
                    answers: [
                        'Deposit yang dikembalikan setelah transaksi terkonfirmasi',
                        'Biaya yang dikenakan jaringan untuk memproses transaksi',
                        'Pungutan yang ditarik penyedia dompet Anda'
                    ]
                },
                {
                    question: 'Mengapa bisnis peduli bahwa gas dibayar dengan stablecoin?',
                    answers: [
                        'Biayanya tetap terprediksi dalam dolar',
                        'Transaksi diproses lebih cepat',
                        'Tidak perlu lagi memiliki dompet'
                    ]
                },
                {
                    question: 'Di chain dengan token gas yang bergejolak, apa yang bisa terjadi pada biaya Anda selagi menunggu?',
                    answers: [
                        'Tidak ada — biaya dipatok dalam dolar',
                        'Biayanya dikembalikan jika harga bergerak',
                        'Biayanya ikut bergerak mengikuti harga token'
                    ]
                }
            ]
        },
        finality: {
            title: 'Kapan sebuah pembayaran benar-benar selesai',
            hint: 'Sebuah transaksi final ketika ia tidak lagi bisa dibatalkan. Sebagian chain hanya membuatnya "sangat mungkin", itulah sebabnya Anda menunggu konfirmasi — blok yang baru diterima masih bisa digantikan, dan penggantian itu disebut reorg. Konsensus Arc membuat finalitas menjadi pasti dalam kurang dari satu detik, jadi tidak ada yang perlu ditunggu.',
            questions: [
                {
                    question: 'Apa arti finalitas?',
                    answers: [
                        'Transaksinya sudah masuk mempool',
                        'Transaksinya tidak lagi bisa dibatalkan',
                        'Biayanya sudah dibayar penuh'
                    ]
                },
                {
                    question: 'Mengapa orang menunggu konfirmasi di sebagian chain?',
                    answers: [
                        'Blok yang baru saja dibuat masih bisa digantikan',
                        'Jaringannya lambat meneruskan pembayaran',
                        'Dompetnya butuh waktu untuk sinkronisasi'
                    ]
                },
                {
                    question: 'Apa itu reorg?',
                    answers: [
                        'Dompet menyusun ulang token yang dipegangnya',
                        'Menulis ulang kontrak pintar yang sudah dideploy',
                        'Blok yang baru diterima digantikan oleh rantai yang berbeda'
                    ]
                }
            ]
        },
        keys: {
            title: 'Dompet, kunci, dan siapa yang boleh membelanjakan',
            hint: 'Dompet tidak menyimpan uang — ia menyimpan kunci yang mengizinkan uang itu dipindahkan, dan siapa pun yang memegang kuncinya memegang dananya. Itu sebabnya tidak ada meja bantuan yang jujur akan meminta frasa pemulihan Anda, dan sebabnya kustodian serius memecah kunci di antara beberapa pihak agar tidak ada satu pihak pun yang bisa menandatangani sendirian.',
            questions: [
                {
                    question: 'Apa yang sebenarnya disimpan sebuah dompet?',
                    answers: [
                        'Koinnya sendiri',
                        'Salinan pribadi dari blockchain',
                        'Kunci yang mengizinkan pembelanjaan'
                    ]
                },
                {
                    question: 'Seseorang dari "dukungan" meminta frasa pemulihan Anda. Apa yang sedang terjadi?',
                    answers: [
                        'Upaya untuk mengambil dana Anda',
                        'Pemeriksaan identitas rutin',
                        'Migrasi dompet yang standar'
                    ]
                },
                {
                    question: 'Apa gunanya memecah kunci penanda tangan di antara dua pihak?',
                    answers: [
                        'Biaya pengiriman transaksi jadi lebih murah',
                        'Tidak ada pihak yang bisa memindahkan dana sendirian',
                        'Saldonya diasuransikan dua kali lipat'
                    ]
                }
            ]
        },
        agents: {
            title: 'Program yang membayar sendiri',
            hint: 'Agen adalah program dengan anggaran. Ia membayar sambil bekerja — sebuah pencarian, sebuah umpan data, sebuah panggilan ke model — dalam jumlah yang jauh terlalu kecil untuk kartu, di mana biaya tetap beberapa sen akan lebih mahal daripada barang yang dibeli. Yang menjaganya tetap aman bukan kepercayaan, melainkan batas belanja yang ditandatangani pemiliknya.',
            questions: [
                {
                    question: 'Apa yang membuat pembayaran agen berbeda dari pembayaran kartu?',
                    answers: [
                        'Nominalnya sangat kecil dan tidak ada orang di meja kasir',
                        'Pembayarannya bisa dibatalkan kapan saja',
                        'Pembayarannya harus disetujui di kantor cabang bank'
                    ]
                },
                {
                    question: 'Apa yang mencegah agen membelanjakan semua yang bisa dijangkaunya?',
                    answers: [
                        'Tidak ada — agen memang harus dipercaya',
                        'Telepon harian dari bank',
                        'Batas belanja yang disetujui pemiliknya'
                    ]
                },
                {
                    question: 'Mengapa pembayaran antarmesin butuh biaya sekecil pecahan sen?',
                    answers: [
                        'Jaringan menagih program lebih mahal daripada manusia',
                        'Biaya yang lebih besar dari pembayarannya membuat transaksi itu sia-sia',
                        'Mesin mengirim jauh lebih banyak transaksi daripada manusia'
                    ]
                }
            ]
        },
        crosschain: {
            title: 'Uang yang harus berpindah chain',
            hint: 'Chain tidak berbagi satu buku besar, jadi sebuah token tidak bisa begitu saja berpindah di antaranya. Jawaban lama adalah menguncinya di satu chain dan menerbitkan salinan — token terbungkus — di chain lain, menyisakan kolam dana terkunci yang menjadi sasaran peretasan terbesar di kripto. Transfer asli membakar di satu sisi dan mencetak di sisi lain, jadi tidak ada kolam yang bisa dicuri.',
            questions: [
                {
                    question: 'Apa itu token terbungkus (wrapped token)?',
                    answers: [
                        'Token yang dikunci di satu chain dan diwakili salinannya di chain lain',
                        'Token yang biayanya sudah termasuk dalam transfer',
                        'Token yang nominalnya disembunyikan dari publik'
                    ]
                },
                {
                    question: 'Mengapa bakar-dan-cetak lebih aman daripada jembatan kunci-dan-bungkus?',
                    answers: [
                        'Lebih cepat diprogram',
                        'Validator menyetujui setiap transfer secara manual',
                        'Tidak ada kolam dana terkunci yang bisa dicuri'
                    ]
                },
                {
                    question: 'Anda mengirim USDC ke alamat di chain yang salah. Apa hasil yang paling mungkin?',
                    answers: [
                        'Jaringan mengalihkannya ke chain yang benar',
                        'Dananya bisa hilang selamanya',
                        'Dananya kembali sendiri setelah beberapa blok'
                    ]
                }
            ]
        },
        transparency: {
            title: 'Bukti tanpa penonton',
            hint: 'Dua hal harus berlaku sekaligus. Cadangan harus bisa dibuktikan, sehingga firma akuntansi independen menerbitkan atestasi bulanan yang memastikan cadangan menutupi seluruh token yang beredar. Dan sebuah bisnis tidak bisa membiarkan pesaing membaca fakturnya, sehingga transfer rahasia menyembunyikan nominal dari publik sambil tetap bisa diungkap kepada auditor.',
            questions: [
                {
                    question: 'Apa yang dipastikan oleh laporan atestasi bulanan?',
                    answers: [
                        'Bahwa cadangan menutupi token yang beredar',
                        'Ke mana arah harga token',
                        'Siapa saja pemegang terbesarnya'
                    ]
                },
                {
                    question: 'Siapa yang menyusun atestasi?',
                    answers: [
                        'Tim keuangan penerbit itu sendiri',
                        'Firma akuntansi independen',
                        'Blockchain, secara otomatis'
                    ]
                },
                {
                    question: 'Apa yang disembunyikan transfer rahasia di Arc?',
                    answers: [
                        'Segalanya — tidak ada catatan yang disimpan sama sekali',
                        'Hanya identitas pengirimnya',
                        'Nominalnya, yang tetap bisa diungkap kepada auditor'
                    ]
                }
            ]
        },
        network: {
            title: 'Jaringan macam apa Arc itu',
            hint: 'Arc adalah Layer-1: ia menyelesaikan setelmen bloknya sendiri alih-alih mengirimkannya ke chain milik orang lain. Ia kompatibel dengan EVM, jadi kontrak dan perkakas yang ditulis untuk Ethereum berjalan tanpa perubahan. Mainnet publiknya dibuka pada September 2026, tetapi aplikasi masih berlatih di testnet — perangkat lunak sungguhan dengan uang yang tak bernilai, dan justru di situlah Anda ingin menemukan bugnya.',
            questions: [
                {
                    question: 'Apa arti kompatibel dengan EVM dalam praktik?',
                    answers: [
                        'Ia berbagi biaya dengan Ethereum',
                        'Kontrak dan perkakas yang dibuat untuk Ethereum berjalan di atasnya',
                        'Bloknya divalidasi oleh Ethereum'
                    ]
                },
                {
                    question: 'Untuk apa sebuah testnet?',
                    answers: [
                        'Menjalankan perangkat lunak sungguhan dengan uang yang tak bernilai',
                        'Melakukan transaksi nyata dengan lebih murah',
                        'Mencoba-coba kata sandi dompet dengan aman'
                    ]
                },
                {
                    question: 'Arc adalah Layer-1. Apa artinya?',
                    answers: [
                        'Ia adalah rilis pertama dari sebuah jaringan Layer-2',
                        'Ia hanya mendukung satu token',
                        'Ia menyelesaikan setelmen bloknya sendiri alih-alih mengirimkannya ke chain lain'
                    ]
                }
            ]
        }
    }
});
