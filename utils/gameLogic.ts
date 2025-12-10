
import { PlayerStats } from '../types';

export interface PersonalityResult {
  title: string;
  desc: string;
  color: string;
  gradient: string;
}

export const determinePersonality = (stats: PlayerStats): PersonalityResult => {
  const { happiness, income, status } = stats;
  const maxVal = Math.max(happiness, income, status);
  const minVal = Math.min(happiness, income, status);
  
  // Balanced: diff between max and min is small (<= 4 points out of possible max ~10 per stat)
  if (maxVal - minVal <= 4) {
    return {
      title: 'Сбалансированный Путник',
      desc: 'Вы прошли жизненный путь, сохраняя равновесие. Вы не впадаете в крайности, уделяя внимание и чувствам, и карьере, и социальному долгу.',
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-blue-500'
    };
  }

  if (happiness === maxVal) return {
    title: 'Счастливый Гармонизатор',
    desc: 'Для вас внутренний мир и тепло человеческих отношений важнее любых наград. Вы строите жизнь вокруг добра, семьи и душевного спокойствия.',
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-pink-500'
  };

  if (status === maxVal) return {
    title: 'Карьерный Лидер',
    desc: 'Вы — человек влияния. Вам важно занимать высокое положение, управлять процессами и чувствовать признание общества. Власть и авторитет — ваши ориентиры.',
    color: 'text-purple-600',
    gradient: 'from-purple-600 to-violet-600'
  };

  // Income max or fallback
  return {
    title: 'Прагматичный Стратег',
    desc: 'Вы твердо стоите на ногах. Финансовая независимость, ресурсы и четкий расчет — основа вашего мира. Вы знаете цену вещам и умеете обеспечивать безопасность.',
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 to-green-600'
  };
};
