import { useState, useMemo } from "react";
import { CharacterStats, Quest, Monster, ShopItem } from "@/types/game";
import { ALL_ITEMS } from "@/data/items";
import { showSuccess, showError } from "@/utils/toast";

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

// Función para obtener una semilla determinista basada en la fecha
const getSeed = (date: Date, type: 'daily' | 'weekly' | 'monthly') => {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  
  if (type === 'daily') return y * 10000 + m * 100 + d;
  if (type === 'monthly') return y * 100 + m;
  
  // Para semanal, usamos el número de semana aproximado
  const firstDayOfYear = new Date(y, 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return y * 100 + weekNum;
};

// Función para barajar un array de forma determinista con una semilla
const getRotatedItems = (items: ShopItem[], seed: number, count: number) => {
  if (items.length <= count) return items;
  
  const shuffled = [...items].sort((a, b) => {
    const valA = Math.sin(seed + a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) * 10000;
    const valB = Math.sin(seed + b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) * 10000;
    return (valA - Math.floor(valA)) - (valB - Math.floor(valB));
  });
  
  return shuffled.slice(0, count);
};

export const useGameState = () => {
  const [stats, setStats] = useState<CharacterStats>(INITIAL_CHARACTER);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [virtualTime, setVirtualTime] = useState(new Date());
  const [activeCombat, setActiveCombat] = useState<Monster | null>(null);

  // Lógica de rotación de la tienda
  const shopItems = useMemo(() => {
    const dailyPool = ALL_ITEMS.filter(item => item.effect.daily);
    const weeklyPool = ALL_ITEMS.filter(item => item.effect.weekly);
    const monthlyPool = ALL_ITEMS.filter(item => item.effect.monthly);

    return {
      daily: getRotatedItems(dailyPool, getSeed(virtualTime, 'daily'), 5),
      weekly: getRotatedItems(weeklyPool, getSeed(virtualTime, 'weekly'), 5),
      monthly: getRotatedItems(monthlyPool, getSeed(virtualTime, 'monthly'), 5),
    };
  }, [virtualTime]);

  const buyItem = (item: ShopItem) => {
    if (stats.gold < item.cost) {
      showError("No tienes suficiente oro.");
      return;
    }

    setStats(prev => ({
      ...prev,
      gold: prev.gold - item.cost,
      gameStats: {
        ...prev.gameStats,
        itemsBought: prev.gameStats.itemsBought + 1
      }
    }));
    setInventory(prev => [...prev, item.id]);
    showSuccess(`Has comprado: ${item.title}`);
  };

  const useItem = (id: string) => {
    const item = ALL_ITEMS.find(i => i.id === id);
    if (!item) return;

    setInventory(prev => {
      const index = prev.indexOf(id);
      if (index > -1) {
        const newInv = [...prev];
        newInv.splice(index, 1);
        return newInv;
      }
      return prev;
    });

    showSuccess(`Has canjeado: ${item.title}. ¡Disfruta tu recompensa!`);
  };

  const adminAddGold = (amount: number) => {
    setStats(prev => ({ 
      ...prev, 
      gold: prev.gold + amount,
      gameStats: { ...prev.gameStats, totalGoldEarned: prev.gameStats.totalGoldEarned + amount }
    }));
    showSuccess(`Añadidas ${amount} monedas de oro.`);
  };

  const adminLevelUp = () => {
    setStats(prev => ({
      ...prev,
      level: prev.level + 1,
      maxHp: prev.maxHp + 10,
      hp: prev.maxHp + 10,
      maxXp: Math.floor(prev.maxXp * 1.2),
      xp: 0,
      attributes: {
        fuerza: prev.attributes.fuerza + 1,
        inteligencia: prev.attributes.inteligencia + 1,
        espiritualidad: prev.attributes.espiritualidad + 1,
        carisma: prev.attributes.carisma + 1,
      }
    }));
    showSuccess("¡Nivel aumentado!");
  };

  const adminReset = () => {
    setStats(INITIAL_CHARACTER);
    setQuests([]);
    setInventory([]);
    setVirtualTime(new Date());
    showSuccess("Partida reseteada.");
  };

  const adminClearInventory = () => {
    setInventory([]);
    showSuccess("Inventario vaciado.");
  };

  const advanceTime = (days: number) => {
    const newTime = new Date(virtualTime);
    newTime.setDate(newTime.getDate() + days);
    setVirtualTime(newTime);
    showSuccess(`Tiempo avanzado ${days} días.`);
  };

  const updateProfile = (updates: Partial<CharacterStats>) => {
    setStats(prev => ({ ...prev, ...updates }));
    showSuccess("Perfil actualizado.");
  };

  return {
    stats,
    quests,
    inventory,
    shopItems,
    virtualTime,
    boughtInRotation: {},
    activeCombat,
    completeQuest: (id: string) => {
      const quest = quests.find(q => q.id === id);
      if (!quest) return;

      // Recompensas básicas por misión
      const rewards = {
        easy: { xp: 10, gold: 5, attr: 0.1 },
        medium: { xp: 25, gold: 15, attr: 0.2 },
        hard: { xp: 60, gold: 40, attr: 0.5 },
      };

      const r = rewards[quest.difficulty];

      setStats(prev => ({
        ...prev,
        xp: prev.xp + r.xp,
        gold: prev.gold + r.gold,
        attributes: {
          ...prev.attributes,
          [quest.stat]: prev.attributes[quest.stat] + r.attr
        },
        gameStats: {
          ...prev.gameStats,
          totalGoldEarned: prev.gameStats.totalGoldEarned + r.gold,
          tasksCompleted: quest.type === 'todo' ? prev.gameStats.tasksCompleted + 1 : prev.gameStats.tasksCompleted,
          habitsCompleted: quest.type === 'habit' ? prev.gameStats.habitsCompleted + 1 : prev.gameStats.habitsCompleted,
          dailiesCompleted: quest.type === 'daily' ? prev.gameStats.dailiesCompleted + 1 : prev.gameStats.dailiesCompleted,
        }
      }));

      if (quest.type === 'todo') {
        setQuests(prev => prev.filter(q => q.id !== id));
      } else {
        setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));
      }

      showSuccess(`¡Misión completada! +${r.gold} Oro, +${r.xp} XP`);
    },
    takeDamage: (amount: number) => {
      setStats(prev => ({ ...prev, hp: Math.max(0, prev.hp - amount) }));
      showError(`¡Has perdido ${amount} HP!`);
    },
    addQuest: (data: any) => {
      const newQuest: Quest = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        completed: false,
        streak: 0
      };
      setQuests(prev => [...prev, newQuest]);
      showSuccess("Misión añadida.");
    },
    updateQuest: (id: string, data: any) => {
      setQuests(prev => prev.map(q => q.id === id ? { ...q, ...data } : q));
      showSuccess("Misión actualizada.");
    },
    deleteQuest: (id: string) => {
      setQuests(prev => prev.filter(q => q.id !== id));
      showSuccess("Misión eliminada.");
    },
    buyItem,
    useItem,
    updateProfile,
    adminReset,
    adminAddGold,
    adminLevelUp,
    adminClearInventory,
    advanceTime,
    completePenalty: (id: string) => {
      setStats(prev => ({
        ...prev,
        activePenalties: prev.activePenalties.filter(pId => pId !== id)
      }));
      showSuccess("Penitencia cumplida.");
    },
    revive: () => {
      setStats(prev => ({ ...prev, hp: prev.maxHp, activePenalties: [] }));
      showSuccess("¡Has revivido!");
    },
    setActiveCombat,
    winCombat: (xp: number, gold: number, hp: number) => {
      setStats(prev => ({
        ...prev,
        hp,
        xp: prev.xp + xp,
        gold: prev.gold + gold,
        gameStats: {
          ...prev.gameStats,
          monstersDefeated: prev.gameStats.monstersDefeated + 1,
          totalGoldEarned: prev.gameStats.totalGoldEarned + gold
        }
      }));
      setActiveCombat(null);
      showSuccess(`¡Victoria! Ganaste ${xp} XP y ${gold} Oro.`);
    },
    loseCombat: (hp: number) => {
      setStats(prev => ({ ...prev, hp: 0 }));
      setActiveCombat(null);
      showError("Has sido derrotado...");
    },
    escapeCombat: (hp: number) => {
      setStats(prev => ({ ...prev, hp }));
      setActiveCombat(null);
      showSuccess("Escapaste del combate.");
    },
  };
};