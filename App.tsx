
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
  const [startTime, setStartTime] = useState<number>(0);
  const [gameHistory, setGameHistory] = useState<Record<string, string[]>>({});
  const [showIntro, setShowIntro] = useState<boolean>(true);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (!isMuted) {
        SoundManager.resumeAndPlay();
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('keydown', handleGlobalClick);
    
    SoundManager.init();
    trackEvent('app_loaded');

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('keydown', handleGlobalClick);
    };
  }, [isMuted]);

  const handleToggleSound = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newState = !isMuted;
      setIsMuted(newState);
      SoundManager.toggleMute(newState);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    SoundManager.resumeAndPlay(); 
  };

  const startCharacterCreation = () => {
    setStartTime(Date.now());
    trackEvent('flow_start_click');
    SoundManager.playClick();
    SoundManager.resumeAndPlay();
    setScreen('character');
  };

  const handleCharacterComplete = (newPlayer: Player) => {
    trackEvent('character_created', { 
      PlayerID: newPlayer.name,
      Age: newPlayer.age,
      Gender: newPlayer.gender 
    });
    SoundManager.playClick();
    SoundManager.resumeAndPlay();
    setPlayer(newPlayer);
    setScreen('map');
  };

  const handleRegionSelect = (regionId: string) => {
    trackEvent('region_started', { 
      regionId,
      PlayerID: player?.name 
    });
    SoundManager.playClick();
    SoundManager.resumeAndPlay();
    setActiveRegion(regionId);
    setScreen('region');
  };

  const handleRegionComplete = (rewards: ArtifactReward[], choices: { question: string, answer: string }[]) => {
    setStats((prev) => {
      const next = { ...prev };
      rewards.forEach((r) => { next[r.type] += r.amount; });
      return next;
    });

    const answerTexts = choices.map(c => c.answer);
    if (activeRegion) {
       setGameHistory(prev => ({ ...prev, [activeRegion]: answerTexts }));
       setCompletedRegions((prev) => [...prev, activeRegion]);
       trackEvent('region_completed_internal', {
         regionId: activeRegion,
         PlayerID: player?.name,
         choices: answerTexts
       });
    }
    setActiveRegion(null);
    setScreen('map');
  };

  const handleGameFinish = () => {
    if (!player) return;
    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
    const personality = determinePersonality(stats);

    // Маппинг ответов для плоской структуры таблицы
    const h = gameHistory;
    const finalReport = {
        PlayerID: player.name,
        Age: player.age,
        Gender: player.gender,
        
        // Ответы по институтам
        A1_Family: h['family']?.[0] || '',
        A2_Family: h['family']?.[1] || '',
        
        A1_Edu: h['education']?.[0] || '',
        A2_Edu: h['education']?.[1] || '',
        
        A1_Work: h['economy']?.[0] || '',
        A2_Work: h['economy']?.[1] || '',
        
        A1_State: h['state']?.[0] || '',
        A2_State: h['state']?.[1] || '',
        
        A1_Culture: h['culture']?.[0] || '',
        A2_Culture: h['culture']?.[1] || '',

        // Итоговые статы
        Total_Happiness: stats.happiness,
        Total_Money: stats.income,
        Total_Status: stats.status,
        
        Personality_Type: personality.title,
        TimeSpent: `${durationSeconds}s`
    };

    // Отправляем всё одним большим событием для записи в Google Sheets
    trackEvent('game_complete_sheet', finalReport);
    
    setScreen('results');
  };

  const restartGame = () => {
    trackEvent('game_restarted', { PlayerID: player?.name });
    setStats(INITIAL_STATS);
    setCompletedRegions([]);
    setActiveRegion(null);
    setGameHistory({});
    setStartTime(Date.now());
    SoundManager.playClick();
    SoundManager.resumeAndPlay();
    setScreen('character');
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroVideo onComplete={handleIntroComplete} />;
  }

  const HeaderControls = (
      <button 
        onClick={handleToggleSound}
        className="fixed top-4 right-4 z-50 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-gray-800 transition-all shadow-lg ring-1 ring-white/30"
      >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
  );

  if (screen === 'intro') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {HeaderControls}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse delay-75"></div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-[2rem] inline-block mb-10 border border-white/10 shadow-2xl ring-1 ring-white/20">
            <Compass size={80} className="text-indigo-300 mx-auto" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Путь <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">Человека</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 text-balance leading-relaxed">
            Симуляция жизненных этапов.<br/>
            Пройдите 5 институтов общества: от Семьи до Культуры.<br/>
            Ваши решения сформируют вашу личность.
          </p>
          
          <button
            onClick={startCharacterCreation}
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-xl"
          >
            Начать свой путь
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {HeaderControls}
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
