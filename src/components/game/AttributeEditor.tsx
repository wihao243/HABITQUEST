import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AttributeDefinition } from "@/types/game";
import { Plus, Trash2, Edit3, Save, X, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { showError, showSuccess } from "@/utils/toast";

interface AttributeEditorProps {
  definitions: AttributeDefinition[];
  onUpdate: (definitions: AttributeDefinition[]) => void;
}

const COLORS = [
  "text-orange-400", "text-blue-400", "text-yellow-400", "text-pink-400", 
  "text-emerald-400", "text-purple-400", "text-rose-400", "text-cyan-400"
];

export const AttributeEditor = ({ definitions, onUpdate }: AttributeEditorProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<AttributeDefinition>({
    id: "", name: "", icon: "✨", color: COLORS[0]
  });

  const handleSave = () => {
    if (!formData.name.trim()) return showError("El nombre es obligatorio");
    
    let newDefinitions = [...definitions];
    if (editingId) {
      newDefinitions = newDefinitions.map(d => d.id === editingId ? formData : d);
    } else {
      if (definitions.length >= 10) return showError("Máximo 10 atributos permitidos");
      newDefinitions.push({ ...formData, id: Math.random().toString(36).substr(2, 9) });
    }
    
    onUpdate(newDefinitions);
    setEditingId(null);
    setIsAdding(false);
    showSuccess("Atributos actualizados");
  };

  const handleDelete = (id: string) => {
    if (definitions.length <= 1) return showError("Debes tener al menos un atributo");
    onUpdate(definitions.filter(d => d.id !== id));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-2 border-slate-200 font-bold text-[10px] uppercase h-8">
          <Shield className="w-3 h-3 mr-1" /> Gestionar Atributos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-4 border-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">
            Atributos del Héroe
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {!isAdding && !editingId ? (
            <Button onClick={() => { setIsAdding(true); setFormData({ id: "", name: "", icon: "✨", color: COLORS[0] }); }} className="w-full bg-indigo-600 font-black uppercase">
              <Plus className="w-4 h-4 mr-2" /> Nuevo Atributo
            </Button>
          ) : (
            <Card className="p-4 border-2 border-indigo-500 bg-indigo-50/30 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase">Nombre</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-9 font-bold" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase">Icono</Label>
                  <Input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="h-9 text-center text-xl" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" className="flex-1 bg-slate-900 font-black uppercase"><Save className="w-3 h-3 mr-1" /> Guardar</Button>
                <Button onClick={() => { setEditingId(null); setIsAdding(false); }} size="sm" variant="outline" className="border-2 font-black uppercase"><X className="w-3 h-3 mr-1" /> Cancelar</Button>
              </div>
            </Card>
          )}

          <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
            {definitions.map(def => (
              <div key={def.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border-2 border-slate-100 group">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{def.icon}</span>
                  <span className="font-black text-sm uppercase tracking-tight">{def.name}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" onClick={() => { setEditingId(def.id); setFormData(def); }} className="h-8 w-8 text-indigo-600"><Edit3 className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(def.id)} className="h-8 w-8 text-rose-600"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};