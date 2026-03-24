export type StatType = 'fuerza' | 'inteligencia' | 'espiritualidad' | 'carisma';
export type ItemCategory = 'armas' | 'armaduras' | 'mascotas' | 'consumibles' | 'real';

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

export interface ShopItem {
  id: string;
  title: string;
  cost: number;
  category: ItemCategory;
  icon: string;
  description?: string;
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
}

export interface GameState {
  stats: CharacterStats;
  quests: Quest[];
  inventory: string[]; // IDs de items comprados
  shopSeeds: {
    daily: string;
    weekly: string;
    monthly: string;
  };
}