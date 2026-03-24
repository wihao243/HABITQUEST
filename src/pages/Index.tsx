import { useGameState } from "@/hooks/use-game-state";
import { CharacterHeader } from "@/components/game/CharacterHeader";
import { QuestList } from "@/components/game/QuestList";
import { Shop } from "@/components/game/Shop";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Settings, Calendar, Repeat, CheckSquare, ShoppingBag } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const { stats, quests, inventory, shopItems, completeQuest, takeDamage, addQuest, buyItem, updateProfile } = useGameState();

  const handleAddNewQuest = (type: 'daily' | 'habit' | 'todo') => {
    const title = prompt(`Nombre de la ${type === 'habit' ? 'hábito' : 'misión'}:`);
    if (!title) return;
    
    const difficulty = prompt("Dificultad (easy, medium, hard):") as any;
    const stat = prompt("Atributo (fuerza, inteligencia, espiritualidad, carisma):") as any;

    addQuest({
      title,
      type,
      difficulty: difficulty || 'medium',
      stat: stat || 'fuerza'
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <nav className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">H</div>
            <h1 className="text-xl font-black italic tracking-tighter text-slate-900">HABITQUEST</h1>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="rounded-full"><Trophy className="w-5 h-5 text-slate-600" /></Button>
            <Button variant="ghost" size="icon" className="rounded-full"><Users className="w-5 h-5 text-slate-600" /></Button>
            <Button variant="ghost" size="icon" className="rounded-full"><Settings className="w-5 h-5 text-slate-600" /></Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <CharacterHeader stats={stats} onUpdateProfile={updateProfile} />

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid grid-cols-4 w-full h-14 bg-white border-2 border-slate-200 p-1 rounded-2xl shadow-sm sticky top-20 z-40">
            <TabsTrigger value="daily" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-black text-xs uppercase tracking-tighter transition-all">
              <Calendar className="w-4 h-4 mr-2 hidden md:block" /> Diarias
            </TabsTrigger>
            <TabsTrigger value="habit" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white font-black text-xs uppercase tracking-tighter transition-all">
              <Repeat className="w-4 h-4 mr-2 hidden md:block" /> Hábitos
            </TabsTrigger>
            <TabsTrigger value="todo" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black text-xs uppercase tracking-tighter transition-all">
              <CheckSquare className="w-4 h-4 mr-2 hidden md:block" /> Tareas
            </TabsTrigger>
            <TabsTrigger value="shop" className="rounded-xl data-[state=active]:bg-amber-500 data-[state=active]:text-white font-black text-xs uppercase tracking-tighter transition-all">
              <ShoppingBag className="w-4 h-4 mr-2 hidden md:block" /> Tienda
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="daily">
              <QuestList quests={quests} type="daily" onComplete={completeQuest} onFail={takeDamage} onAdd={handleAddNewQuest} />
            </TabsContent>
            
            <TabsContent value="habit">
              <QuestList quests={quests} type="habit" onComplete={completeQuest} onFail={takeDamage} onAdd={handleAddNewQuest} />
            </TabsContent>

            <TabsContent value="todo">
              <QuestList quests={quests} type="todo" onComplete={completeQuest} onFail={takeDamage} onAdd={handleAddNewQuest} />
            </TabsContent>

            <TabsContent value="shop">
              <div className="grid grid-cols-1 gap-8">
                <Shop items={shopItems} inventory={inventory} onBuy={buyItem} />
                <Card className="p-6 bg-indigo-50 border-2 border-indigo-100 rounded-2xl">
                  <h4 className="font-black text-indigo-900 uppercase text-sm mb-2">Consejo del Sabio</h4>
                  <p className="text-sm text-indigo-700 italic">
                    "Ahorra para las alas de ángel, pero no olvides tus pociones. Un héroe muerto no puede disfrutar de su botín."
                  </p>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <MadeWithDyad />
    </div>
  );
};

export default Index;