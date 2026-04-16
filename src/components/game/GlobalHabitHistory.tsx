import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle2, Info, Flame } from "lucide-react";
import { format, subDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { CharacterStats, Quest } from "@/types/game";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GlobalHabitHistoryProps {
  stats: CharacterStats;
  quests: Quest[];
}

export const GlobalHabitHistory = ({ stats, quests }: GlobalHabitHistoryProps) => {
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => subDays(today, i)).reverse();
  const habits = quests.filter(q => q.type === 'habit');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-2 border-purple-200 text-purple-600 font-black uppercase text-[10px] h-8 hover:bg-purple-50">
          <CalendarDays className="w-3 h-3 mr-1" /> Historial Detallado
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border-4 border-slate-900 max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-purple-600">
            <CalendarDays className="w-6 h-6" /> Seguimiento de Hábitos
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-1 space-y-4">
          <div className="flex items-center gap-2 p-3 bg-indigo-50 border-2 border-indigo-100 rounded-xl text-indigo-700">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p className="text-[10px] font-bold leading-tight uppercase">
              Aquí puedes ver la constancia de cada uno de tus hábitos en los últimos 30 días. ¡No rompas la cadena!
            </p>
          </div>

          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-6">
              {habits.length > 0 ? habits.map((habit) => (
                <div key={habit.id} className="space-y-3 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white border-2 border-slate-200 flex items-center justify-center text-sm">
                        {habit.stat.substring(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight">{habit.title}</h4>
                    </div>
                    <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-black">
                      <Flame className="w-3 h-3" /> {habit.streak || 0}
                    </div>
                  </div>

                  <div className="grid grid-cols-10 gap-1.5">
                    {last30Days.map((date) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      const isCompleted = (habit.history || []).includes(dateStr);
                      const isToday = isSameDay(date, today);

                      return (
                        <div 
                          key={dateStr} 
                          className={cn(
                            "aspect-square rounded-md border-2 flex flex-col items-center justify-center transition-all relative group",
                            isCompleted 
                              ? "bg-emerald-500 border-emerald-600 text-white" 
                              : "bg-white border-slate-200 text-slate-300",
                            isToday && "ring-2 ring-indigo-400 ring-offset-1"
                          )}
                        >
                          <span className="text-[8px] font-black leading-none">
                            {format(date, 'd')}
                          </span>
                          
                          {/* Tooltip al pasar el ratón */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                            {format(date, "d 'de' MMMM", { locale: es })}: {isCompleted ? 'Completado' : 'Pendiente'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-400 font-bold italic">
                  No tienes hábitos registrados todavía.
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-900 p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Racha Global</p>
              <p className="text-2xl font-black text-white">{stats.gameStats.currentStreak} Días</p>
            </div>
            <div className="bg-indigo-600 p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Racha Máxima</p>
              <p className="text-2xl font-black text-white">{stats.gameStats.maxStreak} Días</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};