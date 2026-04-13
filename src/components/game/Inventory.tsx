import { ShopItem } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Smartphone, Utensils, Coffee, ShoppingCart, Users, Clock, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGameState } from "@/hooks/use-game-state";

interface InventoryProps {
  inventoryIds: string[];
  onUseItem: (id: string) => void;
  activeTimers: Record<string, number>;
  pausedTimers: Record<string, boolean>;
  onTogglePause: (id: string) => void;
  allItems: ShopItem[];
}

export const Inventory = ({ inventoryIds, onUseItem, activeTimers, allItems }: InventoryProps) => {
  const { virtualTime } = useGameState();
  
  const itemCounts = inventoryIds.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueItemIds = Object.keys(itemCounts);
  const ownedItems = allItems.filter(item => uniqueItemIds.includes(item.id));
  
  // Mostrar también items que tienen un timer activo aunque no queden unidades
  const activeTimerIds = Object.keys(activeTimers).filter(id => activeTimers[id] > virtualTime.getTime());
  const itemsWithTimers = allItems.filter(item => activeTimerIds.includes(item.id) && !uniqueItemIds.includes(item.id));
  
  const allDisplayItems = [...ownedItems, ...itemsWithTimers];

  const categories = [
    { id: 'consumible', label: 'Consumibles', icon: <Package className="w-4 h-4" /> },
    { id: 'dopamina', label: 'Dopamina', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'gastronomia', label: 'Comida', icon: <Utensils className="w-4 h-4" /> },
    { id: 'relax', label: 'Relax', icon: <Coffee className="w-4 h-4" /> },
    { id: 'hobbies', label: 'Hobbies', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> },
  ];

  const formatTime = (ms: number) => {
    const seconds = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2">
        <Package className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-black uppercase italic">Cofre de Recompensas</h3>
      </div>

      <TooltipProvider>
        {categories.map(cat => {
          const items = allDisplayItems.filter(i => i.category === cat.id);
          if (items.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                {cat.icon}
                <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map(item => {
                  const expiration = activeTimers[item.id];
                  const timeLeftMs = expiration ? expiration - virtualTime.getTime() : 0;
                  const isActive = timeLeftMs > 0;
                  const count = itemCounts[item.id] || 0;

                  return (
                    <Card key={item.id} className={cn(
                      "p-4 border-2 border-slate-200 bg-white flex flex-col gap-3 shadow-sm hover:border-indigo-300 transition-colors",
                      isActive && "border-indigo-500 bg-indigo-50/30"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-2xl relative",
                            item.rarity === 'legendario' ? "bg-orange-100" : 
                            item.rarity === 'epico' ? "bg-purple-100" : 
                            item.rarity === 'raro' ? "bg-blue-100" : "bg-slate-100"
                          )}>
                            {item.icon}
                            {count > 1 && (
                              <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                                x{count}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 leading-tight">{item.title}</p>
                            <p className="text-[10px] uppercase font-black text-slate-400">{item.rarity}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs text-slate-500 font-medium italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {item.description}
                        </p>

                        {isActive ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded-lg border-2 font-black text-sm bg-indigo-100 border-indigo-200 text-indigo-700">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 animate-pulse" />
                                <span>{formatTime(timeLeftMs)}</span>
                              </div>
                            </div>
                            {count > 0 && (
                              <Button 
                                onClick={() => onUseItem(item.id)}
                                className="w-full font-black uppercase h-9 text-xs bg-slate-900 hover:bg-indigo-600"
                              >
                                Usar otro (+{item.effect.timer}m)
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button 
                            onClick={() => onUseItem(item.id)}
                            className="w-full font-black uppercase h-9 text-xs bg-slate-900 hover:bg-indigo-600"
                          >
                            Canjear Recompensa {item.effect.timer ? `(${item.effect.timer}m)` : ''}
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </TooltipProvider>

      {allDisplayItems.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic">Tu inventario está vacío. ¡Gana oro y date un capricho!</p>
        </div>
      )}
    </div>
  );
};