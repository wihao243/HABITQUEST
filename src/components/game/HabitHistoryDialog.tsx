import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { format, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface HabitHistoryDialogProps {
  title: string;
  history: string[];
}

export const HabitHistoryDialog = ({ title, history = [] }: HabitHistoryDialogProps) => {
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => subDays(today, i)).reverse();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
          <Calendar className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-4 border-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" /> Historial: {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="pt-4 space-y-4">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Últimos 30 días</p>
          
          <div className="grid grid-cols-7 gap-2">
            {last30Days.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const isCompleted = history.includes(dateStr);
              const isToday = isSameDay(date, today);

              return (
                <div 
                  key={dateStr} 
                  className={cn(
                    "aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all",
                    isCompleted 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                      : "bg-slate-50 border-slate-100 text-slate-300",
                    isToday && "border-indigo-500 ring-2 ring-indigo-100"
                  )}
                >
                  <span className="text-[8px] font-black uppercase leading-none mb-1">
                    {format(date, 'EEE', { locale: es })}
                  </span>
                  <span className="text-xs font-black leading-none">
                    {format(date, 'd')}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-2 h-2 mt-1" />
                  ) : (
                    <div className="w-2 h-2 mt-1" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border-2 border-slate-100">
            <div className="text-center flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase">Total Completado</p>
              <p className="text-xl font-black text-slate-900">{history.length}</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase">Efectividad</p>
              <p className="text-xl font-black text-slate-900">
                {Math.round((history.length / 30) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};