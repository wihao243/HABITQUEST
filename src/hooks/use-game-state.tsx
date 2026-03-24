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

export function useGameState() {
  // Tiempo virtual para pruebas
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

  useEffect(() => {
    localStorage.setItem('habitquest_stats', JSON.stringify(stats));
    localStorage.setItem('habitquest_quests', JSON.stringify(quests));
    localStorage.setItem('habitquest_inventory', JSON.stringify(inventory));
    localStorage.setItem('habitquest_time', virtualTime.toISOString());
  }, [stats, quests, inventory, virtualTime]);

  const shopItems = useMemo(() => {
    const daySeed = `${virtualTime.getFullYear()}-${virtualTime.getMonth()}-${virtualTime.getDate()}`;
    const weekSeed = `${virtualTime.getFullYear()}-W${Math.ceil(virtualTime.getDate() / 7)}`;
    const monthSeed = `${virtualTime.getFullYear()}-${virtualTime.getMonth()}`;

    const getItems = (seed: string, count: number, excludeCategories: string[]) => {
      const filtered = ALL_ITEMS.filter(item => !excludeCategories.includes(item.category));
      let hash = 0;
      for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      
      return [...filtered]
        .sort(() => (Math.abs(hash++) % 100) - 50)
        .slice(0, count);
    };

    return {
      daily: getItems(daySeed, 5, ['real']),
      weekly: getItems(weekSeed, 5, ['real']),
      monthly: getItems(monthSeed, 5, ['real']),
      real: ALL_ITEMS.filter(item => item.category === 'real')
    };
  }, [virtualTime]);

  const buyItem = (item: ShopItem) => {
    const isPermanent = item.category !== 'consumibles' && item.category !== 'real';
    
    if (isPermanent && inventory.includes(item.id)) {
      showError("Ya posees este objeto único.");
      return;
    }

    if (stats.gold >= item.cost) {
      setStats(prev => ({ ...prev, gold: prev.gold - item.cost }));
      if (isPermanent) {
        setInventory(prev => [...prev, item.id]);
      }
      showSuccess(`¡Comprado: ${item.title}!`);
    } else {
      showError("No tienes suficiente oro.");
    }
  };

  const advanceTime = (days: number) => {
    const newDate = new Date(virtualTime);
    newDate.setDate(newDate.getDate() + days);
    setVirtualTime(newDate);
    showSuccess(`Tiempo avanzado ${days} días`);
  };

  // ... (resto de funciones de misiones y admin se mantienen igual)
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

  const adminReset = () => { setStats(INITIAL_STATS); setQuests([]); setInventory([]); setVirtualTime(new Date()); localStorage.clear(); };
  const adminAddGold = (a: number) => setStats(prev => ({ ...prev, gold: prev.gold + a }));
  const adminLevelUp = () => setStats(prev => ({ ...prev, level: prev.level + 1 }));
  const adminClearInventory = () => setInventory([]);

  return { 
    stats, quests, inventory, shopItems, virtualTime,
    completeQuest, takeDamage, addQuest, updateQuest, deleteQuest, buyItem, updateProfile,
    adminReset, adminAddGold, adminLevelUp, adminClearInventory, advanceTime
  };
}