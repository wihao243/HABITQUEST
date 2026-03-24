import { Quest, StatType } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Flame, Plus, Skull } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuestListProps {
  quests: Quest[];
  type: 'daily' | 'habit' | 'todo';
  onComplete: (id: string) => void;
  onFail: (amount: number) => void;
  onAdd: (type: 'daily' | 'habit' | 'todo') => void;
}

export const QuestList = ({ quests, type, onComplete, onFail, onAdd }: QuestListProps) => {
  const filteredQuests = quests.filter(q => q.type === type);
  
  const config = {
    daily: { label: 'Misiones Diarias', color: 'text-blue-500', empty: 'No hay misiones diarias hoy.' },
    habit: { label: 'Hábitos', color: 'text-purple-500', empty: 'Crea hábitos para mejorar tus estadísticas.' },
    todo: { label: 'Tareas Únicas', color: 'text-green-500', empty: 'Lista de tareas pendientes.' },
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h3 className={cn("text-xl font-black uppercase italic tracking-tight", config[type].color)}>
          {config[type].label}
        </h3>
        <Button onClick={() => onAdd(type)} size="sm" className="bg-slate-900 hover:bg-indigo-600">
          <Plus className="w-4 h-4 mr-2" /> Añadir
        </Button>
      </div>

      <div className="grid gap-3">
        {filteredQuests.map(quest => (
          <Card key={quest.id} className={cn(
            "p-4 flex items-center justify-between border-2 transition-all",
            quest.completed ? "opacity-50 bg-slate-50" : "hover:border-indigo-400 shadow-md bg-white"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-lg",
                quest.difficulty === 'easy' ? "bg-emerald-500" : quest.difficulty === 'medium' ? "bg-amber-500" : "bg-rose-500"
              )}>
                {quest.stat.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-black text-slate-800 text-lg leading-tight">{quest.title}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter">
                    {quest.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500">
                    {quest.stat}
                  </Badge>
                  {quest.streak && quest.streak > 0 && (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px] font-bold">
                      <Flame className="w-3 h-3 mr-1" /> {quest.streak}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {type === 'habit' && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="text-rose-500 hover:bg-rose-50 border-rose-200 h-11 w-11"
                  onClick={() => onFail(5)}
                >
                  <Skull className="w-5 h-5" />
                </Button>
              )}
              <Button 
                disabled={quest.completed}
                onClick={() => onComplete(quest.id)}
                className={cn(
                  "h-11 px-6 font-black uppercase tracking-tighter",
                  quest.completed ? "bg-emerald-500" : "bg-slate-900 hover:bg-indigo-600"
                )}
              >
                {quest.completed ? <CheckCircle2 className="w-5 h-5" /> : "Hecho"}
              </Button>
            </div>
          </Card>
        ))}
        {filteredQuests.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic">{config[type].empty}</p>
          </div>
        )}
      </div>
    </div>
  );
};