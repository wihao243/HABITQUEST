import { useGameState } from "@/hooks/use-game-state";
import { CharacterHeader } from "@/components/game/CharacterHeader";
import { QuestList } from "@/components/game/QuestList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trophy, Users, Settings } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const { stats, quests, rewards, completeQuest, takeDamage, addQuest, buyReward } = useGameState();

  const handleAddNewQuest = () => {
    const title = prompt("Nombre de la misión:");
    if (!title) return;
    
    const type = prompt("Tipo (daily, habit, todo):") as any;
    const difficulty = prompt("Dificultad (easy, medium, hard):") as any;
    const stat = prompt("Atributo (fuerza, inteligencia, espiritualidad, carisma):") as any;

    addQuest({
      title,
      type: type || 'daily',
      difficulty: difficulty || 'medium',
      stat: stat || 'fuerza'
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter text-indigo-600">HABITQUEST</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon"><Trophy className="w-5 h-5 text-slate-600" /></Button>
            <Button variant="ghost" size="icon"><Users className="w-5 h-5 text-slate-600" /></Button>
            <Button variant="ghost" size="icon"><Settings className="w-5 h-5 text-slate-600" /></Button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        {/* Character Section */}
        <CharacterHeader stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quests Section */}
          <div className="lg:col-span-2">
            <QuestList 
              quests={quests} 
              onComplete={completeQuest} 
              onFail={takeDamage}
              onAdd={handleAddNewQuest}
            />
          </div>

          {/* Sidebar: Shop & Rewards */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-black uppercase italic">Bazar de Recompensas</h3>
            </div>

            <div className="grid gap-4">
              {rewards.map(reward => (
                <Card key={reward.id} className="p-4 border-2 hover:border-yellow-400 transition-colors group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        🎁
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{reward.title}</p>
                        <p className="text-xs text-slate-500 uppercase font-bold">{reward.type === 'real' ? 'Vida Real' : 'Virtual'}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => buyReward(reward.id)}
                      variant="outline" 
                      className="border-yellow-500 text-yellow-700 hover:bg-yellow-500 hover:text-white font-bold"
                    >
                      {reward.cost} Oro
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-indigo-50 border-2 border-indigo-100">
              <h4 className="font-black text-indigo-900 uppercase text-sm mb-2">Consejo del Sabio</h4>
              <p className="text-sm text-indigo-700 italic">
                "La constancia es la espada más afilada. No dejes que tus misiones diarias se acumulen o el Monstruo de la Procrastinación te alcanzará."
              </p>
            </Card>
          </div>
        </div>
      </main>

      <MadeWithDyad />
    </div>
  );
};

export default Index;