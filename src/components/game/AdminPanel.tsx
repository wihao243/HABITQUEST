import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Settings, Trash2, Coins, ArrowUpCircle, PackageX, Clock, Lock, Unlock, Heart, UnlockIcon, RefreshCw, Plus, ShieldAlert, Users, UserCog, Search, Sparkles, Check, ChevronsUpDown } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import { useGameState } from "@/hooks/use-game-state";
import { supabase } from "@/lib/supabase";
import { CharacterStats } from "@/types/game";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
}

export const AdminPanel = ({ 
  onReset, onAddGold, onLevelUp, onClearInventory, onAdvanceTime, onResetToToday, onResetHp, onUnlockQuests, currentTime
}: AdminPanelProps) => {
  const { isAdmin, adminExists, claimAdmin } = useGameState();
  const [password, setPassword] = useState("");
  const [customGold, setCustomGold] = useState("");
  
  // Estados para gestión de otros usuarios
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [isUpdatingOther, setIsUpdatingOther] = useState(false);
  const [isComboOpen, setIsComboOpen] = useState(false);

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
        .select('id, game_state')
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

  const updateOtherUser = async (userId: string, updateFn: (stats: CharacterStats) => CharacterStats) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    setIsUpdatingOther(true);
    try {
      const newStats = updateFn(userToUpdate.game_state);
      const { error } = await supabase
        .from('profiles')
        .update({ game_state: newStats })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Actualizar lista local
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, game_state: newStats } : u));
      showSuccess("Usuario actualizado con éxito");
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

  const selectedUser = users.find(u => u.id === selectedUserId);

  // Si ya hay un admin y no soy yo, no mostramos nada o mostramos acceso denegado
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

  return (
    <Dialog onOpenChange={(open) => open && isAdmin && fetchAllUsers()}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
          <Settings className="w-5 h-5 text-slate-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border-4 border-slate-900 max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <div className="p-6 border-b-4 border-slate-900 bg-slate-50 shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-rose-600 flex items-center gap-2">
              {isAdmin ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              {isAdmin ? "Consola de Mando Suprema" : "Reclamar Trono"}
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
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
                {/* SECCIÓN: OTROS USUARIOS */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Users className="w-5 h-5" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Gestión de Otros Héroes</h3>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-indigo-400">Buscar Usuario</Label>
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
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-3 gap-2">
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
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            disabled={isUpdatingOther}
                            onClick={() => updateOtherUser(selectedUser.id, s => ({ ...s, gold: s.gold + 500 }))}
                            variant="outline" size="sm" className="border-2 border-yellow-500 text-yellow-700 font-bold h-9"
                          >
                            <Coins className="w-3 h-3 mr-1" /> +500 Oro
                          </Button>
                          <Button 
                            disabled={isUpdatingOther}
                            onClick={() => updateOtherUser(selectedUser.id, s => ({ ...s, level: s.level + 1, maxHp: s.maxHp + 10, hp: s.maxHp + 10 }))}
                            variant="outline" size="sm" className="border-2 border-blue-500 text-blue-700 font-bold h-9"
                          >
                            <ArrowUpCircle className="w-3 h-3 mr-1" /> Subir LVL
                          </Button>
                          <Button 
                            disabled={isUpdatingOther}
                            onClick={() => updateOtherUser(selectedUser.id, s => ({ ...s, hp: s.maxHp }))}
                            variant="outline" size="sm" className="border-2 border-emerald-500 text-emerald-700 font-bold h-9"
                          >
                            <Heart className="w-3 h-3 mr-1" /> Curar HP
                          </Button>
                          <Button 
                            disabled={isUpdatingOther}
                            onClick={async () => {
                              setIsUpdatingOther(true);
                              try {
                                const { error } = await supabase.from('profiles').update({ inventory: [] }).eq('id', selectedUser.id);
                                if (error) throw error;
                                showSuccess("Inventario vaciado");
                              } catch (err) { showError("Error al vaciar"); }
                              finally { setIsUpdatingOther(false); }
                            }}
                            variant="outline" size="sm" className="border-2 border-slate-400 text-slate-600 font-bold h-9"
                          >
                            <PackageX className="w-3 h-3 mr-1" /> Vaciar Inv.
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* SECCIÓN: MI PROPIO HÉROE */}
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

                <div className="space-y-2">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};