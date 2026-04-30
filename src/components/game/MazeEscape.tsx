"use client";

import React, { useState, useEffect, useRef } from "react";
import { DoorOpen, TreePine, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MazeEscapeProps {
  onSuccess: () => void;
  onFailure: (damage: number) => void;
  difficulty: number;
}

interface TreeObstacle {
  x: number;
  y: number;
  radius: number;
}

export const MazeEscape = ({ onSuccess, onFailure, difficulty }: MazeEscapeProps) => {
  // Generar árboles circulares que NO se solapan
  const [trees] = useState<TreeObstacle[]>(() => {
    const obs: TreeObstacle[] = [];
    const maxAttempts = 150;
    const targetCount = 35 + Math.floor(Math.random() * 10);
    
    const startPos = { x: 8, y: 50 };
    const exitPos = { x: 92, y: 50 };

    for (let i = 0; i < maxAttempts && obs.length < targetCount; i++) {
      const radius = 2.5 + Math.random() * 4.5;
      const x = radius + Math.random() * (100 - radius * 2);
      const y = radius + Math.random() * (100 - radius * 2);

      // Verificar distancia con otros árboles (evitar solapamiento)
      const overlaps = obs.some(tree => {
        const dist = Math.sqrt(Math.pow(x - tree.x, 2) + Math.pow(y - tree.y, 2));
        return dist < (tree.radius + radius + 1.5); // 1.5% de margen de separación
      });

      if (overlaps) continue;

      // Zonas seguras: Inicio y Salida
      const distToStart = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
      const distToExit = Math.sqrt(Math.pow(x - exitPos.x, 2) + Math.pow(y - exitPos.y, 2));

      if (distToStart > 12 && distToExit > 12) {
        obs.push({ x, y, radius });
      }
    }
    return obs;
  });

  const [playerPos, setPlayerPos] = useState({ x: 8, y: 50 });
  const [monsterPos, setMonsterPos] = useState({ x: 92, y: 85 });
  const [exitPos] = useState({ x: 92, y: 50 });
  
  const playerRef = useRef({ x: 8, y: 50 });
  const monsterRef = useRef({ x: 92, y: 85 });
  const keysRef = useRef<Record<string, boolean>>({});

  const playerRadius = 1.8;

  const checkCollision = (x: number, y: number) => {
    return trees.some(tree => {
      const dx = x - tree.x;
      const dy = y - tree.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (tree.radius + playerRadius - 0.3);
    });
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

      // 1. Movimiento del jugador
      const pSpeed = 68;
      let nextX = playerRef.current.x;
      let nextY = playerRef.current.y;

      if (keysRef.current['arrowup'] || keysRef.current['w']) nextY -= pSpeed * dt;
      if (keysRef.current['arrowdown'] || keysRef.current['s']) nextY += pSpeed * dt;
      if (keysRef.current['arrowleft'] || keysRef.current['a']) nextX -= pSpeed * dt;
      if (keysRef.current['arrowright'] || keysRef.current['d']) nextX += pSpeed * dt;
      
      nextX = Math.max(2, Math.min(98, nextX));
      nextY = Math.max(2, Math.min(98, nextY));

      if (!checkCollision(nextX, nextY)) {
        playerRef.current.x = nextX;
        playerRef.current.y = nextY;
      } else {
        if (!checkCollision(nextX, playerRef.current.y)) playerRef.current.x = nextX;
        else if (!checkCollision(playerRef.current.x, nextY)) playerRef.current.y = nextY;
      }

      // 2. Movimiento del monstruo (Persecución)
      const mSpeed = 24 + (difficulty * 2.5);
      const dx = playerRef.current.x - monsterRef.current.x;
      const dy = playerRef.current.y - monsterRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        monsterRef.current.x += (dx / dist) * mSpeed * dt;
        monsterRef.current.y += (dy / dist) * mSpeed * dt;
      }

      // 3. Colisión con el monstruo
      if (dist < 4.2) {
        cancelAnimationFrame(requestID);
        onFailure(Math.max(15, Math.floor(difficulty * 3.5)));
        return;
      }

      // 4. Meta (Lado derecho)
      const distToExit = Math.sqrt(
        Math.pow(playerRef.current.x - exitPos.x, 2) + 
        Math.pow(playerRef.current.y - exitPos.y, 2)
      );
      
      if (distToExit < 4.5) {
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
  }, [difficulty, exitPos, onFailure, onSuccess, trees]);

  return (
    <div className="relative w-full aspect-[16/9] max-w-[500px] bg-[#021a11] border-4 border-[#0f4d36] rounded-2xl overflow-hidden mx-auto shadow-2xl">
      {/* Suelo del bosque */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', 
        backgroundSize: '20px 20px' 
      }} />

      {/* Árboles (Obstáculos circulares que no se solapan) */}
      {trees.map((tree, i) => (
        <div 
          key={i}
          className="absolute bg-[#064e3b] border-2 border-[#065f46] rounded-full flex items-center justify-center shadow-lg"
          style={{ 
            left: `${tree.x}%`, 
            top: `${tree.y}%`, 
            width: `${tree.radius * 2}%`, 
            height: `${tree.radius * 2 * (16/9)}%`, // Ajuste visual por el aspect ratio
            transform: 'translate(-50%, -50%)'
          }}
        >
          <TreePine className="w-1/2 h-1/2 text-[#022c22] opacity-40" />
        </div>
      ))}

      {/* Salida (Extremo Derecho) */}
      <div 
        className="absolute w-14 h-14 bg-emerald-400/20 border-2 border-emerald-400/50 rounded-full flex items-center justify-center animate-pulse"
        style={{ left: `${exitPos.x}%`, top: `${exitPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-10 h-10 bg-emerald-500/40 rounded-full flex items-center justify-center">
          <DoorOpen className="w-6 h-6 text-emerald-200" />
        </div>
      </div>

      {/* Monstruo (Orbe Rojo) */}
      <div 
        className="absolute w-7 h-7 bg-rose-600 rounded-full shadow-[0_0_30px_rgba(225,29,72,1)] z-10 border-2 border-rose-400"
        style={{ left: `${monsterPos.x}%`, top: `${monsterPos.y}%`, transform: 'translate(-50%, -50%)' }}
      />

      {/* Jugador (Punto Blanco) */}
      <div 
        className="absolute w-5 h-5 bg-white rounded-full shadow-[0_0_20px_white] z-20 border-2 border-emerald-900"
        style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}
      />

      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded text-[8px] font-black text-rose-500 uppercase">
        <AlertTriangle className="w-2 h-2" /> Cruza el bosque hacia la derecha
      </div>
    </div>
  );
};