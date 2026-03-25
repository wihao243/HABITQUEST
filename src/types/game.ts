export type StatType = 'fuerza' | 'inteligencia' | 'espiritualidad' | 'carisma';
export type ItemCategory = 'armas' | 'armaduras' | 'mascotas' | 'consumibles' | 'real';

export interface ItemEffect {
  type: 'hp' | 'xp' | 'gold' | 'stat';
  value: number;
  stat?: StatType;
}

export interface DailyActivity {
  date: string; // ISO date string
  tasks: number;
  habits: number;
  dailies: number;
}

export interface GameStats {
  tasksCompleted: number;
  habitsCompleted: number;
  dailiesCompleted: number;
  monstersDefeated: number;
  bossesDefeated: number;
  totalGoldEarned: number;
  totalDeaths: number;
  itemsBought: number;
  history: DailyActivity[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: (stats: GameStats) => boolean;
  unlocked?: boolean;
}

export interface CharacterStats {
  name: string;
  avatar: string;
  title: string;
  level: number;
  xp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  gold: number;
  attributes: Record<StatType, number>;
  activePenalties: string[];
  unlockedRegions: string[];
  monsterCooldowns: Record<string, string>;
  gameStats: GameStats;
}

export interface Monster {
  id: string;
  name: string;
  avatar: string;
  level: number;
  hp: number;
  maxHp: number;
  damage: number;
  xpReward: number;
  goldReward: number;
  description: string;
  isBoss?: boolean;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  minLevel: number;
  monsters: Monster[];
  boss?: Monster;
  icon: string;
  color: string;
}

export interface Penalty {
  id: string;
  title: string;
  description: string;
  category: 'fisico' | 'limpieza' | 'digital' | 'social';
  icon: string;
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
  description: string;
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
  effect?: ItemEffect;
}