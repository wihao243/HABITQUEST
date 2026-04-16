"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LightningDodgeProps {
  duration: number;
  onHit: (damage: number) => void;
  onComplete: () => void;
  difficulty: number;
}

type Attack = {
  id: number;
  type: 'horizontal' | 'vertical';
  pos: number; // 0-100
  phase: 'warning' | 'active' | 'cooldown';
};

export const LightningDodge = ({ duration, onHit, onComplete, difficulty }: LightningDodgeProps) => {
  const [displayPos, setDisplayPos] = useState({ x: 50, y: 50 });
  const [currentAttack, setCurrentAttack] = useState<Attack | null>(null);
  const [timeLeft, setTimeLeft] = useState(duration);
  
  const posRef = useRef({ x: 50, y: 50 });
  const keysRef = useRef<Record<string, boolean>>({});
  const timeLeftRef = useRef(duration);
  const lastTimeRef = useRef<number>(0);
  const attackTimerRef = useRef<number>(0);
  const attackIdRef = useRef<number>(0);
  
  const onHitRef = useRef(onHit);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onHitRef.current = onHit;
    onCompleteRef.current = onComplete;
  }, [onHit, onComplete]);

  const spawnAttack = useCallback(() => {
    const type = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    const pos = 10 + Math.random() * 80;
    return { id: attackIdRef.current++, type, pos, phase: 'warning' as const };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    let requestID: number;

    const update = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // 1. Movimiento del jugador
      const speed = 100;
      if (keysRef.current['arrowup'] || keysRef.current['w']) posRef.current.y -= speed * dt;
      if (keysRef.current['arrowdown'] || keysRef.current['s']) posRef.current.y += speed * dt;
      if (keysRef.current['arrowleft'] || keysRef.current['a']) posRef.current.x -= speed * dt;
      if (keysRef.current['arrowright'] || keysRef.current['d']) posRef.current.x += speed * dt;
      
      posRef.current.x = Math.max(5, Math.min(95, posRef.current.x));
      posRef.current.y = Math.max(5, Math.min(95, posRef.current.y));

      // 2. Lógica de ataques
      attackTimerRef.current += dt;
      
      setCurrentAttack(prev => {
        if (!prev) {
          attackTimerRef.current = 0;
          return spawnAttack();
        }

        const warningDuration = Math.max(0.4, 1.2 - (difficulty * 0.05));
        const activeDuration = 0.15;
        const cooldownDuration = 0.3;

        if (prev.phase === 'warning' && attackTimerRef.current > warningDuration) {
          attackTimerRef.current = 0;
          return { ...prev, phase: 'active' };
        }

        if (prev.phase === 'active') {
          // Comprobar colisión
          const playerVal = prev.type === 'horizontal' ? posRef.current.y : posRef.current.x;
          if (Math.abs(playerVal - prev.pos) < 8) {
            onHitRef.current(Math.max(2, Math.floor(difficulty * 1.5)));
            attackTimerRef.current = 0;
            return { ...prev, phase: 'cooldown' };
          }
          
          if (attackTimerRef.current > activeDuration) {
            attackTimerRef.current = 0;
            return { ...prev, phase: 'cooldown' };
          }
        }

        if (prev.phase === 'cooldown' && attackTimerRef.current > cooldownDuration) {
          attackTimerRef.current = 0;
          return spawnAttack();
        }

        return prev;
      });

      // 3. Timer global
      timeLeftRef.current -= dt;
      setTimeLeft(Math.max(0, Math.ceil(timeLeftRef.current)));
      setDisplayPos({ ...posRef.current });

      if (timeLeftRef.current > 0) {
        requestID = requestAnimationFrame(update);
      } else {
        onCompleteRef.current();
      }
    };

    requestID = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(requestID);
    };
  }, [difficulty, spawnAttack]);

  return (
    <div className="relative w-full aspect-square max-w-[300px] bg-slate-950 border-4 border-yellow-500 rounded-xl overflow-hidden mx-auto shadow-[0_0_30px_rgba(234,179,8,0.2)]">
      {/* Grid de fondo */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Aviso de ataque */}
      {currentAttack && currentAttack.phase === 'warning' && (
        <div 
          className={cn(
            "absolute bg-rose-600/30 animate-pulse border-rose-500/50",
            currentAttack.type === 'horizontal' ? "w-full h-12 border-y-2" : "h-full w-12 border-x-2"
          )}
          style={{ 
            left: currentAttack.type === 'vertical' ? `${currentAttack.pos}%` : '0',
            top: currentAttack.type === 'horizontal' ? `${currentAttack.pos}%` : '0',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-rose-500 opacity-50" />
          </div>
        </div>
      )}

      {/* Rayo activo */}
      {currentAttack && currentAttack.phase === 'active' && (
        <div 
          className={cn(
            "absolute bg-white shadow-[0_0_20px_#fff] z-20",
            currentAttack.type === 'horizontal' ? "w-full h-10" : "h-full w-10"
          )}
          style={{ 
            left: currentAttack.type === 'vertical' ? `${currentAttack.pos}%` : '0',
            top: currentAttack.type === 'horizontal' ? `${currentAttack.pos}%` : '0',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute inset-0 bg-yellow-400/50 animate-pulse" />
        </div>
      )}

      {/* Jugador */}
      <div 
        className="absolute w-6 h-6 bg-indigo-500 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.8)] z-30 flex items-center justify-center text-xs border-2 border-white transition-transform"
        style={{ left: `${displayPos.x}%`, top: `${displayPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        👤
      </div>

      <div className="absolute top-3 right-3 text-yellow-500 font-black text-[10px] uppercase tracking-widest bg-black/80 px-2 py-1 rounded-md border border-yellow-500/30 backdrop-blur-sm z-40 flex items-center gap-1">
        <Zap className="w-3 h-3" /> {timeLeft}s
      </div>
    </div>
  );
};