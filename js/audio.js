// Audio Manager Module
const AudioManager = {
    menuMusic: null,
    gameplayMusic: null,
    editorMusic: null,
    launchSound: null,
    gateSound: null,
    settlementSound: null,
    missSound: null,
    musicVolume: 0.3,
    soundVolume: 0.5,
    audioUnlocked: false,
    
    init: function() {
        // Initialize audio objects (paths to be configured)
        // Music tracks (loop enabled)
        this.menuMusic = new Audio();
        this.menuMusic.loop = true;
        this.menuMusic.volume = this.musicVolume;
        this.menuMusic.src = 'audio/menu-music.mp3';
        
        // Set up seamless looping for menu music
        // Detect when we're very close to the end and restart immediately to avoid gap
        this.menuMusic.addEventListener('timeupdate', () => {
            if (this.menuMusic.duration && !this.menuMusic.paused && this.menuMusic.currentTime > 0) {
                const timeRemaining = this.menuMusic.duration - this.menuMusic.currentTime;
                // If we're within 0.03 seconds of the end, restart immediately for seamless loop
                if (timeRemaining > 0 && timeRemaining < 0.03) {
                    this.menuMusic.currentTime = 0;
                }
            }
        });
        
        // Fallback: if ended event fires, restart immediately
        this.menuMusic.addEventListener('ended', () => {
            this.menuMusic.currentTime = 0;
            this.menuMusic.play().catch(() => {});
        });
        
        this.gameplayMusic = new Audio();
        this.gameplayMusic.loop = true;
        this.gameplayMusic.volume = this.musicVolume;
        this.gameplayMusic.src = 'audio/gameplay-music.mp3';
        
        // Set up seamless looping for gameplay music
        this.gameplayMusic.addEventListener('timeupdate', () => {
            if (this.gameplayMusic.duration && !this.gameplayMusic.paused && this.gameplayMusic.currentTime > 0) {
                const timeRemaining = this.gameplayMusic.duration - this.gameplayMusic.currentTime;
                if (timeRemaining > 0 && timeRemaining < 0.03) {
                    this.gameplayMusic.currentTime = 0;
                }
            }
        });
        
        this.gameplayMusic.addEventListener('ended', () => {
            this.gameplayMusic.currentTime = 0;
            this.gameplayMusic.play().catch(() => {});
        });
        
        this.editorMusic = new Audio();
        this.editorMusic.loop = true;
        this.editorMusic.volume = this.musicVolume;
        this.editorMusic.src = 'audio/editor-music.mp3';
        
        // Set up seamless looping for editor music
        this.editorMusic.addEventListener('timeupdate', () => {
            if (this.editorMusic.duration && !this.editorMusic.paused && this.editorMusic.currentTime > 0) {
                const timeRemaining = this.editorMusic.duration - this.editorMusic.currentTime;
                if (timeRemaining > 0 && timeRemaining < 0.03) {
                    this.editorMusic.currentTime = 0;
                }
            }
        });
        
        this.editorMusic.addEventListener('ended', () => {
            this.editorMusic.currentTime = 0;
            this.editorMusic.play().catch(() => {});
        });
        
        // Sound effects
        this.launchSound = new Audio();
        this.launchSound.volume = this.soundVolume;
        this.launchSound.src = 'audio/launch.mp3';
        
        this.gateSound = new Audio();
        this.gateSound.volume = this.soundVolume;
        this.gateSound.src = 'audio/gate.mp3';
        
        this.settlementSound = new Audio();
        this.settlementSound.volume = this.soundVolume;
        this.settlementSound.src = 'audio/settlement.mp3';
        
        this.missSound = new Audio();
        this.missSound.volume = this.soundVolume;
        this.missSound.src = 'audio/miss.mp3';
        
        // Preload sounds (optional, helps reduce latency)
        this.preloadSounds();
        
        // Set up audio unlock on first user interaction
        this.setupAudioUnlock();
    },
    
    setupAudioUnlock: function() {
        // Audio will be unlocked when user clicks the start screen
        // This function is kept for compatibility but the actual unlock happens in handleStartScreenClick
    },
    
    preloadSounds: function() {
        // Attempt to preload all audio files
        const audioFiles = [
            this.menuMusic,
            this.gameplayMusic,
            this.editorMusic,
            this.launchSound,
            this.gateSound,
            this.settlementSound,
            this.missSound
        ];
        
        audioFiles.forEach(audio => {
            if (audio) {
                try {
                    // load() is synchronous, doesn't return a promise
                    audio.load();
                } catch (err) {
                    // Silently fail if files don't exist yet (will fail gracefully at play time)
                    console.log('Audio file not found (will be skipped):', audio.src);
                }
            }
        });
    },
    
    playMenuMusic: function() {
        if (this.menuMusic) {
            // Stop gameplay music if playing
            this.stopGameplayMusic();
            // Play menu music
            this.menuMusic.currentTime = 0;
            this.menuMusic.play().catch(err => {
                // If audio isn't unlocked yet, it will play after first user interaction
                if (!this.audioUnlocked) {
                    // Audio will be unlocked on first click, then this will be called again
                    return;
                }
                console.log('Could not play menu music:', err);
            });
        }
    },
    
    stopMenuMusic: function() {
        if (this.menuMusic && !this.menuMusic.paused) {
            this.menuMusic.pause();
            this.menuMusic.currentTime = 0;
        }
    },
    
    playGameplayMusic: function() {
        if (this.gameplayMusic) {
            // Stop menu music if playing
            this.stopMenuMusic();
            // Play gameplay music
            this.gameplayMusic.currentTime = 0;
            this.gameplayMusic.play().catch(err => {
                console.log('Could not play gameplay music:', err);
            });
        }
    },
    
    stopGameplayMusic: function() {
        if (this.gameplayMusic && !this.gameplayMusic.paused) {
            this.gameplayMusic.pause();
            this.gameplayMusic.currentTime = 0;
        }
    },
    
    playEditorMusic: function() {
        if (this.editorMusic) {
            // Stop other music if playing
            this.stopMenuMusic();
            this.stopGameplayMusic();
            // Play editor music
            this.editorMusic.currentTime = 0;
            this.editorMusic.play().catch(err => {
                // If audio isn't unlocked yet, it will play after first user interaction
                if (!this.audioUnlocked) {
                    return;
                }
                console.log('Could not play editor music:', err);
            });
        }
    },
    
    stopEditorMusic: function() {
        if (this.editorMusic && !this.editorMusic.paused) {
            this.editorMusic.pause();
            this.editorMusic.currentTime = 0;
        }
    },
    
    playLaunchSound: function() {
        if (this.launchSound && this.launchSound.src) {
            // Create new Audio instance to allow overlapping sounds
            const sound = new Audio(this.launchSound.src);
            sound.volume = this.soundVolume;
            sound.play().catch(err => {
                // Silently fail if audio can't play (e.g., user interaction required)
                console.log('Could not play launch sound:', err);
            });
        }
    },
    
    playGateSound: function() {
        if (this.gateSound && this.gateSound.src) {
            // Create new Audio instance to allow overlapping sounds
            const sound = new Audio(this.gateSound.src);
            sound.volume = this.soundVolume;
            sound.play().catch(err => {
                // Silently fail if audio can't play (e.g., user interaction required)
                console.log('Could not play gate sound:', err);
            });
        }
    },
    
    playSettlementSound: function() {
        if (this.settlementSound && this.settlementSound.src) {
            // Create new Audio instance to allow overlapping sounds
            const sound = new Audio(this.settlementSound.src);
            sound.volume = this.soundVolume;
            sound.play().catch(err => {
                // Silently fail if audio can't play (e.g., user interaction required)
                console.log('Could not play settlement sound:', err);
            });
        }
    },
    
    playMissSound: function() {
        if (this.missSound && this.missSound.src) {
            // Create new Audio instance to allow overlapping sounds
            const sound = new Audio(this.missSound.src);
            sound.volume = this.soundVolume;
            sound.play().catch(err => {
                // Silently fail if audio can't play (e.g., user interaction required)
                console.log('Could not play miss sound:', err);
            });
        }
    },
    
    setMusicVolume: function(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.menuMusic) this.menuMusic.volume = this.musicVolume;
        if (this.gameplayMusic) this.gameplayMusic.volume = this.musicVolume;
        if (this.editorMusic) this.editorMusic.volume = this.musicVolume;
    },
    
    setSoundVolume: function(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
    },
    
    stopAll: function() {
        this.stopMenuMusic();
        this.stopGameplayMusic();
        this.stopEditorMusic();
    }
};











