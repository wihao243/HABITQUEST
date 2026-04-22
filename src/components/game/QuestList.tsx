import { useState } from "react";
import { Quest } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Flame, Plus, Skull, Edit3, Trash2, RefreshCw, ChevronDown, ChevronUp, XCircle, Calendar, Clock, Coffee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { QuestDialog } from "./QuestDialog";
import { useGameState } from "@/hooks/use-game-state";
import { HabitHistoryDialog } from "./HabitHistoryDialog";
import { GlobalHabitHistory } from "./GlobalHabitHistory";
import { format, isBefore } from "date-fns";
import { es } from "date-fns/locale";

interface QuestListProps {
  quests: Quest[];
  type: 'daily' | 'habit' | 'todo';
  onComplete: (id: string) => void;
  onFail: (id: string) => void;
  onAdd: (data: Omit<Quest, 'id' | 'completed' | 'streak'>) => void;
  onUpdate: (id: string, data: Partial<Quest>) => void;
  onDelete: (id: string) => void;
}

export const QuestList = ({ quests, type, onComplete, onFail, onAdd, onUpdate, onDelete }: QuestListProps) => {
  const { stats, recoverStreak, virtualTime } = useGameState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | undefined>(undefined);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showFailed, setShowFailed] = useState(true);
  const [showRestDays, setShowRestDays] = useState(false);

  const currentDayOfWeek = virtualTime.getDay();

  const filteredQuests = quests.filter(q => q.type === type);
  
  // Lógica de filtrado por días activos para hábitos
  const activeQuests = filteredQuests.filter(q => {
    if (q.completed || q.failed) return false;
    if (type === 'habit' && q.activeDays && !q.activeDays.includes(currentDayOfWeek)) return false;
    return true;
  });

  const restDayQuests = type === 'habit' 
    ? filteredQuests.filter(q => !q.completed && !q.failed && q.activeDays && !q.activeDays.includes(currentDayOfWeek))
    : [];

  const completedQuests = filteredQuests.filter(q => q.completed);
  const failedQuests = filteredQuests.filter(q => q.failed);
  
  const config = {
    daily: { label: 'Misiones Diarias', color: 'text-blue-500', empty: 'No hay misiones diarias hoy.' },
    habit: { label: 'Hábitos', color: 'text-purple-500', empty: 'Crea hábitos para mejorar tus estadísticas.' },
    todo: { label: 'Tareas Únicas', color: 'text-green-500', empty: 'Lista de tareas pendientes.' },
  };

  const handleOpenCreate = () => {
    setEditingQuest(undefined);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (quest: Quest) => {
    setEditingQuest(quest);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingQuest) {
      onUpdate(editingQuest.id, data);
    } else {
      onAdd(data);
    }
  };

  const renderQuestCard = (quest: Quest, isRestDay = false) => {
    const isOverdue = quest.deadline && isBefore(new Date(quest.deadline), virtualTime) && !quest.completed;

    return (
      <Card key={quest.id} className={cn(
        "p-4 flex flex-col gap-4 border-2 transition-all group",
        quest.completed ? "opacity-50 bg-slate-50" : 
        quest.failed ? "opacity-60 bg-rose-50 border-rose-200" : 
        isRestDay ? "opacity-60 bg-slate-50 border-dashed border-slate-200" : "hover:border-indigo-400 shadow-md bg-white"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-lg",
              quest.failed ? "bg-slate-400" :
              isRestDay ? "bg-slate-300" :
              quest.difficulty === 'easy' ? "bg-emerald-500" : quest.difficulty === 'medium' ? "bg-amber-500" : "bg-rose-500"
            )}>
              {quest.stat.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={cn("font-black text-lg leading-tight", (quest.failed || isRestDay) ? "text-slate-400" : "text-slate-800", quest.failed && "line-through")}>
                  {quest.title}
                </p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {type === 'habit' && <HabitHistoryDialog title={quest.title} history={quest.history || []} />}
                  {!quest.failed && !quest.completed && (
                    <button 
                      onClick={() => handleOpenEdit(quest)}
                      className="text-slate-400 hover:text-indigo-600 p-1"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => onDelete(quest.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter">
                  {quest.difficulty}
                </Badge>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500">
                  {quest.stat}
                </Badge>
                {type !== 'todo' && quest.streak && quest.streak > 0 && (
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px] font-bold">
                    <Flame className="w-3 h-3 mr-1" /> {quest.streak}
                  </Badge>
                )}
                {isRestDay && (
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-bold">
                    <Coffee className="w-3 h-3 mr-1" /> Descanso
                  </Badge>
                )}
                {quest.deadline && (
                  <Badge className={cn(
                    "text-[10px] font-bold flex items-center gap-1",
                    isOverdue ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-slate-100 text-slate-600 border-slate-200"
                  )}>
                    <Clock className="w-3 h-3" /> 
                    {format(new Date(quest.deadline), "d MMM, HH:mm", { locale: es })}
                    {isOverdue && " (Vencido)"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {quest.failed ? (
              <div className="flex items-center gap-2 text-rose-500 font-black uppercase text-[10px] px-4">
                <XCircle className="w-5 h-5" /> Fallido
              </div>
            ) : isRestDay ? (
              <div className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] px-4 italic">
                Hoy no toca
              </div>
            ) : (
              <>
                {type === 'habit' && !quest.completed && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-rose-500 hover:bg-rose-50 border-rose-200 h-11 w-11"
                    onClick={() => onFail(quest.id)}
                  >
                    <Skull className="w-5 h-5" />
                  </Button>
                )}
                <Button 
                  disabled={quest.completed}
                  onClick={() => onComplete(quest.id)}
                  className={cn(
                    "h-11 px-6 font-black uppercase tracking-tighter",
                    quest.completed ? "bg-emerald-500" : "bg-slate-900 hover:bg-indigo-600"
                  )}
                >
                  {quest.completed ? <CheckCircle2 className="w-5 h-5" /> : "Hecho"}
                </Button>
              </>
            )}
          </div>
        </div>

        {type !== 'todo' && quest.recoverableStreak && quest.recoverableStreak > 0 && !quest.completed && !quest.failed && !isRestDay && (
          <div className="bg-amber-50 border-2 border-amber-200 p-3 rounded-xl flex items-center justify-between animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-amber-800">Racha Perdida: {quest.recoverableStreak}</p>
                <p className="text-[9px] font-bold text-amber-600">¡Recupérala antes de que sea tarde!</p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => recoverStreak(quest.id)}
              className="border-amber-500 text-amber-700 hover:bg-amber-500 hover:text-white font-black uppercase text-[10px] h-8"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Recuperar (50 Oro)
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className={cn("text-xl font-black uppercase italic tracking-tight", config[type].color)}>
            {config[type].label}
          </h3>
          {type === 'habit' && <GlobalHabitHistory stats={stats} quests={quests} />}
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="bg-slate-900 hover:bg-indigo-600 font-bold">
          <Plus className="w-4 h-4 mr-2" /> Añadir
        </Button>
      </div>

      <div className="grid gap-3">
        {activeQuests.map(q => renderQuestCard(q))}
        
        {activeQuests.length === 0 && completedQuests.length === 0 && failedQuests.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic">{config[type].empty}</p>
          </div>
        )}

        {restDayQuests.length > 0 && (
          <div className="mt-8 space-y-4">
            <button 
              onClick={() => setShowRestDays(!showRestDays)}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 hover:text-blue-700 transition-colors"
            >
              {showRestDays ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              Días de Descanso ({restDayQuests.length})
            </button>
            
            {showRestDays && (
              <div className="grid gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {restDayQuests.map(q => renderQuestCard(q, true))}
              </div>
            )}
          </div>
        )}

        {failedQuests.length > 0 && (
          <div className="mt-8 space-y-4">
            <button 
              onClick={() => setShowFailed(!showFailed)}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-rose-500 hover:text-rose-700 transition-colors"
            >
              {showFailed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              Hábitos Fallidos ({failedQuests.length})
            </button>
            
            {showFailed && (
              <div className="grid gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {failedQuests.map(q => renderQuestCard(q))}
              </div>
            )}
          </div>
        )}

        {(type === 'todo' || completedQuests.length > 0) && (
          <div className="mt-8 space-y-4">
            <button 
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showCompleted ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              Tareas Completadas ({completedQuests.length})
            </button>
            
            {showCompleted && (
              <div className="grid gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {completedQuests.map(q => renderQuestCard(q))}
              </div>
            )}
          </div>
        )}
      </div>

      <QuestDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSubmit={handleSubmit}
        initialData={editingQuest}
        type={type}
      />
    </div>
  );
};