import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, User, Star, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeaderboardEntry {
  id: string;
  name: string;
  level: number;
  avatar: string;
  title: string;
}

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      // Obtenemos los perfiles que tengan estado de juego
      const { data, error } = await supabase
        .from('profiles')
        .select('id, game_state')
        .not('game_state', 'is', null)
        .limit(200); // Traemos un margen para filtrar y ordenar

      if (data) {
        const formatted = data
          .map(d => ({
            id: d.id,
            name: d.game_state.name || "Héroe Anónimo",
            level: d.game_state.level || 1,
            avatar: d.game_state.avatar || "🧙‍♂️",
            title: d.game_state.title || "Aventurero"
          }))
          .sort((a, b) => b.level - a.level) // Ordenamos por nivel descendente
          .slice(0, 100); // Nos quedamos con los 100 mejores
        
        setLeaders(formatted);
      }
      setLoading(false);
    };

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-black uppercase text-xs tracking-widest animate-pulse">Consultando los anales de la historia...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-black uppercase italic">Top 100 Leyendas</h3>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
          {leaders.length} Héroes Registrados
        </div>
      </div>

      <div className="grid gap-3">
        {leaders.map((leader, index) => {
          const isTop3 = index < 3;
          const isImageAvatar = leader.avatar.startsWith('data:image');
          
          return (
            <Card key={leader.id} className={cn(
              "p-4 flex items-center justify-between border-2 transition-all bg-white group",
              index === 0 ? "border-yellow-400 shadow-yellow-100 shadow-lg scale-[1.02] z-10" : 
              index === 1 ? "border-slate-300 shadow-md" : 
              index === 2 ? "border-orange-300 shadow-sm" : "border-slate-100 hover:border-indigo-200"
            )}>
              <div className="flex items-center gap-4">
                <div className="w-10 text-center font-black text-slate-400 flex items-center justify-center">
                  {index === 0 ? <Crown className="w-6 h-6 text-yellow-500 drop-shadow-sm" /> : 
                   index === 1 ? <Medal className="w-6 h-6 text-slate-400" /> : 
                   index === 2 ? <Medal className="w-6 h-6 text-orange-400" /> : 
                   <span className="text-sm">#{index + 1}</span>}
                </div>
                
                <div className={cn(
                  "w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl border-2 shadow-sm overflow-hidden transition-transform group-hover:scale-110",
                  index === 0 ? "border-yellow-400" : "border-white"
                )}>
                  {isImageAvatar ? (
                    <img src={leader.avatar} alt={leader.name} className="w-full h-full object-cover" />
                  ) : (
                    leader.avatar
                  )}
                </div>

                <div>
                  <p className="font-black text-slate-800 leading-tight flex items-center gap-2">
                    {leader.name}
                    {index === 0 && <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 animate-pulse" />}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{leader.title}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={cn(
                  "text-[10px] font-black uppercase",
                  isTop3 ? "text-indigo-600" : "text-slate-400"
                )}>Nivel</p>
                <p className={cn(
                  "text-2xl font-black leading-none",
                  index === 0 ? "text-yellow-600" : "text-slate-900"
                )}>{leader.level}</p>
              </div>
            </Card>
          );
        })}

        {leaders.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase text-sm italic">Aún no hay héroes en el ranking.</p>
            <p className="text-slate-400 text-xs font-bold mt-1">¡Sé el primero en forjar tu leyenda!</p>
          </div>
        )}
      </div>
    </div>
  );
};