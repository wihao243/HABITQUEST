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
  pos: number; // Posición en el eje opuesto (0-100)
  progress: number; // Posición del cabezal (0-100)
  direction: 1 | -1; // Dirección del movimiento
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
    const pos = 15 + Math.random() * 70;
    const direction = Math.random() > 0.5 ? 1 : -1;
    return { 
      id: attackIdRef.current++, 
      type, 
      pos, 
      progress: direction === 1 ? -10 : 110, 
      direction: direction as 1 | -1,
      phase: 'warning' as const 
    };
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
      const speed = 110;
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

        const warningDuration = Math.max(0.3, 0.9 - (difficulty * 0.04));
        const lightningSpeed = 350 + (difficulty * 15);

        if (prev.phase === 'warning') {
          if (attackTimerRef.current > warningDuration) {
            attackTimerRef.current = 0;
            return { ...prev, phase: 'active' };
          }
          return prev;
        }

        if (prev.phase === 'active') {
          const newProgress = prev.progress + (lightningSpeed * dt * prev.direction);
          
          const playerAxisPos = prev.type === 'horizontal' ? posRef.current.y : posRef.current.x;
          const playerTravelPos = prev.type === 'horizontal' ? posRef.current.x : posRef.current.y;
          
          const onLine = Math.abs(playerAxisPos - prev.pos) < 8;
          const rayPassing = Math.abs(playerTravelPos - newProgress) < 12;

          if (onLine && rayPassing) {
            onHitRef.current(Math.max(3, Math.floor(difficulty * 1.8)));
            return { ...prev, phase: 'cooldown', progress: newProgress };
          }

          if ((prev.direction === 1 && newProgress > 120) || (prev.direction === -1 && newProgress < -20)) {
            attackTimerRef.current = 0;
            return { ...prev, phase: 'cooldown' };
          }

          return { ...prev, progress: newProgress };
        }

        if (prev.phase === 'cooldown') {
          const cooldownDuration = 0.2;
          if (attackTimerRef.current > cooldownDuration) {
            attackTimerRef.current = 0;
            return spawnAttack();
          }
          return prev;
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
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Aviso de trayectoria (Franja roja) */}
      {currentAttack && currentAttack.phase === 'warning' && (
        <div 
          className={cn(
            "absolute bg-rose-600/20 animate-pulse border-rose-500/30",
            currentAttack.type === 'horizontal' ? "w-full h-12 border-y-2" : "h-full w-12 border-x-2"
          )}
          style={{ 
            left: currentAttack.type === 'vertical' ? `${currentAttack.pos}%` : '0',
            top: currentAttack.type === 'horizontal' ? `${currentAttack.pos}%` : '0',
            transform: currentAttack.type === 'vertical' ? 'translateX(-50%)' : 'translateY(-50%)'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-rose-500 opacity-30" />
          </div>
        </div>
      )}

      {/* Rayo en movimiento */}
      {currentAttack && currentAttack.phase === 'active' && (
        <>
          {/* Rastro del rayo (Línea completa) */}
          <div 
            className={cn(
              "absolute bg-yellow-400/30 blur-sm z-10",
              currentAttack.type === 'horizontal' ? "w-full h-8" : "h-full w-8"
            )}
            style={{ 
              left: currentAttack.type === 'vertical' ? `${currentAttack.pos}%` : '0',
              top: currentAttack.type === 'horizontal' ? `${currentAttack.pos}%` : '0',
              transform: currentAttack.type === 'vertical' ? 'translateX(-50%)' : 'translateY(-50%)'
            }}
          />
          
          {/* Cabezal del rayo */}
          <div 
            className={cn(
              "absolute bg-white shadow-[0_0_25px_#fff] z-20 rounded-full",
              currentAttack.type === 'horizontal' ? "w-16 h-10" : "h-16 w-10"
            )}
            style={{ 
              left: currentAttack.type === 'vertical' ? `${currentAttack.pos}%` : `${currentAttack.progress}%`,
              top: currentAttack.type === 'horizontal' ? `${currentAttack.pos}%` : `${currentAttack.progress}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="absolute inset-0 bg-yellow-400/60 animate-pulse rounded-full" />
            <Zap className="absolute inset-0 m-auto w-6 h-6 text-yellow-600" />
          </div>
        </>
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