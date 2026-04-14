import { ShieldAlert, Clock, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface AntiFarmOverlayProps {
  blockedUntil: string;
}

export const AntiFarmOverlay = ({ blockedUntil }: AntiFarmOverlayProps) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(blockedUntil).getTime();
      const diff = end - now;

      if (diff <= 0) {
        window.location.reload();
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent" />
      
      <Card className="max-w-md w-full p-8 bg-slate-900 border-4 border-rose-600 shadow-[0_0_50px_rgba(225,29,72,0.3)] text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-rose-600 animate-pulse" />
        
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-600/10 border-4 border-rose-600 text-rose-600 mb-2">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Acceso Restringido</h1>
          <p className="text-rose-400 font-bold uppercase text-xs tracking-widest">Detección de comportamiento automatizado</p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border-2 border-slate-800 space-y-4">
          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            Tu cuenta ha sido bloqueada temporalmente por intentar "farmear" puntos de forma artificial. HabitQuest premia la disciplina real, no los atajos.
          </p>
          
          <div className="flex items-center justify-center gap-3 text-white">
            <Clock className="w-5 h-5 text-rose-500" />
            <span className="text-2xl font-black font-mono">{timeLeft}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-black uppercase">
          <Lock className="w-3 h-3" />
          <span>Bloqueo de Seguridad Activo</span>
        </div>
      </Card>
    </div>
  );
};