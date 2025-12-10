
import React from 'react';
import { Player, PlayerStats } from '../types';
import { REGIONS, AVATARS } from '../constants';
import { Brain, Shield, Trophy, Heart, Anchor, Coins, Smile, Lock, Crown, ArrowDown } from 'lucide-react';
import { SoundManager } from '../utils/sound';

interface MapScreenProps {
  player: Player;
  stats: PlayerStats;
  completedRegions: string[];
  onSelectRegion: (regionId: string) => void;
  onFinishGame: () => void;
}

const IconComponent = ({ name, size = 24, className = "" }: { name: string, size?: number, className?: string }) => {
  const icons: Record<string, React.ElementType> = {
    Brain, Shield, Trophy, Heart, Anchor, Coins
  };
  const Icon = icons[name];
  return Icon ? <Icon size={size} className={className} /> : null;
};

const MapScreen: React.FC<MapScreenProps> = ({
  player,
  stats,
  completedRegions,
  onSelectRegion,
  onFinishGame,
}) => {
  const allRegionsCompleted = completedRegions.length === REGIONS.length;
  const playerAvatarUrl = AVATARS[player.avatarId]?.url || AVATARS[0].url;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-transparent">
      {/* Header Stats Bar */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-50/50 sticky top-0 z-20 transition-all">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200 shadow-sm bg-indigo-50">
                    <img src={playerAvatarUrl} alt="Player" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 leading-tight text-lg">{player.name}</h3>
                    <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wider">Путник</p>
                </div>
            </div>

            <div className="flex gap-2 md:gap-4">
                <div className="flex flex-col md:flex-row items-center gap-1 bg-yellow-50/80 px-3 py-1.5 rounded-xl border border-yellow-200 backdrop-blur-sm shadow-sm">
                    <Smile size={18} className="text-yellow-600" />
                    <span className="font-bold text-yellow-800 text-sm md:text-base">{stats.happiness}</span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-1 bg-green-50/80 px-3 py-1.5 rounded-xl border border-green-200 backdrop-blur-sm shadow-sm">
                    <Coins size={18} className="text-green-600" />
                    <span className="font-bold text-green-800 text-sm md:text-base">{stats.income}</span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-1 bg-purple-50/80 px-3 py-1.5 rounded-xl border border-purple-200 backdrop-blur-sm shadow-sm">
                    <Crown size={18} className="text-purple-600" />
                    <span className="font-bold text-purple-800 text-sm md:text-base">{stats.status}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center relative">
        <div className="max-w-xl w-full flex flex-col gap-8 pb-24 pt-4">
            <div className="text-center mb-2">
                <h2 className="text-3xl font-black text-gray-800">Жизненный Путь</h2>
                <p className="text-gray-500 font-medium mt-1">Создайте свою историю, шаг за шагом</p>
            </div>
            
            {REGIONS.map((region, index) => {
                const isCompleted = completedRegions.includes(region.id);
                // Linear progression logic: 
                // A region is locked if the previous one is not completed.
                // First region (index 0) is always unlocked.
                const isLocked = index > 0 && !completedRegions.includes(REGIONS[index - 1].id);
                const isNext = !isCompleted && !isLocked;

                return (
                    <div key={region.id} className="relative flex flex-col items-center group">
                        {/* Connecting Line (except for the first one) */}
                        {index > 0 && (
                            <div className={`w-1 h-12 mb-2 transition-colors duration-500 ${
                                isLocked ? 'bg-gray-200' : isCompleted ? 'bg-green-300' : 'bg-indigo-300'
                            }`}></div>
                        )}

                        <button
                            onClick={() => {
                                if (!isLocked && !isCompleted) {
                                    SoundManager.playClick();
                                    onSelectRegion(region.id);
                                }
                            }}
                            disabled={isLocked || isCompleted}
                            onMouseEnter={() => {
                                if (!isLocked && !isCompleted) SoundManager.playHover();
                            }}
                            className={`
                                relative w-full flex items-center p-5 rounded-2xl border-b-4 transition-all duration-300
                                ${isCompleted 
                                    ? 'bg-white/90 border-green-200 opacity-90' 
                                    : isLocked
                                        ? 'bg-gray-100/80 border-gray-200 opacity-70 cursor-not-allowed grayscale'
                                        : 'bg-white border-indigo-200 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-400 cursor-pointer ring-4 ring-indigo-50/50'
                                }
                            `}
                        >
                            <div className={`
                                w-16 h-16 rounded-xl flex items-center justify-center shrink-0 mr-5 transition-transform duration-300
                                ${isCompleted ? 'bg-green-100 text-green-600 scale-90' : isLocked ? 'bg-gray-200 text-gray-400' : `${region.color} text-white shadow-lg group-hover:scale-110`}
                            `}>
                                {isLocked ? <Lock size={24} /> : <IconComponent name={region.iconName} size={32} />}
                            </div>
                            
                            <div className="text-left flex-1">
                                <h3 className={`text-xl font-bold ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                                    {region.name}
                                </h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">
                                    {isCompleted ? 'Пройдено' : isLocked ? 'Недоступно' : 'Текущий этап'}
                                </p>
                                <p className="text-sm text-gray-600 leading-snug">
                                    {region.description}
                                </p>
                            </div>

                            {isNext && (
                                <div className="absolute -right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2.5 rounded-full animate-bounce shadow-lg ring-4 ring-white">
                                    <ArrowDown size={18} className="-rotate-90" />
                                </div>
                            )}
                        </button>
                    </div>
                )
            })}
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 bg-white/80 backdrop-blur-md border-t border-gray-200 flex justify-center sticky bottom-0 z-20 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
          <button
            onClick={() => {
                SoundManager.playClick();
                onFinishGame();
            }}
            disabled={!allRegionsCompleted}
            className={`
                w-full max-w-md px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2
                ${allRegionsCompleted 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-purple-200 hover:scale-[1.02]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
            `}
          >
             {allRegionsCompleted ? 'Сформировать Личность' : `Пройдено этапов: ${completedRegions.length} / 5`}
             {allRegionsCompleted && <Trophy size={20} />}
          </button>
      </div>
    </div>
  );
};

export default MapScreen;
