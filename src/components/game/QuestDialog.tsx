import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Quest, StatType } from "@/types/game";
import { cn } from "@/lib/utils";

interface QuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Quest, 'id' | 'completed' | 'streak'>) => void;
  initialData?: Quest;
  type: 'daily' | 'habit' | 'todo';
}

export const QuestDialog = ({ open, onOpenChange, onSubmit, initialData, type }: QuestDialogProps) => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Quest['difficulty']>("medium");
  const [stat, setStat] = useState<StatType>("fuerza");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDifficulty(initialData.difficulty);
      setStat(initialData.stat);
    } else {
      setTitle("");
      setDifficulty("medium");
      setStat("fuerza");
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, difficulty, stat, type });
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
                  <SelectItem value="fuerza" className="font-bold">Fuerza</SelectItem>
                  <SelectItem value="inteligencia" className="font-bold">Inteligencia</SelectItem>
                  <SelectItem value="espiritualidad" className="font-bold">Espíritu</SelectItem>
                  <SelectItem value="carisma" className="font-bold">Carisma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 font-black uppercase h-14 text-lg shadow-lg">
            {initialData ? 'Guardar Cambios' : 'Crear Misión'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};