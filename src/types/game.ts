export type StatType = 'fuerza' | 'inteligencia' | 'espiritualidad' | 'carisma';

export interface CharacterStats {
  level: number;
  xp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  gold: number;
  attributes: Record<StatType, number>;
}

export interface Quest {
  id: string;
  title: string;
  type: 'daily' | 'habit' | 'todo';
  difficulty: 'easy' | 'medium' | 'hard';
  stat: StatType;
  completed: boolean;
  streak?: number;
  lastCompleted?: string;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  type: 'real' | 'virtual';
  icon: string;
}