import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, User, Award, Smile, Upload, FileText } from "lucide-react";
import { CharacterStats } from "@/types/game";
import { showError } from "@/utils/toast";

interface ProfileEditProps {
  stats: CharacterStats;
  onUpdate: (updates: Partial<CharacterStats>) => void;
}

const PRESET_AVATARS = ["🧙‍♂️", "🥷", "🧛", "🧝", "🦸", "🤖", "🤠", "🧑‍🚀"];
const PRESET_TITLES = ["Héroe de la Rutina", "Guerrero del Hábito", "Mago del Enfoque", "Paladín de la Disciplina"];

export const ProfileEdit = ({ stats, onUpdate }: ProfileEditProps) => {
  const [name, setName] = useState(stats.name);
  const [avatar, setAvatar] = useState(stats.avatar);
  const [title, setTitle] = useState(stats.title);
  const [bio, setBio] = useState(stats.bio || "");
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for base64 storage
        showError("La imagen es demasiado grande. Máximo 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ name, avatar, title, bio });
    setOpen(false);
  };

  const isImageAvatar = avatar.startsWith('data:image');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors z-10">
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-4 border-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-indigo-600">
            Personalizar Leyenda
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Avatar Section */}
          <div className="space-y-4">
            <Label className="font-black uppercase text-[10px] text-slate-500 flex items-center gap-2">
              <Smile className="w-3 h-3" /> Imagen de Perfil
            </Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-4xl overflow-hidden shadow-inner">
                {isImageAvatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  avatar || "?"
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-500 font-bold text-xs h-10"
                >
                  <Upload className="w-3 h-3 mr-2" /> Subir Foto
                </Button>
                <p className="text-[9px] text-slate-400 font-medium">O elige un emoji rápido:</p>
                <div className="flex flex-wrap gap-1">
                  {PRESET_AVATARS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar(a)}
                      className={`text-xl p-1 rounded-lg border transition-all ${
                        avatar === a ? "border-indigo-500 bg-indigo-50" : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

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

          {/* Biografía */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="font-black uppercase text-[10px] text-slate-500 flex items-center gap-2">
              <FileText className="w-3 h-3" /> Biografía / Descripción
            </Label>
            <Textarea 
              id="bio" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Cuéntanos tu historia o tus metas..."
              className="border-2 border-slate-200 focus:border-indigo-500 font-bold min-h-[100px] resize-none"
            />
          </div>

          <Button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase italic h-14 text-lg shadow-lg transition-all active:scale-95">
            Confirmar Identidad
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};