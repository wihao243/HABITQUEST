import { ShopItem } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Smartphone, Utensils, Coffee, Sparkles, ShoppingCart, Users, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ShopProps {
  items: {
    dopamina: ShopItem[];
    gastronomia: ShopItem[];
    relax: ShopItem[];
    hobbies: ShopItem[];
    social: ShopItem[];
  };
  onBuy: (item: ShopItem, source: string) => void;
}

export const Shop = ({ items, onBuy }: ShopProps) => {
  const renderItem = (item: ShopItem, source: string) => {
    return (
      <Card key={`${source}-${item.id}`} className="p-4 border-2 transition-all group relative overflow-hidden hover:border-yellow-400 bg-white">
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
              onClick={() => onBuy(item, source)}
              className="w-full font-black border-2 border-yellow-500 text-yellow-700 bg-white hover:bg-yellow-500 hover:text-white transition-all"
            >
              {item.cost} Oro
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

      <Tabs defaultValue="dopamina" className="w-full">
        <TabsList className="grid grid-cols-5 w-full bg-slate-100 p-1 rounded-xl border-2 border-slate-200 h-auto">
          <TabsTrigger value="dopamina" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase py-2 flex flex-col gap-1">
            <Smartphone className="w-4 h-4" /> <span className="hidden md:inline">Dopamina</span>
          </TabsTrigger>
          <TabsTrigger value="gastronomia" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase py-2 flex flex-col gap-1">
            <Utensils className="w-4 h-4" /> <span className="hidden md:inline">Comida</span>
          </TabsTrigger>
          <TabsTrigger value="relax" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase py-2 flex flex-col gap-1">
            <Coffee className="w-4 h-4" /> <span className="hidden md:inline">Relax</span>
          </TabsTrigger>
          <TabsTrigger value="hobbies" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase py-2 flex flex-col gap-1">
            <ShoppingCart className="w-4 h-4" /> <span className="hidden md:inline">Hobbies</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[10px] uppercase py-2 flex flex-col gap-1">
            <Users className="w-4 h-4" /> <span className="hidden md:inline">Social</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dopamina" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.dopamina.map(item => renderItem(item, 'dopamina'))}
          </TabsContent>
          <TabsContent value="gastronomia" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.gastronomia.map(item => renderItem(item, 'gastronomia'))}
          </TabsContent>
          <TabsContent value="relax" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.relax.map(item => renderItem(item, 'relax'))}
          </TabsContent>
          <TabsContent value="hobbies" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.hobbies.map(item => renderItem(item, 'hobbies'))}
          </TabsContent>
          <TabsContent value="social" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.social.map(item => renderItem(item, 'social'))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};