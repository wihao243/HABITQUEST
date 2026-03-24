import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2 } from "lucide-react";
import { CharacterStats } from "@/types/game";

interface ProfileEditProps {
  stats: CharacterStats;
  onUpdate: (updates: Partial<CharacterStats>) => void;
}

const AVATARS = ["🧙‍♂️", "🥷", "🧛", "🧝", "🦸", "🧟", "🤖", "🤠", "🧑‍🚀", "🤴"];
const TITLES = ["Héroe de la Rutina", "Guerrero del Hábito", "Mago del Enfoque", "Paladín de la Disciplina"];

export const ProfileEdit = ({ stats, onUpdate }: ProfileEditProps) => {
  const [name, setName] = useState(stats.name);
  const [avatar, setAvatar] = useState(stats.avatar);
  const [title, setTitle] = useState(stats.title);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ name, avatar, title });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-slate-400 hover:text-white">
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-4 border-slate-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Editar Perfil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold uppercase text-xs text-slate-500">Nombre del Héroe</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="border-2 border-slate-200 focus:border-indigo-500 font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold uppercase text-xs text-slate-500">Título</Label>
            <div className="grid grid-cols-1 gap-2">
              {TITLES.map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={title === t ? "default" : "outline"}
                  onClick={() => setTitle(t)}
                  className={title === t ? "bg-indigo-600 font-bold" : "font-bold"}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold uppercase text-xs text-slate-500">Avatar</Label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`text-3xl p-2 rounded-xl border-2 transition-all ${
                    avatar === a ? "border-indigo-500 bg-indigo-50 scale-110" : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 font-black uppercase h-12">
            Guardar Cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};