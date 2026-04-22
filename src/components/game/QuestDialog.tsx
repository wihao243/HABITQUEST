import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Quest } from "@/types/game";
import { cn } from "@/lib/utils";
import { useGameState } from "@/hooks/use-game-state";
import { Calendar, Clock } from "lucide-react";

interface QuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Quest, 'id' | 'completed' | 'streak'>) => void;
  initialData?: Quest;
  type: 'daily' | 'habit' | 'todo';
}

const DAYS = [
  { id: 1, label: 'L' },
  { id: 2, label: 'M' },
  { id: 3, label: 'X' },
  { id: 4, label: 'J' },
  { id: 5, label: 'V' },
  { id: 6, label: 'S' },
  { id: 0, label: 'D' },
];

export const QuestDialog = ({ open, onOpenChange, onSubmit, initialData, type }: QuestDialogProps) => {
  const { stats } = useGameState();
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Quest['difficulty']>("medium");
  const [stat, setStat] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDifficulty(initialData.difficulty);
      setStat(initialData.stat);
      setDeadline(initialData.deadline || "");
      setActiveDays(initialData.activeDays || [0, 1, 2, 3, 4, 5, 6]);
    } else {
      setTitle("");
      setDifficulty("medium");
      setStat(stats.attributeDefinitions[0]?.id || "");
      setDeadline("");
      setActiveDays([0, 1, 2, 3, 4, 5, 6]);
    }
  }, [initialData, open, stats.attributeDefinitions]);

  const toggleDay = (dayId: number) => {
    setActiveDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId) 
        : [...prev, dayId].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !stat) return;
    onSubmit({ 
      title, 
      difficulty, 
      stat, 
      type,
      deadline: type === 'todo' && deadline ? deadline : undefined,
      activeDays: type === 'habit' ? activeDays : undefined
    });
    onOpenChange(false);
  };

  const config = {
    daily: { label: 'Misión Diaria', color: 'text-blue-500' },
    habit: { label: 'Hábito', color: 'text-purple-500' },
    todo: { label: 'Tarea Única', color: 'text-green-500' },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-4 border-slate-900">
        <DialogHeader>
          <DialogTitle className={cn("text-2xl font-black uppercase italic tracking-tighter", config[type].color)}>
            {initialData ? 'Editar' : 'Nueva'} {config[type].label}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-bold uppercase text-xs text-slate-500">Nombre de la actividad</Label>
            <Input 
              id="title" 
              placeholder="Ej: Meditar 10 min"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="border-2 border-slate-200 focus:border-indigo-500 font-bold h-12"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold uppercase text-xs text-slate-500">Dificultad</Label>
              <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                <SelectTrigger className="border-2 border-slate-200 font-bold h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy" className="font-bold text-emerald-600">Fácil</SelectItem>
                  <SelectItem value="medium" className="font-bold text-amber-600">Media</SelectItem>
                  <SelectItem value="hard" className="font-bold text-rose-600">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold uppercase text-xs text-slate-500">Atributo</Label>
              <Select value={stat} onValueChange={(v: any) => setStat(v)}>
                <SelectTrigger className="border-2 border-slate-200 font-bold h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stats.attributeDefinitions.map(def => (
                    <SelectItem key={def.id} value={def.id} className="font-bold">
                      {def.icon} {def.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {type === 'habit' && (
            <div className="space-y-3">
              <Label className="font-bold uppercase text-xs text-slate-500">Días Activos</Label>
              <div className="flex justify-between gap-1">
                {DAYS.map(day => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={cn(
                      "w-10 h-10 rounded-lg border-2 font-black text-xs transition-all",
                      activeDays.includes(day.id)
                        ? "bg-purple-600 border-purple-700 text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:border-purple-300"
                    )}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-bold text-slate-400 italic">
                El hábito solo aparecerá como obligatorio los días seleccionados.
              </p>
            </div>
          )}

          {type === 'todo' && (
            <div className="space-y-2">
              <Label htmlFor="deadline" className="font-bold uppercase text-xs text-slate-500 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Plazo de Entrega (Fecha y Hora)
              </Label>
              <Input 
                id="deadline" 
                type="datetime-local"
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
                className="border-2 border-slate-200 focus:border-indigo-500 font-bold h-12"
              />
            </div>
          )}

          <Button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 font-black uppercase h-14 text-lg shadow-lg">
            {initialData ? 'Guardar Cambios' : 'Crear Misión'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};