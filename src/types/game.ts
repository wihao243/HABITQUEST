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