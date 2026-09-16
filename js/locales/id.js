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
        audio: 'PENGATURAN AUDIO'
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
        tournamentHighlight: 'Di mode ini Anda punya 10 nyawa. Jawaban benar dalam kuis akan memulihkannya — dan jika semuanya habis, satu kuis terakhir masih bisa mengembalikan Anda ke permainan.'
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
        returnToMenu: 'Kembali ke Menu'
    },

    claim: {
        headline: 'Hadiah: {amount} USDC',
        remaining: 'Tersisa {count} hadiah di pool',

        stepWallet: 'Buktikan dompet',
        walletButton: 'Hubungkan & tanda tangan',
        stepX: 'Verifikasi dengan X',
        xButton: 'Masuk dengan X',
        stepSend: 'Terima hadiah',
        sendButton: 'Klaim',

        walletWaiting: 'Periksa dompet Anda: tanda tangan ini tidak dikenakan biaya dan tidak memindahkan apa pun.',
        walletRejected: 'Anda menolak tanda tangan. Tanpanya, kami tidak dapat memastikan dompet ini milik Anda.',
        walletFailed: 'Dompet tidak dapat diperiksa. Coba lagi.',

        xWaiting: 'Menunggu proses masuk X…',
        xVerified: 'Akun X terverifikasi.',
        xVerifiedAs: 'Terverifikasi sebagai @{handle}.',
        xCancelled: 'Proses masuk dibatalkan.',
        xNotPremium: 'Hadiah hanya diberikan untuk akun X Premium.',
        xTooNew: 'Akun X ini berumur kurang dari enam bulan.',
        xAgeUnknown: 'Umur akun X ini tidak dapat diperiksa.',
        xClaimed: 'Akun X ini sudah pernah mengklaim hadiah.',
        xFailed: 'X tidak dapat dihubungi. Coba lagi.',
        popupBlocked: 'Browser Anda memblokir jendela masuk. Izinkan pop-up dan coba lagi.',

        sending: 'Mengirim hadiah. Ini membutuhkan beberapa detik.',
        paid: '{amount} USDC sedang dalam perjalanan ke dompet Anda. Tidak perlu gas — sudah kami bayarkan.',
        sendFailed: 'Hadiah tidak dapat dikirim. Tidak ada yang dikeluarkan; coba lagi.',
        viewTransaction: 'Lihat transaksi',

        walletClaimed: 'Dompet ini sudah pernah mengklaim hadiah.',
        alreadyClaimed: 'Hadiah sudah pernah diklaim untuk akun ini.',
        ipLimit: 'Terlalu banyak hadiah telah diklaim dari koneksi ini.',
        poolEmpty: 'Pool hadiah sedang kosong. Anda tetap sudah menyelesaikan kursus ini.',
        paused: 'Hadiah sedang dijeda untuk saat ini.',
        needWallet: 'Buktikan dompet Anda terlebih dahulu.',
        needX: 'Verifikasi dengan X terlebih dahulu.',
        expired: 'Klaim ini sudah kedaluwarsa. Selesaikan permainan lagi untuk mengklaim.',
        quizNeeded: 'Hadiah memerlukan {needed} jawaban benar dari 20. Kamu punya {correct}. Mainkan lagi dan jawab pertanyaannya perlahan.',
        failed: 'Hadiah tidak dapat diklaim.'
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
        provingWallet: 'Periksa dompet Anda: tanda tangan membuktikan dompet itu milik Anda dan tidak memindahkan apa pun.',
        gettingSignature: 'Mengambil tanda tangan server...',
        submitting: 'Mengirim transaksi...',
        successTitle: '✅ Skor Difinalisasi!',
        successText: 'Skor Anda berhasil dicatat on-chain.',
        viewTx: 'Lihat Transaksi di Block Explorer',
        errorTitle: '❌ Kesalahan',
        close: 'Tutup',
        failed: 'Gagal memfinalisasi skor on-chain'
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
        leaderboardUnavailable: 'Papan peringkat tidak dapat dijangkau. Coba lagi sebentar lagi.'
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
        '1a': {
            question: 'Perusahaan mana yang berada di balik Arc?',
            answers: [
                'Tether, perusahaan penerbit USDT',
                'Coinbase, perusahaan pengelola Base',
                'Circle, perusahaan penerbit USDC'
            ]
        },
        '1b': {
            question: 'Arc dibangun khusus untuk apa?',
            answers: [
                'Marketplace NFT dan seni digital',
                'Perdagangan anonim antarpengguna',
                'Keuangan berbasis stablecoin'
            ]
        },
        '1c': {
            question: 'Di mana skor dan sertifikat game ini diselesaikan?',
            answers: [
                'Di mainnet Ethereum, lewat kontrak jembatan',
                'Di Arc Testnet, tempat bermain tidak memakan biaya',
                'Di mainnet Arc, dibayar dengan USDC sungguhan'
            ]
        },
        '2a': {
            question: 'Kira-kira berapa biaya rata-rata satu transaksi di Arc?',
            answers: [
                'Sekitar lima dolar',
                'Sekitar setengah sen',
                'Sekitar lima puluh sen'
            ]
        },
        '2b': {
            question: 'Dengan gas dibayar dalam USDC, apa yang bisa dilakukan orang?',
            answers: [
                'Mendapat bunga dari gas yang dibayar',
                'Menganggarkan biaya seperti biaya biasa',
                'Bebas biaya untuk transfer kecil'
            ]
        },
        '2c': {
            question: 'Apa yang dihindari Arc dengan menagih gas dalam USDC?',
            answers: [
                'Keharusan punya dompet untuk mengirim pembayaran',
                'Biaya dalam token yang harganya bergejolak',
                'Pencatatan transaksi di buku besar publik'
            ]
        },
        '3a': {
            question: 'Apa itu Malachite?',
            answers: [
                'Implementasi Tendermint BFT dalam Rust',
                'Algoritme penambangan proof-of-work untuk Arc',
                'Block explorer yang dijalankan Circle untuk Arc'
            ]
        },
        '3b': {
            question: 'Lapisan eksekusi apa yang dipakai Arc?',
            answers: [
                'Runtime Solana',
                'Geth',
                'Reth'
            ]
        },
        '3c': {
            question: 'Di Arc, kapan blok yang sudah dikomit menjadi final?',
            answers: [
                'Seketika, tanpa perlu menunggu konfirmasi',
                'Setelah masa sanggah satu jam berlalu',
                'Setelah enam konfirmasi, seperti di Bitcoin'
            ]
        },
        '4a': {
            question: 'Apakah ARC token untuk membayar gas di Arc?',
            answers: [
                'Hanya untuk pembayaran besar',
                'Ya, sejak mainnet dibuka',
                'Tidak, gas tetap dibayar dengan USDC'
            ]
        },
        '4b': {
            question: 'Apakah mainnet Arc diluncurkan bersama token ARC?',
            answers: [
                'Ya, pada hari yang sama',
                'Ya, khusus untuk validator',
                'Tidak, ARC belum diluncurkan'
            ]
        },
        '4c': {
            question: 'Menurut rancangan ARC, ke mana biaya yang dikonversi menjadi ARC disalurkan?',
            answers: [
                'Ke validator dan staker, dengan sebagian dibakar',
                'Ke pemegang saham Circle sebagai dividen kuartalan',
                'Kembali ke pengguna yang mengirim transaksinya'
            ]
        },
        '5a': {
            question: "Apa yang dimaksud dengan 'ekonomi agentik'?",
            answers: [
                'Bank yang mengganti staf back-office dengan perangkat lunak akuntansi',
                'Orang yang menyewa agen manusia untuk memperdagangkan kripto bagi mereka',
                'Agen AI yang membayar sendiri komputasi, data, dan layanan'
            ]
        },
        '5b': {
            question: 'Seberapa kecil nominal pembayaran agen yang dibutuhkan?',
            answers: [
                'Minimal satu dolar',
                'Di bawah satu sen',
                'Sepuluh dolar atau lebih'
            ]
        },
        '5c': {
            question: 'Standar terbuka mana yang disebut untuk menyelesaikan pembayaran agen?',
            answers: [
                'x402',
                'SWIFT MT103',
                'ERC-721'
            ]
        },
        '6a': {
            question: 'Kode status HTTP mana yang dihidupkan kembali oleh x402?',
            answers: [
                '404 Not Found',
                '402 Payment Required',
                '500 Internal Server Error'
            ]
        },
        '6b': {
            question: 'Dalam alur x402, siapa yang memverifikasi pembayaran on-chain?',
            answers: [
                'Server',
                'Klien',
                'Fasilitator'
            ]
        },
        '6c': {
            question: 'Apa yang dilakukan klien x402 setelah membayar?',
            answers: [
                'Mengulang permintaan awalnya',
                'Membuka akun di server',
                'Menunggu tanda terima lewat email'
            ]
        },
        '7a': {
            question: 'Berapa biasanya biaya jaringan kartu per transaksi?',
            answers: [
                'Beberapa sen ditambah persentase',
                'Biaya bulanan yang tetap',
                'Gratis di bawah satu dolar'
            ]
        },
        '7b': {
            question: 'Apa masalahnya jika kartu dipakai untuk menagih satu sen?',
            answers: [
                'Uangnya baru tiba sebulan kemudian',
                'Kartunya dibekukan karena dicurigai penipuan',
                'Biaya menagihnya lebih mahal daripada hasilnya'
            ]
        },
        '7c': {
            question: 'Apa yang membuat harga bayar-per-panggilan menjadi mungkin?',
            answers: [
                'Transfer yang dihargai dalam pecahan sen',
                'Faktur bulanan yang dikirim lewat email',
                'Batas kredit yang ditetapkan penerbit kartu'
            ]
        },
        '8a': {
            question: 'Bagaimana dompet terprogram Circle melindungi kunci penanda tangan?',
            answers: [
                'Kunci dipecah di antara beberapa pihak dengan MPC',
                'Kunci dikirim lewat email ke pemilik agen',
                'Kunci dicetak dan disimpan di brankas bank'
            ]
        },
        '8b': {
            question: 'Apa yang menentukan batas belanja sebuah agen?',
            answers: [
                'Penilaian agen itu sendiri',
                'Plafon harian dari jaringan',
                'Batas yang ditandatangani pemiliknya'
            ]
        },
        '8c': {
            question: 'Apakah agen pernah memegang kunci privat dompetnya?',
            answers: [
                'Ya, setelah dipercaya',
                'Hanya saat membayar',
                'Tidak, tidak pernah'
            ]
        },
        '9a': {
            question: 'Apa yang dilakukan CCTP terhadap USDC di chain asal?',
            answers: [
                'Membakarnya',
                'Menguncinya',
                'Menyalinnya'
            ]
        },
        '9b': {
            question: 'Apa yang diberikan Circle Gateway kepada agen?',
            answers: [
                'Satu saldo di semua chain',
                'Dompet terpisah di setiap chain',
                'Jalur kredit di bank Circle'
            ]
        },
        '9c': {
            question: 'Mengapa CCTP tidak memerlukan token jembatan yang harus dipercaya?',
            answers: [
                'USDC hanya pernah ada di satu chain',
                'Setiap token terbungkus diasuransikan jembatan',
                'USDC asli dicetak di chain tujuan'
            ]
        },
        '10a': {
            question: 'Dalam bentuk apa cadangan USDC disimpan?',
            answers: [
                'Bitcoin, ether, dan aset kripto lainnya',
                'Saham Circle dan perusahaan mitranya',
                'Kas dan surat utang AS bertenor pendek'
            ]
        },
        '10b': {
            question: 'Seberapa sering atestasi cadangan diterbitkan?',
            answers: [
                'Setiap dekade',
                'Setiap tahun',
                'Setiap bulan'
            ]
        },
        '10c': {
            question: 'Cadangan USDC disimpan terpisah dari uang milik siapa?',
            answers: [
                'Departemen Keuangan AS',
                'Para validator',
                'Circle sendiri'
            ]
        },
        '11a': {
            question: 'Apa yang terjadi pada USDC saat ditebus lewat Circle Mint?',
            answers: [
                'Dibekukan sampai hari kerja berikutnya',
                'Diteruskan ke pembeli berikutnya dalam antrean',
                'Dibakar sementara dolarnya keluar'
            ]
        },
        '11b': {
            question: 'Kapan USDC bisa dicetak dan ditebus?',
            answers: [
                'Hanya pada jam kerja bank AS',
                'Sepanjang waktu, setiap hari',
                'Seminggu sekali, secara berkelompok'
            ]
        },
        '11c': {
            question: 'Sebuah bisnis mentransfer $1.000 ke Circle Mint. Berapa USDC yang dicetak?',
            answers: [
                'Tepat 1.000 USDC',
                'Ditentukan oleh pasar',
                'Sekitar 990 USDC'
            ]
        },
        '12a': {
            question: 'Mata uang apa yang diikuti EURC?',
            answers: [
                'Euro',
                'Yen',
                'Pound'
            ]
        },
        '12b': {
            question: 'Apa yang mendukung EURC?',
            answers: [
                'Sekeranjang saham bank Eropa',
                'Model cadangan yang sama dengan USDC',
                'Algoritme yang menyesuaikan pasokannya'
            ]
        },
        '12c': {
            question: 'Mengapa Arc dirancang untuk beberapa mata uang sekaligus?',
            answers: [
                'Biaya dalam dolar terlalu mahal bagi siapa pun di luar AS',
                'Jaringan satu mata uang berhenti di perbatasan pertama',
                'Regulator mewajibkan setiap chain membawa tiga mata uang'
            ]
        },
        '13a': {
            question: 'Di mana mesin FX Arc menghasilkan kutipan harganya?',
            answers: [
                'Di dalam chain',
                'Di dalam dompet',
                'Di luar chain'
            ]
        },
        '13b': {
            question: 'Mengapa pertukaran mata uang biasa sering bermasalah?',
            answers: [
                'Satu pihak mengirim dan terekspos selagi menunggu',
                'Kurs dipatok tetap selama setahun penuh',
                'Kedua pihak harus memegang mata uang yang sama dulu'
            ]
        },
        '13c': {
            question: 'Jika satu kaki pertukaran FX di Arc tidak bisa diselesaikan, apa yang terjadi pada kaki lainnya?',
            answers: [
                'Menunggu dalam antrean selama seminggu',
                'Kaki itu juga tidak terjadi sama sekali',
                'Diselesaikan sekarang dan dikembalikan nanti'
            ]
        },
        '14a': {
            question: 'Apakah transfer rahasia di Arc dipakai untuk setiap transaksi?',
            answers: [
                'Ya, setiap transfer bersifat privat',
                'Tidak, sifatnya opsional',
                'Hanya untuk transfer di atas $10.000'
            ]
        },
        '14b': {
            question: 'Dalam transfer rahasia, apa yang tetap terlihat?',
            answers: [
                'Alamatnya',
                'Tidak ada sama sekali',
                'Nominalnya'
            ]
        },
        '14c': {
            question: 'Siapa yang bisa melihat detail transfer rahasia bila diperlukan?',
            answers: [
                'Pesaing mana pun yang mau membayar sedikit biaya',
                'Auditor atau regulator yang diberi tahu para pihak',
                'Tidak seorang pun, bahkan kedua pihak yang terlibat'
            ]
        },
        '15a': {
            question: 'Manakah yang termasuk validator pendiri Arc?',
            answers: [
                'Binance',
                'Mastercard',
                'OpenAI'
            ]
        },
        '15b': {
            question: 'Apa tugas validator di Arc?',
            answers: [
                'Menetapkan harga USDC',
                'Menyetujui akun pengguna baru',
                'Mengurutkan transaksi'
            ]
        },
        '15c': {
            question: 'Apa rencana untuk himpunan validator Arc ke depannya?',
            answers: [
                'Menyerahkannya ke satu perusahaan',
                'Beralih ke staking terbuka',
                'Mengganti validator dengan penambang'
            ]
        },
        '16a': {
            question: 'Mengapa transfer bank yang dikirim hari Jumat bisa menganggur sampai Senin?',
            answers: [
                'Bank menyelesaikan transfer hanya sebulan sekali',
                'Bank koresponden punya batas waktu operasional',
                'Setiap transfer harus disetujui pengadilan'
            ]
        },
        '16b': {
            question: 'Kapan transfer stablecoin bisa diselesaikan?',
            answers: [
                'Kapan saja, termasuk akhir pekan',
                'Hanya pada jam kerja bank',
                'Hanya pada hari kerja'
            ]
        },
        '16c': {
            question: 'Apa yang diketahui pengirim stablecoin sebelum mengirim?',
            answers: [
                'Biaya yang akan dibayarnya',
                'Kurs tukar untuk besok',
                'Saldo rekening penerima'
            ]
        },
        '17a': {
            question: 'Kapan testnet Arc mulai berjalan?',
            answers: [
                'September 2026',
                'Oktober 2025',
                'Maret 2024'
            ]
        },
        '17b': {
            question: 'Apa yang ada di antara testnet Arc dan peluncuran publiknya?',
            answers: [
                'Kampanye airdrop token',
                'Testnet kedua yang berbayar',
                'Mainnet privat'
            ]
        },
        '17c': {
            question: 'Kira-kira berapa banyak pembangun yang terlibat di mainnet privat Arc?',
            answers: [
                'Sekitar sepuluh',
                'Lebih dari seratus',
                'Lebih dari sejuta'
            ]
        },
        '18a': {
            question: 'Bisakah meja bantuan membatalkan transfer tuntas yang terkirim ke alamat yang salah?',
            answers: [
                'Tidak, tak bisa ditarik kembali',
                'Ya, dalam tiga puluh hari',
                'Ya, dengan bukti kesalahannya'
            ]
        },
        '18b': {
            question: 'Apa yang membuat kesalahan pada transfer yang sudah tuntas menjadi permanen?',
            answers: [
                'Finalitas yang sama yang membuat setelmen cepat',
                'Aturan yang ditetapkan tiap aplikasi dompet',
                'Penundaan yang ditambahkan jaringan pada transfer besar'
            ]
        },
        '18c': {
            question: 'Mengapa batas belanja dan jaringan uji itu ada?',
            answers: [
                'Agar Anda memeriksa sebelumnya, karena tidak ada sesudahnya',
                'Agar transfer bisa lebih murah bagi semua orang',
                'Agar nominal transfer bisa disembunyikan dari publik'
            ]
        },
        '19a': {
            question: 'Manakah yang masih di depan bagi Arc?',
            answers: [
                'USDC sebagai gas',
                'Token ARC',
                'Finalitas cepat'
            ]
        },
        '19b': {
            question: 'Peralihan apa yang hendak diwujudkan ARC?',
            answers: [
                'Dari Proof-of-Stake ke Proof-of-Work',
                'Dari Proof-of-Authority ke Proof-of-Stake',
                'Dari jaringan Layer-1 ke Layer-2'
            ]
        },
        '19c': {
            question: 'Dengan apa mainnet publik Arc diluncurkan?',
            answers: [
                'Gas ARC dan staking terbuka penuh sejak hari pertama',
                'Penambangan proof-of-work dan gas dibayar dengan ETH',
                'Gas USDC dan himpunan validator pendiri yang berizin'
            ]
        },
        '20a': {
            question: 'Menurut game ini, kapan sebuah pembayaran selesai?',
            answers: [
                'Ketika dikirim',
                'Ketika sudah final',
                'Ketika penerima melihatnya'
            ]
        },
        '20b': {
            question: 'Apa itu setelmen?',
            answers: [
                'Saat pembayaran ditandatangani pengirim',
                'Saat jaringan mengutip biayanya',
                'Saat pembayaran tidak lagi bisa dibatalkan'
            ]
        },
        '20c': {
            question: 'Apa yang membuat setelmen di Arc tiba dalam kecepatan mesin?',
            answers: [
                'Gas stablecoin dan finalitas deterministik di bawah satu detik',
                'Blok lebih besar dan waktu tunggu konfirmasi lebih lama',
                'Jaringan kartu yang terhubung langsung ke chain'
            ]
        }
    },

    rescueTopics: {
        stablecoin: {
            title: 'Apa sebenarnya stablecoin itu',
            hint: 'Stablecoin adalah token yang mewakili uang yang benar-benar dipegang seseorang. USDC bisa ditebus satu banding satu: serahkan kembali sebuah token kepada penerbitnya dan Anda mendapat satu dolar. Janji itulah — bukan perdagangan — yang menjaga harganya tetap satu dolar, dan itu pula sebabnya memegang USDC adalah klaim atas satu dolar, bukan kepemilikan saham perusahaan penerbitnya.',
            questions: [
                {
                    question: 'Apa yang diwakili sebuah stablecoin?',
                    answers: [
                        'Uang yang benar-benar dipegang seseorang',
                        'Daya komputasi di sebuah jaringan',
                        'Saham di sebuah perusahaan teknologi'
                    ]
                },
                {
                    question: 'Untuk menukar USDC kembali menjadi dolar, kepada siapa Anda menyerahkannya?',
                    answers: [
                        'Validator mana pun',
                        'Sebuah bursa',
                        'Penerbit token itu'
                    ]
                },
                {
                    question: 'Apa yang menjaga harga USDC tetap satu dolar?',
                    answers: [
                        'Volume perdagangan tinggi setiap hari',
                        'Pemungutan suara harian semua pemegang',
                        'Janji penebusan satu banding satu'
                    ]
                },
                {
                    question: 'Memegang USDC memberi Anda klaim atas apa?',
                    answers: [
                        'Saham',
                        'Laba',
                        'Satu dolar'
                    ]
                },
                {
                    question: 'Berapa dolar yang Anda terima saat menebus satu USDC?',
                    answers: [
                        'Tepat satu dolar',
                        'Satu, dikurangi biaya',
                        'Harga terakhirnya'
                    ]
                }
            ]
        },
        gas: {
            title: 'Gas, dan mengapa mata uangnya penting',
            hint: 'Gas adalah biaya yang dikenakan jaringan untuk memproses transaksi Anda. Di sebagian besar chain, gas dibayar dengan token yang bergejolak, sehingga biayanya dalam dolar berubah selagi Anda menimbang keputusan. Arc menagih gas dalam USDC, yang mengubah biaya tak terduga menjadi pos pengeluaran biasa — sekitar setengah sen per transaksi.',
            questions: [
                {
                    question: 'Siapa yang mengenakan gas?',
                    answers: [
                        'Jaringan yang memproses transaksi',
                        'Orang yang menerima pembayaran',
                        'Toko yang menyediakan aplikasi dompet'
                    ]
                },
                {
                    question: 'Di sebagian besar chain, apa yang terjadi pada biaya gas dalam dolar selagi Anda menimbang keputusan?',
                    answers: [
                        'Berubah mengikuti harga token',
                        'Turun ke nol dalam semalam',
                        'Dikunci selama satu jam'
                    ]
                },
                {
                    question: 'Arc menagih gas dalam apa?',
                    answers: [
                        'ARC',
                        'ETH',
                        'USDC'
                    ]
                },
                {
                    question: 'Kira-kira berapa biaya gas per transaksi di Arc?',
                    answers: [
                        'Sekitar lima puluh sen',
                        'Sekitar lima sen',
                        'Sekitar setengah sen'
                    ]
                },
                {
                    question: 'Gas dalam USDC mengubah biaya tak terduga menjadi apa?',
                    answers: [
                        'Aset yang bisa diperdagangkan',
                        'Pos pengeluaran biasa',
                        'Potongan pajak'
                    ]
                }
            ]
        },
        finality: {
            title: 'Kapan sebuah pembayaran benar-benar selesai',
            hint: 'Sebuah transaksi final ketika ia tidak lagi bisa dibatalkan. Sebagian chain hanya membuatnya "sangat mungkin", itulah sebabnya Anda menunggu konfirmasi — blok yang baru diterima masih bisa digantikan, dan penggantian itu disebut reorg. Konsensus Arc membuat finalitas menjadi pasti dalam kurang dari satu detik, jadi tidak ada yang perlu ditunggu.',
            questions: [
                {
                    question: 'Kapan sebuah transaksi final?',
                    answers: [
                        'Ketika tidak lagi bisa dibatalkan',
                        'Ketika dompet menampilkannya',
                        'Ketika biayanya sudah dibayar'
                    ]
                },
                {
                    question: 'Di chain yang finalitasnya hanya "sangat mungkin", apa yang ditunggu pengguna?',
                    answers: [
                        'Laporan harian',
                        'Tiket dukungan',
                        'Konfirmasi tambahan'
                    ]
                },
                {
                    question: 'Apa sebutan untuk blok yang baru diterima lalu digantikan?',
                    answers: [
                        'Rollback',
                        'Fork',
                        'Reorg'
                    ]
                },
                {
                    question: 'Berapa lama Arc membuat finalitas menjadi pasti?',
                    answers: [
                        'Sekitar sepuluh menit',
                        'Kurang dari satu detik',
                        'Sekitar satu jam'
                    ]
                },
                {
                    question: 'Di Arc, berapa konfirmasi yang harus Anda tunggu?',
                    answers: [
                        'Tiga puluh',
                        'Enam',
                        'Tidak ada'
                    ]
                }
            ]
        },
        keys: {
            title: 'Dompet, kunci, dan siapa yang boleh membelanjakan',
            hint: 'Dompet tidak menyimpan uang — ia menyimpan kunci yang mengizinkan uang itu dipindahkan, dan siapa pun yang memegang kuncinya memegang dananya. Itu sebabnya tidak ada meja bantuan yang jujur akan meminta frasa pemulihan Anda, dan sebabnya kustodian serius memecah kunci di antara beberapa pihak agar tidak ada satu pihak pun yang bisa menandatangani sendirian.',
            questions: [
                {
                    question: 'Siapa yang menguasai dana di sebuah dompet?',
                    answers: [
                        'Siapa pun yang memegang kuncinya',
                        'Bank yang memverifikasi pengguna',
                        'Siapa pun yang membuat aplikasi dompetnya'
                    ]
                },
                {
                    question: 'Manakah yang benar tentang dompet?',
                    answers: [
                        'Menyimpan salinan seluruh blockchain',
                        'Menyimpan koin dalam file lokal',
                        'Menyimpan kunci, bukan uangnya'
                    ]
                },
                {
                    question: 'Siapa yang akan meminta frasa pemulihan Anda?',
                    answers: [
                        'Tidak ada meja bantuan yang jujur',
                        'Para validator di jaringan Arc',
                        'Tim dukungan resmi dompet Anda'
                    ]
                },
                {
                    question: 'Pada kustodian serius, bisakah satu pihak menandatangani sendirian?',
                    answers: [
                        'Tidak, kuncinya dipecah agar tak ada yang bisa',
                        'Ya, setelah masa tunggu yang singkat',
                        'Ya, pihak yang lebih besar selalu bisa'
                    ]
                },
                {
                    question: 'Kunci di dalam dompet mengizinkan apa?',
                    answers: [
                        'Melihat saldo',
                        'Memindahkan dana',
                        'Mengubah biaya jaringan'
                    ]
                }
            ]
        },
        agents: {
            title: 'Program yang membayar sendiri',
            hint: 'Agen adalah program dengan anggaran. Ia membayar sambil bekerja — sebuah pencarian, sebuah umpan data, sebuah panggilan ke model — dalam jumlah yang jauh terlalu kecil untuk kartu, di mana biaya tetap beberapa sen akan lebih mahal daripada barang yang dibeli. Yang menjaganya tetap aman bukan kepercayaan, melainkan batas belanja yang ditandatangani pemiliknya.',
            questions: [
                {
                    question: 'Dalam konteks ini, apa itu agen?',
                    answers: [
                        'Program dengan anggaran',
                        'Pialang manusia yang bekerja untuk Anda',
                        'Bot layanan pelanggan milik bank'
                    ]
                },
                {
                    question: 'Manakah yang mungkin dibayar agen sambil bekerja?',
                    answers: [
                        'Panggilan ke model',
                        'Kredit rumah',
                        'Gaji bulanan'
                    ]
                },
                {
                    question: 'Mengapa agen tidak bisa membayar satu pencarian dengan kartu?',
                    answers: [
                        'Biaya beberapa sen lebih mahal daripada pencariannya',
                        'Kartu tidak bisa dipakai membayar apa pun secara online',
                        'Pencarian selalu gratis untuk dijalankan perangkat lunak'
                    ]
                },
                {
                    question: 'Siapa yang menandatangani batas belanja tempat agen bekerja?',
                    answers: [
                        'Para validator',
                        'Pemilik agen',
                        'Agen itu sendiri'
                    ]
                },
                {
                    question: 'Kapan agen membayar?',
                    answers: [
                        'Sambil bekerja',
                        'Hanya saat pemiliknya online',
                        'Setahun sekali, di muka'
                    ]
                }
            ]
        },
        crosschain: {
            title: 'Uang yang harus berpindah chain',
            hint: 'Chain tidak berbagi satu buku besar, jadi sebuah token tidak bisa begitu saja berpindah di antaranya. Jawaban lama adalah menguncinya di satu chain dan menerbitkan salinan — token terbungkus — di chain lain, menyisakan kolam dana terkunci yang menjadi sasaran peretasan terbesar di kripto. Transfer asli membakar di satu sisi dan mencetak di sisi lain, jadi tidak ada kolam yang bisa dicuri.',
            questions: [
                {
                    question: 'Mengapa token tidak bisa begitu saja berpindah antar-chain?',
                    answers: [
                        'Setiap chain melarang token asing',
                        'Chain tidak berbagi satu buku besar',
                        'Token terlalu besar untuk dipindahkan'
                    ]
                },
                {
                    question: 'Apa yang ditinggalkan cara lama kunci-dan-salin?',
                    answers: [
                        'Biaya permanen pada setiap transfer',
                        'Kolam berisi dana yang terkunci',
                        'Salinan kedua dari seluruh chain'
                    ]
                },
                {
                    question: 'Kolam dana jembatan yang terkunci telah menarik apa?',
                    answers: [
                        'Peretasan terbesar di kripto',
                        'Asuransi simpanan dari pemerintah',
                        'Imbal hasil staking tertinggi'
                    ]
                },
                {
                    question: 'Apa yang dilakukan transfer asli di chain tujuan?',
                    answers: [
                        'Membakar token',
                        'Mencetak token',
                        'Mengunci token'
                    ]
                },
                {
                    question: 'Mengapa tidak ada yang bisa dicuri dalam transfer asli?',
                    answers: [
                        'Tidak ada kolam dana terkunci',
                        'Nominalnya dienkripsi',
                        'Setiap transfer diasuransikan'
                    ]
                }
            ]
        },
        transparency: {
            title: 'Bukti tanpa penonton',
            hint: 'Dua hal harus berlaku sekaligus. Cadangan harus bisa dibuktikan, sehingga firma akuntansi independen menerbitkan atestasi bulanan yang memastikan cadangan menutupi seluruh token yang beredar. Dan sebuah bisnis tidak bisa membiarkan pesaing membaca fakturnya, sehingga transfer rahasia menyembunyikan nominal dari publik sambil tetap bisa diungkap kepada auditor.',
            questions: [
                {
                    question: 'Siapa yang menerbitkan atestasi cadangan?',
                    answers: [
                        'Tim pemasaran Circle sendiri',
                        'Firma akuntansi independen',
                        'Para validator jaringan Arc'
                    ]
                },
                {
                    question: 'Seberapa sering atestasi cadangan terbit?',
                    answers: [
                        'Setiap lima tahun',
                        'Setiap bulan',
                        'Tidak pernah'
                    ]
                },
                {
                    question: 'Masalah apa yang diselesaikan transfer rahasia bagi sebuah bisnis?',
                    answers: [
                        'Biaya gas yang terlalu tinggi',
                        'Pelanggan yang telat membayar tagihan',
                        'Pesaing yang membaca fakturnya'
                    ]
                },
                {
                    question: 'Transfer rahasia menyembunyikan nominal dari siapa?',
                    answers: [
                        'Auditor',
                        'Publik',
                        'Pengirim'
                    ]
                },
                {
                    question: 'Bisakah auditor tetap melihat detail transfer rahasia?',
                    answers: [
                        'Tidak, nominalnya hilang selamanya',
                        'Ya, detailnya tetap bisa diungkap kepada auditor',
                        'Hanya jika jaringan memilih untuk mengizinkannya'
                    ]
                }
            ]
        },
        network: {
            title: 'Jaringan macam apa Arc itu',
            hint: 'Arc adalah Layer-1: ia menyelesaikan setelmen bloknya sendiri alih-alih mengirimkannya ke chain milik orang lain. Ia kompatibel dengan EVM, jadi kontrak dan perkakas yang ditulis untuk Ethereum berjalan tanpa perubahan. Mainnet publiknya dibuka pada September 2026, tetapi aplikasi masih berlatih di testnet — perangkat lunak sungguhan dengan uang yang tak bernilai, dan justru di situlah Anda ingin menemukan bugnya.',
            questions: [
                {
                    question: 'Apakah Arc mengirimkan bloknya ke chain lain?',
                    answers: [
                        'Ya, ia mengirimkannya ke Ethereum',
                        'Tidak, ia menyelesaikan bloknya sendiri',
                        'Ya, ia mengirimkannya ke Bitcoin'
                    ]
                },
                {
                    question: 'Apakah kontrak Ethereum perlu ditulis ulang agar berjalan di Arc?',
                    answers: [
                        'Ya, ke dalam bahasa khusus Arc',
                        'Tidak, berjalan tanpa perubahan',
                        'Ya, harus di-porting ke Rust'
                    ]
                },
                {
                    question: 'Kapan mainnet publik Arc dibuka?',
                    answers: [
                        'Januari 2025',
                        'Belum dibuka',
                        'September 2026'
                    ]
                },
                {
                    question: 'Di mana aplikasi berlatih sebelum aktif di Arc?',
                    answers: [
                        'Di mainnet',
                        'Tidak di mana pun',
                        'Di testnet'
                    ]
                },
                {
                    question: 'Apa yang membuat testnet tempat yang tepat untuk menemukan bug?',
                    answers: [
                        'Tidak ada validator sama sekali',
                        'Perangkat lunaknya sama sekali berbeda',
                        'Uang di dalamnya tak bernilai'
                    ]
                }
            ]
        }
    }
});
