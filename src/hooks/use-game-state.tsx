import { useState } from "react";
import { CharacterStats, Quest, Monster, ShopItem } from "@/types/game";

const INITIAL_GAME_STATS = {
  tasksCompleted: 0,
  habitsCompleted: 0,
  dailiesCompleted: 0,
  monstersDefeated: 0,
  bossesDefeated: 0,
  totalGoldEarned: 0,
  totalDeaths: 0,
  itemsBought: 0,
  history: [],
  currentStreak: 0,
  maxStreak: 0,
  perfectDays: 0,
  waterDrank: 0,
  exerciseDays: 0,
  cardioSessions: 0,
  healthyMeals: 0,
  stepsMax: 0,
  exerciseHours: 0,
  pagesRead: 0,
  languagePractice: 0,
  meditationHours: 0,
  deepWorkSessions: 0,
  journalEntries: 0,
  noSnoozeDays: 0,
  cosmeticsBought: 0,
  petsOwned: 0,
  realLifeRewardsBought: 0,
  lowHpHeals: 0,
  friendsInvited: 0,
};

const INITIAL_CHARACTER: CharacterStats = {
  name: "Héroe",
  avatar: "🧙‍♂️",
  title: "Héroe de la Rutina",
  level: 1,
  hp: 50,
  maxHp: 50,
  xp: 0,
  maxXp: 100,
  gold: 0,
  attributes: {
    fuerza: 1,
    inteligencia: 1,
    espiritualidad: 1,
    carisma: 1,
  },
  gameStats: INITIAL_GAME_STATS,
  activePenalties: [],
  activeTimers: {},
  monsterCooldowns: {},
};

export const useGameState = () => {
  const [stats, setStats] = useState<CharacterStats>(INITIAL_CHARACTER);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [virtualTime, setVirtualTime] = useState(new Date());
  const [activeCombat, setActiveCombat] = useState<Monster | null>(null);

  return {
    stats,
    quests,
    inventory,
    shopItems: { daily: [], weekly: [], monthly: [] },
    virtualTime,
    boughtInRotation: {},
    activeCombat,
    completeQuest: (id: string) => {},
    takeDamage: (amount: number) => {},
    addQuest: (data: any) => {},
    updateQuest: (id: string, data: any) => {},
    deleteQuest: (id: string) => {},
    buyItem: (item: ShopItem, source: string) => {},
    useItem: (id: string) => {},
    updateProfile: (updates: Partial<CharacterStats>) => {
      setStats(prev => ({ ...prev, ...updates }));
    },
    adminReset: () => {},
    adminAddGold: (amount: number) => {},
    adminLevelUp: () => {},
    adminClearInventory: () => {},
    advanceTime: (days: number) => {},
    completePenalty: (id: string) => {},
    revive: () => {},
    setActiveCombat,
    winCombat: (xp: number, gold: number, hp: number) => {},
    loseCombat: (hp: number) => {},
    escapeCombat: (hp: number) => {},
  };
};