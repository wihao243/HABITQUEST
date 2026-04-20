import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShopItem, ItemCategory } from "@/types/game";
import { ShoppingBag, Plus, Edit3, Trash2, Save, X, Heart, Zap, TrendingUp, Search, Filter, Coins, Clock, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShopEditorProps {
  items: ShopItem[];
  onAdd: (item: Omit<ShopItem, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<ShopItem>) => void;
  onDelete: (id: string) => void;
}

export const ShopEditor = ({ items, onAdd, onUpdate, onDelete }: ShopEditorProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  
  const [formData, setFormData] = useState<Omit<ShopItem, 'id'>>({
    title: "",
    cost: 0,
    category: "consumible",
    icon: "🎁",
    rarity: "comun",
    description: "",
    effect: { daily: true, hp: 0, xpFlat: 0, xpMultiplier: 1, timer: 0 }
  });

  const calculateAutoCost = (effect: any) => {
    const hpCost = (effect.hp || 0) * 10;
    const xpFlatCost = (effect.xpFlat || 0) * 10;
    const xpMultCost = Math.max(0, (effect.xpMultiplier - 1) * 500);
    const timerCost = (effect.timer || 0) * 1;
    return Math.max(10, Math.floor(hpCost + xpFlatCost + xpMultCost + timerCost));
  };

  useEffect(() => {
    const newCost = calculateAutoCost(formData.effect);
    if (newCost !== formData.cost) {
      setFormData(prev => ({ ...prev, cost: newCost }));
    }
  }, [formData.effect]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchesRarity = rarityFilter === "all" || item.rarity === rarityFilter;
      return matchesSearch && matchesRarity;
    });
  }, [items, search, rarityFilter]);

  const handleOpenAdd = () => {
    setEditingId(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: ShopItem) => {
    setEditingId(item.id);
    setFormData({ 
      ...item, 
      effect: { 
        ...item.effect,
        hp: item.effect.hp || 0,
        xpFlat: item.effect.xpFlat || 0,
        xpMultiplier: item.effect.xpMultiplier || 1,
        timer: item.effect.timer || 0,
        daily: item.effect.daily || false,
        weekly: item.effect.weekly || false,
        monthly: item.effect.monthly || false
      } 
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }
    setIsFormOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      cost: 0,
      category: "consumible",
      icon: "🎁",
      rarity: "comun",
      description: "",
      effect: { daily: true, hp: 0, xpFlat: 0, xpMultiplier: 1, timer: 0 }
    });
  };

  const getRotationType = () => {
    if (formData.effect.monthly) return "monthly";
    if (formData.effect.weekly) return "weekly";
    return "daily";
  };

  const setRotationType = (type: string) => {
    setFormData({
      ...formData,
      effect: {
        ...formData.effect,
        daily: type === "daily",
        weekly: type === "weekly",
        monthly: type === "monthly"
      }
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-2 border-indigo-500 text-indigo-600 font-black uppercase text-xs h-9">
            <ShoppingBag className="w-4 h-4 mr-2" /> Gestionar Tienda
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] w-[95vw] bg-white rounded-2xl border-4 border-slate-900 h-[85vh] flex flex-col p-0 overflow-hidden">
          <div className="p-6 border-b-4 border-slate-900 bg-slate-50 shrink-0">
            <DialogHeader className="mb-6 pr-8">
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
                Catálogo Global
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Buscar por nombre..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-2 font-bold h-11"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Select value={rarityFilter} onValueChange={setRarityFilter}>
                  <SelectTrigger className="flex-1 md:w-[160px] border-2 font-bold h-11">
                    <Filter className="w-3 h-3 mr-2" />
                    <SelectValue placeholder="Rareza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Rarezas</SelectItem>
                    <SelectItem value="comun" className="text-slate-600 font-bold">Común</SelectItem>
                    <SelectItem value="raro" className="text-blue-600 font-bold">Raro</SelectItem>
                    <SelectItem value="epico" className="text-purple-600 font-bold">Épico</SelectItem>
                    <SelectItem value="legendario" className="text-orange-600 font-bold">Legendario</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleOpenAdd} className="bg-indigo-600 hover:bg-indigo-700 font-black uppercase text-xs h-11 px-4">
                  <Plus className="w-4 h-4 mr-2" /> Nuevo
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <Card key={item.id} className="p-4 bg-white rounded-xl border-2 border-slate-100 hover:border-indigo-200 transition-all group">
                  <div className="flex items-center justify-between">
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
                        <p className="font-black text-sm leading-tight">{item.title}</p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-[8px] uppercase font-black px-1 h-4">
                            {item.cost} Oro
                          </Badge>
                          <Badge className={cn(
                            "text-[8px] uppercase font-black px-1 h-4",
                            item.rarity === 'legendario' ? "bg-orange-500" : 
                            item.rarity === 'epico' ? "bg-purple-500" : 
                            item.rarity === 'raro' ? "bg-blue-500" : "bg-slate-500"
                          )}>
                            {item.rarity}
                          </Badge>
                          <Badge variant="secondary" className="text-[8px] uppercase font-black px-1 h-4">
                            {item.effect.monthly ? "Mensual" : item.effect.weekly ? "Semanal" : "Diario"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(item)} className="h-9 w-9 text-indigo-600 hover:bg-indigo-50">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onDelete(item.id)} className="h-9 w-9 text-rose-600 hover:bg-rose-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-400 font-black uppercase italic tracking-widest">No hay objetos con esta rareza</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-4 border-slate-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-indigo-600">
              {editingId ? "Editar Objeto" : "Nuevo Objeto"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Título</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="border-2 font-bold h-11" placeholder="Nombre del objeto..." />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Icono (Emoji)</Label>
              <Input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="border-2 font-bold text-center text-2xl h-11" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                <Coins className="w-3 h-3 text-yellow-500" /> Coste
              </Label>
              <div className="h-11 border-2 border-slate-100 bg-slate-50 rounded-md flex items-center px-3 font-black text-slate-900">
                {formData.cost} Oro
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Rareza</Label>
              <Select value={formData.rarity} onValueChange={(v: any) => setFormData({...formData, rarity: v})}>
                <SelectTrigger className="border-2 font-bold h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="comun">Común</SelectItem>
                  <SelectItem value="raro">Raro</SelectItem>
                  <SelectItem value="epico">Épico</SelectItem>
                  <SelectItem value="legendario">Legendario</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Frecuencia (Rotación)</Label>
              <Select value={getRotationType()} onValueChange={setRotationType}>
                <SelectTrigger className="border-2 font-bold h-11">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Categoría</Label>
              <Select value={formData.category} onValueChange={(v: any) => setFormData({...formData, category: v})}>
                <SelectTrigger className="border-2 font-bold h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumible">Consumible</SelectItem>
                  <SelectItem value="dopamina">Dopamina</SelectItem>
                  <SelectItem value="gastronomia">Gastronomía</SelectItem>
                  <SelectItem value="relax">Relax</SelectItem>
                  <SelectItem value="hobbies">Hobbies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 p-3 bg-indigo-50 rounded-xl border-2 border-indigo-100 grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase flex items-center gap-1 text-rose-500"><Heart className="w-3 h-3" /> Curación (HP)</Label>
                <Input 
                  type="number" 
                  min="0"
                  value={formData.effect.hp || 0} 
                  onChange={e => {
                    const val = parseInt(e.target.value) || 0;
                    setFormData({...formData, effect: { ...formData.effect, hp: Math.max(0, val) }});
                  }} 
                  className="h-8 text-xs font-bold" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase flex items-center gap-1 text-blue-500"><Zap className="w-3 h-3" /> Experiencia (XP)</Label>
                <Input 
                  type="number" 
                  min="0"
                  value={formData.effect.xpFlat || 0} 
                  onChange={e => {
                    const val = parseInt(e.target.value) || 0;
                    setFormData({...formData, effect: { ...formData.effect, xpFlat: Math.max(0, val) }});
                  }} 
                  className="h-8 text-xs font-bold" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase flex items-center gap-1 text-amber-500"><TrendingUp className="w-3 h-3" /> Multiplicador XP</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="1"
                  value={formData.effect.xpMultiplier || 1} 
                  onChange={e => {
                    const val = parseFloat(e.target.value) || 1;
                    setFormData({...formData, effect: { ...formData.effect, xpMultiplier: Math.max(1, val) }});
                  }} 
                  className="h-8 text-xs font-bold" 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase flex items-center gap-1 text-indigo-500"><Clock className="w-3 h-3" /> Duración (Min)</Label>
                <Input 
                  type="number" 
                  min="0"
                  value={formData.effect.timer || 0} 
                  onChange={e => {
                    const val = parseInt(e.target.value) || 0;
                    setFormData({...formData, effect: { ...formData.effect, timer: Math.max(0, val) }});
                  }} 
                  className="h-8 text-xs font-bold" 
                />
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Descripción</Label>
              <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="border-2 font-bold h-11" placeholder="¿Qué hace este objeto?" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1 bg-slate-900 hover:bg-indigo-600 font-black uppercase h-12">
              <Save className="w-4 h-4 mr-2" /> Guardar
            </Button>
            <Button onClick={() => setIsFormOpen(false)} variant="outline" className="border-2 font-black uppercase h-12">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};