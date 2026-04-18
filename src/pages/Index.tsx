import { useMemo } from "react";
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
import { Leaderboard } from "@/components/game/Leaderboard";
import { AntiFarmOverlay } from "@/components/game/AntiFarmOverlay";
import { AntiFarmWarning } from "@/components/game/AntiFarmWarning";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, Repeat, CheckSquare, ShoppingBag, Package, Globe, LogOut } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { cn } from "@/lib/utils";

const Index = () => {
  const { 
    stats, quests, inventory, shopItems, virtualTime, boughtInRotation, activeCombat, allItems,
    activeTab, setActiveTab,
    completeQuest, takeDamage, addQuest, updateQuest, deleteQuest, buyItem, useItem, updateProfile,
    adminReset, adminAddGold, adminLevelUp, adminClearInventory, adminUnlockQuests, advanceTime, resetToToday,
    completePenalty, revive, setActiveCombat, winCombat, loseCombat, escapeCombat,
    addShopItem, updateShopItem, deleteShopItem, logout, resetHp,
    showFarmWarning, closeFarmWarning
  } = useGameState();

  const isDead = stats.hp <= 0;
  
  // Verificar si el usuario está bloqueado por farmeo
  const isBlocked = (stats.blockedUntil && new Date(stats.blockedUntil).getTime() > new Date().getTime()) || stats.isPermanentlyBanned;

  const tabComponents = useMemo(() => [
    { id: "habit", component: <QuestList quests={quests} type="habit" onComplete={completeQuest} onFail={takeDamage} onAdd={addQuest} onUpdate={updateQuest} onDelete={deleteQuest} /> },
    { id: "todo", component: <QuestList quests={quests} type="todo" onComplete={completeQuest} onFail={takeDamage} onAdd={addQuest} onUpdate={updateQuest} onDelete={deleteQuest} /> },
    { id: "world", component: <WorldMap player={stats} onFight={setActiveCombat} currentTime={virtualTime} /> },
    { id: "ranking", component: <Leaderboard /> },
    { id: "shop", component: <Shop items={shopItems} boughtInRotation={boughtInRotation} onBuy={buyItem} allItems={allItems} onAddShopItem={addShopItem} onUpdateShopItem={updateShopItem} onDeleteShopItem={deleteShopItem} /> },
    { id: "inventory", component: <Inventory inventoryIds={inventory} onUseItem={useItem} activeTimers={stats.activeTimers} pausedTimers={{}} onTogglePause={() => {}} allItems={allItems} /> },
  ], [quests, stats, inventory, shopItems, virtualTime, boughtInRotation, activeCombat, allItems, completeQuest, takeDamage, addQuest, updateQuest, deleteQuest, buyItem, useItem, addShopItem, updateShopItem, deleteShopItem]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {isBlocked && (
        <AntiFarmOverlay 
          blockedUntil={stats.blockedUntil} 
          isPermanent={stats.isPermanentlyBanned} 
          banCount={stats.banCount}
        />
      )}
      
      <AntiFarmWarning open={showFarmWarning} onAccept={closeFarmWarning} />

      {isDead && !isBlocked && (
        <DeathOverlay 
          penaltyIds={stats.activePenalties} 
          onComplete={completePenalty} 
          onRevive={revive} 
        />
      )}

      {activeCombat && !isBlocked && (
        <Combat 
          monster={activeCombat} 
          player={stats} 
          inventory={inventory}
          allItems={allItems}
          onWin={winCombat} 
          onLose={loseCombat} 
          onEscape={escapeCombat} 
          onUseItem={useItem}
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
            <AdminPanel 
              onReset={adminReset} 
              onAddGold={adminAddGold} 
              onLevelUp={adminLevelUp} 
              onClearInventory={adminClearInventory} 
              onAdvanceTime={advanceTime}
              onResetToToday={resetToToday}
              onResetHp={resetHp}
              onUnlockQuests={adminUnlockQuests}
              currentTime={virtualTime}
            />
            <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-rose-50 text-slate-600 hover:text-rose-600">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <CharacterHeader stats={stats} onUpdateProfile={updateProfile} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full h-14 bg-white border-2 border-slate-200 p-1 rounded-2xl shadow-sm sticky top-20 z-40">
            <TabsTrigger value="habit" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <Repeat className="w-4 h-4 mr-1 hidden md:block" /> Hábitos
            </TabsTrigger>
            <TabsTrigger value="todo" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <CheckSquare className="w-4 h-4 mr-1 hidden md:block" /> Tareas
            </TabsTrigger>
            <TabsTrigger value="world" className="rounded-xl data-[state=active]:bg-rose-600 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <Globe className="w-4 h-4 mr-1 hidden md:block" /> Mundo
            </TabsTrigger>
            <TabsTrigger value="ranking" className="rounded-xl data-[state=active]:bg-yellow-500 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <Trophy className="w-4 h-4 mr-1 hidden md:block" /> Ranking
            </TabsTrigger>
            <TabsTrigger value="shop" className="rounded-xl data-[state=active]:bg-amber-500 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <ShoppingBag className="w-4 h-4 mr-1 hidden md:block" /> Tienda
            </TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-xl data-[state=active]:bg-slate-800 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">
              <Package className="w-4 h-4 mr-1 hidden md:block" /> Inventario
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 relative">
            {tabComponents.map((tab) => (
              <div 
                key={tab.id} 
                className={cn(
                  "transition-all duration-300",
                  activeTab === tab.id ? "block opacity-100 translate-y-0" : "hidden opacity-0 translate-y-4"
                )}
              >
                {tab.component}
              </div>
            ))}
          </div>
        </Tabs>
      </main>

      <MadeWithDyad />
    </div>
  );
};

export default Index;