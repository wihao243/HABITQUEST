import { ShopItem } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Smartphone, Utensils, Coffee, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ShopProps {
  items: {
    daily: ShopItem[];
    weekly: ShopItem[];
    monthly: ShopItem[];
  };
  boughtInRotation: Record<string, boolean>;
  onBuy: (item: ShopItem, source: string) => void;
}

export const Shop = ({ items, boughtInRotation, onBuy }: ShopProps) => {
  const renderItem = (item: ShopItem, source: string) => {
    const isSoldOut = boughtInRotation[item.id];

    return (
      <Card key={`${source}-${item.id}`} className={cn(
        "p-4 border-2 transition-all group relative overflow-hidden bg-white",
        isSoldOut ? "opacity-60 grayscale" : "hover:border-yellow-400"
      )}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner",
                item.rarity === 'legendario' ? "bg-orange-100" : 
                item.rarity === 'epico' ? "bg-purple-100" : 
                item.rarity === 'raro' ? "bg-blue-100" : "bg-slate-100"
              )}>
                {item.icon}
              </div>
              <div>
                <p className="font-black text-slate-800 leading-tight">{item.title}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{item.rarity}</p>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-300 hover:text-amber-500 transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-none p-3 max-w-[200px]">
                  <p className="text-xs font-bold">{item.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-500 italic line-clamp-2">{item.description}</p>
            <Button 
              disabled={isSoldOut}
              onClick={() => onBuy(item, source)}
              className={cn(
                "w-full font-black border-2 transition-all",
                isSoldOut 
                  ? "bg-slate-100 border-slate-200 text-slate-400" 
                  : "border-yellow-500 text-yellow-700 bg-white hover:bg-yellow-500 hover:text-white"
              )}
            >
              {isSoldOut ? "Agotado" : `${item.cost} Oro`}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-black uppercase italic">Bazar de Recompensas</h3>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid grid-cols-3 w-full bg-slate-100 p-1 rounded-xl border-2 border-slate-200 h-auto">
          <TabsTrigger value="daily" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase py-2 flex flex-col gap-1">
            <Smartphone className="w-4 h-4" /> <span className="hidden md:inline">Diaria</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase py-2 flex flex-col gap-1">
            <Utensils className="w-4 h-4" /> <span className="hidden md:inline">Semanal</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase py-2 flex flex-col gap-1">
            <Coffee className="w-4 h-4" /> <span className="hidden md:inline">Mensual</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="daily" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.daily.map(item => renderItem(item, 'daily'))}
          </TabsContent>
          <TabsContent value="weekly" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.weekly.map(item => renderItem(item, 'weekly'))}
          </TabsContent>
          <TabsContent value="monthly" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.monthly.map(item => renderItem(item, 'monthly'))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};