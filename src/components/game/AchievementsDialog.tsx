import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Lock, CheckCircle2, Flame, Heart, Brain, Coins, Users } from "lucide-react";
import { ALL_ACHIEVEMENTS } from "@/data/achievements";
import { GameStats, CharacterStats } from "@/types/game";
import { cn } from "@/lib/utils";

interface AchievementsDialogProps {
  stats: CharacterStats;
}

export const AchievementsDialog = ({ stats }: AchievementsDialogProps) => {
  const gameStats = stats.gameStats;

  const categories = [
    { id: 'rachas', label: 'Rachas', icon: <Flame className="w-4 h-4" /> },
    { id: 'salud', label: 'Salud', icon: <Heart className="w-4 h-4" /> },
    { id: 'mente', label: 'Mente', icon: <Brain className="w-4 h-4" /> },
    { id: 'economia', label: 'Economía', icon: <Coins className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> },
  ];

  const renderAchievement = (achievement: any) => {
    const isUnlocked = achievement.requirement(gameStats, stats);
    return (
      <div 
        key={achievement.id} 
        className={cn(
          "p-4 rounded-xl border-2 flex items-center gap-4 transition-all",
          isUnlocked 
            ? "bg-indigo-50 border-indigo-200" 
            : "bg-slate-50 border-slate-100 opacity-60 grayscale"
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner",
          isUnlocked ? "bg-white" : "bg-slate-200"
        )}>
          {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-slate-400" />}
        </div>
        <div className="flex-1">
          <h4 className="font-black text-slate-900 leading-tight text-sm">{achievement.title}</h4>
          <p className="text-[10px] font-medium text-slate-500">{achievement.description}</p>
        </div>
        {isUnlocked && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
          <Trophy className="w-5 h-5 text-slate-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border-4 border-slate-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-indigo-600 flex items-center gap-2">
            <Trophy className="w-6 h-6" /> Salón de la Fama
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="rachas" className="w-full mt-4">
          <TabsList className="grid grid-cols-5 w-full bg-slate-100 p-1 rounded-xl border-2 border-slate-200">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase">
                <span className="hidden md:inline">{cat.label}</span>
                <span className="md:hidden">{cat.icon}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {ALL_ACHIEVEMENTS.filter(a => a.category === cat.id).map(renderAchievement)}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};