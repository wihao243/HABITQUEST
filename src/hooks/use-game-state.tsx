import { useState, useEffect, useMemo } from 'react';
import { CharacterStats, Quest, ShopItem, StatType, Penalty, Monster, GameStats, DailyActivity } from '../types/game';
import { ALL_ITEMS } from '../data/items';
import { ALL_PENALTIES } from '../data/penalties';
import { showSuccess, showError } from '../utils/toast';

const INITIAL_GAME_STATS: GameStats = {
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
};

const INITIAL_STATS: CharacterStats = {
  name: "Héroe de la Rutina",
  avatar: "🧙‍♂️",
  title: "Novato del Hábito",
  level: 1,
  xp: 0,
  maxXp: 100,
  hp: 50,
  maxHp: 50,
  gold: 0,
  attributes: {
    fuerza: 1,
    inteligencia: 1,
    espiritualidad: 1,
    carisma: 1,
  },
  activePenalties: [],
  unlockedRegions: ['r1'],
  monsterCooldowns: {},
  gameStats: INITIAL_GAME_STATS,
  activeTimers: {},
};

const getISOWeek = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export function useGameState() {
  const [virtualTime, setVirtualTime] = useState(() => {
    const saved = localStorage.getItem('habitquest_time');
    return saved ? new Date(saved) : new Date();
  });

  const [stats, setStats] = useState<CharacterStats>(() => {
    const saved = localStorage.getItem('habitquest_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_STATS, ...parsed, gameStats: { ...INITIAL_GAME_STATS, ...parsed.gameStats } };
    }
    return INITIAL_STATS;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('habitquest_quests');
    return saved ? JSON.parse(saved) : [];
  });

  const [inventory, setInventory] = useState<string[]>(() => {
    const saved = localStorage.getItem('habitquest_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [boughtInRotation, setBoughtInRotation] = useState<{
    daily: string[], weekly: string[], monthly: string[]
  }>(() => {
    const saved = localStorage.getItem('habitquest_bought_rotation');
    return saved ? JSON.parse(saved) : { daily: [], weekly: [], monthly: [] };
  });

  const [activeCombat, setActiveCombat] = useState<Monster | null>(null);

  const seeds = useMemo(() => {
    const d = virtualTime;
    return {
      day: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
      week: `${d.getFullYear()}-W${getISOWeek(d)}`,
      month: `${d.getFullYear()}-${d.getMonth()}`
    };
  }, [virtualTime]);

  const shopItems = useMemo(() => {
    return {
      daily: ALL_ITEMS.filter(i => i.effect?.daily),
      weekly: ALL_ITEMS.filter(i => i.effect?.weekly),
      monthly: ALL_ITEMS.filter(i => i.effect?.monthly),
    };
  }, []);

  const checkLevelUp = (currentStats: CharacterStats): CharacterStats => {
    let next = { ...currentStats };
    while (next.xp >= next.maxXp) {
      next.level += 1;
      next.xp -= next.maxXp;
      next.maxXp = Math.floor(next.maxXp * 1.2);
      next.maxHp += 15;
      next.hp = next.maxHp;
      next.attributes.fuerza += 0.5;
      next.attributes.inteligencia += 0.5;
      next.attributes.espiritualidad += 0.5;
      next.attributes.carisma += 0.5;
      showSuccess(`¡NIVEL ${next.level}! Tus estadísticas han mejorado.`);
    }
    return next;
  };

  useEffect(() => {
    const lastSeedsStr = localStorage.getItem('habitquest_last_seeds');
    const lastSeeds = lastSeedsStr ? JSON.parse(lastSeedsStr) : {};
    
    if (lastSeeds.day !== seeds.day) {
      const allDailiesDone = quests.filter(q => q.type === 'daily').every(q => q.completed);
      if (allDailiesDone && quests.some(q => q.type === 'daily')) {
        setStats(prev => ({
          ...prev,
          gameStats: { ...prev.gameStats, perfectDays: prev.gameStats.perfectDays + 1 }
        }));
      }

      setQuests(prev => prev.map(q => (q.type === 'daily' || q.type === 'habit') ? { ...q, completed: false } : q));
      
      if (stats.hp <= 0) {
        const available = ALL_PENALTIES.filter(p => !stats.activePenalties.includes(p.id));
        if (available.length > 0) {
          const random = available[Math.floor(Math.random() * available.length)];
          setStats(prev => ({ ...prev, activePenalties: [...prev.activePenalties, random.id] }));
          showError("¡Un nuevo día de muerte! Se ha añadido otro castigo.");
        }
      }
      setBoughtInRotation(prev => {
        const next = { ...prev };
        next.daily = [];
        if (lastSeeds.week !== seeds.week) next.weekly = [];
        if (lastSeeds.month !== seeds.month) next.monthly = [];
        return next;
      });
      localStorage.setItem('habitquest_last_seeds', JSON.stringify(seeds));
    }
  }, [seeds, stats.hp, quests]);

  useEffect(() => {
    localStorage.setItem('habitquest_stats', JSON.stringify(stats));
    localStorage.setItem('habitquest_quests', JSON.stringify(quests));
    localStorage.setItem('habitquest_inventory', JSON.stringify(inventory));
    localStorage.setItem('habitquest_time', virtualTime.toISOString());
    localStorage.setItem('habitquest_bought_rotation', JSON.stringify(boughtInRotation));
  }, [stats, quests, inventory, virtualTime, boughtInRotation]);

  // Actualizar temporizadores activos
  useEffect(() => {
    const timers = { ...stats.activeTimers };
    Object.keys(timers).forEach(id => {
      if (timers[id] > 0) {
        timers[id] = Math.max(0, timers[id] - 1);
      }
    });
    if (JSON.stringify(timers) !== JSON.stringify(stats.activeTimers)) {
      setStats(prev => ({ ...prev, activeTimers: timers }));
    }
  }, [stats.activeTimers, virtualTime]);

  const buyItem = (item: ShopItem, source: 'daily' | 'weekly' | 'monthly') => {
    if (stats.hp <= 0) return showError("Estás muerto. No puedes comprar.");
    if (boughtInRotation[source].includes(item.id)) return showError("Agotado.");
    if (stats.gold >= item.cost) {
      setStats(prev => ({ 
        ...prev, 
        gold: prev.gold - item.cost,
        gameStats: { 
          ...prev.gameStats, 
          itemsBought: prev.gameStats.itemsBought + 1,
          realLifeRewardsBought: prev.gameStats.realLifeRewardsBought + 1,
        }
      }));
      setInventory(prev => [...prev, item.id]);
      setBoughtInRotation(prev => ({ ...prev, [source]: [...prev[source], item.id] }));
      showSuccess(`¡Comprado: ${item.title}!`);
    } else showError("Oro insuficiente.");
  };

  const useItem = (itemId: string) => {
    const item = ALL_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    const index = inventory.indexOf(itemId);
    if (index > -1) {
      const newInv = [...inventory];
      newInv.splice(index, 1);
      setInventory(newInv);
    }

    // Activar temporizador si el objeto lo tiene
    if (item.effect?.timer) {
      setStats(prev => ({ 
        ...prev, 
        activeTimers: { ...prev.activeTimers, [itemId]: item.effect.timer }
      }));
      showSuccess(`¡Activado: ${item.title}! Duración: ${item.effect.timer} minutos.`);
    } else {
      showSuccess(`¡Has canjeado: ${item.title}! Disfruta tu recompensa.`);
    }
  };

  const completeQuest = (id: string) => {
    if (stats.hp <= 0) return showError("Estás muerto. No puedes completar misiones.");
    const q = quests.find(x => x.id === id);
    if (!q) return;
    const xp = q.difficulty === 'easy' ? 10 : q.difficulty === 'medium' ? 25 : 50;
    const gold = q.difficulty === 'easy' ? 5 : q.difficulty === 'medium' ? 15 : 30;
    
    const today = virtualTime.toISOString().split('T')[0];
    const hour = virtualTime.getHours();

    setStats(prev => {
      let nextGameStats = { ...prev.gameStats };
      const title = q.title.toLowerCase();
      if (title.includes('agua')) nextGameStats.waterDrank += 1;
      if (title.includes('ejercicio') || title.includes('gym')) {
        nextGameStats.exerciseDays += 1;
        nextGameStats.exerciseHours += 1;
      }
      if (title.includes('correr') || title.includes('cardio')) nextGameStats.cardioSessions += 1;
      if (title.includes('cocinar') || title.includes('sano')) nextGameStats.healthyMeals += 1;
      if (title.includes('leer')) nextGameStats.pagesRead += 10;
      if (title.includes('idioma') || title.includes('duolingo')) nextGameStats.languagePractice += 1;
      if (title.includes('meditar')) nextGameStats.meditationHours += 0.5;
      if (title.includes('trabajo') || title.includes('estudiar')) nextGameStats.deepWorkSessions += 1;
      if (title.includes('diario') || title.includes('escribir')) nextGameStats.journalEntries += 1;
      if (hour < 9) nextGameStats.noSnoozeDays += 1;

      const historyIndex = nextGameStats.history.findIndex(h => h.date === today);
      if (historyIndex > -1) {
        const day = nextGameStats.history[historyIndex];
        if (q.type === 'todo') day.tasks += 1;
        if (q.type === 'habit') day.habits += 1;
        if (q.type === 'daily') day.dailies += 1;
      } else {
        nextGameStats.history.push({
          date: today,
          tasks: q.type === 'todo' ? 1 : 0,
          habits: q.type === 'habit' ? 1 : 0,
          dailies: q.type === 'daily' ? 1 : 0,
        });
        if (nextGameStats.history.length > 30) nextGameStats.history.shift();
      }

      let next = { 
        ...prev, 
        gold: prev.gold + gold, 
        xp: prev.xp + xp,
        gameStats: {
          ...nextGameStats,
          totalGoldEarned: prev.gameStats.totalGoldEarned + gold,
          tasksCompleted: q.type === 'todo' ? prev.gameStats.tasksCompleted + 1 : prev.gameStats.tasksCompleted,
          habitsCompleted: q.type === 'habit' ? prev.gameStats.habitsCompleted + 1 : prev.gameStats.habitsCompleted,
          dailiesCompleted: q.type === 'daily' ? prev.gameStats.dailiesCompleted + 1 : prev.gameStats.dailiesCompleted,
          currentStreak: q.type === 'habit' ? (q.streak || 0) + 1 : prev.gameStats.currentStreak,
          maxStreak: Math.max(prev.gameStats.maxStreak, q.type === 'habit' ? (q.streak || 0) + 1 : 0)
        }
      };
      next = checkLevelUp(next);
      return next;
    });
    
    if (q.type === 'todo') setQuests(prev => prev.filter(x => x.id !== id));
    else setQuests(prev => prev.map(x => x.id === id ? { ...x, completed: true, streak: (x.streak || 0) + 1 } : x));
    showSuccess(`+${xp} XP | +${gold} Oro`);
  };

  const takeDamage = (amount: number) => {
    setStats(prev => {
      const newHp = Math.max(0, prev.hp - amount);
      let penalties = prev.activePenalties;
      let gameStats = { ...prev.gameStats };
      
      if (newHp === 0 && prev.hp > 0) {
        const random = ALL_PENALTIES[Math.floor(Math.random() * ALL_PENALTIES.length)];
        penalties = [random.id];
        gameStats.totalDeaths += 1;
        showError("¡HAS MUERTO! Debes cumplir tu penitencia.");
      }
      return { ...prev, hp: newHp, activePenalties: penalties, gameStats };
    });
  };

  const winCombat = (xp: number, gold: number, remainingHp: number) => {
    if (!activeCombat) return;
    
    const respawnTime = new Date(virtualTime);
    respawnTime.setHours(respawnTime.getHours() + 1);

    setStats(prev => {
      let next = { 
        ...prev, 
        gold: prev.gold + gold, 
        xp: prev.xp + xp, 
        hp: remainingHp,
        monsterCooldowns: {
          ...prev.monsterCooldowns,
          [activeCombat.id]: respawnTime.toISOString()
        },
        gameStats: {
          ...prev.gameStats,
          totalGoldEarned: prev.gameStats.totalGoldEarned + gold,
          monstersDefeated: prev.gameStats.monstersDefeated + 1,
          bossesDefeated: activeCombat.isBoss ? prev.gameStats.bossesDefeated + 1 : prev.gameStats.bossesDefeated,
        }
      };
      next = checkLevelUp(next);
      return next;
    });
    setActiveCombat(null);
    showSuccess(`¡Victoria! +${xp} XP | +${gold} Oro`);
  };

  const loseCombat = (remainingHp: number) => {
    takeDamage(stats.hp - remainingHp);
    setActiveCombat(null);
  };

  const escapeCombat = (remainingHp: number) => {
    setStats(prev => ({ ...prev, hp: remainingHp }));
    setActiveCombat(null);
    showError("Has escapado del combate.");
  };

  const completePenalty = (id: string) => {
    setStats(prev => ({ ...prev, activePenalties: prev.activePenalties.filter(pId => pId !== id) }));
    showSuccess("Castigo cumplido.");
  };

  const revive = () => {
    if (stats.activePenalties.length > 0) return showError("Aún tienes castigos pendientes.");
    setStats(prev => ({ ...prev, hp: Math.floor(prev.maxHp * 0.2) }));
    showSuccess("¡Has vuelto a la vida!");
  };

  const advanceTime = (days: number) => {
    const newDate = new Date(virtualTime);
    newDate.setDate(newDate.getDate() + days);
    setVirtualTime(newDate);
    showSuccess(`Tiempo avanzado ${days} días.`);
  };

  const updateProfile = (updates: Partial<CharacterStats>) => setStats(prev => ({ ...prev, ...updates }));
  const addQuest = (q: any) => setQuests(prev => [...prev, { ...q, id: Math.random().toString(36).substr(2, 9), completed: false, streak: 0, createdAt: virtualTime.toISOString() }]);
  const updateQuest = (id: string, u: any) => setQuests(prev => prev.map(q => q.id === id ? { ...q, ...u } : q));
  const deleteQuest = (id: string) => setQuests(prev => prev.filter(q => q.id !== id));

  const adminReset = () => { 
    setStats(INITIAL_STATS); setQuests([]); setInventory([]); setVirtualTime(new Date()); 
    setBoughtInRotation({ daily: [], weekly: [], monthly: [] }); localStorage.clear(); 
  };
  const adminAddGold = (a: number) => setStats(prev => ({ 
    ...prev, 
    gold: prev.gold + a,
    gameStats: { ...prev.gameStats, totalGoldEarned: prev.gameStats.totalGoldEarned + a }
  }));
  const adminLevelUp = () => setStats(prev => {
    let next = { ...prev, xp: prev.maxXp };
    return checkLevelUp(next);
  });
  const adminClearInventory = () => setInventory([]);

  return { 
    stats, quests, inventory, shopItems, virtualTime, boughtInRotation, activeCombat,
    completeQuest, takeDamage, addQuest, updateQuest, deleteQuest, buyItem, useItem, updateProfile,
    adminReset, adminAddGold, adminLevelUp, adminClearInventory, advanceTime,
    completePenalty, revive, setActiveCombat, winCombat, loseCombat, escapeCombat
  };
}