import { useState, useEffect, useMemo } from 'react';
import { CharacterStats, Quest, ShopItem, StatType } from '../types/game';
import { ALL_ITEMS } from '../data/items';
import { showSuccess, showError } from '../utils/toast';

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
};

// Función auxiliar para obtener el número de semana real (ISO)
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
    if (saved) return { ...INITIAL_STATS, ...JSON.parse(saved) };
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
    daily: string[], weekly: string[], monthly: string[], real: string[]
  }>(() => {
    const saved = localStorage.getItem('habitquest_bought_rotation');
    return saved ? JSON.parse(saved) : { daily: [], weekly: [], monthly: [], real: [] };
  });

  // Semillas únicas para cada periodo
  const seeds = useMemo(() => {
    const d = virtualTime;
    return {
      day: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
      week: `${d.getFullYear()}-W${getISOWeek(d)}`,
      month: `${d.getFullYear()}-${d.getMonth()}`
    };
  }, [virtualTime]);

  // Resetear stock cuando cambian las semillas
  useEffect(() => {
    const lastSeedsStr = localStorage.getItem('habitquest_last_seeds');
    const lastSeeds = lastSeedsStr ? JSON.parse(lastSeedsStr) : {};
    
    setBoughtInRotation(prev => {
      const next = { ...prev };
      let changed = false;

      if (lastSeeds.day !== seeds.day) { next.daily = []; changed = true; }
      if (lastSeeds.week !== seeds.week) { next.weekly = []; changed = true; }
      if (lastSeeds.month !== seeds.month) { next.monthly = []; changed = true; }

      if (changed) {
        localStorage.setItem('habitquest_last_seeds', JSON.stringify(seeds));
        return next;
      }
      return prev;
    });
  }, [seeds]);

  useEffect(() => {
    localStorage.setItem('habitquest_stats', JSON.stringify(stats));
    localStorage.setItem('habitquest_quests', JSON.stringify(quests));
    localStorage.setItem('habitquest_inventory', JSON.stringify(inventory));
    localStorage.setItem('habitquest_time', virtualTime.toISOString());
    localStorage.setItem('habitquest_bought_rotation', JSON.stringify(boughtInRotation));
  }, [stats, quests, inventory, virtualTime, boughtInRotation]);

  // Generador de objetos basado en semilla (Seeded Random)
  const shopItems = useMemo(() => {
    const getSeededItems = (seed: string, count: number, excludeCategories: string[]) => {
      const pool = ALL_ITEMS.filter(item => !excludeCategories.includes(item.category));
      if (pool.length === 0) return [];

      // Hash simple de la semilla
      let h = 0;
      for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
      
      const result: ShopItem[] = [];
      const tempPool = [...pool];
      
      for (let i = 0; i < count && tempPool.length > 0; i++) {
        // Generador congruencial lineal para obtener el siguiente índice
        h = (h * 1664525 + 1013904223) >>> 0;
        const index = h % tempPool.length;
        result.push(tempPool.splice(index, 1)[0]);
      }
      return result;
    };

    return {
      daily: getSeededItems(seeds.day, 5, ['real']),
      weekly: getSeededItems(seeds.week, 5, ['real']),
      monthly: getSeededItems(seeds.month, 5, ['real']),
      real: ALL_ITEMS.filter(item => item.category === 'real')
    };
  }, [seeds]);

  const buyItem = (item: ShopItem, source: 'daily' | 'weekly' | 'monthly' | 'real') => {
    if (boughtInRotation[source].includes(item.id)) {
      showError("Agotado en esta rotación.");
      return;
    }
    if (stats.gold >= item.cost) {
      setStats(prev => ({ ...prev, gold: prev.gold - item.cost }));
      if (item.category !== 'real') setInventory(prev => [...prev, item.id]);
      setBoughtInRotation(prev => ({ ...prev, [source]: [...prev[source], item.id] }));
      showSuccess(`¡Comprado: ${item.title}!`);
    } else {
      showError("No tienes suficiente oro.");
    }
  };

  const useItem = (itemId: string) => {
    const item = ALL_ITEMS.find(i => i.id === itemId);
    if (!item || !item.effect) return;

    setStats(prev => {
      const next = { ...prev };
      const { effect } = item;
      if (effect.type === 'hp') next.hp = Math.min(next.maxHp, next.hp + effect.value);
      if (effect.type === 'gold') next.gold += effect.value;
      if (effect.type === 'xp') {
        next.xp += effect.value;
        while (next.xp >= next.maxXp) {
          next.level += 1;
          next.xp -= next.maxXp;
          next.maxXp = Math.floor(next.maxXp * 1.2);
          showSuccess("¡NIVEL SUBIDO!");
        }
      }
      if (effect.type === 'stat' && effect.stat) next.attributes[effect.stat] += effect.value;
      return next;
    });

    const index = inventory.indexOf(itemId);
    if (index > -1) {
      const newInv = [...inventory];
      newInv.splice(index, 1);
      setInventory(newInv);
    }
    showSuccess(`¡Usado: ${item.title}!`);
  };

  const advanceTime = (days: number) => {
    const newDate = new Date(virtualTime);
    newDate.setDate(newDate.getDate() + days);
    setVirtualTime(newDate);
    showSuccess(`Tiempo avanzado ${days} días.`);
  };

  const updateProfile = (updates: Partial<CharacterStats>) => setStats(prev => ({ ...prev, ...updates }));
  const addQuest = (q: any) => setQuests(prev => [...prev, { ...q, id: Math.random().toString(36).substr(2, 9), completed: false, streak: 0 }]);
  const updateQuest = (id: string, u: any) => setQuests(prev => prev.map(q => q.id === id ? { ...q, ...u } : q));
  const deleteQuest = (id: string) => setQuests(prev => prev.filter(q => q.id !== id));
  const completeQuest = (id: string) => {
    const q = quests.find(x => x.id === id);
    if (!q) return;
    const xp = q.difficulty === 'easy' ? 10 : q.difficulty === 'medium' ? 25 : 50;
    const gold = q.difficulty === 'easy' ? 5 : q.difficulty === 'medium' ? 15 : 30;
    setStats(prev => ({ ...prev, gold: prev.gold + gold, xp: prev.xp + xp }));
    if (q.type === 'todo') setQuests(prev => prev.filter(x => x.id !== id));
    else setQuests(prev => prev.map(x => x.id === id ? { ...x, completed: true, streak: (x.streak || 0) + 1 } : x));
    showSuccess(`+${xp} XP | +${gold} Oro`);
  };
  const takeDamage = (a: number) => setStats(prev => ({ ...prev, hp: Math.max(0, prev.hp - a) }));

  const adminReset = () => { 
    setStats(INITIAL_STATS); setQuests([]); setInventory([]); setVirtualTime(new Date()); 
    setBoughtInRotation({ daily: [], weekly: [], monthly: [], real: [] }); localStorage.clear(); 
  };
  const adminAddGold = (a: number) => setStats(prev => ({ ...prev, gold: prev.gold + a }));
  const adminLevelUp = () => setStats(prev => ({ ...prev, level: prev.level + 1 }));
  const adminClearInventory = () => setInventory([]);

  return { 
    stats, quests, inventory, shopItems, virtualTime, boughtInRotation,
    completeQuest, takeDamage, addQuest, updateQuest, deleteQuest, buyItem, useItem, updateProfile,
    adminReset, adminAddGold, adminLevelUp, adminClearInventory, advanceTime
  };
}