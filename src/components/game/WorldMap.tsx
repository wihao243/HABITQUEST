import { WORLD_REGIONS } from "@/data/world";
import { Region, Monster, CharacterStats } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Lock, Sword, Skull, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface WorldMapProps {
  player: CharacterStats;
  onFight: (monster: Monster) => void;
  currentTime: Date;
}

export const WorldMap = ({ player, onFight, currentTime }: WorldMapProps) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [now, setNow] = useState(currentTime);

  // Sincronizar el reloj interno con el tiempo virtual
  useEffect(() => {
    setNow(currentTime);
  }, [currentTime]);

  const getCooldownInfo = (monsterId: string) => {
    const cooldownStr = player.monsterCooldowns[monsterId];
    if (!cooldownStr) return null;
    
    const respawnTime = new Date(cooldownStr);
    if (now >= respawnTime) return null;

    const diff = respawnTime.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return { minutes, seconds };
  };

  const renderAvatar = (avatar: string, className?: string) => {
    const isImage = avatar.startsWith('/') || avatar.startsWith('http') || avatar.startsWith('data:');
    if (isImage) {
      return <img src={avatar} alt="Avatar" className={cn("w-full h-full object-cover rounded-xl", className)} />;
    }
    return avatar;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2">
        <Map className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-black uppercase italic">Mapa del Mundo</h3>
      </div>

      {!selectedRegion ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORLD_REGIONS.map((region) => {
            const isLocked = player.level < region.minLevel;
            return (
              <Card 
                key={region.id}
                onClick={() => !isLocked && setSelectedRegion(region)}
                className={cn(
                  "p-6 border-4 transition-all cursor-pointer group relative overflow-hidden",
                  isLocked ? "opacity-60 bg-slate-100 grayscale" : "hover:border-indigo-500 bg-white shadow-lg"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner",
                    region.color
                  )}>
                    {isLocked ? <Lock className="w-8 h-8 text-white/50" /> : region.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-black uppercase italic text-slate-900">{region.name}</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nivel Mínimo: {region.minLevel}</p>
                  </div>
                  {!isLocked && <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />}
                </div>
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-[1px]">
                    <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Bloqueado</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedRegion(null)}
            className="font-black uppercase text-xs text-slate-500 hover:text-indigo-600"
          >
            ← Volver al Mapa
          </Button>

          <div className={cn("p-8 rounded-3xl text-white border-4 border-slate-900 shadow-xl", selectedRegion.color)}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{selectedRegion.icon}</span>
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">{selectedRegion.name}</h2>
                <p className="font-bold text-white/80">{selectedRegion.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Sword className="w-4 h-4" /> Enemigos en la zona
              </h4>
              {selectedRegion.monsters.map(monster => {
                const cooldown = getCooldownInfo(monster.id);
                return (
                  <Card key={monster.id} className={cn(
                    "p-4 border-2 bg-white flex items-center justify-between transition-colors",
                    cooldown ? "opacity-60 grayscale" : "hover:border-rose-400"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl overflow-hidden">
                        {renderAvatar(monster.avatar)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 leading-tight">{monster.name}</p>
                        {cooldown ? (
                          <p className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Reaparece en {cooldown.minutes}m {cooldown.seconds}s
                          </p>
                        ) : (
                          <p className="text-[10px] font-bold text-slate-400 uppercase">LVL {monster.level} • {monster.hp} HP</p>
                        )}
                      </div>
                    </div>
                    <Button 
                      disabled={!!cooldown}
                      onClick={() => onFight(monster)}
                      className={cn(
                        "font-black uppercase h-10 px-6",
                        cooldown ? "bg-slate-200 text-slate-400" : "bg-slate-900 hover:bg-rose-600"
                      )}
                    >
                      {cooldown ? "Muerto" : "Pelear"}
                    </Button>
                  </Card>
                );
              })}
            </div>

            {selectedRegion.boss && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                  <Skull className="w-4 h-4" /> Jefe de Mazmorra
                </h4>
                {(() => {
                  const cooldown = getCooldownInfo(selectedRegion.boss!.id);
                  return (
                    <Card className={cn(
                      "p-6 border-4 flex flex-col items-center text-center space-y-4",
                      cooldown ? "border-slate-200 bg-slate-50 grayscale opacity-60" : "border-rose-500 bg-rose-50"
                    )}>
                      <div className={cn(
                        "w-24 h-24 rounded-full border-4 flex items-center justify-center text-6xl shadow-lg overflow-hidden",
                        cooldown ? "bg-slate-400 border-slate-300" : "bg-rose-600 border-white"
                      )}>
                        {renderAvatar(selectedRegion.boss!.avatar)}
                      </div>
                      <div>
                        <h5 className="text-2xl font-black uppercase italic text-rose-900">{selectedRegion.boss!.name}</h5>
                        {cooldown ? (
                          <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-black uppercase flex items-center gap-2 mt-2">
                            <Clock className="w-4 h-4" /> Reaparece en {cooldown.minutes}m {cooldown.seconds}s
                          </div>
                        ) : (
                          <>
                            <p className="text-xs font-bold text-rose-700 uppercase mb-2">Nivel {selectedRegion.boss!.level} • {selectedRegion.boss!.hp} HP</p>
                            <p className="text-sm text-rose-800/70 font-medium italic">{selectedRegion.boss!.description}</p>
                          </>
                        )}
                      </div>
                      <Button 
                        disabled={!!cooldown}
                        onClick={() => onFight(selectedRegion.boss!)}
                        className={cn(
                          "w-full font-black uppercase h-14 text-lg shadow-lg",
                          cooldown ? "bg-slate-300 text-slate-500" : "bg-rose-600 hover:bg-rose-700"
                        )}
                      >
                        {cooldown ? "Derrotado" : "Desafiar Jefe"}
                      </Button>
                    </Card>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};