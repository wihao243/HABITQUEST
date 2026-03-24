import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Trash2, Coins, ArrowUpCircle, PackageX } from "lucide-react";

interface AdminPanelProps {
  onReset: () => void;
  onAddGold: (amount: number) => void;
  onLevelUp: () => void;
  onClearInventory: () => void;
}

export const AdminPanel = ({ onReset, onAddGold, onLevelUp, onClearInventory }: AdminPanelProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
          <Settings className="w-5 h-5 text-slate-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-4 border-slate-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-rose-600">
            Modo Administrador
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 pt-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trucos de Recursos</p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => onAddGold(1000)} 
                variant="outline" 
                className="border-2 border-yellow-500 text-yellow-700 font-bold hover:bg-yellow-50"
              >
                <Coins className="w-4 h-4 mr-2" /> +1000 Oro
              </Button>
              <Button 
                onClick={onLevelUp} 
                variant="outline" 
                className="border-2 border-blue-500 text-blue-700 font-bold hover:bg-blue-50"
              >
                <ArrowUpCircle className="w-4 h-4 mr-2" /> Subir Nivel
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gestión de Datos</p>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={onClearInventory} 
                variant="outline" 
                className="border-2 border-slate-400 text-slate-600 font-bold hover:bg-slate-50"
              >
                <PackageX className="w-4 h-4 mr-2" /> Vaciar Inventario
              </Button>
              <Button 
                onClick={() => {
                  if(confirm("¿Estás seguro de que quieres borrar TODO tu progreso?")) onReset();
                }} 
                variant="destructive" 
                className="bg-rose-600 hover:bg-rose-700 font-black uppercase"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Resetear Partida
              </Button>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-center text-slate-400 italic mt-4">
          "Un gran poder conlleva una gran responsabilidad... o simplemente muchas pruebas."
        </p>
      </DialogContent>
    </Dialog>
  );
};