import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, CheckSquare, Repeat, Calendar, Sword, Skull, Coins, BarChart3, Activity } from "lucide-react";
import { CharacterStats } from "@/types/game";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';

interface StatsDialogProps {
  stats: CharacterStats;
}

export const StatsDialog = ({ stats }: StatsDialogProps) => {
  const gameStats = stats.gameStats;

  const attributeData = stats.attributeDefinitions.map(def => ({
    subject: def.name,
    A: stats.attributes[def.id] || 1,
    fullMark: 100
  }));

  const historyData = gameStats.history.slice(-7).map(day => ({
    name: day.date.split('-').slice(1).join('/'),
    Tareas: day.tasks,
    Hábitos: day.habits,
    Diarias: day.dailies,
  }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
          <User className="w-5 h-5 text-slate-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border-4 border-slate-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 flex items-center gap-2">
            <User className="w-6 h-6" /> Registro de Héroe
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={<CheckSquare className="text-emerald-500" />} label="Tareas" value={gameStats.tasksCompleted} />
            <StatCard icon={<Repeat className="text-purple-500" />} label="Hábitos" value={gameStats.habitsCompleted} />
            <StatCard icon={<Calendar className="text-blue-500" />} label="Diarias" value={gameStats.dailiesCompleted} />
            <StatCard icon={<Sword className="text-rose-500" />} label="Enemigos" value={gameStats.monstersDefeated} />
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Distribución de Atributos
            </h4>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={attributeData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                  <Radar
                    name="Atributos"
                    dataKey="A"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Actividad de los últimos 7 días
            </h4>
            {historyData.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                    <Bar dataKey="Tareas" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Hábitos" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Diarias" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-400 font-bold italic text-sm">
                No hay datos de actividad todavía.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={<Coins className="text-amber-500" />} label="Oro Total" value={gameStats.totalGoldEarned} />
            <StatCard icon={<Skull className="text-rose-700" />} label="Muertes" value={gameStats.totalDeaths} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-100 flex flex-col items-center text-center">
    <div className="mb-1">{icon}</div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    <span className="text-xl font-black text-slate-900">{value}</span>
  </div>
);