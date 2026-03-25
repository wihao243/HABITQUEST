import { Region, Monster } from "../types/game";

export const WORLD_REGIONS: Region[] = [
  {
    id: 'r1',
    name: 'Bosque de los Susurros',
    description: 'Un bosque denso donde los ecos de la pereza intentan atraparte.',
    minLevel: 1,
    icon: '🌲',
    color: 'bg-emerald-500',
    monsters: [
      { id: 'm1', name: 'Slime de Lodo', avatar: '💧', level: 1, hp: 30, maxHp: 30, damage: 5, xpReward: 15, goldReward: 10, description: 'Una masa pegajosa que ralentiza tus movimientos.' },
      { id: 'm2', name: 'Duende del Sueño', avatar: '👺', level: 2, hp: 45, maxHp: 45, damage: 8, xpReward: 25, goldReward: 15, description: 'Te lanza polvos mágicos que te dan ganas de dormir.' },
      { id: 'm3', name: 'Lobo de las Sombras', avatar: '🐺', level: 3, hp: 60, maxHp: 60, damage: 12, xpReward: 40, goldReward: 25, description: 'Acecha a los que pierden el enfoque.' },
    ],
    boss: { id: 'b1', name: 'Gran Ent de la Procrastinación', avatar: '🌳', level: 5, hp: 150, maxHp: 150, damage: 20, xpReward: 200, goldReward: 100, description: 'Un árbol milenario que ha atrapado a miles en su inactividad.' }
  },
  {
    id: 'r2',
    name: 'Cuevas de Cristal',
    description: 'Túneles brillantes llenos de distracciones y peligros.',
    minLevel: 5,
    icon: '💎',
    color: 'bg-blue-500',
    monsters: [
      { id: 'm4', name: 'Murciélago de Eco', avatar: '🦇', level: 6, hp: 80, maxHp: 80, damage: 15, xpReward: 60, goldReward: 40, description: 'Sus gritos confunden tu mente.' },
      { id: 'm5', name: 'Gólem de Cuarzo', avatar: '🗿', level: 8, hp: 120, maxHp: 120, damage: 25, xpReward: 100, goldReward: 70, description: 'Duro como una roca, difícil de vencer.' },
    ],
    boss: { id: 'b2', name: 'Dragón de las Gemas', avatar: '🐲', level: 10, hp: 350, maxHp: 350, damage: 45, xpReward: 500, goldReward: 300, description: 'Guardián de los tesoros perdidos por la falta de disciplina.' }
  },
  {
    id: 'r3',
    name: 'Pico del Trueno',
    description: 'Una montaña escarpada donde solo los más fuertes sobreviven.',
    minLevel: 10,
    icon: '⚡',
    color: 'bg-indigo-500',
    monsters: [
      { id: 'm6', name: 'Águila de Rayo', avatar: '🦅', level: 12, hp: 180, maxHp: 180, damage: 40, xpReward: 150, goldReward: 100, description: 'Ataca con la velocidad del rayo.' },
      { id: 'm7', name: 'Elemental de Tormenta', avatar: '🌪️', level: 15, hp: 250, maxHp: 250, damage: 55, xpReward: 250, goldReward: 180, description: 'Un torbellino de energía pura.' },
    ],
    boss: { id: 'b3', name: 'Titán de las Nubes', avatar: '☁️', level: 20, hp: 800, maxHp: 800, damage: 90, xpReward: 1500, goldReward: 1000, description: 'El señor de las alturas, solo los héroes legendarios pueden desafiarlo.' }
  }
];