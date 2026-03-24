import { ALL_PENALTIES } from "@/data/penalties";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skull, ShieldAlert, Heart, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DeathOverlayProps {
  penaltyIds: string[];
  onComplete: (id: string) => void;
  onRevive: () => void;
}

export const DeathOverlay = ({ penaltyIds, onComplete, onRevive }: DeathOverlayProps) => {
  const [sworn, setSworn] = useState(false);
  const activePenalties = ALL_PENALTIES.filter(p => penaltyIds.includes(p.id));

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