
export type StatType = 'happiness' | 'income' | 'status';

export interface ArtifactReward {
  type: StatType;
  amount: number;
}

export interface Answer {
  text: string;
  rewards: ArtifactReward[];
  reason: string; // Explanation for the result
}

export interface Question {
  npcName: string;
  npcDescription: string;
  imageUrl: string; // Specific image for the character
  dialogue: string;
  answers: Answer[]; 
}

export interface Region {
  id: string;
  name: string;
  iconName: string; 
  description: string;
  questions: Question[];
  color: string;
  bgGradient: string; 
}

export interface PlayerStats {
  happiness: number;
  income: number;
  status: number;
}

export interface Player {
  name: string;
  avatarId: number;
  gender: 'male' | 'female';
  age: number;
}

export type GameScreen = 'intro' | 'character' | 'map' | 'region' | 'results';
