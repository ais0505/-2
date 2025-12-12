
// Audio Utility using Web Audio API for SFX and HTML5 Audio for Music

// Playlist of Ambient/Lo-Fi/Chill tracks (Reliable Sources)
const PLAYLIST = [
    // Track 1: Soft Piano & Ambience
    'https://mp3tornado.net/getmp3/MC9MVEl3TURFM01qQTRPRFZmTmpRM01qQTRPRFZmT0RnMU5qTTVNV05sWXpBMllqQmpOelEwWHprM09HSmlOREptTVdOaU16WXlZbUkzTlM4OElYd2hQbHNpWjNNaUxEQXNJa1FyVUdWeVpYb2lMREVzYm5Wc2JDd3dMRFV3TERCZC9UcmlzdGFuK0QuK1BlcmV6Ky0rTGl0dGxlcm9vdCtUb3duXyhtcDN0b3JuYWRvLm5ldCkvVHJpc3RhbitELitQZXJleislRTIlODAlOTMrTGl0dGxlcm9vdCtUb3duXyhtcDN0b3JuYWRvLm5ldCk/cz12ayZyPSZjb29raWVzPTc5MDY2MTAyMzY3XzEuY29va2ll', 
];

let audioCtx: AudioContext | null = null;
let musicAudio: HTMLAudioElement | null = null;
let isMutedGlobal = false;
let currentTrackIndex = 0;
let fadeInterval: any = null;

// Volume Configuration
const MUSIC_VOLUME = 0.4; // Increased to 40% so it's clearly audible
const SFX_VOLUME = 0.2;   // Slightly louder SFX

const initAudioContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

export const SoundManager = {
    init: () => {
        if (!musicAudio) {
            musicAudio = new Audio();
            musicAudio.volume = 0; // Start silent for fade-in
            
            // Event listener for playlist rotation
            musicAudio.addEventListener('ended', SoundManager.playNextTrack);
            
            // Set initial track
            currentTrackIndex = 0;
            musicAudio.src = PLAYLIST[currentTrackIndex];
            musicAudio.load();
        }
    },

    playNextTrack: () => {
        if (!musicAudio) return;
        
        currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
        musicAudio.src = PLAYLIST[currentTrackIndex];
        
        const playPromise = musicAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.log("Auto-advance track blocked (usually fine if user active):", e);
            });
        }
    },

    toggleMute: (mute: boolean) => {
        isMutedGlobal = mute;
        if (musicAudio) {
            musicAudio.muted = mute;
            if (!mute) {
                // If unmuted, check if playing. If paused, resume.
                if (musicAudio.paused) {
                    SoundManager.playMusic();
                } else {
                    musicAudio.volume = MUSIC_VOLUME;
                }
            }
        }
    },

    playMusic: () => {
        if (musicAudio && !isMutedGlobal) {
            // Prevent restarting if already playing
            if (!musicAudio.paused) return;

            const playPromise = musicAudio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Fade In Logic
                    if (fadeInterval) clearInterval(fadeInterval);
                    
                    let currentVol = 0;
                    musicAudio!.volume = 0;

                    // Faster fade-in (20ms steps instead of 50ms)
                    fadeInterval = setInterval(() => {
                        if (!musicAudio) {
                             clearInterval(fadeInterval);
                             return;
                        }
                        
                        currentVol += 0.02; // Faster volume increase
                        if (currentVol >= MUSIC_VOLUME) {
                            currentVol = MUSIC_VOLUME;
                            musicAudio.volume = currentVol;
                            clearInterval(fadeInterval);
                        } else {
                            musicAudio.volume = currentVol;
                        }
                    }, 20); 
                }).catch(e => {
                    console.log("Music autoplay blocked, waiting for interaction.", e);
                });
            }
        }
    },

    // --- SFX Section (Web Audio API) ---

    playClick: () => {
        if (isMutedGlobal) return;
        initAudioContext();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        // Sine wave for clean "UI" click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);

        // Volume Envelope
        gain.gain.setValueAtTime(SFX_VOLUME, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    },

    playSuccess: () => {
        if (isMutedGlobal) return;
        initAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const notes = [523.25, 659.25, 783.99]; // C Major

        notes.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'triangle'; // Triangle wave for softer but distinct tone
            osc.frequency.value = freq;
            
            const startTime = now + (i * 0.1);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(SFX_VOLUME, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
            
            osc.start(startTime);
            osc.stop(startTime + 0.7);
        });
    },

    playHover: () => {
    if (isMutedGlobal) return;
    initAudioContext();
    if (!audioCtx) return;

    const ctx = audioCtx; // гарантируем, что не null

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);

        // Very short, very quiet
        gain.gain.setValueAtTime(SFX_VOLUME * 0.2, audioCtx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }
};
