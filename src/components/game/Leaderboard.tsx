import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, User, Star } from "lucide-react";
import { cn } from "@/lib/utils";

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
      const { data, error } = await supabase
        .from('profiles')
        .select('id, game_state')
        .order('updated_at', { ascending: false })
        .limit(20);

      if (data) {
        const formatted = data
          .filter(d => d.game_state)
          .map(d => ({
            id: d.id,
            name: d.game_state.name,
            level: d.game_state.level,
            avatar: d.game_state.avatar,
            title: d.game_state.title
          }))
          .sort((a, b) => b.level - a.level);
        setLeaders(formatted);
      }
      setLoading(false);
    };

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-black uppercase italic">Ranking de Héroes</h3>
      </div>

      <div className="grid gap-3">
        {leaders.map((leader, index) => (
          <Card key={leader.id} className={cn(
            "p-4 flex items-center justify-between border-2 transition-all bg-white",
            index === 0 ? "border-yellow-400 shadow-yellow-100 shadow-lg" : 
            index === 1 ? "border-slate-300" : 
            index === 2 ? "border-orange-300" : "border-slate-100"
          )}>
            <div className="flex items-center gap-4">
              <div className="w-8 text-center font-black text-slate-400">
                {index === 0 ? <Medal className="w-6 h-6 text-yellow-500 mx-auto" /> : 
                 index === 1 ? <Medal className="w-6 h-6 text-slate-400 mx-auto" /> : 
                 index === 2 ? <Medal className="w-6 h-6 text-orange-400 mx-auto" /> : 
                 `#${index + 1}`}
              </div>
              
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl border-2 border-white shadow-sm">
                {leader.avatar}
              </div>

              <div>
                <p className="font-black text-slate-800 leading-tight flex items-center gap-2">
                  {leader.name}
                  {index === 0 && <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{leader.title}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-black text-indigo-600 uppercase">Nivel</p>
              <p className="text-2xl font-black text-slate-900 leading-none">{leader.level}</p>
            </div>
          </Card>
        ))}

        {leaders.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic">Aún no hay héroes en el ranking.</p>
          </div>
        )}
      </div>
    </div>
  );
};