import { Quest } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Flame, Plus, Skull } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuestListProps {
  quests: Quest[];
  onComplete: (id: string) => void;
  onFail: (amount: number) => void;
  onAdd: () => void;
}

export const QuestList = ({ quests, onComplete, onFail, onAdd }: QuestListProps) => {
  const categories = [
    { type: 'daily', label: 'Misiones Diarias', color: 'text-blue-400' },
    { type: 'habit', label: 'Hábitos', color: 'text-purple-400' },
    { type: 'todo', label: 'Tareas Únicas', color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black uppercase italic tracking-tight">Libro de Misiones</h3>
        <Button onClick={onAdd} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Nueva Misión
        </Button>
      </div>

      {categories.map(cat => (
        <div key={cat.type} className="space-y-4">
          <h4 className={cn("text-sm font-black uppercase tracking-widest flex items-center gap-2", cat.color)}>
            <div className="h-px flex-1 bg-current opacity-20" />
            {cat.label}
            <div className="h-px flex-1 bg-current opacity-20" />
          </h4>
          
          <div className="grid gap-3">
            {quests.filter(q => q.type === cat.type).map(quest => (
              <Card key={quest.id} className={cn(
                "p-4 flex items-center justify-between border-2 transition-all",
                quest.completed ? "opacity-50 bg-slate-50" : "hover:border-indigo-400 shadow-sm"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold",
                    quest.difficulty === 'easy' ? "bg-green-500" : quest.difficulty === 'medium' ? "bg-yellow-500" : "bg-red-500"
                  )}>
                    {quest.stat[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{quest.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] uppercase">{quest.difficulty}</Badge>
                      {quest.streak && quest.streak > 0 && (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px]">
                          <Flame className="w-3 h-3 mr-1" /> {quest.streak}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {cat.type === 'habit' && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:bg-red-50 border-red-200"
                      onClick={() => onFail(5)}
                    >
                      <Skull className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    disabled={quest.completed}
                    onClick={() => onComplete(quest.id)}
                    className={cn(
                      quest.completed ? "bg-green-500" : "bg-slate-900 hover:bg-indigo-600"
                    )}
                  >
                    {quest.completed ? <CheckCircle2 className="w-4 h-4" /> : "Completar"}
                  </Button>
                </div>
              </Card>
            ))}
            {quests.filter(q => q.type === cat.type).length === 0 && (
              <p className="text-center text-slate-400 text-sm italic py-4">No hay misiones en esta categoría.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};