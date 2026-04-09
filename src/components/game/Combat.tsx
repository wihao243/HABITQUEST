"use client";

import { useState, useEffect } from "react";
import { Monster, CharacterStats } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sword, Zap, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { DodgeArena } from "./DodgeArena";

interface CombatProps {
  monster: Monster;
  player: CharacterStats;
  onWin: (xp: number, gold: number, remainingHp: number) => void;
  onLose: (remainingHp: number) => void;
  onEscape: (remainingHp: number) => void;
}

export const Combat = ({ monster, player, onWin, onLose, onEscape }: CombatProps) => {
  const [monsterHp, setMonsterHp] = useState(monster.hp);
  const [playerHp, setPlayerHp] = useState(player.hp);
  const [log, setLog] = useState<string[]>(["¡Comienza el combate!"]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [animating, setAnimating] = useState<"player" | "monster" | null>(null);
  const [showDodge, setShowDodge] = useState(false);

  // El modo esquiva se activa para monstruos de nivel 5 o superior (Mundo 2+)
  const isDodgeMode = monster.level >= 5;

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  const isImageAvatar = player.avatar.startsWith('data:image');

  const handleAttack = () => {
    if (!isPlayerTurn || isFinished || animating) return;
    
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
        setTimeout(() => onWin(monster.xpReward, monster.goldReward, playerHp), 1500);
      } else {
        setIsPlayerTurn(false);
        if (isDodgeMode) {
          setTimeout(() => setShowDodge(true), 500);
        }
      }
    }, 500);
  };

  const handleSkill = () => {
    if (!isPlayerTurn || isFinished || animating) return;
    
    setAnimating("player");
    const heal = Math.floor(player.attributes.espiritualidad * 8);
    const newPlayerHp = Math.min(player.maxHp, playerHp + heal);
    setPlayerHp(newPlayerHp);
    addLog(`Usas meditación y recuperas ${heal} HP.`);

    setTimeout(() => {
      setAnimating(null);
      setIsPlayerTurn(false);
      if (isDodgeMode) {
        setTimeout(() => setShowDodge(true), 500);
      }
    }, 500);
  };

  // Lógica de ataque automático para Mundo 1
  useEffect(() => {
    if (!isPlayerTurn && !isFinished && !isDodgeMode) {
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
            setTimeout(() => onLose(0), 1500);
          } else {
            setIsPlayerTurn(true);
          }
        }, 500);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, isFinished, isDodgeMode]);

  const handleDodgeHit = (damage: number) => {
    setPlayerHp(prev => {
      const next = Math.max(0, prev - damage);
      if (next <= 0 && !isFinished) {
        setIsFinished(true);
        setShowDodge(false);
        addLog("¡Has caído en combate!");
        setTimeout(() => onLose(0), 1500);
      }
      return next;
    });
  };

  const handleDodgeComplete = () => {
    setShowDodge(false);
    setIsPlayerTurn(true);
    addLog(`${monster.name} termina su ataque.`);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full bg-slate-900 border-4 border-slate-800 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Monster Side */}
          <div className="flex flex-col items-center space-y-6">
            <div className={cn(
              "w-48 h-48 rounded-3xl bg-slate-800 border-4 border-rose-500 flex items-center justify-center text-8xl shadow-lg transition-transform duration-300",
              animating === "monster" && "scale-110 translate-y-4",
              monsterHp <= 0 && "opacity-0 scale-50"
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

          {/* Player Side */}
          <div className="flex flex-col items-center space-y-6">
            <div className={cn(
              "w-48 h-48 rounded-3xl bg-indigo-600 border-4 border-yellow-500 flex items-center justify-center text-8xl shadow-lg transition-transform duration-300 overflow-hidden",
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

        {/* Combat Log & Actions */}
        <div className="bg-slate-950 p-6 border-t-4 border-slate-800">
          {showDodge ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-rose-500 font-black uppercase italic animate-pulse">
                <ShieldAlert className="w-5 h-5" /> ¡ESQUIVA EL ATAQUE!
              </div>
              <DodgeArena 
                duration={8} 
                onHit={handleDodgeHit} 
                onComplete={handleDodgeComplete} 
                difficulty={monster.level} 
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2 h-32 overflow-y-auto bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                {log.map((m, i) => (
                  <p key={i} className={cn(
                    "text-sm font-bold",
                    i === 0 ? "text-white" : "text-slate-500"
                  )}>{m}</p>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  disabled={!isPlayerTurn || isFinished || !!animating}
                  onClick={handleAttack}
                  className="h-full bg-rose-600 hover:bg-rose-500 font-black uppercase flex flex-col gap-1"
                >
                  <Sword className="w-5 h-5" /> Atacar
                </Button>
                <Button 
                  disabled={!isPlayerTurn || isFinished || !!animating}
                  onClick={handleSkill}
                  className="h-full bg-indigo-600 hover:bg-indigo-500 font-black uppercase flex flex-col gap-1"
                >
                  <Zap className="w-5 h-5" /> Curar
                </Button>
                <Button 
                  disabled={!isPlayerTurn || isFinished || !!animating}
                  onClick={() => onEscape(playerHp)}
                  variant="outline"
                  className="col-span-2 border-2 border-slate-700 text-slate-400 font-black uppercase"
                >
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