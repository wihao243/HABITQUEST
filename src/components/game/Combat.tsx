"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Monster, CharacterStats, ShopItem } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sword, Package, ShieldAlert, X, Zap, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DodgeArena } from "./DodgeArena";
import { LightningDodge } from "./LightningDodge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CombatProps {
  monster: Monster;
  player: CharacterStats;
  inventory: string[];
  allItems: ShopItem[];
  onWin: (xp: number, gold: number, remainingHp: number) => void;
  onLose: (remainingHp: number) => void;
  onEscape: (remainingHp: number) => void;
  onUseItem: (id: string) => void;
}

export const Combat = ({ monster, player, inventory, allItems, onWin, onLose, onEscape, onUseItem }: CombatProps) => {
  const [monsterHp, setMonsterHp] = useState(monster.hp);
  const [playerHp, setPlayerHp] = useState(player.hp);
  const [log, setLog] = useState<string[]>(["¡Comienza el combate!"]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [animating, setAnimating] = useState<"player" | "monster" | null>(null);
  const [showDodge, setShowDodge] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  // Estados para el minijuego de Clicker (Mundo 3)
  const [clickerPhase, setClickerPhase] = useState<'none' | 'countdown' | 'active'>('none');
  const [clickerCountdown, setClickerCountdown] = useState(3);
  const [clickerTimer, setClickerTimer] = useState(5);
  const clickerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isDodgeMode = monster.level >= 5;
  const isClickerMode = monster.combatType === 'clicker';
  
  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));
  const isImageAvatar = player.avatar.startsWith('data:image');

  const usableItems = inventory
    .map(id => allItems.find(i => i.id === id))
    .filter(i => i && i.category === 'consumible' && i.effect.hp) as ShopItem[];

  const handleAttack = () => {
    if (!isPlayerTurn || isFinished || animating || clickerPhase !== 'none') return;

    if (isClickerMode) {
      startClickerMinigame();
    } else {
      standardAttack();
    }
  };

  const standardAttack = () => {
    setAnimating("player");
    const damage = Math.floor(player.attributes.fuerza * 5 + Math.random() * 10);
    const newMonsterHp = Math.max(0, monsterHp - damage);
    setMonsterHp(newMonsterHp);
    addLog(`Atacas a ${monster.name} por ${damage} de daño.`);

    setTimeout(() => {
      setAnimating(null);
      if (newMonsterHp <= 0) {
        setIsFinished(true);
        addLog(`¡Has derrotado a ${monster.name}!`);
        setTimeout(() => onWin(monster.xpReward, monster.goldReward, playerHp), 800);
      } else {
        setIsPlayerTurn(false);
        if (isDodgeMode) setTimeout(() => setShowDodge(true), 300);
      }
    }, 400);
  };

  const startClickerMinigame = () => {
    setClickerPhase('countdown');
    setClickerCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setClickerCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setClickerPhase('active');
          setClickerTimer(5);
          startClickerActivePhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startClickerActivePhase = () => {
    const activeInterval = setInterval(() => {
      setClickerTimer(prev => {
        if (prev <= 0.1) {
          clearInterval(activeInterval);
          endClickerPhase();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    clickerIntervalRef.current = activeInterval;
  };

  const handleManualClick = () => {
    if (clickerPhase !== 'active' || isFinished) return;
    
    // El daño por clic ahora es la mitad del nivel del jugador, redondeado hacia abajo
    const damagePerClick = Math.floor(player.level / 2);
    
    setMonsterHp(prev => {
      const next = Math.max(0, prev - damagePerClick);
      if (next <= 0 && !isFinished) {
        setIsFinished(true);
        if (clickerIntervalRef.current) clearInterval(clickerIntervalRef.current);
        setClickerPhase('none');
        addLog(`¡Has derrotado a ${monster.name} a base de golpes!`);
        setTimeout(() => onWin(monster.xpReward, monster.goldReward, playerHp), 800);
      }
      return next;
    });
    setAnimating("player");
    setTimeout(() => setAnimating(null), 50);
  };

  const endClickerPhase = () => {
    setClickerPhase('none');
    addLog(`¡Tiempo agotado! El asalto ha terminado.`);
    
    if (monsterHp > 0) {
      setIsPlayerTurn(false);
      if (isDodgeMode) setTimeout(() => setShowDodge(true), 300);
    }
  };

  const handleUseItem = (item: ShopItem) => {
    if (!isPlayerTurn || isFinished || animating || clickerPhase !== 'none') return;
    
    const healAmount = item.effect.hp || 0;
    const newHp = Math.min(player.maxHp, playerHp + healAmount);
    setPlayerHp(newHp);
    addLog(`Usas ${item.title} y recuperas ${healAmount} HP.`);
    
    onUseItem(item.id);
    setShowInventory(false);

    setTimeout(() => {
      setIsPlayerTurn(false);
      if (isDodgeMode) setTimeout(() => setShowDodge(true), 300);
    }, 400);
  };

  useEffect(() => {
    if (!isPlayerTurn && !isFinished && !isDodgeMode && !showDodge && clickerPhase === 'none') {
      const timer = setTimeout(() => {
        setAnimating("monster");
        const damage = Math.max(1, Math.floor(monster.damage - (player.attributes.fuerza * 0.5)));
        const newPlayerHp = Math.max(0, playerHp - damage);
        setPlayerHp(newPlayerHp);
        addLog(`${monster.name} te ataca por ${damage} de daño.`);

        setTimeout(() => {
          setAnimating(null);
          if (newPlayerHp <= 0) {
            setIsFinished(true);
            addLog("¡Has caído en combate!");
            setTimeout(() => onLose(0), 800);
          } else {
            setIsPlayerTurn(true);
          }
        }, 400);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, isFinished, isDodgeMode, showDodge, monster.damage, monster.name, player.attributes.fuerza, playerHp, onLose, clickerPhase]);

  const handleDodgeHit = useCallback((damage: number) => {
    setPlayerHp(prev => {
      const next = Math.max(0, prev - damage);
      if (next <= 0 && !isFinished) {
        setIsFinished(true);
        setShowDodge(false);
        addLog("¡Has caído en combate!");
        setTimeout(() => onLose(0), 800);
      }
      return next;
    });
  }, [isFinished, onLose]);

  const handleDodgeComplete = useCallback(() => {
    setShowDodge(false);
    setIsPlayerTurn(true);
    addLog(`${monster.name} termina su ataque.`);
  }, [monster.name]);

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full bg-slate-900 border-4 border-slate-800 overflow-hidden shadow-2xl relative">
        {showInventory && (
          <div className="absolute inset-0 z-20 bg-slate-900/95 p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white uppercase italic">Objetos Usables</h3>
              <Button variant="ghost" onClick={() => setShowInventory(false)} className="text-white"><X /></Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {usableItems.length > 0 ? usableItems.map((item, idx) => (
                  <Card key={`${item.id}-${idx}`} className="p-4 bg-slate-800 border-2 border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-white font-bold text-sm">{item.title}</p>
                        <p className="text-emerald-400 text-[10px] font-black uppercase">+{item.effect.hp} HP</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleUseItem(item)} className="bg-indigo-600 font-black uppercase text-[10px]">Usar</Button>
                  </Card>
                )) : (
                  <div className="col-span-2 text-center py-10 text-slate-500 font-bold italic">No tienes pociones en el inventario.</div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className={cn(
              "w-48 h-48 rounded-3xl bg-slate-800 border-4 border-rose-500 flex items-center justify-center text-8xl shadow-lg transition-all duration-300",
              animating === "monster" && "scale-110 translate-y-4",
              monsterHp <= 0 && "opacity-0 scale-50",
              clickerPhase === 'active' && "animate-bounce"
            )}>
              {monster.avatar}
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-rose-400 font-black uppercase text-xs">
                <span>{monster.name} (LVL {monster.level})</span>
                <span>{monsterHp} / {monster.maxHp} HP</span>
              </div>
              <Progress value={(monsterHp / monster.maxHp) * 100} className="h-4 bg-slate-800 border-2 border-slate-700" />
            </div>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <div className={cn(
              "w-48 h-48 rounded-3xl bg-indigo-600 border-4 border-yellow-500 flex items-center justify-center text-8xl shadow-lg transition-all duration-300 overflow-hidden",
              animating === "player" && "scale-110 -translate-y-4",
              playerHp <= 0 && "grayscale opacity-50"
            )}>
              {isImageAvatar ? (
                <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                player.avatar
              )}
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-indigo-400 font-black uppercase text-xs">
                <span>{player.name} (LVL {player.level})</span>
                <span>{playerHp} / {player.maxHp} HP</span>
              </div>
              <Progress value={(playerHp / player.maxHp) * 100} className="h-4 bg-slate-800 border-2 border-slate-700" />
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-6 border-t-4 border-slate-800">
          {showDodge ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-rose-500 font-black uppercase italic animate-pulse">
                <ShieldAlert className="w-5 h-5" /> ¡ESQUIVA EL ATAQUE!
              </div>
              {isClickerMode ? (
                <LightningDodge 
                  duration={8} 
                  onHit={handleDodgeHit} 
                  onComplete={handleDodgeComplete} 
                  difficulty={monster.level} 
                />
              ) : (
                <DodgeArena 
                  duration={8} 
                  onHit={handleDodgeHit} 
                  onComplete={handleDodgeComplete} 
                  difficulty={monster.level} 
                />
              )}
            </div>
          ) : clickerPhase === 'countdown' ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in zoom-in duration-300">
              <h3 className="text-3xl font-black text-yellow-500 uppercase italic tracking-tighter">¡Prepárate para clicar!</h3>
              <div className="text-6xl font-black text-white animate-pulse">{clickerCountdown}</div>
            </div>
          ) : clickerPhase === 'active' ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-6">
              <div className="flex items-center gap-4 w-full max-w-md">
                <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                <Progress value={(clickerTimer / 5) * 100} className="h-6 flex-1 bg-slate-800 border-2 border-yellow-500" />
                <span className="text-xl font-black text-white w-12">{clickerTimer.toFixed(1)}s</span>
              </div>
              <Button 
                onClick={handleManualClick}
                className="w-full max-w-md h-24 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black text-4xl uppercase italic tracking-tighter shadow-[0_0_30px_rgba(234,179,8,0.4)] active:scale-95 transition-transform"
              >
                <MousePointer2 className="w-10 h-10 mr-4" /> ¡GOLPEA!
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2 h-32 overflow-y-auto bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                {log.map((m, i) => (
                  <p key={i} className={cn("text-sm font-bold", i === 0 ? "text-white" : "text-slate-500")}>{m}</p>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button disabled={!isPlayerTurn || isFinished || !!animating} onClick={handleAttack} className="h-full bg-rose-600 hover:bg-rose-500 font-black uppercase flex flex-col gap-1">
                  <Sword className="w-5 h-5" /> Atacar
                </Button>
                <Button disabled={!isPlayerTurn || isFinished || !!animating} onClick={() => setShowInventory(true)} className="h-full bg-indigo-600 hover:bg-indigo-500 font-black uppercase flex flex-col gap-1">
                  <Package className="w-5 h-5" /> Objetos
                </Button>
                <Button disabled={!isPlayerTurn || isFinished || !!animating} onClick={() => onEscape(playerHp)} variant="outline" className="col-span-2 border-2 border-slate-700 text-slate-400 font-black uppercase">
                  Escapar
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};