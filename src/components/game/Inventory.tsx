import { ShopItem } from "@/types/game";
import { ALL_ITEMS } from "@/data/items";
import { Card } from "@/components/ui/card";
import { Package, Shield, Sword, Dog, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryProps {
  inventoryIds: string[];
}

export const Inventory = ({ inventoryIds }: InventoryProps) => {
  const ownedItems = ALL_ITEMS.filter(item => inventoryIds.includes(item.id));

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

      {categories.map(cat => {
        const items = ownedItems.filter(i => i.category === cat.id);
        if (items.length === 0) return null;

        return (
          <div key={cat.id} className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              {cat.icon}
              <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {items.map(item => (
                <Card key={item.id} className="p-3 border-2 border-slate-200 bg-white flex items-center gap-3 shadow-sm">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xl",
                    item.rarity === 'legendario' ? "bg-orange-100" : 
                    item.rarity === 'epico' ? "bg-purple-100" : 
                    item.rarity === 'raro' ? "bg-blue-100" : "bg-slate-100"
                  )}>
                    {item.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs text-slate-800 truncate">{item.title}</p>
                    <p className="text-[8px] uppercase font-black text-slate-400">{item.rarity}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {ownedItems.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic">Tu inventario está vacío. ¡Ve a la tienda!</p>
        </div>
      )}
    </div>
  );
};