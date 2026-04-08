import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, User, Award, Smile } from "lucide-react";
import { CharacterStats } from "@/types/game";

interface ProfileEditProps {
  stats: CharacterStats;
  onUpdate: (updates: Partial<CharacterStats>) => void;
}

const PRESET_AVATARS = ["🧙‍♂️", "🥷", "🧛", "🧝", "🦸", "Zombie", "🤖", "🤠", "🧑‍🚀", "🤴"];
const PRESET_TITLES = ["Héroe de la Rutina", "Guerrero del Hábito", "Mago del Enfoque", "Paladín de la Disciplina"];

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
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors">
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-4 border-slate-900 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-indigo-600">
            Personalizar Leyenda
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-black uppercase text-[10px] text-slate-500 flex items-center gap-2">
              <User className="w-3 h-3" /> Nombre del Héroe
            </Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Escribe tu nombre..."
              className="border-2 border-slate-200 focus:border-indigo-500 font-bold h-12"
            />
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-black uppercase text-[10px] text-slate-500 flex items-center gap-2">
              <Award className="w-3 h-3" /> Título o Rango
            </Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ej: Maestro de la Procrastinación"
              className="border-2 border-slate-200 focus:border-indigo-500 font-bold h-12 mb-2"
            />
            <div className="flex flex-wrap gap-1">
              {PRESET_TITLES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTitle(t)}
                  className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border transition-all ${
                    title === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar */}
          <div className="space-y-2">
            <Label htmlFor="avatar" className="font-black uppercase text-[10px] text-slate-500 flex items-center gap-2">
              <Smile className="w-3 h-3" /> Avatar (Emoji o Texto)
            </Label>
            <div className="flex gap-2 mb-2">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-2xl">
                {avatar || "?"}
              </div>
              <Input 
                id="avatar" 
                value={avatar} 
                onChange={(e) => setAvatar(e.target.value)} 
                placeholder="Pega un emoji..."
                className="border-2 border-slate-200 focus:border-indigo-500 font-bold h-12 flex-1"
                maxLength={10}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`text-2xl p-2 rounded-xl border-2 transition-all ${
                    avatar === a ? "border-indigo-500 bg-indigo-50 scale-110 shadow-sm" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase italic h-14 text-lg shadow-lg transition-all active:scale-95">
            Confirmar Identidad
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};