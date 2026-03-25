import { ALL_ITEMS } from "@/data/items";  
import { Card, Button, Input, Select, SelectContent, SelectItem } from "@/components/ui";  
import { cn } from "@/lib/utils";  

interface ShopEditorProps {  
  onSave: () => void;  
}  

export const ShopEditor = ({ onSave }: ShopEditorProps) => {  
  const [editItem, setEditItem] = useState<ShopItem | null>(null);  
  const [newItem, setNewItem] = useState({  
    id: "",  
    title: "",  
    cost: 0,  
    category: "",  
    icon: "",  
    rarity: "comun",  
    description: "",  
    effect: { timer: 0, daily: false, weekly: false, monthly: false },  
  });  

  const handleSave = () => {  
    if (editItem) {  
      // Actualizar item existente  
      const index = ALL_ITEMS.findIndex(i => i.id === editItem.id);  
      if (index !== -1) {  
        ALL_ITEMS[index] = newItem;  
      }  
    } else {  
      // Agregar nuevo item  
      ALL_ITEMS.push(newItem);  
    }  
    onSave();  
  };  

  const handleDelete = (id: string) => {  
    const index = ALL_ITEMS.findIndex(i => i.id === id);  
    if (index !== -1) {  
      ALL_ITEMS.splice(index, 1);  
      onSave();  
    }  
  };  

  return (  
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">  
      <h2 className="text-2xl font-bold mb-4">Editar Tienda</h2>  

      {/* Formulario para nuevo item */}  
      <div className="mb-6">  
        <h3 className="text-xl font-bold mb-2">Agregar nuevo objeto</h3>  
        <form className="space-y-4">  
          <div className="mb-3">  
            <label className="block text-sm font-bold text-slate-700">ID</label>  
            <Input  
              type="text"  
              value={newItem.id}  
              onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}  
            />  
          </div>  

          <div className="mb-3">  
            <label className="block text-sm font-bold text-slate-700">Título</label>  
            <Input  
              type="text"  
              value={newItem.title}  
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}  
            />  
          </div>  

          <div className="mb-3">  
            <label className="block text-sm font-bold text-slate-700">Costo (Oro)</label>  
            <Input  
              type="number"  
              value={newItem.cost}  
              onChange={(e) => setNewItem({ ...newItem, cost: parseInt(e.target.value) })}  
            />  
          </div>  

          <div className="mb-3">  
            <label className="block text-sm font-bold text-slate-700">Categoría</label>  
            <Select  
              value={newItem.category}  
              onValueChange={(v) => setNewItem({ ...newItem, category: v })}  
            >  
              <SelectContent>  
                <SelectItem value="dopamina">Dopamina</SelectItem>  
                <SelectItem value="gastronomia">Gastronomía</SelectItem>  
                <SelectItem value="relax">Relax</SelectItem>  
                <SelectItem value="hobbies">Hobbies</SelectItem>  
                <SelectItem value="social">Social</SelectItem>  
              </SelectContent>  
            </Select>  
          </div>  

          <div className="mb-3">  
            <label className="block text-sm font-bold text-slate-700">Icono</label>  
            <Input  
              type="text"  
              value={newItem.icon}  
              onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}  
            />  
          </div>  

          <div className="mb-3">  
            <label className="block text-sm font-bold text-slate-700">Rareza</label>  
            <Select  
              value={newItem.rarity}  
              onValueChange={(v) => setNewItem({ ...newItem, rarity: v })}  
            >  
              <SelectContent>  
                <SelectItem value="comun">Común</SelectItem>  
                <SelectItem value="raro">Raro</SelectItem>  
                <SelectItem value="epico">Épico</SelectItem>  
                <SelectItem value="legendario">Legendario</SelectItem>  
              </SelectContent>  
            </Select>  
          </div>  

          <div className="mb-3">  
            <label className="block text-sm font-bold text-slate-700">Descripción</label>  
            <Input  
              type="text"  
              value={newItem.description}  
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}  
            />  
          </div>  

          <div className="mb-3">  
            <label className="block text-sm font-bold text-slate-700">Efecto</label>  
            <form className="space-y-2">  
              <div>  
                <label>Tiempo (minutos)</label>  
                <Input  
                  type="number"  
                  value={newItem.effect.timer}  
                  onChange={(e) => setNewItem({ ...newItem, effect: { ...newItem.effect, timer: parseInt(e.target.value) }})}  
                />  
              </div>  

              <div>  
                <label>Diaria</label>  
                <Input  
                  type="checkbox"  
                  checked={newItem.effect.daily}  
                  onChange={(e) => setNewItem({ ...newItem, effect: { ...newItem.effect, daily: e.target.checked }})}  
                />  
              </div>  

              <div>  
                <label>Semanal</label>  
                <Input  
                  type="checkbox"  
                  checked={newItem.effect.weekly}  
                  onChange={(e) => setNewItem({ ...newItem, effect: { ...newItem.effect, weekly: e.target.checked }})}  
                />  
              </div>  

              <div>  
                <label>Mensual</label>  
                <Input  
                  type="checkbox"  
                  checked={newItem.effect.monthly}  
                  onChange={(e) => setNewItem({ ...newItem, effect: { ...newItem.effect, monthly: e.target.checked }})}  
                />  
              </div>  
            </form>  
          </div>  

          <Button variant="default" onClick={handleSave}>Guardar</Button>  
        </form>  
      </div>  

      {/* Lista de items para editar/eliminar */}  
      <div className="mt-6">  
        <h3 className="text-xl font-bold mb-4">Gestionar objetos existentes</h3>  
        {ALL_ITEMS.map(item => (  
          <div key={item.id} className="mb-4 p-4 border border-slate-200 rounded-lg">  
            <h4 className="text-xl font-bold">{item.title}</h4>  
            <p>{item.description}</p>  
            <Button variant="outline" onClick={() => {  
              setEditItem(item);  
              setNewItem(item);  
            }}>Editar</Button>  
            <Button variant="destructive" onClick={() => handleDelete(item.id)}>Eliminar</Button>  
          </div>  
        ))}  
      </div>  
    </div>  
  );  
};  