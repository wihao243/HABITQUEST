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
  const [stats, setStats] = useState<CharacterStats>(() => {
    const saved = localStorage.getItem('habitquest_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_STATS, ...parsed };
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

  useEffect(() => {
    localStorage.setItem('habitquest_stats', JSON.stringify(stats));
    localStorage.setItem('habitquest_quests', JSON.stringify(quests));
    localStorage.setItem('habitquest_inventory', JSON.stringify(inventory));
  }, [stats, quests, inventory]);

  const shopItems = useMemo(() => {
    const now = new Date();
    const daySeed = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const weekSeed = `${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`;
    const monthSeed = `${now.getFullYear()}-${now.getMonth()}`;

    const getItems = (seed: string, count: number, excludeCategories: string[]) => {
      const filtered = ALL_ITEMS.filter(item => !excludeCategories.includes(item.category));
      let hash = 0;
      for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      
      return [...filtered]
        .sort(() => (hash % 100) - 50)
        .slice(0, count);
    };

    return {
      daily: getItems(daySeed, 5, ['real']),
      weekly: getItems(weekSeed, 5, ['real']),
      monthly: getItems(monthSeed, 5, ['real']),
      real: ALL_ITEMS.filter(item => item.category === 'real')
    };
  }, []);

  const updateProfile = (updates: Partial<CharacterStats>) => {
    setStats(prev => ({ ...prev, ...updates }));
    showSuccess("¡Perfil actualizado!");
  };

  const addXp = (amount: number, stat: StatType) => {
    setStats(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;
      let newAttributes = { ...prev.attributes, [stat]: prev.attributes[stat] + 0.1 };

      if (newXp >= newMaxXp) {
        newLevel += 1;
        newXp -= newMaxXp;
        newMaxXp = Math.floor(newMaxXp * 1.2);
        showSuccess(`¡NIVEL SUBIDO! Ahora eres nivel ${newLevel}`);
      }

      return { ...prev, xp: newXp, level: newLevel, maxXp: newMaxXp, attributes: newAttributes };
    });
  };

  const completeQuest = (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (!quest) return;

    const xpReward = quest.difficulty === 'easy' ? 10 : quest.difficulty === 'medium' ? 25 : 50;
    const goldReward = quest.difficulty === 'easy' ? 5 : quest.difficulty === 'medium' ? 15 : 30;

    addXp(xpReward, quest.stat);
    setStats(prev => ({ ...prev, gold: prev.gold + goldReward }));
    
    if (quest.type === 'todo') {
      setQuests(prev => prev.filter(q => q.id !== id));
    } else {
      setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true, streak: (q.streak || 0) + 1 } : q));
    }
    
    showSuccess(`+${xpReward} XP | +${goldReward} Oro`);
  };

  const takeDamage = (amount: number) => {
    setStats(prev => {
      const newHp = Math.max(0, prev.hp - amount);
      if (newHp === 0) {
        showError("¡HAS MUERTO! Penalización aplicada.");
        return {
          ...prev,
          hp: prev.maxHp,
          level: Math.max(1, prev.level - 1),
          gold: Math.floor(prev.gold * 0.5),
        };
      }
      return { ...prev, hp: newHp };
    });
  };

  const addQuest = (newQuest: Omit<Quest, 'id' | 'completed' | 'streak'>) => {
    const quest: Quest = {
      ...newQuest,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      streak: 0,
    };
    setQuests(prev => [...prev, quest]);
    showSuccess("¡Misión añadida!");
  };

  const updateQuest = (id: string, updates: Partial<Quest>) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
    showSuccess("¡Misión actualizada!");
  };

  const deleteQuest = (id: string) => {
    setQuests(prev => prev.filter(q => q.id !== id));
    showSuccess("Misión eliminada");
  };

  const buyItem = (item: ShopItem) => {
    if (inventory.includes(item.id) && item.category !== 'consumibles' && item.category !== 'real') {
      showError("Ya posees este objeto único.");
      return;
    }

    if (stats.gold >= item.cost) {
      setStats(prev => ({ ...prev, gold: prev.gold - item.cost }));
      if (item.category !== 'consumibles' && item.category !== 'real') {
        setInventory(prev => [...prev, item.id]);
      }
      showSuccess(`¡Comprado: ${item.title}!`);
    } else {
      showError("No tienes suficiente oro.");
    }
  };

  return { stats, quests, inventory, shopItems, completeQuest, takeDamage, addQuest, updateQuest, deleteQuest, buyItem, updateProfile };
}