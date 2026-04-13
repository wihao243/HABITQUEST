import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { CharacterStats, Quest, Monster, ShopItem, AttributeDefinition } from "@/types/game";
import { ALL_ITEMS as INITIAL_ITEMS } from "@/data/items";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";
import { format, isAfter, startOfDay, addDays, isSameDay, isSameWeek, isSameMonth, getWeek } from "date-fns";

interface GameStateContextType {
  stats: CharacterStats;
  quests: Quest[];
  inventory: string[];
  virtualTime: Date;
  allItems: ShopItem[];
  user: any;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  completeQuest: (id: string) => void;
  useItem: (id: string) => void;
  takeDamage: (amount: number) => void;
  addQuest: (data: any) => void;
  updateQuest: (id: string, data: any) => void;
  deleteQuest: (id: string) => void;
  updateProfile: (updates: Partial<CharacterStats>) => void;
  updateAttributeDefinitions: (definitions: AttributeDefinition[]) => void;
  adminReset: () => void;
  adminAddGold: (amount: number) => void;
  adminLevelUp: () => void;
  adminClearInventory: () => void;
  adminUnlockQuests: () => void;
  advanceTime: (days: number) => void;
  resetToToday: () => void;
  resetHp: () => void;
  completePenalty: (id: string) => void;
  revive: () => void;
  setActiveCombat: (monster: Monster | null) => void;
  activeCombat: Monster | null;
  winCombat: (xp: number, gold: number, remainingHp: number) => void;
  loseCombat: (remainingHp: number) => void;
  escapeCombat: (remainingHp: number) => void;
  buyItem: (item: ShopItem, source: string) => void;
  logout: () => void;
  shopItems: { daily: ShopItem[]; weekly: ShopItem[]; monthly: ShopItem[] };
  boughtInRotation: Record<string, boolean>;
  addShopItem: (item: Omit<ShopItem, 'id'>) => void;
  updateShopItem: (id: string, updates: Partial<ShopItem>) => void;
  deleteShopItem: (id: string) => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

const DEFAULT_ATTRIBUTES: AttributeDefinition[] = [
  { id: 'fuerza', name: 'Fuerza', icon: '💪', color: 'text-orange-400' },
  { id: 'inteligencia', name: 'Inteligencia', icon: '🧠', color: 'text-blue-400' },
  { id: 'espiritualidad', name: 'Espíritu', icon: '✨', color: 'text-yellow-400' },
  { id: 'carisma', name: 'Carisma', icon: '🎭', color: 'text-pink-400' },
];

const INITIAL_GAME_STATS = {
  tasksCompleted: 0, habitsCompleted: 0, dailiesCompleted: 0, monstersDefeated: 0, bossesDefeated: 0,
  totalGoldEarned: 0, totalDeaths: 0, itemsBought: 0, history: [], currentStreak: 0, maxStreak: 0,
  perfectDays: 0, waterDrank: 0, exerciseDays: 0, cardioSessions: 0, healthyMeals: 0, stepsMax: 0,
  exerciseHours: 0, pagesRead: 0, languagePractice: 0, meditationHours: 0, deepWorkSessions: 0,
  journalEntries: 0, noSnoozeDays: 0, cosmeticsBought: 0, petsOwned: 0, realLifeRewardsBought: 0,
  lowHpHeals: 0, friendsInvited: 0,
};

const INITIAL_CHARACTER: CharacterStats = {
  name: "Héroe", avatar: "🧙‍♂️", title: "Héroe de la Rutina", level: 1, hp: 100, maxHp: 100, xp: 0, maxXp: 100, gold: 0,
  attributes: { fuerza: 1, inteligencia: 1, espiritualidad: 1, carisma: 1 },
  attributeDefinitions: DEFAULT_ATTRIBUTES,
  gameStats: INITIAL_GAME_STATS, activePenalties: [], activeTimers: {}, monsterCooldowns: {},
};

const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
};

