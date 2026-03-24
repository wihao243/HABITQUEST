import { ShopItem } from "@/types/game";
import { ALL_ITEMS } from "@/data/items";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Shield, Sword, Dog, Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InventoryProps {
  inventoryIds: string[];
  onUseItem: (id: string) => void;
}

export const Inventory = ({ inventoryIds, onUseItem }: InventoryProps) => {
  // Contar duplicados
  const itemCounts = inventoryIds.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueItemIds = Object.keys(itemCounts);
  const ownedItems = ALL_ITEMS.filter(item => uniqueItemIds.includes(item.id));

  const categories = [
    { id: 'armas', label: 'Armas', icon: <Sword className="w-4 h-4" /> },
    { id: 'armaduras', label: 'Armaduras', icon: <Shield className="w-4 h-4" /> },
    { id: 'mascotas', label: 'Mascotas', icon: <Dog className="w-4 h-4" /> },
    { id: 'consumibles', label: 'Consumibles', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2">
        <Package className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-black uppercase italic">Cofre de Pertenencias</h3>
      </div>

      <TooltipProvider>
        {categories.map(cat => {
          const items = ownedItems.filter(i => i.category === cat.id);
          if (items.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                {cat.icon}
                <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map(item => (
                  <Card key={item.id} className="p-4 border-2 border-slate-200 bg-white flex flex-col gap-3 shadow-sm hover:border-indigo-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl relative",
                          item.rarity === 'legendario' ? "bg-orange-100" : 
                          item.rarity === 'epico' ? "bg-purple-100" : 
                          item.rarity === 'raro' ? "bg-blue-100" : "bg-slate-100"
                        )}>
                          {item.icon}
                          {itemCounts[item.id] > 1 && (
                            <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                              x{itemCounts[item.id]}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 leading-tight">{item.title}</p>
                          <p className="text-[10px] uppercase font-black text-slate-400">{item.rarity}</p>
                        </div>
                      </div>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-slate-300 hover:text-indigo-500 transition-colors">
                            <Info className="w-5 h-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white border-none p-3 max-w-[200px]">
                          <p className="text-xs font-bold">{item.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-slate-500 italic line-clamp-2">{item.description}</p>
                      <Button 
                        onClick={() => onUseItem(item.id)}
                        className="w-full bg-slate-900 hover:bg-indigo-600 font-black uppercase h-9 text-xs"
                      >
                        Usar Objeto
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </TooltipProvider>

      {inventoryIds.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic">Tu inventario está vacío. ¡Ve a la tienda!</p>
        </div>
      )}
    </div>
  );
};