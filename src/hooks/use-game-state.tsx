import { useState, useEffect, useMemo } from 'react';
import { CharacterStats, Quest, ShopItem, StatType, Penalty, Monster } from '../types/game';
import { ALL_ITEMS } from '../data/items';
import { ALL_PENALTIES } from '../data/penalties';
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
  activePenalties: [],
  unlockedRegions: ['r1'],
  monsterCooldowns: {},
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
  }, [seeds, stats.hp]);

  useEffect(() => {
    localStorage.setItem('habitquest_stats', JSON.stringify(stats));
    localStorage.setItem('habitquest_quests', JSON.stringify(quests));
    localStorage.setItem('habitquest_inventory', JSON.stringify(inventory));
    localStorage.setItem('habitquest_time', virtualTime.toISOString());
    localStorage.setItem('habitquest_bought_rotation', JSON.stringify(boughtInRotation));
  }, [stats, quests, inventory, virtualTime, boughtInRotation]);

  const shopItems = useMemo(() => {
    const getSeededItems = (seed: string, count: number) => {
      const pool = ALL_ITEMS.filter(item => item.category !== 'real');
      if (pool.length === 0) return [];
      let h = 0;
      for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
      const result: ShopItem[] = [];
      const tempPool = [...pool];
      for (let i = 0; i < count && tempPool.length > 0; i++) {
        h = (h * 1664525 + 1013904223) >>> 0;
        const index = h % tempPool.length;
        result.push(tempPool.splice(index, 1)[0]);
      }
      return result;
    };
    return {
      daily: getSeededItems(seeds.day, 5),
      weekly: getSeededItems(seeds.week, 5),
      monthly: getSeededItems(seeds.month, 5)
    };
  }, [seeds]);

  const buyItem = (item: ShopItem, source: 'daily' | 'weekly' | 'monthly') => {
    if (stats.hp <= 0) return showError("Estás muerto. No puedes comprar.");
    if (boughtInRotation[source].includes(item.id)) return showError("Agotado.");
    if (stats.gold >= item.cost) {
      setStats(prev => ({ ...prev, gold: prev.gold - item.cost }));
      setInventory(prev => [...prev, item.id]);
      setBoughtInRotation(prev => ({ ...prev, [source]: [...prev[source], item.id] }));
      showSuccess(`¡Comprado: ${item.title}!`);
    } else showError("Oro insuficiente.");
  };

  const useItem = (itemId: string) => {
    const item = ALL_ITEMS.find(i => i.id === itemId);
    if (!item || !item.effect) return;
    setStats(prev => {
      let next = { ...prev };
      const { effect } = item;
      if (effect.type === 'hp') next.hp = Math.min(next.maxHp, next.hp + effect.value);
      if (effect.type === 'gold') next.gold += effect.value;
      if (effect.type === 'xp') {
        next.xp += effect.value;
        next = checkLevelUp(next);
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

  const completeQuest = (id: string) => {
    if (stats.hp <= 0) return showError("Estás muerto. No puedes completar misiones.");
    const q = quests.find(x => x.id === id);
    if (!q) return;
    const xp = q.difficulty === 'easy' ? 10 : q.difficulty === 'medium' ? 25 : 50;
    const gold = q.difficulty === 'easy' ? 5 : q.difficulty === 'medium' ? 15 : 30;
    setStats(prev => {
      let next = { ...prev, gold: prev.gold + gold, xp: prev.xp + xp };
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
      if (newHp === 0 && prev.hp > 0) {
        const random = ALL_PENALTIES[Math.floor(Math.random() * ALL_PENALTIES.length)];
        penalties = [random.id];
        showError("¡HAS MUERTO! Debes cumplir tu penitencia.");
      }
      return { ...prev, hp: newHp, activePenalties: penalties };
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
  const addQuest = (q: any) => setQuests(prev => [...prev, { ...q, id: Math.random().toString(36).substr(2, 9), completed: false, streak: 0 }]);
  const updateQuest = (id: string, u: any) => setQuests(prev => prev.map(q => q.id === id ? { ...q, ...u } : q));
  const deleteQuest = (id: string) => setQuests(prev => prev.filter(q => q.id !== id));

  const adminReset = () => { 
    setStats(INITIAL_STATS); setQuests([]); setInventory([]); setVirtualTime(new Date()); 
    setBoughtInRotation({ daily: [], weekly: [], monthly: [] }); localStorage.clear(); 
  };
  const adminAddGold = (a: number) => setStats(prev => ({ ...prev, gold: prev.gold + a }));
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