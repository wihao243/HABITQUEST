import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Lock, CheckCircle2 } from "lucide-react";
import { ALL_ACHIEVEMENTS } from "@/data/achievements";
import { GameStats } from "@/types/game";
import { cn } from "@/lib/utils";

interface AchievementsDialogProps {
  gameStats: GameStats;
}

export const AchievementsDialog = ({ gameStats }: AchievementsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
          <Trophy className="w-5 h-5 text-slate-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-4 border-slate-900 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-indigo-600 flex items-center gap-2">
            <Trophy className="w-6 h-6" /> Salón de la Fama
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-3 pt-4">
          {ALL_ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = achievement.requirement(gameStats);
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
                  <h4 className="font-black text-slate-900 leading-tight">{achievement.title}</h4>
                  <p className="text-xs font-medium text-slate-500">{achievement.description}</p>
                </div>
                {isUnlocked && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};