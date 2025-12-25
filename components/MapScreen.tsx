
import React from 'react';
import { Player, PlayerStats } from '../types';
import { REGIONS, AVATARS } from '../constants';
import { Brain, Shield, Trophy, Heart, Anchor, Coins, Smile, Lock, Crown, ArrowDown, Check, User } from 'lucide-react';
import * as Lucide from 'lucide-react';
import { SoundManager } from '../utils/sound';

// Безопасное извлечение иконок для предотвращения ошибок TS2305
const Mars = (Lucide as any).Mars || User;
const Venus = (Lucide as any).Venus || User;

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
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header Stats Bar */}
      <div className="glass shadow-2xl border-b border-white/5 sticky top-0 z-20 transition-all">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-white/5 relative">
                    <img src={playerAvatarUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-md p-0.5 rounded-tl-lg">
                      {player.gender === 'male' ? <Mars size={10} className="text-indigo-400" /> : <Venus size={10} className="text-rose-400" />}
                    </div>
                </div>
                <div>
                    <h3 className="font-black text-white leading-tight text-lg">{player.name}</h3>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">
                      {player.gender === 'male' ? 'Исследователь' : 'Исследовательница'} • {player.age} л.
                    </p>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                    <Smile size={18} className="text-yellow-400" />
                    <span className="font-bold text-white text-sm">{stats.happiness}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                    <Coins size={18} className="text-emerald-400" />
                    <span className="font-bold text-white text-sm">{stats.income}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                    <Crown size={18} className="text-purple-400" />
                    <span className="font-bold text-white text-sm">{stats.status}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <div className="max-w-xl w-full flex flex-col gap-10 pb-32 pt-8">
            <div className="text-center mb-4">
                <h2 className="text-4xl font-black text-white mb-2">Жизненный Путь</h2>
                <p className="text-indigo-200/50 font-medium italic">Движение сквозь пространство и время</p>
            </div>
            
            {REGIONS.map((region, index) => {
                const isCompleted = completedRegions.includes(region.id);
                const isLocked = index > 0 && !completedRegions.includes(REGIONS[index - 1].id);
                const isNext = !isCompleted && !isLocked;

                return (
                    <div key={region.id} className="relative flex flex-col items-center animate-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
                        {index > 0 && (
                            <div className={`w-[2px] h-12 mb-2 transition-colors duration-1000 ${
                                isLocked ? 'bg-white/5' : isCompleted ? 'bg-emerald-500/30' : 'bg-indigo-500/30'
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
                                relative w-full flex items-center p-6 rounded-[2rem] transition-all duration-500
                                ${isCompleted 
                                    ? 'glass opacity-40 grayscale-0 border-emerald-500/20' 
                                    : isLocked
                                        ? 'bg-white/5 opacity-20 cursor-not-allowed grayscale'
                                        : 'glass glass-hover shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2 cursor-pointer border-white/10'
                                }
                            `}
                        >
                            <div className={`
                                w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 mr-6 transition-all duration-700
                                ${isCompleted 
                                    ? 'bg-emerald-500/20 text-emerald-400' 
                                    : isLocked 
                                        ? 'bg-white/5 text-white/20' 
                                        : `${region.color} text-white shadow-[0_0_30px_rgba(0,0,0,0.2)] group-hover:scale-110`
                                }
                            `}>
                                {isLocked ? <Lock size={24} /> : <IconComponent name={region.iconName} size={36} />}
                                {isCompleted && (
                                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-[#020617]">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="text-left flex-1">
                                <h3 className={`text-2xl font-black mb-1 ${isCompleted ? 'text-emerald-300' : 'text-white'}`}>
                                    {region.name}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">
                                    {isCompleted ? 'Завершено' : isLocked ? 'Заблокировано' : 'Доступно'}
                                </p>
                                <p className="text-sm text-indigo-100/60 leading-relaxed font-medium">
                                    {region.description}
                                </p>
                            </div>

                            {isNext && (
                                <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-indigo-500 text-white p-3 rounded-full animate-bounce shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                                    <ArrowDown size={20} className="-rotate-90" />
                                </div>
                            )}
                        </button>
                    </div>
                )
            })}
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-8 glass border-t border-white/5 flex justify-center sticky bottom-0 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => {
                SoundManager.playClick();
                onFinishGame();
            }}
            disabled={!allRegionsCompleted}
            className={`
                w-full max-w-md px-10 py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3
                ${allRegionsCompleted 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-105 active:scale-95' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                }
            `}
          >
             {allRegionsCompleted ? 'Сформировать Сущность' : `${completedRegions.length} / 5 Этапов`}
             {allRegionsCompleted && <Trophy size={22} />}
          </button>
      </div>
    </div>
  );
};

export default MapScreen;
