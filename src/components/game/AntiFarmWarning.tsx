import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ShieldAlert } from "lucide-react";

interface AntiFarmWarningProps {
  open: boolean;
  onAccept: () => void;
}

export const AntiFarmWarning = ({ open, onAccept }: AntiFarmWarningProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white border-4 border-amber-500 rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-amber-600 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6" /> ¡DETECCIÓN DE ACTIVIDAD!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 font-bold text-base leading-relaxed pt-2">
            Se ha detectado un patrón de creación y completado de misiones demasiado rápido. 
            <br /><br />
            HabitQuest está diseñado para recompensar el progreso real. Si continúas intentando "farmear" puntos de forma artificial, **tu cuenta será bloqueada temporalmente durante 1 hora**.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction 
            onClick={onAccept}
            className="bg-amber-500 hover:bg-amber-600 text-white font-black uppercase w-full h-12"
          >
            Entendido, jugaré limpio
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};