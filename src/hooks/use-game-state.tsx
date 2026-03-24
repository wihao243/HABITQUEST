import { useState, useEffect } from 'react';
import { CharacterStats, Quest, Reward, StatType } from '../types/game';
import { showSuccess, showError } from '../utils/toast';

const INITIAL_STATS: CharacterStats = {
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
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('habitquest_quests');
    return saved ? JSON.parse(saved) : [];
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('habitquest_rewards');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: '1h de Netflix', cost: 20, type: 'real', icon: 'Tv' },
      { id: '2', title: 'Pizza el Viernes', cost: 150, type: 'real', icon: 'Pizza' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('habitquest_stats', JSON.stringify(stats));
    localStorage.setItem('habitquest_quests', JSON.stringify(quests));
    localStorage.setItem('habitquest_rewards', JSON.stringify(rewards));
  }, [stats, quests, rewards]);

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
  };

  const buyReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (stats.gold >= reward.cost) {
      setStats(prev => ({ ...prev, gold: prev.gold - reward.cost }));
      showSuccess(`¡Canjeado: ${reward.title}! Disfruta tu recompensa.`);
    } else {
      showError("No tienes suficiente oro, ¡sigue esforzándote!");
    }
  };

  return { stats, quests, rewards, completeQuest, takeDamage, addQuest, buyReward };
}