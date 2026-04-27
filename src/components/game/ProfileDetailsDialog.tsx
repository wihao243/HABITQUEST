import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CharacterStats } from "@/types/game";
import { StatBar } from "./StatBar";
import { Heart, Star, Shield, Award, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileDetailsDialogProps {
  stats: CharacterStats | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileDetailsDialog = ({ stats, open, onOpenChange }: ProfileDetailsDialogProps) => {
  if (!stats) return null;

  const isImageAvatar = stats.avatar?.startsWith('data:image');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-950 text-white border-4 border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-0">
        <div className="relative h-32 bg-gradient-to-b from-indigo-600/30 to-transparent" />
        
        <div className="px-8 pb-8 -mt-16 relative z-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-yellow-500 flex items-center justify-center text-6xl shadow-2xl overflow-hidden">
                {isImageAvatar ? (
                  <img src={stats.avatar} alt={stats.name} className="w-full h-full object-cover" />
                ) : (
                  stats.avatar || "🧙‍♂️"
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-slate-900 font-black px-3 py-1 rounded-lg text-sm border-2 border-slate-900">
                LVL {stats.level}
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{stats.name}</h2>
              <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                <Award className="w-3 h-3" /> {stats.title}
              </p>
            </div>

            {stats.bio && (
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 w-full relative">
                <Quote className="absolute -top-2 -left-2 w-6 h-6 text-slate-700" />
                <p className="text-slate-400 text-sm font-medium italic leading-relaxed">
                  "{stats.bio}"
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
              <StatBar 
                label="Vida" 
                value={stats.hp} 
                max={stats.maxHp} 
                color="bg-rose-500" 
                icon={<Heart className="w-3 h-3" />}
              />
              <StatBar 
                label="Experiencia" 
                value={stats.xp} 
                max={stats.maxXp} 
                color="bg-blue-500" 
                icon={<Star className="w-3 h-3" />}
              />
            </div>

            <div className="w-full pt-6 border-t border-slate-800">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Shield className="w-3 h-3" /> Atributos del Héroe
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {stats.attributeDefinitions?.map(def => (
                  <div key={def.id} className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-xl">{def.icon}</span>
                    <div className="text-left">
                      <p className="text-[9px] uppercase font-black text-slate-500 leading-none">{def.name}</p>
                      <p className="text-lg font-black text-white leading-none mt-1">{(stats.attributes?.[def.id] || 1).toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};