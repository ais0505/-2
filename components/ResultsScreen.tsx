
import React from 'react';
import { Player, PlayerStats } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { RefreshCcw, Share2, Database } from 'lucide-react';
import { AVATARS } from '../constants';
import { downloadAnalyticsData } from '../utils/analytics';
import { determinePersonality } from '../utils/gameLogic';
import { SoundManager } from '../utils/sound';

interface ResultsScreenProps {
  player: Player;
  stats: PlayerStats;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ player, stats, onRestart }) => {
  const personality = determinePersonality(stats);
  const playerAvatarUrl = AVATARS[player.avatarId]?.url || AVATARS[0].url;

  const chartData = [
    { subject: 'Счастье', A: stats.happiness, fullMark: 20 },
    { subject: 'Доход', A: stats.income, fullMark: 20 },
    { subject: 'Статус', A: stats.status, fullMark: 20 },
  ];

  const handleShare = () => {
    alert("Результат скопирован в буфер обмена!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-transparent">
      <div className="bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col lg:flex-row border border-white/50 ring-1 ring-gray-200">
        
        {/* Left Side: Personality & Avatar */}
        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden bg-slate-50/50">
            {/* Background elements */}
            <div className={`absolute top-0 w-full h-2 bg-gradient-to-r ${personality.gradient}`}></div>
            
            <div className="relative z-10 w-full">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl mx-auto mb-8 overflow-hidden bg-white">
                    <img src={playerAvatarUrl} alt={player.name} className="w-full h-full object-cover" />
                </div>
                
                <h1 className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mb-3">Жизненная карта</h1>
                <h2 className={`text-3xl md:text-4xl font-black mb-6 ${personality.color}`}>
                    {personality.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md mx-auto">
                    {personality.desc}
                </p>

                <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                    <button 
                        onClick={() => {
                            SoundManager.playClick();
                            handleShare();
                        }}
                        onMouseEnter={() => SoundManager.playHover()}
                        className={`flex items-center justify-center gap-2 w-full py-4 text-white rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg bg-gradient-to-r ${personality.gradient}`}
                    >
                        <Share2 size={20} />
                        Поделиться результатом
                    </button>
                    <button 
                        onClick={() => {
                            SoundManager.playClick();
                            onRestart();
                        }}
                        onMouseEnter={() => SoundManager.playHover()}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all hover:border-gray-300"
                    >
                        <RefreshCcw size={18} />
                        Пройти путь заново
                    </button>
                    
                    {/* Data Download Button */}
                    <button 
                        onClick={() => {
                            SoundManager.playClick();
                            downloadAnalyticsData();
                        }}
                        className="flex items-center justify-center gap-2 w-full py-3 mt-4 text-gray-500 text-sm font-semibold hover:text-indigo-600 transition-colors"
                        title="Скачать JSON с данными игры"
                    >
                        <Database size={16} />
                        Скачать данные исследования (JSON)
                    </button>
                </div>
            </div>
        </div>

        {/* Right Side: Chart & Stats */}
        <div className="lg:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
             <div className="mb-6">
                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Баланс жизни</h3>
                 <p className="text-gray-500">Визуализация ваших приоритетов</p>
             </div>

             <div className="h-[300px] w-full mb-8 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar
                      name="Показатели"
                      dataKey="A"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      fill="#6366f1"
                      fillOpacity={0.5}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
             </div>

             <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                     <div className="flex items-center gap-3">
                         <span className="text-2xl">😊</span>
                         <span className="font-bold text-gray-700">Счастье</span>
                     </div>
                     <span className="text-xl font-black text-yellow-600">{stats.happiness}</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
                     <div className="flex items-center gap-3">
                         <span className="text-2xl">💰</span>
                         <span className="font-bold text-gray-700">Доход</span>
                     </div>
                     <span className="text-xl font-black text-green-600">{stats.income}</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
                     <div className="flex items-center gap-3">
                         <span className="text-2xl">👑</span>
                         <span className="font-bold text-gray-700">Статус</span>
                     </div>
                     <span className="text-xl font-black text-purple-600">{stats.status}</span>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
