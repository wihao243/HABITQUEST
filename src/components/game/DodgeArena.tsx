import { useState, useEffect, useRef } from "react";

interface DodgeArenaProps {
  duration: number;
  onHit: (damage: number) => void;
  onComplete: () => void;
  difficulty: number;
}

export const DodgeArena = ({ duration, onHit, onComplete, difficulty }: DodgeArenaProps) => {
  const [displayPos, setDisplayPos] = useState({ x: 50, y: 50 });
  const [displayProjectiles, setDisplayProjectiles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(duration);
  
  // Refs para el motor del juego (evitan re-renders innecesarios y lag)
  const posRef = useRef({ x: 50, y: 50 });
  const projectilesRef = useRef<{ id: number; x: number; y: number; vx: number; vy: number }[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const projectileIdRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const update = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // 1. Movimiento del jugador
      const speed = 70;
      if (keysRef.current['arrowup'] || keysRef.current['w']) posRef.current.y -= speed * dt;
      if (keysRef.current['arrowdown'] || keysRef.current['s']) posRef.current.y += speed * dt;
      if (keysRef.current['arrowleft'] || keysRef.current['a']) posRef.current.x -= speed * dt;
      if (keysRef.current['arrowright'] || keysRef.current['d']) posRef.current.x += speed * dt;
      
      posRef.current.x = Math.max(5, Math.min(95, posRef.current.x));
      posRef.current.y = Math.max(5, Math.min(95, posRef.current.y));
      setDisplayPos({ ...posRef.current });

      // 2. Generar proyectiles
      spawnTimerRef.current += dt;
      const spawnRate = 0.4 / (1 + (difficulty * 0.2));
      if (spawnTimerRef.current > spawnRate) {
        spawnTimerRef.current = 0;
        const side = Math.floor(Math.random() * 4);
        let x = 0, y = 0, vx = 0, vy = 0;
        const pSpeed = 35 + (difficulty * 4);

        if (side === 0) { x = Math.random() * 100; y = -5; vy = pSpeed; }
        else if (side === 1) { x = Math.random() * 100; y = 105; vy = -pSpeed; }
        else if (side === 2) { x = -5; y = Math.random() * 100; vx = pSpeed; }
        else { x = 105; y = Math.random() * 100; vx = -pSpeed; }

        projectilesRef.current.push({ id: projectileIdRef.current++, x, y, vx, vy });
      }

      // 3. Actualizar proyectiles y colisiones
      projectilesRef.current = projectilesRef.current.filter(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Detección de colisión
        const dist = Math.sqrt(Math.pow(p.x - posRef.current.x, 2) + Math.pow(p.y - posRef.current.y, 2));
        if (dist < 5) {
          onHit(Math.max(1, Math.floor(difficulty * 1.5)));
          return false; // Eliminar proyectil al impactar
        }

        return p.x > -15 && p.x < 115 && p.y > -15 && p.y < 115;
      });
      
      setDisplayProjectiles(projectilesRef.current.map(p => ({ id: p.id, x: p.x, y: p.y })));

      // 4. Tiempo restante
      setTimeLeft(prev => {
        const next = prev - dt;
        if (next <= 0) {
          cancelAnimationFrame(requestRef.current!);
          onComplete();
          return 0;
        }
        return next;
      });

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [difficulty, onHit, onComplete]); // Solo depende de props estables

  return (
    <div className="relative w-full aspect-square max-w-[300px] bg-slate-950 border-4 border-white rounded-xl overflow-hidden mx-auto shadow-[0_0_30px_rgba(255,255,255,0.1)]">
      {/* Jugador (Alma) */}
      <div 
        className="absolute w-5 h-5 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.8)] z-10 flex items-center justify-center text-[10px]"
        style={{ left: `${displayPos.x}%`, top: `${displayPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        ❤️
      </div>

      {/* Proyectiles */}
      {displayProjectiles.map(p => (
        <div 
          key={p.id}
          className="absolute w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_white]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}
        />
      )}

      {/* UI */}
      <div className="absolute top-3 right-3 text-white font-black text-[10px] uppercase tracking-widest bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
        {Math.ceil(timeLeft)}s
      </div>
    </div>
  );
};