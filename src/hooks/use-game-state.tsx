import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { CharacterStats, Quest, Monster, ShopItem, AttributeDefinition } from "@/types/game";
import { ALL_ITEMS as INITIAL_ITEMS } from "@/data/items";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";
import { startOfDay, startOfWeek, startOfMonth, isAfter, format } from "date-fns";

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
  resetHp: () => void;
  completePenalty: (id: string) => void;
  revive: () => void;
  setActiveCombat: (monster: Monster | null) => void;
  activeCombat: Monster | null;
  buyItem: (item: ShopItem, source: string) => void;
  logout: () => void;
  shopItems: { daily: ShopItem[]; weekly: ShopItem[]; monthly: ShopItem[] };
  boughtInRotation: Record<string, boolean>;
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

export const GameStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [stats, setStats] = useState<CharacterStats>(INITIAL_CHARACTER);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [virtualTime, setVirtualTime] = useState(new Date());
  const [activeCombat, setActiveCombat] = useState<Monster | null>(null);
  const [boughtItemsLog, setBoughtItemsLog] = useState<Record<string, string>>({});
  const [allItems, setAllItems] = useState<ShopItem[]>(INITIAL_ITEMS);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        if (data && data.game_state) {
          // Fusión robusta para evitar campos undefined
          const loadedStats = {
            ...INITIAL_CHARACTER,
            ...data.game_state,
            attributeDefinitions: data.game_state.attributeDefinitions || DEFAULT_ATTRIBUTES,
            attributes: data.game_state.attributes || INITIAL_CHARACTER.attributes,
            gameStats: { ...INITIAL_GAME_STATS, ...(data.game_state.gameStats || {}) }
          };
          setStats(loadedStats);
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

  const saveData = useCallback(async (s: any, q: any, i: any, b: any, a: any) => {
    if (!user || !isInitialLoadDone) return;
    await supabase.from('profiles').upsert({
      id: user.id, game_state: s, quests: q, inventory: i, bought_items: b, all_items: a, updated_at: new Date().toISOString(),
    });
  }, [user, isInitialLoadDone]);

  useEffect(() => {
    if (!isInitialLoadDone || !user) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveData(stats, quests, inventory, boughtItemsLog, allItems), 2000);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [stats, quests, inventory, boughtItemsLog, allItems, user, isInitialLoadDone, saveData]);

  useEffect(() => {
    const todayStr = format(virtualTime, 'yyyy-MM-dd');
    const startOfToday = startOfDay(virtualTime);
    const startOfThisWeek = startOfWeek(virtualTime, { weekStartsOn: 1 });
    const startOfThisMonth = startOfMonth(virtualTime);

    setQuests(prev => prev.map(q => {
      if ((q.type === 'daily' || q.type === 'habit') && q.completed && q.lastCompletedDate !== todayStr) {
        return { ...q, completed: false };
      }
      return q;
    }));

    setBoughtItemsLog(prev => {
      const newLog = { ...prev };
      let changed = false;
      Object.entries(newLog).forEach(([itemId, dateStr]) => {
        const item = allItems.find(i => i.id === itemId);
        if (!item) return;
        const purchaseDate = new Date(dateStr);
        let shouldReset = false;
        if (item.effect.daily && isAfter(startOfToday, purchaseDate)) shouldReset = true;
        if (item.effect.weekly && isAfter(startOfThisWeek, purchaseDate)) shouldReset = true;
        if (item.effect.monthly && isAfter(startOfThisMonth, purchaseDate)) shouldReset = true;
        if (shouldReset) {
          delete newLog[itemId];
          changed = true;
        }
      });
      return changed ? newLog : prev;
    });
  }, [virtualTime, allItems]);

  const completeQuest = (id: string) => {
    const todayStr = format(virtualTime, 'yyyy-MM-dd');
    const yesterdayDate = new Date(virtualTime);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = format(yesterdayDate, 'yyyy-MM-dd');

    const quest = quests.find(q => q.id === id);
    if (!quest || quest.completed) return;

    const rewards = { easy: { xp: 10, gold: 5, attr: 0.1 }, medium: { xp: 25, gold: 15, attr: 0.2 }, hard: { xp: 60, gold: 40, attr: 0.5 } };
    const r = rewards[quest.difficulty];
    
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
      let newXp = prev.xp + r.xp;
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
        showSuccess(`¡SUBIDA DE NIVEL! Ahora eres nivel ${newLevel}`);
      }

      const currentAttrValue = prev.attributes[quest.stat] || 1;

      return {
        ...prev, xp: newXp, level: newLevel, maxXp: newMaxXp, hp: newHp, maxHp: newMaxHp, gold: prev.gold + r.gold,
        attributes: { ...prev.attributes, [quest.stat]: currentAttrValue + r.attr },
        gameStats: { ...prev.gameStats, totalGoldEarned: prev.gameStats.totalGoldEarned + r.gold,
          tasksCompleted: quest.type === 'todo' ? prev.gameStats.tasksCompleted + 1 : prev.gameStats.tasksCompleted,
          habitsCompleted: quest.type === 'habit' ? prev.gameStats.habitsCompleted + 1 : prev.gameStats.habitsCompleted,
          dailiesCompleted: quest.type === 'daily' ? prev.gameStats.dailiesCompleted + 1 : prev.gameStats.dailiesCompleted,
        }
      };
    });
    showSuccess(`¡Misión completada! +${r.gold} Oro`);
  };

  const value = {
    stats, quests, inventory, virtualTime, allItems, user, loading, activeTab, setActiveTab,
    completeQuest, useItem: (id: string) => {
      const item = allItems.find(i => i.id === id);
      if (item?.effect.timer) setStats(prev => ({ ...prev, activeTimers: { ...prev.activeTimers, [id]: (prev.activeTimers[id] || 0) + (item.effect.timer! * 60) } }));
      setInventory(prev => { const idx = prev.indexOf(id); if (idx > -1) { const n = [...prev]; n.splice(idx, 1); return n; } return prev; });
    },
    takeDamage: (amount: number) => setStats(prev => ({ ...prev, hp: Math.max(0, prev.hp - amount) })),
    addQuest: (data: any) => setQuests(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), completed: false, streak: 0 }]),
    updateQuest: (id: string, data: any) => setQuests(prev => prev.map(q => q.id === id ? { ...q, ...data } : q)),
    deleteQuest: (id: string) => setQuests(prev => prev.filter(q => q.id !== id)),
    updateProfile: (updates: Partial<CharacterStats>) => setStats(prev => ({ ...prev, ...updates })),
    updateAttributeDefinitions: (definitions: AttributeDefinition[]) => {
      setStats(prev => {
        const newAttributes = { ...prev.attributes };
        definitions.forEach(d => {
          if (newAttributes[d.id] === undefined) newAttributes[d.id] = 1;
        });
        return { ...prev, attributeDefinitions: definitions, attributes: newAttributes };
      });
    },
    adminReset: () => { setStats(INITIAL_CHARACTER); setQuests([]); setInventory([]); setVirtualTime(new Date()); setBoughtItemsLog({}); },
    adminAddGold: (amount: number) => setStats(prev => ({ ...prev, gold: prev.gold + amount })),
    adminLevelUp: () => setStats(prev => ({ ...prev, level: prev.level + 1, hp: prev.maxHp + 10, maxHp: prev.maxHp + 10 })),
    adminClearInventory: () => setInventory([]),
    adminUnlockQuests: () => {
      setQuests(prev => prev.map(q => (q.type === 'daily' || q.type === 'habit') ? { ...q, completed: false } : q));
      showSuccess("¡Misiones y hábitos desbloqueados!");
    },
    advanceTime: (days: number) => { const n = new Date(virtualTime); n.setDate(n.getDate() + days); setVirtualTime(n); },
    resetHp: () => setStats(prev => ({ ...prev, maxHp: Math.max(prev.maxHp, 100), hp: Math.max(prev.maxHp, 100) })),
    completePenalty: (id: string) => setStats(prev => ({ ...prev, activePenalties: prev.activePenalties.filter(pId => pId !== id) })),
    revive: () => setStats(prev => ({ ...prev, hp: prev.maxHp, activePenalties: [] })),
    setActiveCombat, activeCombat,
    buyItem: (item: ShopItem) => {
      if (stats.gold >= item.cost) {
        setStats(prev => ({ ...prev, gold: prev.gold - item.cost }));
        setInventory(prev => [...prev, item.id]);
        setBoughtItemsLog(prev => ({ ...prev, [item.id]: virtualTime.toISOString() }));
        showSuccess(`Comprado: ${item.title}`);
      } else showError("Oro insuficiente");
    },
    logout: () => supabase.auth.signOut(),
    shopItems: { 
      daily: allItems.filter(i => i.effect.daily), 
      weekly: allItems.filter(i => i.effect.weekly), 
      monthly: allItems.filter(i => i.effect.monthly) 
    },
    boughtInRotation: Object.keys(boughtItemsLog).reduce((acc, id) => ({ ...acc, [id]: true }), {}),
  };

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) throw new Error("useGameState must be used within a GameStateProvider");
  return context;
};