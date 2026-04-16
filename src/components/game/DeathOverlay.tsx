import { ALL_PENALTIES } from "@/data/penalties";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skull, ShieldAlert, Heart, CheckCircle2, Plus, Search, Info } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useGameState } from "@/hooks/use-game-state";
import { Penalty } from "@/types/game";

interface DeathOverlayProps {
  penaltyIds: string[];
  onComplete: (id: string) => void;
  onRevive: () => void;
}

export const DeathOverlay = ({ penaltyIds, onComplete, onRevive }: DeathOverlayProps) => {
  const { stats, addPenaltyToActive, createCustomPenalty } = useGameState();
  const [sworn, setSworn] = useState(false);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  // Formulario para castigo personalizado
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customIcon, setCustomIcon] = useState("⚠️");

  const activePenalties = useMemo(() => {
    return penaltyIds.map(id => {
      const standard = ALL_PENALTIES.find(p => p.id === id);
      if (standard) return standard;
      return stats.customPenalties?.find(p => p.id === id);
    }).filter(Boolean) as Penalty[];
  }, [penaltyIds, stats.customPenalties]);

  const availablePenalties = useMemo(() => {
    return ALL_PENALTIES.filter(p => !penaltyIds.includes(p.id))
      .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
  }, [penaltyIds, search]);

  const handleAddCustom = () => {
    if (!customTitle.trim()) return;
    createCustomPenalty({
      title: customTitle,
      description: customDesc,
      icon: customIcon,
      category: 'personalizado'
    });
    setCustomTitle("");
    setCustomDesc("");
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8 py-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-600 border-8 border-rose-900 animate-pulse">
            <Skull className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Has Caído</h1>
          <p className="text-rose-400 font-bold uppercase tracking-widest text-sm">Tu disciplina ha fallado. Paga tu deuda para revivir.</p>
        </div>

        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Penitencias Activas ({activePenalties.length})</h2>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-2 border-rose-500 text-rose-500 font-black uppercase text-[10px] h-8 hover:bg-rose-500 hover:text-white">
                  <Plus className="w-3 h-3 mr-1" /> Añadir Penitencia
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-4 border-slate-900 max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-rose-600">
                    Elegir Castigo
                  </DialogTitle>
                </DialogHeader>

                <div className="flex gap-2 mb-4">
                  <Button 
                    onClick={() => setIsAdding(false)} 
                    variant={!isAdding ? "default" : "outline"}
                    className="flex-1 font-black uppercase text-xs"
                  >
                    Predefinidos
                  </Button>
                  <Button 
                    onClick={() => setIsAdding(true)} 
                    variant={isAdding ? "default" : "outline"}
                    className="flex-1 font-black uppercase text-xs"
                  >
                    Personalizado
                  </Button>
                </div>

                {!isAdding ? (
                  <>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="Buscar castigo..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 border-2 font-bold"
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                      {availablePenalties.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => addPenaltyToActive(p.id)}
                          className="w-full text-left p-3 bg-slate-50 hover:bg-rose-50 border-2 border-slate-100 hover:border-rose-200 rounded-xl transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{p.icon}</span>
                            <div>
                              <p className="font-black text-sm text-slate-800 group-hover:text-rose-600">{p.title}</p>
                              <p className="text-[10px] font-bold text-slate-400 line-clamp-1">{p.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-4 gap-3">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase">Icono</Label>
                        <Input value={customIcon} onChange={e => setCustomIcon(e.target.value)} className="text-center text-2xl h-12 border-2" />
                      </div>
                      <div className="col-span-3 space-y-2">
                        <Label className="text-[10px] font-black uppercase">Título del Castigo</Label>
                        <Input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Ej: Limpiar el teclado" className="h-12 border-2 font-bold" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase">Descripción</Label>
                      <Textarea value={customDesc} onChange={e => setCustomDesc(e.target.value)} placeholder="Detalla qué debes hacer exactamente..." className="border-2 font-bold min-h-[100px]" />
                    </div>
                    <Button onClick={handleAddCustom} className="w-full bg-rose-600 hover:bg-rose-500 font-black uppercase h-12">
                      Añadir a la lista
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {activePenalties.map((penalty) => (
            <Card key={penalty.id} className="p-6 bg-slate-900 border-2 border-rose-900/50 text-white flex flex-col md:flex-row gap-6 items-center">
              <div className="text-4xl bg-slate-800 p-4 rounded-2xl border-2 border-slate-700">
                {penalty.icon}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-black uppercase italic text-rose-500">{penalty.title}</h3>
                <p className="text-slate-400 text-sm mt-1 font-medium">{penalty.description}</p>
              </div>
              <Button 
                onClick={() => onComplete(penalty.id)}
                className="bg-rose-600 hover:bg-rose-500 font-black uppercase px-8 h-12"
              >
                Completado
              </Button>
            </Card>
          ))}

          {penaltyIds.length === 0 && (
            <Card className="p-8 bg-emerald-900/20 border-2 border-emerald-500/50 text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-emerald-500 uppercase italic">Penitencia Cumplida</h3>
              <p className="text-emerald-200/70 font-bold">Has pagado tus deudas con sudor y disciplina.</p>
            </Card>
          )}
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border-2 border-slate-800 space-y-6">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="sworn" 
              checked={sworn} 
              onCheckedChange={(v) => setSworn(!!v)}
              className="mt-1 border-rose-500 data-[state=checked]:bg-rose-600"
            />
            <label htmlFor="sworn" className="text-sm font-bold text-slate-300 leading-tight cursor-pointer">
              Juro por mi honor que he realizado todos los castigos indicados de forma honesta y completa.
            </label>
          </div>

          <Button 
            disabled={!sworn || penaltyIds.length > 0}
            onClick={onRevive}
            className={cn(
              "w-full h-16 text-xl font-black uppercase italic tracking-tighter transition-all",
              sworn && penaltyIds.length === 0 
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]" 
                : "bg-slate-800 text-slate-500"
            )}
          >
            <Heart className="w-6 h-6 mr-2" /> Revivir Personaje
          </Button>
        </div>

        <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
          Aviso: Cada día que pase sin revivir, se añadirá un nuevo castigo.
        </p>
      </div>
    </div>
  );
};