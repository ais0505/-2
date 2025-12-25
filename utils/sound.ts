
// Audio Utility - High Reliability Calm System

// Используем проверенный источник с высокой доступностью (Royalty Free Calm Music)
const MUSIC_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'; // Стабильный инструментальный трек
// Альтернативный очень спокойный вариант:
const CALM_BACKUP = 'https://cdn.pixabay.com/download/audio/2024/10/28/audio_90a46348a8.mp3?filename=friendly-town-fun-video-game-music-loop-256055.mp3'; 

let audioCtx: AudioContext | null = null;
let musicAudio: HTMLAudioElement | null = null;
let isMutedGlobal = false;

const MUSIC_VOLUME = 0.15; 
const SFX_VOLUME = 0.12;   

const initAudioContext = () => {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    } catch (e) {
        console.error("AudioContext init failed", e);
    }
};

export const SoundManager = {
    init: () => {
        if (typeof window === 'undefined') return;
        
        if (!musicAudio) {
            musicAudio = new Audio();
            musicAudio.src = MUSIC_URL;
            musicAudio.volume = MUSIC_VOLUME;
            musicAudio.loop = true;
            musicAudio.preload = "auto";
            musicAudio.crossOrigin = "anonymous";
            
            // Обработка ошибок загрузки
            musicAudio.addEventListener('error', (e) => {
                console.warn("Primary music failed, trying backup source...");
                if (musicAudio) {
                    musicAudio.src = CALM_BACKUP;
                    musicAudio.load();
                    if (!isMutedGlobal) {
                        musicAudio.play().catch(() => console.log("Backup also blocked"));
                    }
                }
            });
        }
        initAudioContext();
    },

    toggleMute: (mute: boolean) => {
        isMutedGlobal = mute;
        if (musicAudio) {
            musicAudio.muted = mute;
            if (!mute) {
                SoundManager.playMusic();
            } else {
                musicAudio.pause();
            }
        }
    },

    playMusic: () => {
        SoundManager.init();
        initAudioContext();
        
        if (!musicAudio || isMutedGlobal) return;
        
        // Попытка запуска
        const playPromise = musicAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch((err) => {
                console.debug("Autoplay blocked. User must click on the page first.");
                // При следующей попытке (через клик в App.tsx) музыка запустится
            });
        }
    },

    // Метод для принудительного запуска после жеста пользователя
    resumeAndPlay: () => {
        initAudioContext();
        if (musicAudio && !isMutedGlobal && musicAudio.paused) {
            musicAudio.play().catch(e => console.error("Final play attempt failed", e));
        }
    },

    playClick: () => {
        if (isMutedGlobal) return;
        initAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
        
        gain.gain.setValueAtTime(SFX_VOLUME, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        
        osc.start(now);
        osc.stop(now + 0.1);
    },

    playSuccess: () => {
        if (isMutedGlobal) return;
        initAudioContext();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        [523.25, 659.25, 783.99].forEach((f, i) => {
            const osc = audioCtx!.createOscillator();
            const g = audioCtx!.createGain();
            osc.connect(g);
            g.connect(audioCtx!.destination);
            osc.type = 'sine';
            osc.frequency.value = f;
            g.gain.setValueAtTime(0, now + i*0.1);
            g.gain.linearRampToValueAtTime(SFX_VOLUME * 0.4, now + i*0.1 + 0.05);
            g.gain.exponentialRampToValueAtTime(0.0001, now + i*0.1 + 0.8);
            osc.start(now + i*0.1);
            osc.stop(now + i*0.1 + 0.9);
        });
    },

    playHover: () => {
        if (isMutedGlobal) return;
        initAudioContext();
        if (!audioCtx) return;
        
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(650, now + 0.05);
        
        gain.gain.setValueAtTime(SFX_VOLUME * 0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        
        osc.start(now);
        osc.stop(now + 0.05);
    }
};
