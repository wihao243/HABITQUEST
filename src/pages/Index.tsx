import { useGameState } from "@/hooks/use-game-state";
import { CharacterHeader } from "@/components/game/CharacterHeader";
import { QuestList } from "@/components/game/QuestList";
import { Shop } from "@/components/game/Shop";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Settings } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const { stats, quests, inventory, shopItems, completeQuest, takeDamage, addQuest, buyItem } = useGameState();

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
        <CharacterHeader stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <QuestList 
              quests={quests} 
              onComplete={completeQuest} 
              onFail={takeDamage}
              onAdd={handleAddNewQuest}
            />
          </div>

          <div className="space-y-6">
            <Shop 
              items={shopItems} 
              inventory={inventory} 
              onBuy={buyItem} 
            />

            <Card className="p-6 bg-indigo-50 border-2 border-indigo-100">
              <h4 className="font-black text-indigo-900 uppercase text-sm mb-2">Consejo del Sabio</h4>
              <p className="text-sm text-indigo-700 italic">
                "Ahorra para las alas de ángel, pero no olvides tus pociones. Un héroe muerto no puede disfrutar de su botín."
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