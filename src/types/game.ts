export type ItemCategory = 'dopamina' | 'gastronomia' | 'relax' | 'hobbies' | 'social' | 'consumible';

export interface AttributeDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ItemEffect {
  timer?: number;
  daily?: boolean;
  weekly?: boolean;
  monthly?: boolean;
  hp?: number;
  xpMultiplier?: number;
  xpFlat?: number;
}

export interface DailyActivity {
  date: string;
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

export interface CharacterStats {
  name: string;
  avatar: string;
  title: string;
  bio?: string;
  level: number;
  hp: number;
  maxHp: number;
  xp: number;
  maxXp: number;
  gold: number;
  attributes: Record<string, number>;
  attributeDefinitions: AttributeDefinition[];
  gameStats: GameStats;
  activePenalties: string[];
  customPenalties?: Penalty[];
  monsterCooldowns: Record<string, string>;
  blockedUntil?: string;
  banCount: number;
  isPermanentlyBanned?: boolean;
  lastResetDate?: string;
  activeTimers: Record<string, number>;
}

export interface Quest {
  id: string;
  title: string;
  type: 'daily' | 'habit' | 'todo';
  difficulty: 'easy' | 'medium' | 'hard';
  stat: string;
  completed: boolean;
  failed?: boolean;
  streak?: number;
  lastCompletedDate?: string;
  recoverableStreak?: number;
  history?: string[];
  deadline?: string; // Nueva propiedad para fecha límite
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
  combatType?: 'standard' | 'clicker';
}

export interface Region {
  id: string;
  name: string;
  description: string;
  minLevel: number;
  icon: string;
  color: string;
  monsters: Monster[];
  boss?: Monster;
}

export interface ShopItem {
  id: string;
  title: string;
  cost: number;
  category: ItemCategory;
  icon: string;
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
  description: string;
  effect: ItemEffect;
}

export interface Achievement {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  requirement: (gameStats: GameStats, charStats: CharacterStats) => boolean;
}

export interface Penalty {
  id: string;
  category: 'fisico' | 'limpieza' | 'digital' | 'social' | 'personalizado';
  icon: string;
  title: string;
  description: string;
}