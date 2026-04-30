"use client";

import React, { useState, useEffect, useRef } from "react";
import { DoorOpen, TreePine } from "lucide-react";
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
  
  // Generar algunos "árboles" decorativos aleatorios
  const trees = useRef(Array.from({ length: 15 }, () => ({
    x: 15 + Math.random() * 70,
    y: 15 + Math.random() * 70,
    size: 15 + Math.random() * 15
  }))).current;

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
      const pSpeed = 65;
      if (keysRef.current['arrowup'] || keysRef.current['w']) playerRef.current.y -= pSpeed * dt;
      if (keysRef.current['arrowdown'] || keysRef.current['s']) playerRef.current.y += pSpeed * dt;
      if (keysRef.current['arrowleft'] || keysRef.current['a']) playerRef.current.x -= pSpeed * dt;
      if (keysRef.current['arrowright'] || keysRef.current['d']) playerRef.current.x += pSpeed * dt;
      
      playerRef.current.x = Math.max(2, Math.min(98, playerRef.current.x));
      playerRef.current.y = Math.max(2, Math.min(98, playerRef.current.y));

      // 2. Movimiento del monstruo
      const mSpeed = 28 + (difficulty * 2.5);
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
    <div className="relative w-full aspect-square max-w-[300px] bg-[#062c1e] border-4 border-[#0f4d36] rounded-2xl overflow-hidden mx-auto shadow-2xl">
      {/* Textura de suelo de bosque */}
      <div className="absolute inset-0 opacity-30" style={{ 
        backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', 
        backgroundSize: '15px 15px' 
      }} />

      {/* Árboles decorativos */}
      {trees.map((tree, i) => (
        <TreePine 
          key={i}
          className="absolute text-[#064e3b] opacity-40"
          style={{ 
            left: `${tree.x}%`, 
            top: `${tree.y}%`, 
            width: `${tree.size}px`, 
            height: `${tree.size}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Salida (Claro del bosque) */}
      <div 
        className="absolute w-12 h-12 bg-emerald-400/20 border-2 border-emerald-400/50 rounded-full flex items-center justify-center animate-pulse"
        style={{ left: `${exitPos.x}%`, top: `${exitPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-8 h-8 bg-emerald-500/40 rounded-full flex items-center justify-center">
          <DoorOpen className="w-5 h-5 text-emerald-200" />
        </div>
      </div>

      {/* Monstruo */}
      <div 
        className="absolute w-8 h-8 bg-rose-600 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.8)] flex items-center justify-center text-lg z-10 border-2 border-rose-400"
        style={{ left: `${monsterPos.x}%`, top: `${monsterPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        👹
      </div>

      {/* Jugador (Punto blanco limpio) */}
      <div 
        className="absolute w-5 h-5 bg-white rounded-full shadow-[0_0_15px_white] z-20 border-2 border-emerald-900"
        style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}
      />

      <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm py-1.5">
        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] text-center">
          ESCAPE DEL BOSQUE
        </p>
      </div>
    </div>
  );
};