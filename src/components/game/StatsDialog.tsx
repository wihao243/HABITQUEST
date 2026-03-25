import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, CheckSquare, Repeat, Calendar, Sword, Skull, Coins, ShoppingCart } from "lucide-react";
import { GameStats } from "@/types/game";

interface StatsDialogProps {
  gameStats: GameStats;
}

export const StatsDialog = ({ gameStats }: StatsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
          <User className="w-5 h-5 text-slate-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-4 border-slate-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 flex items-center gap-2">
            <User className="w-6 h-6" /> Registro de Héroe
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <StatCard icon={<CheckSquare className="text-emerald-500" />} label="Tareas" value={gameStats.tasksCompleted} />
          <StatCard icon={<Repeat className="text-purple-500" />} label="Hábitos" value={gameStats.habitsCompleted} />
          <StatCard icon={<Calendar className="text-blue-500" />} label="Diarias" value={gameStats.dailiesCompleted} />
          <StatCard icon={<Sword className="text-rose-500" />} label="Enemigos" value={gameStats.monstersDefeated} />
          <StatCard icon={<Skull className="text-slate-900" />} label="Jefes" value={gameStats.bossesDefeated} />
          <StatCard icon={<Coins className="text-amber-500" />} label="Oro Total" value={gameStats.totalGoldEarned} />
          <StatCard icon={<Skull className="text-rose-700" />} label="Muertes" value={gameStats.totalDeaths} />
          <StatCard icon={<ShoppingCart className="text-indigo-500" />} label="Compras" value={gameStats.itemsBought} />
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border-2 border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Resumen de Carrera</p>
          <p className="text-sm font-bold text-slate-600 italic">
            Has completado un total de {gameStats.tasksCompleted + gameStats.habitsCompleted + gameStats.dailiesCompleted} actividades de disciplina. 
            {gameStats.monstersDefeated > 0 ? ` Has liberado al mundo de ${gameStats.monstersDefeated} amenazas.` : " Aún no has entrado en combate."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-100 flex flex-col items-center text-center">
    <div className="mb-1">{icon}</div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    <span className="text-xl font-black text-slate-900">{value}</span>
  </div>
);