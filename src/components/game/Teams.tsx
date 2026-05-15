"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Coins, Plus, Trash2, ArrowUpRight, ArrowDownLeft, Shield, Loader2 } from "lucide-react";
import { Team } from "@/types/game";
import { showSuccess, showError } from "@/utils/toast";
import { useGameState } from "@/hooks/use-game-state";
import { cn } from "@/lib/utils";

export const Teams = () => {
  const { user, stats, updateProfile } = useGameState();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState("");
  const [goldAmount, setGoldAmount] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (err) {
      console.error("Error cargando equipos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('teams')
        .insert([{ name: newTeamName, created_by: user.id, gold: 0 }]);

      if (error) throw error;
      showSuccess(`Equipo "${newTeamName}" forjado.`);
      setNewTeamName("");
      fetchTeams();
    } catch (err: any) {
      showError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateGold = async (teamId: string, currentGold: number, amount: number, isAdding: boolean) => {
    const finalAmount = isAdding ? amount : -amount;
    
    if (!isAdding && currentGold < amount) {
      showError("El equipo no tiene suficiente oro.");
      return;
    }

    if (isAdding && stats.gold < amount) {
      showError("No tienes suficiente oro personal.");
      return;
    }

    try {
      const { error } = await supabase
        .from('teams')
        .update({ gold: currentGold + finalAmount })
        .eq('id', teamId);

      if (error) throw error;

      // Actualizar oro personal
      const personalGoldChange = isAdding ? -amount : amount;
      updateProfile({ gold: stats.gold + personalGoldChange });

      showSuccess(isAdding ? "Oro aportado al equipo." : "Oro retirado del equipo.");
      setGoldAmount(prev => ({ ...prev, [teamId]: "" }));
      fetchTeams();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm("¿Seguro que quieres disolver este equipo? El oro se perderá.")) return;
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;
      showSuccess("Equipo disuelto.");
      fetchTeams();
    } catch (err: any) {
      showError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Reuniendo a los clanes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-black uppercase italic">Gremios y Alianzas</h3>
        </div>
      </div>

      <Card className="p-6 border-4 border-slate-900 bg-white shadow-xl">
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <Label className="text-[10px] font-black uppercase text-slate-500">Fundar Nuevo Gremio</Label>
          <div className="flex gap-3">
            <Input 
              placeholder="Nombre del equipo..." 
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="border-2 font-bold h-12"
            />
            <Button 
              disabled={isCreating || !newTeamName.trim()} 
              className="bg-indigo-600 hover:bg-indigo-500 font-black uppercase h-12 px-6"
            >
              {isCreating ? <Loader2 className="animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
              Fundar
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map(team => (
          <Card key={team.id} className="p-6 border-2 border-slate-200 bg-white hover:border-indigo-300 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {team.created_by === user.id && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteTeam(team.id)}
                  className="text-slate-300 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-indigo-200">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase italic text-slate-900">{team.name}</h4>
                <div className="flex items-center gap-2 text-yellow-600 font-black">
                  <Coins className="w-4 h-4" />
                  <span>{team.gold} Oro en el Cofre</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t-2 border-slate-50">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">Gestionar Oro del Gremio</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Cantidad..." 
                    value={goldAmount[team.id] || ""}
                    onChange={(e) => setGoldAmount(prev => ({ ...prev, [team.id]: e.target.value }))}
                    className="border-2 font-bold h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleUpdateGold(team.id, team.gold, parseInt(goldAmount[team.id]), true)}
                    disabled={!goldAmount[team.id] || parseInt(goldAmount[team.id]) <= 0}
                    className="bg-emerald-600 hover:bg-emerald-500 font-black uppercase text-[10px] h-10"
                  >
                    <ArrowUpRight className="w-3 h-3 mr-1" /> Aportar
                  </Button>
                  <Button 
                    onClick={() => handleUpdateGold(team.id, team.gold, parseInt(goldAmount[team.id]), false)}
                    disabled={!goldAmount[team.id] || parseInt(goldAmount[team.id]) <= 0}
                    variant="outline"
                    className="border-2 border-rose-200 text-rose-600 hover:bg-rose-50 font-black uppercase text-[10px] h-10"
                  >
                    <ArrowDownLeft className="w-3 h-3 mr-1" /> Retirar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-black uppercase text-sm italic">No hay gremios activos.</p>
          <p className="text-slate-400 text-xs font-bold mt-1">¡Funda el primero y reúne a tus aliados!</p>
        </div>
      )}
    </div>
  );
};