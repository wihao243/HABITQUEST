import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface DodgeArenaProps {
  duration: number;
  onHit: (damage: number) => void;
  onComplete: () => void;
  difficulty: number;
}

export const DodgeArena = ({ duration, onHit, onComplete, difficulty }: DodgeArenaProps) => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [projectiles, setProjectiles] = useState<{ id: number; x: number; y: number; vx: number; vy: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(duration);
  const requestRef = useRef<number>();
  const keys = useRef<Record<string, boolean>>({});

  // Manejo de teclado
  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current[e.key.toLowerCase()] = true;
    const up = (e: KeyboardEvent) => keys.current[e.key.toLowerCase()] = false;
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Lógica del juego
  useEffect(() => {
    let lastTime = performance.now();
    let projectileId = 0;
    let spawnTimer = 0;

    const update = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Movimiento del jugador
      setPos(prev => {
        let nx = prev.x;
        let ny = prev.y;
        const speed = 60;
        if (keys.current['arrowup'] || keys.current['w']) ny -= speed * dt;
        if (keys.current['arrowdown'] || keys.current['s']) ny += speed * dt;
        if (keys.current['arrowleft'] || keys.current['a']) nx -= speed * dt;
        if (keys.current['arrowright'] || keys.current['d']) nx += speed * dt;
        return {
          x: Math.max(5, Math.min(95, nx)),
          y: Math.max(5, Math.min(95, ny))
        };
      });

      // Generar proyectiles
      spawnTimer += dt;
      if (spawnTimer > (0.4 / (difficulty * 0.5))) {
        spawnTimer = 0;
        const side = Math.floor(Math.random() * 4);
        let x = 0, y = 0, vx = 0, vy = 0;
        const speed = 30 + (difficulty * 5);

        if (side === 0) { x = Math.random() * 100; y = -5; vy = speed; }
        else if (side === 1) { x = Math.random() * 100; y = 105; vy = -speed; }
        else if (side === 2) { x = -5; y = Math.random() * 100; vx = speed; }
        else { x = 105; y = Math.random() * 100; vx = -speed; }

        setProjectiles(prev => [...prev, { id: projectileId++, x, y, vx, vy }]);
      }

      // Actualizar proyectiles y colisiones
      setProjectiles(prev => {
        const next = prev.map(p => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt }))
                         .filter(p => p.x > -10 && p.x < 110 && p.y > -10 && p.y < 110);
        
        // Colisión simple (distancia)
        next.forEach(p => {
          const dist = Math.sqrt(Math.pow(p.x - pos.x, 2) + Math.pow(p.y - pos.y, 2));
          if (dist < 4) {
            onHit(Math.max(1, Math.floor(difficulty * 2)));
            // Eliminar proyectil tras golpe para no recibir daño múltiple instantáneo
            p.x = -100; 
          }
        });
        
        return next;
      });

      setTimeLeft(prev => {
        const next = prev - dt;
        if (next <= 0) {
          onComplete();
          return 0;
        }
        return next;
      });

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [difficulty, pos.x, pos.y]);

  return (
    <div className="relative w-full aspect-square max-w-[300px] bg-black border-4 border-white rounded-lg overflow-hidden mx-auto shadow-[0_0_20px_rgba(255,255,255,0.2)]">
      {/* Jugador (Corazón) */}
      <div 
        className="absolute w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)] z-10 transition-transform"
        style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-[8px]">❤️</div>
      </div>

      {/* Proyectiles */}
      {projectiles.map(p => (
        <div 
          key={p.id}
          className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}
        />
      ))}

      {/* UI del minijuego */}
      <div className="absolute top-2 right-2 text-white font-black text-[10px] uppercase tracking-widest opacity-50">
        Esquiva: {Math.ceil(timeLeft)}s
      </div>
    </div>
  );
};