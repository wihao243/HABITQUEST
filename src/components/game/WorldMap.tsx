import { WORLD_REGIONS } from "@/data/world";
import { Region, Monster, CharacterStats } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Lock, Sword, Skull, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface WorldMapProps {
  player: CharacterStats;
  onFight: (monster: Monster) => void;
}

export const WorldMap = ({ player, onFight }: WorldMapProps) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

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
              {selectedRegion.monsters.map(monster => (
                <Card key={monster.id} className="p-4 border-2 border-slate-200 bg-white flex items-center justify-between hover:border-rose-400 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                      {monster.avatar}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 leading-tight">{monster.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">LVL {monster.level} • {monster.hp} HP</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => onFight(monster)}
                    className="bg-slate-900 hover:bg-rose-600 font-black uppercase h-10 px-6"
                  >
                    Pelear
                  </Button>
                </Card>
              ))}
            </div>

            {selectedRegion.boss && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                  <Skull className="w-4 h-4" /> Jefe de Mazmorra
                </h4>
                <Card className="p-6 border-4 border-rose-500 bg-rose-50 flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-rose-600 border-4 border-white flex items-center justify-center text-6xl shadow-lg">
                    {selectedRegion.boss.avatar}
                  </div>
                  <div>
                    <h5 className="text-2xl font-black uppercase italic text-rose-900">{selectedRegion.boss.name}</h5>
                    <p className="text-xs font-bold text-rose-700 uppercase mb-2">Nivel {selectedRegion.boss.level} • {selectedRegion.boss.hp} HP</p>
                    <p className="text-sm text-rose-800/70 font-medium italic">{selectedRegion.boss.description}</p>
                  </div>
                  <Button 
                    onClick={() => onFight(selectedRegion.boss!)}
                    className="w-full bg-rose-600 hover:bg-rose-700 font-black uppercase h-14 text-lg shadow-lg"
                  >
                    Desafiar Jefe
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};