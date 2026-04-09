import { CharacterStats } from "@/types/game";
import { StatBar } from "./StatBar";
import { Heart, Star, Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProfileEdit } from "./ProfileEdit";

interface CharacterHeaderProps {
  stats: CharacterStats;
  onUpdateProfile: (updates: Partial<CharacterStats>) => void;
}

export const CharacterHeader = ({ stats, onUpdateProfile }: CharacterHeaderProps) => {
  const isImageAvatar = stats.avatar.startsWith('data:image');

  return (
    <Card className="p-6 bg-slate-900 text-white border-4 border-slate-800 shadow-xl relative overflow-hidden">
      <ProfileEdit stats={stats} onUpdate={onUpdateProfile} />
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-indigo-600 border-4 border-yellow-500 flex items-center justify-center text-4xl shadow-lg overflow-hidden">
            {isImageAvatar ? (
              <img src={stats.avatar} alt={stats.name} className="w-full h-full object-cover" />
            ) : (
              stats.avatar
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-slate-900 font-black px-2 py-1 rounded-md text-sm border-2 border-slate-900 z-10">
            LVL {stats.level}
          </div>
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tighter italic uppercase leading-none">{stats.name}</h2>
              <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest">{stats.title}</p>
              {stats.bio && (
                <p className="text-slate-400 text-xs font-medium italic mt-2 max-w-md line-clamp-2">
                  "{stats.bio}"
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-yellow-400 font-bold">
              <Coins className="w-5 h-5" />
              <span>{stats.gold} Oro</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatBar 
              label="Vida (HP)" 
              value={stats.hp} 
              max={stats.maxHp} 
              color="bg-red-500" 
              icon={<Heart className="w-3 h-3" />}
            />
            <StatBar 
              label="Experiencia (XP)" 
              value={stats.xp} 
              max={stats.maxXp} 
              color="bg-blue-500" 
              icon={<Star className="w-3 h-3" />}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-800">
        {stats.attributeDefinitions.map(def => (
          <AttributeItem 
            key={def.id} 
            icon={<span className="text-lg">{def.icon}</span>} 
            label={def.name} 
            value={stats.attributes[def.id] || 1} 
          />
        ))}
      </div>
    </Card>
  );
};

const AttributeItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
    {icon}
    <div className="flex flex-col">
      <span className="text-[10px] uppercase font-bold text-slate-400 truncate max-w-[80px]">{label}</span>
      <span className="text-sm font-black">{value.toFixed(1)}</span>
    </div>
  </div>
);