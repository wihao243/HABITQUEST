import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle2, XCircle, Info } from "lucide-react";
import { format, subDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { CharacterStats } from "@/types/game";
import { cn } from "@/lib/utils";

interface GlobalHabitHistoryProps {
  stats: CharacterStats;
}

export const GlobalHabitHistory = ({ stats }: GlobalHabitHistoryProps) => {
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => subDays(today, i)).reverse();
  const history = stats.gameStats.history || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-2 border-purple-200 text-purple-600 font-black uppercase text-[10px] h-8 hover:bg-purple-50">
          <CalendarDays className="w-3 h-3 mr-1" /> Historial Global
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-4 border-slate-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-purple-600">
            <CalendarDays className="w-6 h-6" /> Calendario de Constancia
          </DialogTitle>
        </DialogHeader>
        
        <div className="pt-4 space-y-6">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border-2 border-blue-100 rounded-xl text-blue-700">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p className="text-[10px] font-bold leading-tight uppercase">
              Este calendario muestra el total de hábitos completados cada día. ¡Mantén el color para forjar tu disciplina!
            </p>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {last30Days.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const dayData = history.find(h => h.date === dateStr);
              const habitsDone = dayData?.habits || 0;
              const isToday = isSameDay(date, today);

              return (
                <div 
                  key={dateStr} 
                  className={cn(
                    "aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all relative group",
                    habitsDone > 0 
                      ? "bg-purple-50 border-purple-200 text-purple-700" 
                      : "bg-slate-50 border-slate-100 text-slate-300",
                    isToday && "border-indigo-500 ring-2 ring-indigo-100"
                  )}
                >
                  <span className="text-[7px] font-black uppercase leading-none mb-1 opacity-60">
                    {format(date, 'EEE', { locale: es })}
                  </span>
                  <span className="text-sm font-black leading-none">
                    {format(date, 'd')}
                  </span>
                  
                  {habitsDone > 0 && (
                    <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {habitsDone}
                    </div>
                  )}

                  {/* Tooltip simple al pasar el ratón */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                    {habitsDone} hábitos completados
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Racha Actual</p>
              <p className="text-2xl font-black text-slate-900">{stats.gameStats.currentStreak} Días</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Racha Máxima</p>
              <p className="text-2xl font-black text-slate-900">{stats.gameStats.maxStreak} Días</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};