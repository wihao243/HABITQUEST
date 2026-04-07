import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { CharacterStats, Quest, Monster, ShopItem } from "@/types/game";
import { ALL_ITEMS as INITIAL_ITEMS } from "@/data/items";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";

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

const getSeed = (date: Date, type: 'daily' | 'weekly' | 'monthly') => {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  if (type === 'daily') return y * 10000 + m * 100 + d;
  if (type === 'monthly') return y * 100 + m;
  const firstDayOfYear = new Date(y, 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return y * 100 + weekNum;
};

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
  const [boughtItems, setBoughtItems] = useState<Record<string, number>>({});
  const [pausedTimers, setPausedTimers] = useState<Record<string, boolean>>({});
  const [allItems, setAllItems] = useState<ShopItem[]>(INITIAL_ITEMS);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Manejo de sesión
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (!session) setLoading(false);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
        setIsInitialLoadDone(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Carga de datos del perfil
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          if (data.game_state) setStats(data.game_state);
          if (data.quests) setQuests(data.quests);
          if (data.inventory) setInventory(data.inventory);
          if (data.bought_items) setBoughtItems(data.bought_items);
          if (data.all_items) setAllItems(data.all_items);
        } else if (error && error.code === 'PGRST116') {
          // Crear perfil si no existe
          await supabase.from('profiles').insert({
            id: user.id,
            game_state: INITIAL_CHARACTER,
            quests: [],
            inventory: [],
            bought_items: {},
            all_items: INITIAL_ITEMS
          });
        }
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
        setIsInitialLoadDone(true);
      }
    };

    loadData();
  }, [user]);

  // Guardado automático
  const saveData = useCallback(async (
    currentStats: CharacterStats, 
    currentQuests: Quest[], 
    currentInv: string[], 
    currentBought: Record<string, number>, 
    currentAllItems: ShopItem[]
  ) => {
    if (!user || !isInitialLoadDone) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        game_state: currentStats,
        quests: currentQuests,
        inventory: currentInv,
        bought_items: currentBought,
        all_items: currentAllItems,
        updated_at: new Date().toISOString(),
      });

    if (error) console.error("Error al guardar en la nube:", error);
  }, [user, isInitialLoadDone]);

  useEffect(() => {
    if (!isInitialLoadDone || !user) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      saveData(stats, quests, inventory, boughtItems, allItems);
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [stats, quests, inventory, boughtItems, allItems, user, isInitialLoadDone, saveData]);

  // Lógica de temporizadores
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const newTimers = { ...prev.activeTimers };
        let changed = false;
        Object.keys(newTimers).forEach(itemId => {
          if (!pausedTimers[itemId] && newTimers[itemId] > 0) {
            newTimers[itemId] -= 1;
            changed = true;
            if (newTimers[itemId] <= 0) {
              delete newTimers[itemId];
              showSuccess(`¡El tiempo de recompensa ha terminado!`);
            }
          }
        });
        return changed ? { ...prev, activeTimers: newTimers } : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pausedTimers]);

  const seeds = useMemo(() => ({
    daily: getSeed(virtualTime, 'daily'),
    weekly: getSeed(virtualTime, 'weekly'),
    monthly: getSeed(virtualTime, 'monthly'),
  }), [virtualTime]);

  const shopItems = useMemo(() => {
    const dailyPool = allItems.filter(item => item.effect.daily);
    const weeklyPool = allItems.filter(item => item.effect.weekly);
    const monthlyPool = allItems.filter(item => item.effect.monthly);
    return {
      daily: getRotatedItems(dailyPool, seeds.daily, 5),
      weekly: getRotatedItems(weeklyPool, seeds.weekly, 5),
      monthly: getRotatedItems(monthlyPool, seeds.monthly, 5),
    };
  }, [seeds, allItems]);

  const boughtInRotation = useMemo(() => {
    const result: Record<string, boolean> = {};
    Object.entries(boughtItems).forEach(([itemId, seed]) => {
      const item = allItems.find(i => i.id === itemId);
      if (!item) return;
      const currentSeed = item.effect.daily ? seeds.daily : item.effect.weekly ? seeds.weekly : seeds.monthly;
      if (seed === currentSeed) result[itemId] = true;
    });
    return result;
  }, [boughtItems, seeds, allItems]);

  const buyItem = (item: ShopItem) => {
    if (stats.gold < item.cost) {
      showError("No tienes suficiente oro.");
      return;
    }
    if (boughtInRotation[item.id]) {
      showError("Este objeto ya ha sido comprado en este periodo.");
      return;
    }
    const currentSeed = item.effect.daily ? seeds.daily : item.effect.weekly ? seeds.weekly : seeds.monthly;
    setStats(prev => ({
      ...prev,
      gold: prev.gold - item.cost,
      gameStats: { ...prev.gameStats, itemsBought: prev.gameStats.itemsBought + 1 }
    }));
    setInventory(prev => [...prev, item.id]);
    setBoughtItems(prev => ({ ...prev, [item.id]: currentSeed }));
    showSuccess(`Has comprado: ${item.title}`);
  };

  const useItem = (id: string) => {
    const item = allItems.find(i => i.id === id);
    if (!item) return;
    if (item.effect.timer) {
      setStats(prev => ({
        ...prev,
        activeTimers: {
          ...prev.activeTimers,
          [id]: (prev.activeTimers[id] || 0) + (item.effect.timer! * 60)
        }
      }));
      showSuccess(`¡Temporizador de ${item.title} iniciado!`);
    } else {
      showSuccess(`Has canjeado: ${item.title}`);
    }
    setInventory(prev => {
      const index = prev.indexOf(id);
      if (index > -1) {
        const newInv = [...prev];
        newInv.splice(index, 1);
        return newInv;
      }
      return prev;
    });
  };

  const togglePauseTimer = (itemId: string) => {
    setPausedTimers(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const advanceTime = (days: number) => {
    const newTime = new Date(virtualTime);
    newTime.setDate(newTime.getDate() + days);
    setVirtualTime(newTime);
    showSuccess(`Tiempo avanzado ${days} días.`);
  };

  const addShopItem = (item: Omit<ShopItem, 'id'>) => {
    const newItem = { ...item, id: `custom-${Math.random().toString(36).substr(2, 9)}` };
    setAllItems(prev => [...prev, newItem]);
    showSuccess("Objeto añadido a la tienda.");
  };

  const updateShopItem = (id: string, updates: Partial<ShopItem>) => {
    setAllItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    showSuccess("Objeto actualizado.");
  };

  const deleteShopItem = (id: string) => {
    setAllItems(prev => prev.filter(item => item.id !== id));
    showSuccess("Objeto eliminado de la tienda.");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    showSuccess("Sesión cerrada.");
  };

  return {
    stats, quests, inventory, shopItems, virtualTime, boughtInRotation, activeCombat, pausedTimers, allItems, user, loading,
    buyItem, advanceTime, togglePauseTimer, addShopItem, updateShopItem, deleteShopItem, logout,
    completeQuest: (id: string) => {
      const quest = quests.find(q => q.id === id);
      if (!quest) return;
      const rewards = { easy: { xp: 10, gold: 5, attr: 0.1 }, medium: { xp: 25, gold: 15, attr: 0.2 }, hard: { xp: 60, gold: 40, attr: 0.5 } };
      const r = rewards[quest.difficulty];
      setStats(prev => ({
        ...prev, xp: prev.xp + r.xp, gold: prev.gold + r.gold,
        attributes: { ...prev.attributes, [quest.stat]: prev.attributes[quest.stat] + r.attr },
        gameStats: { ...prev.gameStats, totalGoldEarned: prev.gameStats.totalGoldEarned + r.gold,
          tasksCompleted: quest.type === 'todo' ? prev.gameStats.tasksCompleted + 1 : prev.gameStats.tasksCompleted,
          habitsCompleted: quest.type === 'habit' ? prev.gameStats.habitsCompleted + 1 : prev.gameStats.habitsCompleted,
          dailiesCompleted: quest.type === 'daily' ? prev.gameStats.dailiesCompleted + 1 : prev.gameStats.dailiesCompleted,
        }
      }));
      if (quest.type === 'todo') setQuests(prev => prev.filter(q => q.id !== id));
      else setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));
      showSuccess(`¡Misión completada! +${r.gold} Oro`);
    },
    takeDamage: (amount: number) => {
      setStats(prev => ({ ...prev, hp: Math.max(0, prev.hp - amount) }));
      showError(`¡Has perdido ${amount} HP!`);
    },
    addQuest: (data: any) => {
      const newQuest: Quest = { ...data, id: Math.random().toString(36).substr(2, 9), completed: false, streak: 0 };
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
    useItem,
    updateProfile: (updates: Partial<CharacterStats>) => {
      setStats(prev => ({ ...prev, ...updates }));
      showSuccess("Perfil actualizado.");
    },
    adminReset: () => { setStats(INITIAL_CHARACTER); setQuests([]); setInventory([]); setVirtualTime(new Date()); showSuccess("Reset completo."); },
    adminAddGold: (amount: number) => {
      setStats(prev => ({ ...prev, gold: prev.gold + amount, gameStats: { ...prev.gameStats, totalGoldEarned: prev.gameStats.totalGoldEarned + amount } }));
      showSuccess(`+${amount} Oro.`);
    },
    adminLevelUp: () => {
      setStats(prev => ({ ...prev, level: prev.level + 1, maxHp: prev.maxHp + 10, hp: prev.maxHp + 10, maxXp: Math.floor(prev.maxXp * 1.2), xp: 0,
        attributes: { fuerza: prev.attributes.fuerza + 1, inteligencia: prev.attributes.inteligencia + 1, espiritualidad: prev.attributes.espiritualidad + 1, carisma: prev.attributes.carisma + 1 }
      }));
      showSuccess("¡Nivel +1!");
    },
    adminClearInventory: () => { setInventory([]); showSuccess("Inventario vacío."); },
    completePenalty: (id: string) => { setStats(prev => ({ ...prev, activePenalties: prev.activePenalties.filter(pId => pId !== id) })); showSuccess("Penitencia cumplida."); },
    revive: () => { setStats(prev => ({ ...prev, hp: prev.maxHp, activePenalties: [] })); showSuccess("¡Has revivido!"); },
    setActiveCombat,
    winCombat: (xp: number, gold: number, hp: number) => {
      setStats(prev => ({ ...prev, hp, xp: prev.xp + xp, gold: prev.gold + gold, gameStats: { ...prev.gameStats, monstersDefeated: prev.gameStats.monstersDefeated + 1, totalGoldEarned: prev.gameStats.totalGoldEarned + gold } }));
      setActiveCombat(null); showSuccess("¡Victoria!");
    },
    loseCombat: (hp: number) => { setStats(prev => ({ ...prev, hp: 0 })); setActiveCombat(null); showError("Derrotado..."); },
    escapeCombat: (hp: number) => { setStats(prev => ({ ...prev, hp })); setActiveCombat(null); showSuccess("Escapaste."); },
  };
};