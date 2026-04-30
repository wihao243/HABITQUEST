"use client";

import React, { useState, useEffect, useRef } from "react";
import { Move, Skull, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface MazeEscapeProps {
  onSuccess: () => void;
  onFailure: (damage: number) => void;
  difficulty: number;
}

export const MazeEscape = ({ onSuccess, onFailure, difficulty }: MazeEscapeProps) => {
  const [playerPos, setPlayerPos] = useState({ x: 10, y: 10 });
  const [monsterPos, setMonsterPos] = useState({ x: 90, y: 90 });
  const [exitPos] = useState({ x: 90, y: 10 });
  
  const playerRef = useRef({ x: 10, y: 10 });
  const monsterRef = useRef({ x: 90, y: 90 });
  const keysRef = useRef<Record<string, boolean>>({});
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    let requestID: number;
    let lastTime = 0;

    const update = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // 1. Movimiento del jugador
      const pSpeed = 60;
      if (keysRef.current['arrowup'] || keysRef.current['w']) playerRef.current.y -= pSpeed * dt;
      if (keysRef.current['arrowdown'] || keysRef.current['s']) playerRef.current.y += pSpeed * dt;
      if (keysRef.current['arrowleft'] || keysRef.current['a']) playerRef.current.x -= pSpeed * dt;
      if (keysRef.current['arrowright'] || keysRef.current['d']) playerRef.current.x += pSpeed * dt;
      
      playerRef.current.x = Math.max(2, Math.min(98, playerRef.current.x));
      playerRef.current.y = Math.max(2, Math.min(98, playerRef.current.y));

      // 2. Movimiento del monstruo (IA simple de persecución)
      const mSpeed = 25 + (difficulty * 2);
      const dx = playerRef.current.x - monsterRef.current.x;
      const dy = playerRef.current.y - monsterRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        monsterRef.current.x += (dx / dist) * mSpeed * dt;
        monsterRef.current.y += (dy / dist) * mSpeed * dt;
      }

      // 3. Colisiones
      if (dist < 5) {
        cancelAnimationFrame(requestID);
        onFailure(Math.max(5, Math.floor(difficulty * 2)));
        return;
      }

      // 4. Meta
      const distToExit = Math.sqrt(
        Math.pow(playerRef.current.x - exitPos.x, 2) + 
        Math.pow(playerRef.current.y - exitPos.y, 2)
      );
      
      if (distToExit < 5) {
        cancelAnimationFrame(requestID);
        onSuccess();
        return;
      }

      setPlayerPos({ ...playerRef.current });
      setMonsterPos({ ...monsterRef.current });
      requestID = requestAnimationFrame(update);
    };

    requestID = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(requestID);
    };
  }, [difficulty, exitPos, onFailure, onSuccess]);

  return (
    <div className="relative w-full aspect-square max-w-[300px] bg-emerald-950 border-4 border-emerald-800 rounded-xl overflow-hidden mx-auto shadow-2xl">
      {/* Fondo de laberinto decorativo */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(#065f46 2px, transparent 2px)', 
        backgroundSize: '20px 20px' 
      }} />

      {/* Salida */}
      <div 
        className="absolute w-10 h-10 bg-emerald-500/30 border-2 border-emerald-400 rounded-lg flex items-center justify-center animate-pulse"
        style={{ left: `${exitPos.x}%`, top: `${exitPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <DoorOpen className="w-6 h-6 text-emerald-400" />
      </div>

      {/* Monstruo */}
      <div 
        className="absolute w-8 h-8 bg-rose-600 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.6)] flex items-center justify-center text-lg z-10"
        style={{ left: `${monsterPos.x}%`, top: `${monsterPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        👹
      </div>

      {/* Jugador */}
      <div 
        className="absolute w-6 h-6 bg-white rounded-md shadow-lg flex items-center justify-center text-xs z-20 border-2 border-emerald-900"
        style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        🏃
      </div>

      <div className="absolute bottom-2 left-0 w-full text-center">
        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-black/40 py-1">
          ¡Llega a la puerta! Usa WASD o Flechas
        </p>
      </div>
    </div>
  );
};