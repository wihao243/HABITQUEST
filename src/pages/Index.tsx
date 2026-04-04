import { useGameState } from "@/hooks/use-game-state";
import { CharacterHeader } from "@/components/game/CharacterHeader";
import { QuestList } from "@/components/game/QuestList";
import { Shop } from "@/components/game/Shop";
import { Inventory } from "@/components/game/Inventory";
import { AdminPanel } from "@/components/game/AdminPanel";
import { DeathOverlay } from "@/components/game/DeathOverlay";
import { WorldMap } from "@/components/game/WorldMap";
import { Combat } from "@/components/game/Combat";
import { AchievementsDialog } from "@/components/game/AchievementsDialog";
import { StatsDialog } from "@/components/game/StatsDialog";
import { ShopEditor } from "@/components/game/ShopEditor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Calendar, Repeat, CheckSquare, ShoppingBag, Package, Globe } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const { 
    stats, quests, inventory, shopItems, virtualTime, boughtInRotation, activeCombat, pausedTimers, allItems,
    completeQuest, takeDamage, addQuest, updateQuest, deleteQuest, buyItem, useItem, updateProfile,
    adminReset, adminAddGold, adminLevelUp, adminClearInventory, advanceTime, togglePauseTimer,
    completePenalty, revive, setActiveCombat, winCombat, loseCombat, escapeCombat,
    addShopItem, updateShopItem, deleteShopItem
  } = useGameState();

  const isDead = stats.hp <= 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {isDead && (
        <DeathOverlay 
          penaltyIds={stats.activePenalties} 
          onComplete={completePenalty} 
          onRevive={revive} 
        />
      )}

      {activeCombat && (
        <Combat 
          monster={activeCombat} 
          player={stats} 
          onWin={winCombat} 
          onLose={loseCombat} 
          onEscape={escapeCombat} 
        />
      )}

      <nav className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">⚔️</div>
            <h1 className="text-xl font-black italic tracking-tighter text-slate-900">HABITQUEST</h1>
          </div>
          <div className="flex gap-1">
            <AchievementsDialog stats={stats} />
            <StatsDialog stats={stats} />
            <ShopEditor 
              items={allItems} 
              onAdd={addShopItem} 
              onUpdate={updateShopItem} 
              onDelete={deleteShopItem} 
            />
            <AdminPanel 
              onReset={adminReset} 
              onAddGold={adminAddGold} 
              onLevelUp={adminLevelUp} 
              onClearInventory={adminClearInventory} 
              onAdvanceTime={advanceTime}
              currentTime={virtualTime}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <CharacterHeader stats={stats} onUpdateProfile={updateProfile} />

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid grid-cols-6 w-full h-14 bg-white border-2 border-slate-200 p-1 rounded-2xl shadow-sm sticky top-20 z-40">
            <TabsTrigger value="daily" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <Calendar className="w-4 h-4 mr-1 hidden md:block" /> Diarias
            </TabsTrigger>
            <TabsTrigger value="habit" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <Repeat className="w-4 h-4 mr-1 hidden md:block" /> Hábitos
            </TabsTrigger>
            <TabsTrigger value="todo" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <CheckSquare className="w-4 h-4 mr-1 hidden md:block" /> Tareas
            </TabsTrigger>
            <TabsTrigger value="world" className="rounded-xl data-[state=active]:bg-rose-600 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <Globe className="w-4 h-4 mr-1 hidden md:block" /> Mundo
            </TabsTrigger>
            <TabsTrigger value="shop" className="rounded-xl data-[state=active]:bg-amber-500 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <ShoppingBag className="w-4 h-4 mr-1 hidden md:block" /> Tienda
            </TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-xl data-[state=active]:bg-slate-800 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <Package className="w-4 h-4 mr-1 hidden md:block" /> Inventario
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="daily">
              <QuestList quests={quests} type="daily" onComplete={completeQuest} onFail={takeDamage} onAdd={addQuest} onUpdate={updateQuest} onDelete={deleteQuest} />
            </TabsContent>
            <TabsContent value="habit">
              <QuestList quests={quests} type="habit" onComplete={completeQuest} onFail={takeDamage} onAdd={addQuest} onUpdate={updateQuest} onDelete={deleteQuest} />
            </TabsContent>
            <TabsContent value="todo">
              <QuestList quests={quests} type="todo" onComplete={completeQuest} onFail={takeDamage} onAdd={addQuest} onUpdate={updateQuest} onDelete={deleteQuest} />
            </TabsContent>
            <TabsContent value="world">
              <WorldMap player={stats} onFight={setActiveCombat} currentTime={virtualTime} />
            </TabsContent>
            <TabsContent value="shop">
              <Shop items={shopItems} boughtInRotation={boughtInRotation} onBuy={buyItem} />
            </TabsContent>
            <TabsContent value="inventory">
              <Inventory 
                inventoryIds={inventory} 
                onUseItem={useItem} 
                activeTimers={stats.activeTimers} 
                pausedTimers={pausedTimers}
                onTogglePause={togglePauseTimer}
                allItems={allItems}
              />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <MadeWithDyad />
    </div>
  );
};

export default Index;