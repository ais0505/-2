
import React, { useState } from 'react';
import { Player } from '../types';
import { User, Check, Mars, Venus, Calendar } from 'lucide-react';
import { AVATARS } from '../constants';
import { SoundManager } from '../utils/sound';

interface CharacterCreationProps {
  onComplete: (player: Player) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const handleSubmit = () => {
    const ageNum = parseInt(age);
    if (name.trim() && ageNum > 0 && gender && selectedAvatar !== null) {
      SoundManager.playClick();
      onComplete({ 
        name, 
        age: ageNum, 
        gender, 
        avatarId: selectedAvatar 
      });
    }
  };

  const isFormValid = name.trim().length > 0 && 
                      age.trim().length > 0 && 
                      parseInt(age) > 0 && 
                      gender !== null && 
                      selectedAvatar !== null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-5xl mx-auto">
      <div className="glass rounded-[2.5rem] p-8 md:p-12 w-full shadow-2xl animate-in fade-in zoom-in duration-700">
        <h2 className="text-4xl font-black text-white mb-2 text-center tracking-tight">
          Создайте исследователя
        </h2>
        <p className="text-indigo-200/50 text-center mb-10 text-lg font-medium">
          Выберите Героя , который пройдет этот путь.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Имя */}
          <div>
            <label className="block text-xs font-bold text-indigo-300 mb-2 uppercase tracking-[0.2em] ml-1">
              Ваше имя
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-indigo-300/20 focus:bg-white/10 focus:border-indigo-500 transition-all outline-none text-lg font-semibold shadow-inner"
              />
            </div>
          </div>

          {/* Возраст */}
          <div>
            <label className="block text-xs font-bold text-indigo-300 mb-2 uppercase tracking-[0.2em] ml-1">
              Возраст
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Лет..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-indigo-300/20 focus:bg-white/10 focus:border-indigo-500 transition-all outline-none text-lg font-semibold shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Выбор пола */}
        <div className="mb-10 text-center">
          <label className="block text-xs font-bold text-indigo-300 mb-4 uppercase tracking-[0.2em]">
            Пол персонажа
          </label>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => { setGender('male'); SoundManager.playClick(); }}
              onMouseEnter={() => SoundManager.playHover()}
              className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 w-32 ${
                gender === 'male' 
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]' 
                  : 'bg-white/5 border-white/5 opacity-50 hover:opacity-100'
              }`}
            >
              <Mars size={40} className={gender === 'male' ? 'text-indigo-300' : 'text-white'} />
              <span className="font-bold text-white text-sm">Мужчина</span>
            </button>

            <button
              onClick={() => { setGender('female'); SoundManager.playClick(); }}
              onMouseEnter={() => SoundManager.playHover()}
              className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 w-32 ${
                gender === 'female' 
                  ? 'bg-rose-600/20 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)]' 
                  : 'bg-white/5 border-white/5 opacity-50 hover:opacity-100'
              }`}
            >
              <Venus size={40} className={gender === 'female' ? 'text-rose-300' : 'text-white'} />
              <span className="font-bold text-white text-sm">Женщина</span>
            </button>
          </div>
        </div>

        {/* Выбор аватара */}
        <div className="mb-12">
          <label className="block text-xs font-bold text-indigo-300 mb-6 text-center uppercase tracking-[0.2em]">
            Визуальный образ
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => {
                    SoundManager.playClick();
                    setSelectedAvatar(avatar.id);
                }}
                onMouseEnter={() => SoundManager.playHover()}
                className={`relative group transition-all duration-500 ${
                    selectedAvatar === avatar.id ? 'scale-110' : 'hover:scale-105 opacity-40 hover:opacity-100'
                }`}
              >
                <div className={`
                    w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all shadow-xl
                    ${selectedAvatar === avatar.id 
                        ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-indigo-500/10' 
                        : 'border-white/5 bg-white/5'
                    }
                `}>
                    <img
                        src={avatar.url}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    {selectedAvatar === avatar.id && (
                        <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1 shadow-lg">
                            <Check className="text-white" size={10} strokeWidth={4} />
                        </div>
                    )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full py-5 rounded-2xl text-xl font-black transition-all transform max-w-md mx-auto block ${
            !isFormValid
              ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95'
          }`}
        >
          Начать путешествие
        </button>
      </div>
    </div>
  );
};

export default CharacterCreation;
