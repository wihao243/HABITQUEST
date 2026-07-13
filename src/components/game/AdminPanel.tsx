import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Trash2, Coins, ArrowUpCircle, PackageX, Clock, Lock, Unlock, Heart, UnlockIcon, RefreshCw, Plus, ShieldAlert, Users, UserCog, Search, Sparkles, Check, ChevronsUpDown, Calendar, CheckCircle2, XCircle, Flame, Edit3, Trash2 as Trash2Icon, Percent, CheckSquare, Repeat, ListTodo } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import { useGameState } from "@/hooks/use-game-state";
import { supabase } from "@/lib/supabase";
import { CharacterStats, Quest } from "@/types/game";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";

interface AdminPanelProps {
  onReset: () => void;
  onAddGold: (amount: number) => void;
  onLevelUp: () => void;
  onClearInventory: () => void;
  onAdvanceTime: (days: number) => void;
  onResetToToday: () => void;
  onResetHp: () => void;
  onUnlockQuests: () => void;
  currentTime: Date;
}

interface UserProfile {
  id: string;
  game_state: CharacterStats;
  quests?: Quest[];
}

export const AdminPanel = ({ 
  onReset, onAddGold, onLevelUp, onClearInventory, onAdvanceTime, onResetToToday, onResetHp, onUnlockQuests, currentTime
}: AdminPanelProps) => {
  const { isAdmin, adminExists, claimAdmin, user: currentUser, stats: currentStats, updateProfile } = useGameState();
  const [password, setPassword] = useState("");
  const [customGold, setCustomGold] = useState("");
  const [otherUserGold, setOtherUserGold] = useState("");
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [isUpdatingOther, setIsUpdatingOther] = useState(false);
  const [isComboOpen, setIsComboOpen] = useState(false);
  const [showQuestManagement, setShowQuestManagement] = useState(false);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    await claimAdmin(password);
    setPassword("");
  };

  const fetchAllUsers = useCallback(async () => {
    if (!isAdmin) return;
    setIsFetchingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, game_state, quests')
        .not('game_state', 'is', null);
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      showError("No se pudieron cargar los usuarios");
    } finally {
      setIsFetchingUsers(false);
    }
  }, [isAdmin]);

  const updateOtherUser = async (
    userId: string, 
    updateFn: (stats: CharacterStats) => CharacterStats, 
    inventoryUpdate?: string[],
    questsUpdate?: Quest[]
  ) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    setIsUpdatingOther(true);
    try {
      const newStats = updateFn(userToUpdate.game_state);
      const updatePayload: any = { game_state: newStats };
      if (inventoryUpdate !== undefined) {
        updatePayload.inventory = inventoryUpdate;
      }
      if (questsUpdate !== undefined) {
        updatePayload.quests = questsUpdate;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId);
      
      if (error) throw error;
      
      // Actualizar lista local para que el UI refleje el cambio inmediatamente
      setUsers(prev => prev.map(u => u.id === userId ? { 
        ...u, 
        game_state: newStats,
        inventory: inventoryUpdate !== undefined ? inventoryUpdate : u.inventory,
        quests: questsUpdate !== undefined ? questsUpdate : u.quests
      } : u));

      // Si el admin se está editando a sí mismo a través de esta lista, actualizamos también el estado global
      if (userId === currentUser?.id) {
        updateProfile(newStats);
      }
      
      showSuccess("Cambio aplicado con éxito");
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      showError("Error al aplicar el cambio");
    } finally {
      setIsUpdatingOther(false);
    }
  };

  const handleAddGold = () => {
    const amount = parseInt(customGold);
    if (isNaN(amount) || amount <= 0) {
      showError("Introduce una cantidad válida");
      return;
    }
    onAddGold(amount);
    setCustomGold("");
    showSuccess(`Añadido ${amount} de oro`);
  };

  const handleAddGoldToOther = () => {
    if (!selectedUserId) return;
    const amount = parseInt(otherUserGold);
    if (isNaN(amount) || amount <= 0) {
      showError("Introduce una cantidad válida");
      return;
    }
    updateOtherUser(selectedUserId, s => ({ ...s, gold: s.gold + amount }));
    setOtherUserGold("");
  };

  const handleRemoveGoldFromOther = () => {
    if (!selectedUserId) return;
    const amount = parseInt(otherUserGold);
    if (isNaN(amount) || amount <= 0) {
      showError("Introduce una cantidad válida");
      return;
    }
    updateOtherUser(selectedUserId, s => ({ ...s, gold: Math.max(0, s.gold - amount) }));
    setOtherUserGold("");
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  if (adminExists && !isAdmin) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
            <Settings className="w-5 h-5 text-slate-600" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-4 border-slate-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-rose-600 flex items-center gap-2">
              <Lock className="w-6 h-6" /> Acceso Denegado
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 text-rose-600" />
            </div>
            <p className="text-slate-600 font-bold">
              Ya existe un Administrador Único para este reino. Solo él puede acceder a estas funciones.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Helper function to get habit statistics
  const getHabitStats = (habit: Quest) => {
    const today = currentTime;
    const last30Days = Array.from({ length: 30 }, (_, i) => subDays(today, i)).reverse();
    const completedDays = habit.history || [];
    
    return {
      totalCompleted: completedDays.length,
      currentStreak: habit.streak || 0,
      recoverableStreak: habit.recoverableStreak || 0,
      completionRate: Math.round((completedDays.length / 30) * 100),
      lastCompletedDate: habit.lastCompletedDate,
      days: last30Days.map(date => ({
        date,
        isCompleted: completedDays.includes(format(date, 'yyyy-MM-dd')),
        isRestDay: habit.activeDays && !habit.activeDays.includes(date.getDay())
      }))
    };
  };

  // Function to complete a quest for another user
  const completeOtherUserQuest = async (userId: string, questId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const quest = user.quests?.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    const rewards = { 
      easy: { xp: 10, gold: 5, attr: 0.1 }, 
      medium: { xp: 25, gold: 15, attr: 0.2 }, 
      hard: { xp: 60, gold: 40, attr: 0.5 } 
    };
    const r = rewards[quest.difficulty];

    const todayStr = format(currentTime, 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(currentTime, 1), 'yyyy-MM-dd');
    
    const updatedQuests = user.quests?.map(q => {
      if (q.id === questId) {
        let newStreak = q.streak || 0;
        if (q.type !== 'todo') {
          if (q.lastCompletedDate === yesterdayStr) newStreak += 1;
          else if (q.lastCompletedDate !== todayStr) newStreak = 1;
        }
        const newHistory = q.type !== 'todo' ? [...(q.history || []), todayStr] : (q.history || []);
        return { 
          ...q, 
          completed: true, 
          lastCompletedDate: todayStr, 
          streak: q.type !== 'todo' ? newStreak : undefined, 
          recoverableStreak: undefined, 
          history: newHistory 
        };
      }
      return q;
    }) || [];

    await updateOtherUser(userId, (prev) => {
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
      }
      return {
        ...prev, 
        xp: newXp, 
        level: newLevel, 
        maxXp: newMaxXp, 
        hp: newHp, 
        maxHp: newMaxHp, 
        gold: prev.gold + r.gold,
        attributes: { ...prev.attributes, [quest.stat]: (prev.attributes[quest.stat] || 1) + r.attr },
        gameStats: { ...prev.gameStats, totalGoldEarned: prev.gameStats.totalGoldEarned + r.gold }
      };
    }, undefined, updatedQuests);
  };

  // Function to add a new habit
  const addHabit = async (userId: string, habitData: Omit<Quest, 'id' | 'completed' | 'streak'>) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const newHabit: Quest = {
      ...habitData,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      streak: 0,
      history: [],
      order: (user.quests?.length || 0) + 1
    };
    
    const updatedQuests = [...(user.quests || []), newHabit];
    await updateOtherUser(userId, s => s, undefined, updatedQuests);
  };

  // Function to delete a habit
  const deleteHabit = async (userId: string, habitId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const updatedQuests = user.quests?.filter(q => q.id !== habitId) || [];
    await updateOtherUser(userId, s => s, undefined, updatedQuests);
  };

  // Calcular descuento del usuario seleccionado
  const selectedUserDiscount = selectedUser ? (() => {
    const habits = (selectedUser.quests || []).filter(q => q.type === 'habit');
    const totalStreak = habits.reduce((sum, q) => sum + (q.streak || 0), 0);
    return Math.min(50, totalStreak);
  })() : 0;

  return (
    <Dialog onOpenChange={(open) => {
      if (open && isAdmin) {
        fetchAllUsers();
        setShowQuestManagement(false);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
          <Settings className="w-5 h-5 text-slate-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] w-[95vw] bg-white rounded-2xl border-4 border-slate-900 max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <div className="p-6 border-b-4 border-slate-900 bg-slate-50 shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-rose-600 flex items-center gap-2">
              {isAdmin ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              {isAdmin ? "Consola de Mando Suprema" : "Reclamar Trono"}
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {!isAdmin ? (
            <form onSubmit={handleClaim} className="space-y-4">
              <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-xl mb-4">
                <p className="text-xs font-bold text-amber-800 leading-relaxed">
                  ⚠️ **ATENCIÓN:** El primero que introduzca la contraseña se convertirá en el **Administrador Único**. Nadie más podrá acceder a este panel.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500">Código de Acceso</Label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className="text-center text-2xl tracking-[1em] font-black border-2 border-slate-200 focus:border-rose-500 h-14"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full bg-slate-900 hover:bg-rose-600 font-black uppercase h-12">
                Convertirse en Admin
              </Button>
            </form>
          ) : (
            <div className="grid gap-8 animate-in fade-in zoom-in-95 duration-300">
              {/* Sección de Gestión de Otros Usuarios */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Users className="w-5 h-5" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Gestión de Otros Héroes</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={fetchAllUsers} className="h-7 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600">
                    <RefreshCw className={cn("w-3 h-3 mr-1", isFetchingUsers && "animate-spin")} /> Actualizar Lista
                  </Button>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-indigo-400">Seleccionar Héroe</Label>
                    <Popover open={isComboOpen} onOpenChange={setIsComboOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isComboOpen}
                          className="w-full justify-between border-2 border-indigo-200 font-bold h-11 bg-white"
                        >
                          {selectedUserId
                            ? users.find((u) => u.id === selectedUserId)?.game_state.name
                            : isFetchingUsers ? "Cargando usuarios..." : "Escribe el nombre de un héroe..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-2 border-slate-900 rounded-xl overflow-hidden">
                        <Command>
                          <CommandInput placeholder="Escribe para buscar..." className="h-11 font-bold" />
                          <CommandList>
                            <CommandEmpty className="p-4 text-center text-xs font-bold text-slate-400 uppercase">No se encontró ningún héroe.</CommandEmpty>
                            <CommandGroup>
                              {users.map((u) => (
                                <CommandItem
                                  key={u.id}
                                  value={u.game_state.name}
                                  onSelect={() => {
                                    setSelectedUserId(u.id);
                                    setIsComboOpen(false);
                                    setShowQuestManagement(false);
                                  }}
                                  className="font-bold cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedUserId === u.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {u.game_state.name} (LVL {u.game_state.level})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {selectedUser && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600">
                          Estadísticas de {selectedUser.game_state.name}
                        </h4>
                        <Button 
                          onClick={() => setShowQuestManagement(!showQuestManagement)}
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-[10px] font-black uppercase text-indigo-600 border-indigo-200"
                        >
                          <Calendar className="w-3 h-3 mr-1" /> {showQuestManagement ? "Ocultar Misiones" : "Gestionar Misiones"}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <div className="bg-white p-2 rounded-lg border border-indigo-100 text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase">Oro</p>
                          <p className="text-sm font-black text-indigo-600">{selectedUser.game_state.gold}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-indigo-100 text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase">Nivel</p>
                          <p className="text-sm font-black text-indigo-600">{selectedUser.game_state.level}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-indigo-100 text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase">HP</p>
                          <p className="text-sm font-black text-indigo-600">{selectedUser.game_state.hp}/{selectedUser.game_state.maxHp}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-indigo-100 text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase">Misiones</p>
                          <p className="text-sm font-black text-indigo-600">{(selectedUser.quests || []).length}</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-indigo-100 text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase">Descuento</p>
                          <p className="text-sm font-black text-emerald-600">-{selectedUserDiscount}%</p>
                        </div>
                      </div>

                      {/* Sección de Gestión de Oro */}
                      <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 space-y-3">
                        <h5 className="text-xs font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
                          <Coins className="w-4 h-4" /> Gestión de Oro
                        </h5>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-slate-500">Añadir Oro</Label>
                            <div className="flex gap-2">
                              <Input 
                                type="number" 
                                value={otherUserGold} 
                                onChange={(e) => setOtherUserGold(e.target.value)}
                                placeholder="Cantidad..."
                                className="h-10 border-2 font-bold bg-white"
                              />
                              <Button 
                                disabled={isUpdatingOther}
                                onClick={handleAddGoldToOther} 
                                variant="outline" 
                                className="border-2 border-emerald-500 text-emerald-700 font-bold shrink-0 h-10 px-3"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-slate-500">Quitar Oro</Label>
                            <div className="flex gap-2">
                              <Input 
                                type="number" 
                                value={otherUserGold} 
                                onChange={(e) => setOtherUserGold(e.target.value)}
                                placeholder="Cantidad..."
                                className="h-10 border-2 font-bold bg-white"
                              />
                              <Button 
                                disabled={isUpdatingOther}
                                onClick={handleRemoveGoldFromOther} 
                                variant="outline" 
                                className="border-2 border-rose-500 text-rose-600 font-bold shrink-0 h-10 px-3"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {showQuestManagement && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                          <div className="bg-white p-4 rounded-xl border-2 border-indigo-200">
                            <h5 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-3 flex items-center gap-2">
                              <Calendar className="w-4 h-4" /> Gestión de Misiones
                            </h5>
                            
                            <Tabs defaultValue="habit" className="w-full">
                              <TabsList className="grid grid-cols-3 w-full bg-slate-100 p-1 rounded-xl border-2 border-slate-200 h-auto mb-4">
                                <TabsTrigger value="habit" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase py-2 flex items-center justify-center gap-1">
                                  <Repeat className="w-3 h-3" /> Hábitos
                                </TabsTrigger>
                                <TabsTrigger value="daily" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase py-2 flex items-center justify-center gap-1">
                                  <CheckSquare className="w-3 h-3" /> Diarias
                                </TabsTrigger>
                                <TabsTrigger value="todo" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase py-2 flex items-center justify-center gap-1">
                                  <ListTodo className="w-3 h-3" /> Tareas
                                </TabsTrigger>
                              </TabsList>

                              {["habit", "daily", "todo"].map((type) => (
                                <TabsContent key={type} value={type} className="space-y-3">
                                  {(selectedUser.quests || []).filter(q => q.type === type).map(quest => {
                                    const stats = type === 'habit' ? getHabitStats(quest) : null;
                                    return (
                                      <div key={quest.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className={cn("font-bold text-sm text-slate-800", quest.completed && "line-through text-slate-400")}>
                                              {quest.title}
                                            </p>
                                            <p className="text-[10px] text-slate-500">Dificultad: {quest.difficulty} | Stat: {quest.stat}</p>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {quest.completed ? (
                                              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase px-2 py-1 rounded-full flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Completada
                                              </span>
                                            ) : (
                                              <Button 
                                                size="sm" 
                                                onClick={() => completeOtherUserQuest(selectedUser.id, quest.id)}
                                                className="bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase text-[9px] h-8 px-3"
                                              >
                                                Completar
                                              </Button>
                                            )}
                                            <Button 
                                              size="icon" 
                                              variant="ghost" 
                                              className="h-8 w-8 text-rose-600 hover:bg-rose-100"
                                              onClick={() => deleteHabit(selectedUser.id, quest.id)}
                                            >
                                              <Trash2Icon className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        </div>
                                        
                                        {type === 'habit' && stats && (
                                          <>
                                            <div className="grid grid-cols-4 gap-1 mt-1">
                                              <div className="text-center">
                                                <p className="text-[8px] font-black text-slate-400">Completados</p>
                                                <p className="text-xs font-black text-indigo-600">{stats.totalCompleted}</p>
                                              </div>
                                              <div className="text-center">
                                                <p className="text-[8px] font-black text-slate-400">Racha</p>
                                                <p className="text-xs font-black text-orange-600 flex items-center justify-center gap-1">
                                                  <Flame className="w-2 h-2" /> {stats.currentStreak}
                                                </p>
                                              </div>
                                              <div className="text-center">
                                                <p className="text-[8px] font-black text-slate-400">Efectividad</p>
                                                <p className="text-xs font-black text-emerald-600">{stats.completionRate}%</p>
                                              </div>
                                              <div className="text-center">
                                                <p className="text-[8px] font-black text-slate-400">Última</p>
                                                <p className="text-xs font-black text-blue-600">
                                                  {stats.lastCompletedDate ? format(new Date(stats.lastCompletedDate), 'd/M') : 'Nunca'}
                                                </p>
                                              </div>
                                            </div>
                                            
                                            <div className="mt-2">
                                              <p className="text-[9px] font-black text-slate-400 mb-1">Historial de los últimos 7 días:</p>
                                              <div className="flex gap-1">
                                                {stats.days.slice(-7).map((day, idx) => (
                                                  <div 
                                                    key={idx} 
                                                    className={cn(
                                                      "w-6 h-6 rounded text-[8px] font-black flex items-center justify-center",
                                                      day.isRestDay 
                                                        ? "bg-slate-100 text-slate-400 border border-slate-200" 
                                                        : day.isCompleted 
                                                          ? "bg-emerald-100 text-emerald-700 border border-emerald-300" 
                                                          : "bg-rose-100 text-rose-700 border border-rose-300"
                                                    )}
                                                    title={`${day.date.toLocaleDateString()}: ${day.isRestDay ? 'Descanso' : day.isCompleted ? 'Completado' : 'Faltó'}`}
                                                  >
                                                    {day.date.getDate()}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}

                                  {(selectedUser.quests || []).filter(q => q.type === type).length === 0 && (
                                    <div className="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                      <p className="text-slate-400 font-bold italic">Este usuario no tiene misiones de este tipo.</p>
                                    </div>
                                  )}
                                </TabsContent>
                              ))}
                            </Tabs>

                            <Button 
                              onClick={() => addHabit(selectedUser.id, {
                                title: "Nuevo Hábito",
                                difficulty: "medium",
                                stat: selectedUser.game_state.attributeDefinitions[0]?.id || "fuerza",
                                type: "habit",
                                activeDays: [0, 1, 2, 3, 4, 5, 6]
                              })}
                              className="w-full bg-indigo-600 hover:bg-indigo-500 font-black uppercase text-xs h-10 mt-4"
                            >
                              <Plus className="w-4 h-4 mr-2" /> Añadir Nuevo Hábito
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <UserCog className="w-5 h-5" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Mi Propio Héroe</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Control del Tiempo
                    </p>
                    <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-100 mb-2">
                      <p className="text-xs font-bold text-slate-600">Fecha Actual: {currentTime.toLocaleDateString()}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button onClick={() => onAdvanceTime(1)} variant="outline" size="sm" className="font-bold border-2">
                        +1 Día
                      </Button>
                      <Button onClick={() => onAdvanceTime(7)} variant="outline" size="sm" className="font-bold border-2">
                        +1 Sem
                      </Button>
                      <Button onClick={() => onAdvanceTime(30)} variant="outline" size="sm" className="font-bold border-2">
                        +1 Mes
                      </Button>
                    </div>
                    <Button onClick={onResetToToday} variant="secondary" className="w-full font-black uppercase mt-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                      <RefreshCw className="w-4 h-4 mr-2" /> Resetear a Hoy
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trucos de Recursos</p>
                    
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase text-slate-500">Inyectar Oro</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          value={customGold} 
                          onChange={(e) => setCustomGold(e.target.value)}
                          placeholder="Cantidad..."
                          className="h-10 border-2 font-bold"
                        />
                        <Button onClick={handleAddGold} variant="outline" className="border-2 border-yellow-500 text-yellow-700 font-bold shrink-0">
                          <Plus className="w-4 h-4 mr-1" /> Añadir
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={onLevelUp} variant="outline" className="border-2 border-blue-500 text-blue-700 font-bold">
                        <ArrowUpCircle className="w-4 h-4 mr-2" /> Subir Nivel
                      </Button>
                      <Button onClick={onResetHp} variant="outline" className="border-2 border-emerald-500 text-emerald-700 font-bold">
                        <Heart className="w-4 h-4 mr-2" /> Curar Todo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gestión de Datos Globales</p>
                <div className="grid grid-cols-1 gap-2">
                  <Button onClick={onUnlockQuests} variant="outline" className="border-2 border-indigo-500 text-indigo-700 font-bold">
                    <UnlockIcon className="w-4 h-4 mr-2" /> Desbloquear Misiones
                  </Button>
                  <Button onClick={onClearInventory} variant="outline" className="border-2 border-slate-400 text-slate-600 font-bold">
                    <PackageX className="w-4 h-4 mr-2" /> Vaciar Mi Inventario
                  </Button>
                  <Button onClick={() => confirm("¿Resetear todo?") && onReset()} variant="destructive" className="font-black uppercase">
                    <Trash2 className="w-4 h-4 mr-2" /> Resetear Mi Partida
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};