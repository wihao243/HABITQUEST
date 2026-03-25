import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShopItem, ItemCategory } from "@/types/game";
import { ShoppingBag, Plus, Edit3, Trash2, Save, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ShopEditorProps {
  items: ShopItem[];
  onAdd: (item: Omit<ShopItem, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<ShopItem>) => void;
  onDelete: (id: string) => void;
}

export const ShopEditor = ({ items, onAdd, onUpdate, onDelete }: ShopEditorProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState<Omit<ShopItem, 'id'>>({
    title: "",
    cost: 50,
    category: "dopamina",
    icon: "🎁",
    rarity: "comun",
    description: "",
    effect: { daily: true }
  });

  const handleEdit = (item: ShopItem) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setIsAdding(false);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onAdd(formData);
      setIsAdding(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      cost: 50,
      category: "dopamina",
      icon: "🎁",
      rarity: "comun",
      description: "",
      effect: { daily: true }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-2 border-indigo-500 text-indigo-600 font-black uppercase text-xs">
          <ShoppingBag className="w-4 h-4 mr-2" /> Editar Tienda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white rounded-2xl border-4 border-slate-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
            Gestión de Inventario Global
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {!isAdding && !editingId ? (
            <Button onClick={() => setIsAdding(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 font-black uppercase">
              <Plus className="w-4 h-4 mr-2" /> Crear Nuevo Objeto
            </Button>
          ) : (
            <Card className="p-6 border-4 border-indigo-500 bg-indigo-50/30 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase">Título</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="border-2 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase">Icono (Emoji)</Label>
                  <Input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="border-2 font-bold text-center text-2xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase">Coste (Oro)</Label>
                  <Input type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: parseInt(e.target.value)})} className="border-2 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase">Rareza</Label>
                  <Select value={formData.rarity} onValueChange={(v: any) => setFormData({...formData, rarity: v})}>
                    <SelectTrigger className="border-2 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comun">Común</SelectItem>
                      <SelectItem value="raro">Raro</SelectItem>
                      <SelectItem value="epico">Épico</SelectItem>
                      <SelectItem value="legendario">Legendario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase">Categoría</Label>
                  <Select value={formData.category} onValueChange={(v: any) => setFormData({...formData, category: v})}>
                    <SelectTrigger className="border-2 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dopamina">Dopamina</SelectItem>
                      <SelectItem value="gastronomia">Gastronomía</SelectItem>
                      <SelectItem value="relax">Relax</SelectItem>
                      <SelectItem value="hobbies">Hobbies</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase">Rotación</Label>
                  <Select 
                    value={formData.effect.daily ? "daily" : formData.effect.weekly ? "weekly" : "monthly"} 
                    onValueChange={(v: any) => setFormData({...formData, effect: { [v]: true, timer: formData.effect.timer }})}
                  >
                    <SelectTrigger className="border-2 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diaria</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase">Descripción</Label>
                  <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="border-2 font-bold" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase">Temporizador (Minutos - 0 para ninguno)</Label>
                  <Input type="number" value={formData.effect.timer || 0} onChange={e => setFormData({...formData, effect: { ...formData.effect, timer: parseInt(e.target.value) || undefined }})} className="border-2 font-bold" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} className="flex-1 bg-slate-900 font-black uppercase"><Save className="w-4 h-4 mr-2" /> Guardar</Button>
                <Button onClick={() => { setEditingId(null); setIsAdding(false); }} variant="outline" className="border-2 font-black uppercase"><X className="w-4 h-4 mr-2" /> Cancelar</Button>
              </div>
            </Card>
          )}

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase text-slate-400">Lista de Objetos ({items.length})</Label>
            <div className="grid gap-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border-2 border-slate-100 group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-black text-sm leading-tight">{item.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {item.cost} Oro • {item.rarity} • {item.effect.daily ? 'Diario' : item.effect.weekly ? 'Semanal' : 'Mensual'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(item)} className="h-8 w-8 text-indigo-600"><Edit3 className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(item.id)} className="h-8 w-8 text-rose-600"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};