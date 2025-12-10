
import React, { useState, useEffect } from 'react';
import { Player, PlayerStats, GameScreen, ArtifactReward } from './types';
import CharacterCreation from './components/CharacterCreation';
import MapScreen from './components/MapScreen';
import RegionScreen from './components/RegionScreen';
import ResultsScreen from './components/ResultsScreen';
import { Compass, Volume2, VolumeX } from 'lucide-react'; 
import { trackEvent } from './utils/analytics';
import { determinePersonality } from './utils/gameLogic';
import { SoundManager } from './utils/sound';
import IntroVideo from './components/IntroVideo';

const INITIAL_STATS: PlayerStats = {
  happiness: 0,
  income: 0,
  status: 0,
};

function App() {
  const [screen, setScreen] = useState<GameScreen>('intro');
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS);
  const [completedRegions, setCompletedRegions] = useState<string[]>([]);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // Analytics state
  const [startTime, setStartTime] = useState<number>(0);
  const [gameHistory, setGameHistory] = useState<Record<string, string[]>>({});

  // Intro state - checking localStorage
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return !localStorage.getItem('hm_intro_seen');
  });

  // Track initial page load and setup global audio listener
  useEffect(() => {
    trackEvent('app_loaded');
    SoundManager.init();

    // Attempt to play music on the very first interaction anywhere on the page
    const startAudio = () => {
      if (!isMuted) {
          SoundManager.playMusic();
      }
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
    };

    window.addEventListener('click', startAudio);
    window.addEventListener('keydown', startAudio);

    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
    };
  }, []);

  const handleToggleSound = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newState = !isMuted;
      setIsMuted(newState);
      SoundManager.toggleMute(newState);
  };

  const handleIntroComplete = () => {
    localStorage.setItem('hm_intro_seen', 'true');
    setShowIntro(false);
    if (!isMuted) SoundManager.playMusic();
  };

  const startCharacterCreation = () => {
    setStartTime(Date.now());
    trackEvent('flow_start_click');
    setScreen('character');
  };

  const handleCharacterComplete = (newPlayer: Player) => {
    trackEvent('character_created', { 
      name: newPlayer.name, 
      avatarId: newPlayer.avatarId 
    });
    setPlayer(newPlayer);
    setScreen('map');
  };

  const handleRegionSelect = (regionId: string) => {
    trackEvent('region_started', { regionId });
    setActiveRegion(regionId);
    setScreen('region');
  };

  const handleRegionComplete = (rewards: ArtifactReward[], choices: { question: string, answer: string }[]) => {
    // 1. Update Stats
    setStats((prev) => {
      const next = { ...prev };
      rewards.forEach((r) => {
        next[r.type] += r.amount;
      });
      return next;
    });

    // 2. Save Answers for Final Report
    // We just extract the answer text
    const answerTexts = choices.map(c => c.answer);
    if (activeRegion) {
       setGameHistory(prev => ({
         ...prev,
         [activeRegion]: answerTexts
       }));
       setCompletedRegions((prev) => [...prev, activeRegion]);
    }

    setActiveRegion(null);
    setScreen('map');
  };

  const handleGameFinish = () => {
    if (!player) return;

    // Calculate duration
    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
    const personality = determinePersonality(stats);

    // Helper to safely get answer
    const getAns = (regionId: string, idx: number) => gameHistory[regionId]?.[idx] || 'N/A';

    // Construct the specific payload for Google Sheets columns
    const sheetPayload = {
        PlayerID: player.name,
        // Family
        A1_Family: getAns('family', 0),
        A2_Family: getAns('family', 1),
        // Education
        A1_Edu: getAns('education', 0),
        A2_Edu: getAns('education', 1),
        // Economy (Work)
        A1_Work: getAns('economy', 0),
        A2_Work: getAns('economy', 1),
        // State
        A1_State: getAns('state', 0),
        A2_State: getAns('state', 1),
        // Culture
        A1_Culture: getAns('culture', 0),
        A2_Culture: getAns('culture', 1),
        
        // Totals
        Total_Happiness: stats.happiness,
        Total_Money: stats.income,
        Total_Status: stats.status,
        
        Personality_Type: personality.title,
        TimeSpent: `${durationSeconds}s`
    };

    trackEvent('game_complete_sheet', sheetPayload);
    setScreen('results');
  };

  const restartGame = () => {
    trackEvent('game_restarted');
    setStats(INITIAL_STATS);
    setCompletedRegions([]);
    setActiveRegion(null);
    setGameHistory({});
    setStartTime(Date.now());
    setScreen('character');
  };

  if (showIntro) {
    return <IntroVideo onComplete={handleIntroComplete} />;
  }

  // Common Sound Toggle Button
  const SoundToggle = (
      <button 
        onClick={handleToggleSound}
        className="fixed top-4 right-4 z-50 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-gray-800 transition-all shadow-lg ring-1 ring-white/30"
        title={isMuted ? "Включить звук" : "Выключить звук"}
      >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
  );

  // Intro Screen
  if (screen === 'intro') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {SoundToggle}
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse delay-75"></div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-[2rem] inline-block mb-10 border border-white/10 shadow-2xl ring-1 ring-white/20">
            <Compass size={80} className="text-indigo-300 mx-auto drop-shadow-lg" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Путь <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">Человека</span>
          </h1>
          <div className="space-y-4 mb-12">
            <p className="text-xl text-gray-300 leading-relaxed font-light">
              Симуляция жизненных этапов.
            </p>
            <p className="text-lg text-gray-400">
               Пройдите 5 институтов общества: от Семьи до Культуры. <br/>
               Ваши решения сформируют вашу личность.
            </p>
          </div>
          
          <button
            onClick={() => {
              SoundManager.playClick();
              // SoundManager.playMusic() is redundant here if the global listener works, but we keep it safe.
              startCharacterCreation();
            }}
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            <span className="relative z-10">Начать свой путь</span>
            <div className="absolute inset-0 rounded-2xl bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {SoundToggle}
      {screen === 'character' && <CharacterCreation onComplete={handleCharacterComplete} />}
      
      {screen === 'map' && player && (
        <MapScreen
          player={player}
          stats={stats}
          completedRegions={completedRegions}
          onSelectRegion={handleRegionSelect}
          onFinishGame={handleGameFinish}
        />
      )}

      {screen === 'region' && activeRegion && (
        <RegionScreen
          regionId={activeRegion}
          onCompleteRegion={handleRegionComplete}
          onBack={() => setScreen('map')}
        />
      )}

      {screen === 'results' && player && (
        <ResultsScreen
          player={player}
          stats={stats}
          onRestart={restartGame}
        />
      )}
    </>
  );
}

export default App;
