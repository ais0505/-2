
import React, { useState } from 'react';
import { Region as _Region, ArtifactReward, Answer } from '../types';
import { REGIONS } from '../constants';
import { ArrowLeft, MessageCircle, Heart, Brain, Shield, Coins, Anchor, Play } from 'lucide-react';
import { SoundManager } from '../utils/sound';

interface RegionScreenProps {
  regionId: string;
  onCompleteRegion: (rewards: ArtifactReward[], choices: { question: string, answer: string }[]) => void;
  onBack: () => void;
}

const IconComponent = ({ name, size = 24, className = "" }: { name: string, size?: number, className?: string }) => {
  const icons: Record<string, React.ElementType> = {
    Heart, Brain, Coins, Shield, Anchor
  };
  const Icon = icons[name];
  return Icon ? <Icon size={size} className={className} /> : null;
};

type ScreenState = 'intro' | 'question' | 'feedback' | 'summary';

const RegionScreen: React.FC<RegionScreenProps> = ({ regionId, onCompleteRegion, onBack }) => {
  const region = REGIONS.find((r) => r.id === regionId);
  const [screenState, setScreenState] = useState<ScreenState>('intro');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [accumulatedRewards, setAccumulatedRewards] = useState<ArtifactReward[]>([]);
  const [playerChoices, setPlayerChoices] = useState<{ question: string, answer: string }[]>([]);
  const [lastAnswer, setLastAnswer] = useState<Answer | null>(null);
  
  if (!region) return null;

  const currentQuestion = region.questions[currentQuestionIdx];

  const handleStartRegion = () => {
    SoundManager.playClick();
    setScreenState('question');
  };

  const handleAnswerSelect = (answer: Answer) => {
    SoundManager.playClick();
    SoundManager.playSuccess(); // Reward moment
    setLastAnswer(answer);
    setAccumulatedRewards([...accumulatedRewards, ...answer.rewards]);
    
    // Save the specific text choice for analytics
    setPlayerChoices(prev => [
        ...prev, 
        { question: currentQuestion.dialogue, answer: answer.text }
    ]);
    
    setScreenState('feedback');
  };

  const handleNextFromFeedback = () => {
    SoundManager.playClick();
    setLastAnswer(null);
    if (currentQuestionIdx < region.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setScreenState('question');
    } else {
      setScreenState('summary');
    }
  };

  const finishRegion = () => {
    SoundManager.playClick();
    // Pass both rewards and specific choices back to App
    onCompleteRegion(accumulatedRewards, playerChoices);
  };

  const getAggregatedStats = () => {
    const stats = { happiness: 0, income: 0, status: 0 };
    accumulatedRewards.forEach(r => {
        if (r.type in stats) stats[r.type as keyof typeof stats] += r.amount;
    });
    return stats;
  };

  // --- 1. STAGE INTRO SCREEN ---
  if (screenState === 'intro') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br ${region.bgGradient} text-white`}>
         <div className="max-w-md w-full text-center">
             <div className="bg-white/20 backdrop-blur-md p-10 rounded-full w-40 h-40 mx-auto flex items-center justify-center mb-8 shadow-xl ring-4 ring-white/30">
                <IconComponent name={region.iconName} size={80} className="text-white drop-shadow-md" />
             </div>
             
             <h2 className="text-xl uppercase tracking-[0.2em] opacity-80 mb-2 font-bold">Новый этап</h2>
             <h1 className="text-4xl md:text-5xl font-black mb-6 drop-shadow-lg leading-tight">{region.name}</h1>
             <p className="text-lg md:text-xl leading-relaxed mb-10 text-white/90 font-medium">
               {region.description}
             </p>

             <button 
               onClick={handleStartRegion}
               className="group relative inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-[0_25px_50px_-10px_rgba(0,0,0,0.4)] transition-all"
             >
               <span>Войти в {region.name}</span>
               <div className="bg-gray-900 text-white rounded-full p-1 group-hover:translate-x-1 transition-transform">
                 <Play size={14} fill="currentColor" />
               </div>
             </button>
         </div>
         
         <button onClick={onBack} className="absolute top-6 left-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <ArrowLeft size={24} />
         </button>
      </div>
    );
  }

  // --- 2. SUMMARY SCREEN ---
  if (screenState === 'summary') {
    const stats = getAggregatedStats();
    return (
      <div className="min-h-screen bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-md fixed inset-0 z-50">
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 max-w-md w-full text-center border-b-8 border-green-500 relative">
           
           <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white p-4 rounded-full shadow-lg border-4 border-white">
              <IconComponent name={region.iconName} size={40} />
           </div>

           <h2 className="text-3xl font-black text-gray-800 mb-2 mt-6">Этап пройден!</h2>
           <p className="text-gray-500 mb-8 font-medium">Итоги этапа «{region.name}»:</p>

           <div className="flex justify-center gap-3 mb-10">
              {stats.happiness > 0 && (
                <div className="flex flex-col items-center p-3 bg-rose-50 rounded-2xl min-w-[90px] border border-rose-100">
                    <span className="text-2xl mb-1">😊</span>
                    <span className="font-bold text-rose-800 text-xl">+{stats.happiness}</span>
                    <span className="text-xs text-rose-500 font-bold uppercase tracking-wider">Счастье</span>
                </div>
              )}
              {stats.income > 0 && (
                <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-2xl min-w-[90px] border border-emerald-100">
                    <span className="text-2xl mb-1">💰</span>
                    <span className="font-bold text-emerald-800 text-xl">+{stats.income}</span>
                    <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Доход</span>
                </div>
              )}
              {stats.status > 0 && (
                <div className="flex flex-col items-center p-3 bg-indigo-50 rounded-2xl min-w-[90px] border border-indigo-100">
                    <span className="text-2xl mb-1">👑</span>
                    <span className="font-bold text-indigo-800 text-xl">+{stats.status}</span>
                    <span className="text-xs text-indigo-500 font-bold uppercase tracking-wider">Статус</span>
                </div>
              )}
           </div>

           <button 
             onClick={finishRegion}
             className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 text-lg"
           >
             Продолжить путь
           </button>
        </div>
      </div>
    );
  }

  // --- 3. MAIN GAMEPLAY (Question & Feedback) ---
  return (
    <div className={`min-h-screen flex flex-col ${region.color} transition-colors duration-500 relative`}>
      {/* Header */}
      <div className="p-4 flex items-center text-white/90 z-10">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
        </button>
        <h1 className="ml-4 text-xl font-bold tracking-wide flex items-center gap-2">
            <IconComponent name={region.iconName} size={20} />
            {region.name}
        </h1>
        <div className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
            Вопрос {currentQuestionIdx + 1} / {region.questions.length}
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10">
         <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative">
            <div key={currentQuestionIdx} className="w-full">
                {/* NPC Section */}
                <div className="bg-gray-50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border-b border-gray-100">
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-md ring-4 ring-white">
                            <img src={currentQuestion.imageUrl} alt="NPC" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h3 className="text-2xl font-black text-gray-800 mb-1">{currentQuestion.npcName}</h3>
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-3">{currentQuestion.npcDescription}</p>
                        
                        {/* DIALOGUE BUBBLE */}
                        <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm inline-flex gap-3 text-left">
                            <MessageCircle size={24} className="text-indigo-400 shrink-0 mt-1" />
                            <p className="text-lg text-gray-800 font-medium italic">"{currentQuestion.dialogue}"</p>
                        </div>
                    </div>
                </div>

                {/* Answers Section */}
                <div className="p-6 md:p-8 grid gap-4">
                    {currentQuestion.answers.map((answer, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswerSelect(answer)}
                            onMouseEnter={() => SoundManager.playHover()}
                            className="group relative bg-white border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 p-5 rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-between"
                        >
                            <span className="font-semibold text-gray-700 text-lg group-hover:text-indigo-900">{answer.text}</span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white rounded-full p-2">
                                <ArrowLeft className="rotate-180" size={16} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
         </div>
      </div>

      {/* FEEDBACK OVERLAY (Reasoning) */}
      {screenState === 'feedback' && lastAnswer && (
        <div className="absolute inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
           <div className="bg-white w-full md:max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl p-6 md:p-8 flex flex-col items-center text-center">
              
              <div className="mb-6 flex gap-3 justify-center">
                 {lastAnswer.rewards.filter(r => r.amount > 0).map((r, i) => (
                    <div key={i} className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl font-bold border
                        ${r.type === 'happiness' ? 'bg-rose-50 text-rose-700 border-rose-100' : ''}
                        ${r.type === 'income' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
                        ${r.type === 'status' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : ''}
                    `}>
                        <span className="text-xl">
                            {r.type === 'happiness' && '😊'}
                            {r.type === 'income' && '💰'}
                            {r.type === 'status' && '👑'}
                        </span>
                        <span>+{r.amount}</span>
                    </div>
                 ))}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3">Почему так?</h3>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {lastAnswer.reason}
              </p>

              <button 
                onClick={handleNextFromFeedback}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Далее
              </button>
           </div>
        </div>
      )}

    </div>
  );
};

export default RegionScreen;
