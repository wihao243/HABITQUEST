"use client";

import React, { useState, useEffect, useRef } from "react";
import { DoorOpen, TreePine, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MazeEscapeProps {
  onSuccess: () => void;
  onFailure: (damage: number) => void;
  difficulty: number;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const MazeEscape = ({ onSuccess, onFailure, difficulty }: MazeEscapeProps) => {
  // Generar el laberinto aleatorio al montar el componente
  const [obstacles] = useState<Obstacle[]>(() => {
    const obs: Obstacle[] = [];
    const count = 10 + Math.floor(Math.random() * 5); // Entre 10 y 15 bloques
    
    for (let i = 0; i < count; i++) {
      const isVertical = Math.random() > 0.5;
      const w = isVertical ? 5 : 15 + Math.random() * 20;
      const h = isVertical ? 15 + Math.random() * 20 : 5;
      const x = Math.random() * (100 - w);
      const y = Math.random() * (100 - h);

      // Zonas seguras: Inicio (10,10), Salida (90,10) y Spawn Monstruo (90,90)
      const distToStart = Math.sqrt(Math.pow(x + w/2 - 10, 2) + Math.pow(y + h/2 - 10, 2));
      const distToExit = Math.sqrt(Math.pow(x + w/2 - 90, 2) + Math.pow(y + h/2 - 10, 2));
      const distToMonster = Math.sqrt(Math.pow(x + w/2 - 90, 2) + Math.pow(y + h/2 - 90, 2));

      if (distToStart > 18 && distToExit > 18 && distToMonster > 15) {
        obs.push({ x, y, w, h });
      }
    }
    return obs;
  });

  const [playerPos, setPlayerPos] = useState({ x: 10, y: 10 });
  const [monsterPos, setMonsterPos] = useState({ x: 90, y: 90 });
  const [exitPos] = useState({ x: 90, y: 10 });
  
  const playerRef = useRef({ x: 10, y: 10 });
  const monsterRef = useRef({ x: 90, y: 90 });
  const keysRef = useRef<Record<string, boolean>>({});

  const checkCollision = (x: number, y: number) => {
    const r = 2.2; // Radio de colisión del jugador
    return obstacles.some(obs => 
      x + r > obs.x && x - r < obs.x + obs.w &&
      y + r > obs.y && y - r < obs.y + obs.h
    );
  };

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

      // 1. Movimiento del jugador con colisiones
      const pSpeed = 62;
      let nextX = playerRef.current.x;
      let nextY = playerRef.current.y;

      if (keysRef.current['arrowup'] || keysRef.current['w']) nextY -= pSpeed * dt;
      if (keysRef.current['arrowdown'] || keysRef.current['s']) nextY += pSpeed * dt;
      if (keysRef.current['arrowleft'] || keysRef.current['a']) nextX -= pSpeed * dt;
      if (keysRef.current['arrowright'] || keysRef.current['d']) nextX += pSpeed * dt;
      
      nextX = Math.max(2, Math.min(98, nextX));
      nextY = Math.max(2, Math.min(98, nextY));

      // Detección de colisión con deslizamiento
      if (!checkCollision(nextX, nextY)) {
        playerRef.current.x = nextX;
        playerRef.current.y = nextY;
      } else {
        if (!checkCollision(nextX, playerRef.current.y)) playerRef.current.x = nextX;
        else if (!checkCollision(playerRef.current.x, nextY)) playerRef.current.y = nextY;
      }

      // 2. Movimiento del monstruo (Persecución implacable)
      const mSpeed = 26 + (difficulty * 2.3);
      const dx = playerRef.current.x - monsterRef.current.x;
      const dy = playerRef.current.y - monsterRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        monsterRef.current.x += (dx / dist) * mSpeed * dt;
        monsterRef.current.y += (dy / dist) * mSpeed * dt;
      }

      // 3. Colisión con el monstruo
      if (dist < 4.5) {
        cancelAnimationFrame(requestID);
        onFailure(Math.max(10, Math.floor(difficulty * 2.8)));
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
  }, [difficulty, exitPos, onFailure, onSuccess, obstacles]);

  return (
    <div className="relative w-full aspect-square max-w-[300px] bg-[#021a11] border-4 border-[#0f4d36] rounded-2xl overflow-hidden mx-auto shadow-2xl">
      {/* Suelo del bosque */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', 
        backgroundSize: '15px 15px' 
      }} />

      {/* Obstáculos generados aleatoriamente */}
      {obstacles.map((obs, i) => (
        <div 
          key={i}
          className="absolute bg-[#064e3b] border-2 border-[#065f46] flex flex-wrap items-center justify-center overflow-hidden"
          style={{ 
            left: `${obs.x}%`, 
            top: `${obs.y}%`, 
            width: `${obs.w}%`, 
            height: `${obs.h}%` 
          }}
        >
          <TreePine className="w-3 h-3 text-[#022c22] opacity-30" />
        </div>
      ))}

      {/* Salida */}
      <div 
        className="absolute w-12 h-12 bg-emerald-400/20 border-2 border-emerald-400/50 rounded-full flex items-center justify-center animate-pulse"
        style={{ left: `${exitPos.x}%`, top: `${exitPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-8 h-8 bg-emerald-500/40 rounded-full flex items-center justify-center">
          <DoorOpen className="w-5 h-5 text-emerald-200" />
        </div>
      </div>

      {/* Monstruo (Orbe Rojo) */}
      <div 
        className="absolute w-6 h-6 bg-rose-600 rounded-full shadow-[0_0_25px_rgba(225,29,72,1)] z-10 border-2 border-rose-400"
        style={{ left: `${monsterPos.x}%`, top: `${monsterPos.y}%`, transform: 'translate(-50%, -50%)' }}
      />

      {/* Jugador (Punto Blanco) */}
      <div 
        className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] z-20 border-2 border-emerald-900"
        style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}
      />

      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded text-[8px] font-black text-rose-500 uppercase">
        <AlertTriangle className="w-2 h-2" /> ¡Escapa del bosque!
      </div>
    </div>
  );
};