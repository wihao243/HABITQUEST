import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Frown, Smile, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface QualitySelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (quality: 'mal' | 'bien' | 'excelente') => void;
  title: string;
}

export const QualitySelectionDialog = ({ open, onOpenChange, onSelect, title }: QualitySelectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl border-4 border-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-center">
            ¿Cómo lo has hecho?
          </DialogTitle>
          <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
            {title}
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-3 pt-4">
          <Button 
            onClick={() => onSelect('mal')}
            variant="outline"
            className="flex flex-col gap-2 h-24 border-2 border-slate-200 hover:border-rose-500 hover:bg-rose-50 group"
          >
            <Frown className="w-8 h-8 text-slate-400 group-hover:text-rose-500" />
            <span className="font-black uppercase text-[10px]">Mal</span>
          </Button>
          
          <Button 
            onClick={() => onSelect('bien')}
            variant="outline"
            className="flex flex-col gap-2 h-24 border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 group"
          >
            <Smile className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
            <span className="font-black uppercase text-[10px]">Bien</span>
          </Button>
          
          <Button 
            onClick={() => onSelect('excelente')}
            variant="outline"
            className="flex flex-col gap-2 h-24 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 group"
          >
            <Star className="w-8 h-8 text-slate-400 group-hover:text-emerald-500" />
            <span className="font-black uppercase text-[10px]">Excelente</span>
          </Button>
        </div>
        
        <p className="text-[9px] text-center font-bold text-slate-400 italic mt-2">
          La calidad ajusta ligeramente la XP recibida (+/- 10%).
        </p>
      </DialogContent>
    </Dialog>
  );
};