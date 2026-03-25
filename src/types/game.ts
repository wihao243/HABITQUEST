export type StatType = 'fuerza' | 'inteligencia' | 'espiritualidad' | 'carisma';
export type ItemCategory = 'dopamina' | 'gastronomia' | 'relax' | 'hobbies' | 'social';

export interface ItemEffect {
  type: 'hp' | 'xp' | 'gold' | 'stat';
  value: number;
  stat?: StatType;
  // Nuevos efectos de tiempo
  timer?: number; // minutos
  daily?: boolean;
  weekly?: boolean;
  monthly?: boolean;
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
  currentStreak: number;
  maxStreak: number;
  perfectDays: number;
  waterDrank: number;
  exerciseDays: number;
  cardioSessions: number;
  healthyMeals: number;
  stepsMax: number;
  exerciseHours: number;
  pagesRead: number;
  languagePractice: number;
  meditationHours: number;
  deepWorkSessions: number;
  journalEntries: number;
  noSnoozeDays: number;
  cosmeticsBought: number;
  petsOwned: number;
  realLifeRewardsBought: number;
  lowHpHeals: number;
  friendsInvited: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'rachas' | 'salud' | 'mente' | 'economia' | 'social';
  requirement: (stats: GameStats, char: CharacterStats) => boolean;
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
  // Nuevos temporizadores
  activeTimers: Record<string, number>; // id: minutos restantes
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
  createdAt?: string;
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