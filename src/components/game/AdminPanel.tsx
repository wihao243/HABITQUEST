import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Trash2, Coins, ArrowUpCircle, PackageX, Clock, Lock, Unlock } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";

interface AdminPanelProps {
  onReset: () => void;
  onAddGold: (amount: number) => void;
  onLevelUp: () => void;
  onClearInventory: () => void;
  onAdvanceTime: (days: number) => void;
  currentTime: Date;
}

export const AdminPanel = ({ 
  onReset, onAddGold, onLevelUp, onClearInventory, onAdvanceTime, currentTime
}: AdminPanelProps) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "5818") {
      setIsAuthenticated(true);
      showSuccess("Acceso concedido, Comandante.");
    } else {
      showError("Contraseña incorrecta. Acceso denegado.");
      setPassword("");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsAuthenticated(false);
      setPassword("");
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
          <Settings className="w-5 h-5 text-slate-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-4 border-slate-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-rose-600 flex items-center gap-2">
            {isAuthenticated ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            Modo Administrador
          </DialogTitle>
        </DialogHeader>
        
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Código de Acceso</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="text-center text-2xl tracking-[1em] font-black border-2 border-slate-200 focus:border-rose-500 h-14"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full bg-slate-900 hover:bg-rose-600 font-black uppercase h-12">
              Desbloquear Consola
            </Button>
          </form>
        ) : (
          <div className="grid gap-6 pt-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3" /> Control del Tiempo
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-100 mb-2">
                <p className="text-xs font-bold text-slate-600">Fecha Actual: {currentTime.toLocaleDateString()}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => onAdvanceTime(1)} variant="outline" size="sm" className="font-bold border-2">
                  +1 Día
                </Button>
                <Button onClick={() => onAdvanceTime(7)} variant="outline" size="sm" className="font-bold border-2">
                  +1 Sem
                </Button>
                <Button onClick={() => onAdvanceTime(30)} variant="outline" size="sm" className="font-bold border-2">
                  +1 Mes
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trucos de Recursos</p>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => onAddGold(1000)} variant="outline" className="border-2 border-yellow-500 text-yellow-700 font-bold">
                  <Coins className="w-4 h-4 mr-2" /> +1000 Oro
                </Button>
                <Button onClick={onLevelUp} variant="outline" className="border-2 border-blue-500 text-blue-700 font-bold">
                  <ArrowUpCircle className="w-4 h-4 mr-2" /> Subir Nivel
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gestión de Datos</p>
              <div className="grid grid-cols-1 gap-2">
                <Button onClick={onClearInventory} variant="outline" className="border-2 border-slate-400 text-slate-600 font-bold">
                  <PackageX className="w-4 h-4 mr-2" /> Vaciar Inventario
                </Button>
                <Button onClick={() => confirm("¿Resetear todo?") && onReset()} variant="destructive" className="font-black uppercase">
                  <Trash2 className="w-4 h-4 mr-2" /> Resetear Partida
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};