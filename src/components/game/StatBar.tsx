import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon?: React.ReactNode;
}

export const StatBar = ({ label, value, max, color, icon }: StatBarProps) => {
  const percentage = (value / max) * 100;

  return (
    <div className="space-y-1 w-full">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1">
          {icon}
          <span>{label}</span>
        </div>
        <span>{Math.floor(value)} / {max}</span>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-900">
        <div 
          className={cn("h-full transition-all duration-500", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};