
import React, { useState } from 'react';
import { Player } from '../types';
import { User, Check } from 'lucide-react';
import { AVATARS } from '../constants';
import { SoundManager } from '../utils/sound';

interface CharacterCreationProps {
  onComplete: (player: Player) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const handleSubmit = () => {
    if (name.trim() && selectedAvatar !== null) {
      SoundManager.playClick();
      onComplete({ name, avatarId: selectedAvatar });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-5xl mx-auto bg-transparent">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full border border-white/50 ring-1 ring-gray-100">
        <h2 className="text-4xl font-black text-gray-800 mb-2 text-center tracking-tight">
          Создайте исследователя
        </h2>
        <p className="text-gray-500 text-center mb-10 text-lg">
          Выберите героя, который пройдёт этот путь.
        </p>

        <div className="mb-10 max-w-md mx-auto">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Ваше имя
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Стив"
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-lg font-semibold"
            />
          </div>
        </div>

        <div className="mb-10">
          <label className="block text-sm font-bold text-gray-700 mb-6 text-center uppercase tracking-wide">
            Выберите аватар
          </label>
          
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => {
                    SoundManager.playClick();
                    setSelectedAvatar(avatar.id);
                }}
                onMouseEnter={() => SoundManager.playHover()}
                className={`relative flex flex-col items-center group transition-all duration-200 ${
                    selectedAvatar === avatar.id ? 'scale-105' : 'hover:scale-105'
                }`}
              >
                <div className={`
                    w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all shadow-sm
                    ${selectedAvatar === avatar.id 
                        ? 'border-indigo-600 ring-4 ring-indigo-200 shadow-xl' 
                        : 'border-gray-100 group-hover:border-indigo-300'
                    }
                `}>
                    <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="w-full h-full object-cover bg-gray-50"
                    />
                    {selectedAvatar === avatar.id && (
                        <div className="absolute top-2 right-2 bg-indigo-600 rounded-full p-1.5 shadow-md animate-in zoom-in duration-200">
                            <Check className="text-white" size={14} strokeWidth={4} />
                        </div>
                    )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim() || selectedAvatar === null}
          className={`w-full py-5 rounded-2xl text-xl font-bold text-white transition-all transform max-w-md mx-auto block ${
            !name.trim() || selectedAvatar === null
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] shadow-xl shadow-indigo-200'
          }`}
        >
          Начать путешествие
        </button>
      </div>
    </div>
  );
};

export default CharacterCreation;