const shuffleWithSeed = <T,>(array: T[], seed: string): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const GameStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [stats, setStats] = useState<CharacterStats>(INITIAL_CHARACTER);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [timeOffset, setTimeOffset] = useState(0);
  const [lastResetDate, setLastResetDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [activeCombat, setActiveCombat] = useState<Monster | null>(null);
  const [boughtItemsLog, setBoughtItemsLog] = useState<Record<string, string>>({});
  const [allItems, setAllItems] = useState<ShopItem[]>(INITIAL_ITEMS);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
  
  const virtualTime = useMemo(() => newDate.now() + timeOffset), [timeOffset]);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Lógica de cuenta atrás para temporizadores
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const newTimers = { ...prev.activeTimers };
        let changed = false;
        Object.keys(newTimers).forEach(id => {
          if (newTimers[id] > 0) {
            newTimers[id] -= 1;
            changed = true;
          } else {
            delete newTimers[id];
            changed = true;
          }
        });
        return changed ? { ...prev, activeTimers: newTimers } : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const saveData = useCallback(async (s: any, q: any, i: any, b: any, a: any) => {
    if (!user || !isInitialLoadDone) return;
    try {
      await supabase.from('profiles').upsert({
        id: user.id, 
        game_state: s, 
        quests: q, 
        inventory: i, 
        bought_items: b, 
        all_items: a, 
        updated_at: new Date(Date.now() + timeOffset).toISOString(),
      });
    } catch (err) {
      console.error("Error guardando datos:", err);
    }
  }, [user, isInitialLoadDone, timeOffset]);

  const checkDayReset = useCallback((currentTime: Date) => {
    const todayStr = format(currentTime, 'yyyy-MM-dd');
    if (todayStr !== lastResetDate && isInitialLoadDone) {
      setQuests(prev => {
        const updated = prev.map(q => (q.type === 'daily' || q.type === 'habit') ? { ...q, completed: false } : q);
        saveData(stats, updated, inventory, boughtItemsLog, allItems);
        return updated;
      });
      setLastResetDate(todayStr);
    }
  }, [lastResetDate, isInitialLoadDone, stats, inventory, boughtItemsLog, allItems, saveData]);

  const shopItems = useMemo(() => {
    const dailySeed = format(virtualTime, 'yyyy-MM-dd');
    const weeklySeed = format(virtualTime, 'yyyy-') + getWeek(virtualTime);
    const monthlySeed = format(virtualTime, 'yyyy-MM');

    const dailyPool = allItems.filter(i => i.effect.daily || i.category === 'consumible');
    const weeklyPool = allItems.filter(i => i.effect.weekly);
    const monthlyPool = allItems.filter(i => i.effect.monthly);

    return {
      daily: shuffleWithSeed(dailyPool, dailySeed).slice(0, 6),
      weekly: shuffleWithSeed(weeklyPool, weeklySeed).slice(0, 5),
      monthly: shuffleWithSeed(monthlyPool, monthlySeed).slice(0, 5),
    };
  }, [allItems, virtualTime]);

  const boughtInRotation = useMemo(() => {
    const result: Record<string, boolean> = {};
    Object.entries(boughtItemsLog).forEach(([id, dateStr]) => {
      const item = allItems.find(i => i.id === id);
      if (!item || item.category === 'consumible') return; // Consumibles no se agotan
      const purchaseDate = new Date(dateStr);
      
      if (item.effect.daily && isSameDay(purchaseDate, virtualTime)) result[id] = true;
      else if (item.effect.weekly && isSameWeek(purchaseDate, virtualTime)) result[id] = true;
      else if (item.effect.monthly && isSameMonth(purchaseDate, virtualTime)) result[id] = true;
    });
    return result;
  }, [boughtItemsLog, allItems, virtualTime]);

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

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          if (data.game_state) setStats(data.game_state);
          if (data.quests) setQuests(data.quests);
          if (data.inventory) setInventory(data.inventory);
          if (data.bought_items) setBoughtItemsLog(data.bought_items);
          if (data.all_items) setAllItems(data.all_items);
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

  useEffect(() => {
    if (!isInitialLoadDone || !user) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveData(stats, quests, inventory, boughtItemsLog, allItems), 2000);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [stats, quests, inventory, boughtItemsLog, allItems, user, isInitialLoadDone, saveData]);

  const getActiveMultiplier = useCallback(() => {
    let multiplier = 1;
    Object.keys(stats.activeTimers).forEach(itemId => {
      const item = allItems.find(i => i.id === itemId);
      if (item?.effect.xpMultiplier) {
        multiplier *= item.effect.xpMultiplier;
      }
    });
    return multiplier;
  }, [stats.activeTimers, allItems]);

  const useItem = (id: string) => {
    const item = allItems.find(i => i.id === id);
    if (!item) return;

    setStats(prev => {
      let newHp = prev.hp;
      let newXp = prev.xp;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;
      let newMaxHp = prev.maxHp;

      // Efecto de curación
      if (item.effect.hp) {
        newHp = Math.min(prev.maxHp, prev.hp + item.effect.hp);
      }

      // Efecto de XP instantánea
      if (item.effect.xpFlat) {
        newXp += item.effect.xpFlat;
        while (newXp >= newMaxXp) {
          newXp -= newMaxXp;
          newLevel += 1;
          newMaxXp = Math.floor(newMaxXp * 1.2);
          newMaxHp += 10;
          newHp = newMaxHp;
          showSuccess(`¡SUBIDA DE NIVEL! Ahora eres nivel ${newLevel}`);
        }
      }

      // Efecto de temporizador (Dopamina/Relax/Multiplicador)
      const newTimers = { ...prev.activeTimers };
      if (item.effect.timer) {
        newTimers[id] = (newTimers[id] || 0) + (item.effect.timer * 60);
      }

      return { ...prev, hp: newHp, xp: newXp, level: newLevel, maxXp: newMaxXp, maxHp: newMaxHp, activeTimers: newTimers };
    });

    setInventory(prev => {
      const idx = prev.indexOf(id);
      if (idx > -1) {
        const n = [...prev];
        n.splice(idx, 1);
        return n;
      }
      return prev;
    });
    
    if (item.category === 'consumible') showSuccess(`Usado: ${item.title}`);
  };

  const value = {
    stats, quests, inventory, virtualTime, allItems, user, loading, activeTab, setActiveTab,
    completeQuest: (id: string) => {
      const todayStr = format(virtualTime, 'yyyy-MM-dd');
      const yesterdayStr = format(addDays(virtualTime, -1), 'yyyy-MM-dd');
      const quest = quests.find(q => q.id === id);
      if (!quest || quest.completed) return;

      const rewards = { easy: { xp: 10, gold: 5, attr: 0.1 }, medium: { xp: 25, gold: 15, attr: 0.2 }, hard: { xp: 60, gold: 40, attr: 0.5 } };
      const r = rewards[quest.difficulty];
      
      // Aplicar multiplicador de XP activo
      const multiplier = getActiveMultiplier();
      const finalXp = Math.floor(r.xp * multiplier);
      
      setQuests(prev => prev.map(q => {
        if (q.id === id) {
          let newStreak = q.streak || 0;
          if (q.lastCompletedDate === yesterdayStr) newStreak += 1;
          else if (q.lastCompletedDate !== todayStr) newStreak = 1;
          return { ...q, completed: true, lastCompletedDate: todayStr, streak: newStreak };
        }
        return q;
      }));

      setStats(prev => {
        let newXp = prev.xp + finalXp;
        let newLevel = prev.level;
        let newMaxXp = prev.maxXp;
        let newMaxHp = prev.maxHp;
        let newHp = prev.hp;
        while (newXp >= newMaxXp) {
          newXp -= newMaxXp;
          newLevel += 1;
          newMaxXp = Math.floor(newMaxXp * 1.2);
          newMaxHp += 10;
          newHp = newMaxHp;
        }
        return {
          ...prev, xp: newXp, level: newLevel, maxXp: newMaxXp, hp: newHp, maxHp: newMaxHp, gold: prev.gold + r.gold,
          attributes: { ...prev.attributes, [quest.stat]: (prev.attributes[quest.stat] || 1) + r.attr },
          gameStats: { ...prev.gameStats, totalGoldEarned: prev.gameStats.totalGoldEarned + r.gold }
        };
      });
      showSuccess(`¡Misión completada! +${r.gold} Oro ${multiplier > 1 ? `(XP x${multiplier})` : ''}`);
    },
    useItem,
    takeDamage: (amount: number) => setStats(prev => ({ ...prev, hp: Math.max(0, prev.hp - amount) })),
    addQuest: (data: any) => setQuests(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), completed: false, streak: 0 }]),
    updateQuest: (id: string, data: any) => setQuests(prev => prev.map(q => q.id === id ? { ...q, ...data } : q)),
    deleteQuest: (id: string) => setQuests(prev => prev.filter(q => q.id !== id)),
    updateProfile: (updates: Partial<CharacterStats>) => setStats(prev => ({ ...prev, ...updates })),
    updateAttributeDefinitions: (definitions: AttributeDefinition[]) => setStats(prev => ({ ...prev, attributeDefinitions: definitions })),
    adminReset: () => { setStats(INITIAL_CHARACTER); setQuests([]); setInventory([]); setTimeOffset(0); setBoughtItemsLog({}); },
    adminAddGold: (amount: number) => setStats(prev => ({ ...prev, gold: prev.gold + amount })),
    adminLevelUp: () => setStats(prev => ({ ...prev, level: prev.level + 1, hp: prev.maxHp + 10, maxHp: prev.maxHp + 10 })),
    adminClearInventory: () => setInventory([]),
    adminUnlockQuests: () => setQuests(prev => prev.map(q => ({ ...q, completed: false }))),
    advanceTime: (days: number) => setTimeOffset(prev => prev + days * 24 * 60 * 60 * 1000),
    resetToToday: () => setTimeOffset(0),
    resetHp: () => setStats(prev => ({ ...prev, hp: prev.maxHp })),
    completePenalty: (id: string) => setStats(prev => ({ ...prev, activePenalties: prev.activePenalties.filter(pId => pId !== id) })),
    revive: () => setStats(prev => ({ ...prev, hp: prev.maxHp, activePenalties: [] })),
    setActiveCombat, activeCombat,
    winCombat: (xp: number, gold: number, remainingHp: number) => {
      const multiplier = getActiveMultiplier();
      const finalXp = Math.floor(xp * multiplier);
      const monsterId = activeCombat?.id;
      const isBoss = activeCombat?.id.startsWith('b'); // Los IDs de jefes empiezan por 'b'

      setStats(prev => {
        let newXp = prev.xp + finalXp;
        let newLevel = prev.level;
        let newMaxXp = prev.maxXp;
        let newMaxHp = prev.maxHp;
        let newHp = remainingHp;
        while (newXp >= newMaxXp) {
          newXp -= newMaxXp;
          newLevel += 1;
          newMaxXp = Math.floor(newMaxXp * 1.2);
          newMaxHp += 10;
          newHp = newMaxHp;
        }

        // Registrar cooldown
        const newCooldowns = { ...prev.monsterCooldowns };
        if (monsterId) {
          const cooldownMinutes = isBoss ? 60 : 30;
          const respawnTime = new Date(virtualTime.getTime() + cooldownMinutes * 60000);
          newCooldowns[monsterId] = respawnTime.toISOString();
        }

        return { 
          ...prev, 
          xp: newXp, 
          level: newLevel, 
          maxXp: newMaxXp, 
          hp: newHp, 
          maxHp: newMaxHp, 
          gold: prev.gold + gold, 
          monsterCooldowns: newCooldowns,
          gameStats: { 
            ...prev.gameStats, 
            totalGoldEarned: prev.gameStats.totalGoldEarned + gold, 
            monstersDefeated: prev.gameStats.monstersDefeated + 1,
            bossesDefeated: isBoss ? prev.gameStats.bossesDefeated + 1 : prev.gameStats.bossesDefeated
          } 
        };
      });
      setActiveCombat(null);
      if (multiplier > 1) showSuccess(`¡Victoria! XP x${multiplier} aplicada.`);
    },
    loseCombat: (remainingHp: number) => { setStats(prev => ({ ...prev, hp: remainingHp, gameStats: { ...prev.gameStats, totalDeaths: prev.gameStats.totalDeaths + 1 } })); setActiveCombat(null); },
    escapeCombat: (remainingHp: number) => { setStats(prev => ({ ...prev, hp: remainingHp })); setActiveCombat(null); },
    buyItem: (item: ShopItem) => {
      if (stats.gold >= item.cost) {
        setStats(prev => ({ ...prev, gold: prev.gold - item.cost }));
        setInventory(prev => [...prev, item.id]);
        setBoughtItemsLog(prev => ({ ...prev, [item.id]: virtualTime.toISOString() }));
        showSuccess(`Comprado: ${item.title}`);
      } else showError("Oro insuficiente");
    },
    logout: () => supabase.auth.signOut(),
    shopItems,
    boughtInRotation,
    addShopItem: (item: Omit<ShopItem, 'id'>) => setAllItems(prev => [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }]),
    updateShopItem: (id: string, updates: Partial<ShopItem>) => setAllItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i)),
    deleteShopItem: (id: string) => setAllItems(prev => prev.filter(i => i.id !== id)),
  };

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) throw new Error("useGameState must be used within a GameStateProvider");
  return context;
};