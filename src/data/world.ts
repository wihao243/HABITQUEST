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
      { id: 'm1', name: 'Slime de Lodo', avatar: '/slime-lodo.png', level: 1, hp: 30, maxHp: 30, damage: 5, xpReward: 3, goldReward: 2, description: 'Una masa pegajosa que ralentiza tus movimientos.' },
      { id: 'm2', name: 'Duende del Sueño', avatar: '/duende-sueno.png', level: 2, hp: 45, maxHp: 45, damage: 8, xpReward: 5, goldReward: 3, description: 'Te lanza polvos mágicos que te dan ganas de dormir.' },
      { id: 'm3', name: 'Lobo de las Sombras', avatar: '/lobo-sombras.png', level: 3, hp: 60, maxHp: 60, damage: 12, xpReward: 8, goldReward: 5, description: 'Acecha a los que pierden el enfoque.' },
    ],
    boss: { id: 'b1', name: 'Gran Ent de la Procrastinación', avatar: '/ent-procrastinacion.png', level: 5, hp: 150, maxHp: 150, damage: 20, xpReward: 30, goldReward: 15, description: 'Un árbol milenario que ha atrapado a miles en su inactividad.' }
  },
  {
    id: 'r2',
    name: 'Cuevas de Cristal',
    description: 'Túneles brillantes llenos de distracciones y peligros.',
    minLevel: 5,
    icon: '💎',
    color: 'bg-blue-500',
    monsters: [
      { id: 'm4', name: 'Murciélago de Eco', avatar: '🦇', level: 6, hp: 80, maxHp: 80, damage: 15, xpReward: 12, goldReward: 8, description: 'Sus gritos confunden tu mente.' },
      { id: 'm5', name: 'Gólem de Cuarzo', avatar: '🗿', level: 8, hp: 120, maxHp: 120, damage: 25, xpReward: 18, goldReward: 12, description: 'Duro como una roca, difícil de vencer.' },
    ],
    boss: { id: 'b2', name: 'Dragón de las Gemas', avatar: '🐲', level: 10, hp: 350, maxHp: 350, damage: 45, xpReward: 60, goldReward: 40, description: 'Guardián de los tesoros perdidos por la falta de disciplina.' }
  },
  {
    id: 'r3',
    name: 'Pico del Trueno',
    description: 'Una montaña escarpada donde solo los más fuertes sobreviven.',
    minLevel: 10,
    icon: '⚡',
    color: 'bg-indigo-500',
    monsters: [
      { id: 'm6', name: 'Águila de Rayo', avatar: '🦅', level: 12, hp: 180, maxHp: 180, damage: 40, xpReward: 25, goldReward: 15, description: 'Ataca con la velocidad del rayo.', combatType: 'clicker' },
      { id: 'm7', name: 'Elemental de Tormenta', avatar: '🌪️', level: 15, hp: 250, maxHp: 250, damage: 55, xpReward: 35, goldReward: 25, description: 'Un torbellino de energía pura.', combatType: 'clicker' },
    ],
    boss: { id: 'b3', name: 'Titán de las Nubes', avatar: '☁️', level: 20, hp: 800, maxHp: 800, damage: 90, xpReward: 100, goldReward: 70, description: 'El señor de las alturas, solo los héroes legendarios pueden desafiarlo.', combatType: 'clicker' }
  },
  {
    id: 'r4',
    name: 'Desierto de los Espejismos',
    description: 'Un mar de arena donde el calor distorsiona la realidad.',
    minLevel: 15,
    icon: '🏜️',
    color: 'bg-orange-400',
    monsters: [
      { id: 'm8', name: 'Escorpión de Cristal', avatar: '🦂', level: 18, hp: 350, maxHp: 350, damage: 70, xpReward: 45, goldReward: 30, description: 'Su aguijón inyecta dudas paralizantes.' },
      { id: 'm9', name: 'Momia del Olvido', avatar: '🧟', level: 22, hp: 500, maxHp: 500, damage: 85, xpReward: 60, goldReward: 45, description: 'Un antiguo rey que olvidó sus metas.' },
    ],
    boss: { id: 'b4', name: 'Esfinge del Tiempo Perdido', avatar: '🦁', level: 30, hp: 1500, maxHp: 1500, damage: 150, xpReward: 200, goldReward: 150, description: 'Te devora si no aprovechas cada segundo.' }
  },
  {
    id: 'r5',
    name: 'Pantano de la Melancolía',
    description: 'Aguas estancadas que intentan hundirte en la tristeza.',
    minLevel: 25,
    icon: '🍄',
    color: 'bg-lime-700',
    monsters: [
      { id: 'm10', name: 'Sapo de Cieno', avatar: '🐸', level: 28, hp: 700, maxHp: 700, damage: 110, xpReward: 80, goldReward: 60, description: 'Su croar te quita las ganas de hacer nada.' },
      { id: 'm11', name: 'Fuego Fatuo', avatar: '👻', level: 35, hp: 900, maxHp: 900, damage: 140, xpReward: 110, goldReward: 90, description: 'Luces que te distraen del camino correcto.' },
    ],
    boss: { id: 'b5', name: 'Hidra de las Mil Excusas', avatar: '🐍', level: 45, hp: 3000, maxHp: 3000, damage: 250, xpReward: 400, goldReward: 300, description: 'Corta una excusa y aparecerán dos más.' }
  },
  {
    id: 'r6',
    name: 'Ciudad Mecánica',
    description: 'Una metrópolis de engranajes que nunca descansa.',
    minLevel: 40,
    icon: '⚙️',
    color: 'bg-slate-500',
    monsters: [
      { id: 'm12', name: 'Dron de Vigilancia', avatar: '🛸', level: 45, hp: 1200, maxHp: 1200, damage: 180, xpReward: 150, goldReward: 120, description: 'Te observa para detectar cualquier fallo en tu rutina.' },
      { id: 'm13', name: 'Centinela de Vapor', avatar: '🤖', level: 55, hp: 1800, maxHp: 1800, damage: 220, xpReward: 220, goldReward: 180, description: 'Una máquina de eficiencia implacable.' },
    ],
    boss: { id: 'b6', name: 'El Gran Engranaje Maestro', avatar: '🦾', level: 65, hp: 6000, maxHp: 6000, damage: 400, xpReward: 800, goldReward: 600, description: 'El corazón de la ciudad, controla cada segundo de productividad.' }
  },
  {
    id: 'r7',
    name: 'Glaciar Eterno',
    description: 'Un páramo helado donde la voluntad se congela.',
    minLevel: 60,
    icon: '❄️',
    color: 'bg-cyan-300',
    monsters: [
      { id: 'm14', name: 'Yeti de Escarcha', avatar: '🧌', level: 65, hp: 2500, maxHp: 2500, damage: 300, xpReward: 350, goldReward: 250, description: 'Su aliento congela tus mejores intenciones.' },
      { id: 'm15', name: 'Elemental de Hielo', avatar: '🧊', level: 75, hp: 3500, maxHp: 3500, damage: 380, xpReward: 500, goldReward: 400, description: 'Frío y calculador, como un lunes por la mañana.' },
    ],
    boss: { id: 'b7', name: 'Dragón de la Ventisca', avatar: '🐉', level: 85, hp: 10000, maxHp: 10000, damage: 600, xpReward: 1500, goldReward: 1200, description: 'El señor del frío eterno, solo los corazones ardientes pueden vencerlo.' }
  },
  {
    id: 'r8',
    name: 'Templo del Vacío',
    description: 'Un lugar entre dimensiones donde el tiempo no existe.',
    minLevel: 80,
    icon: '🌌',
    color: 'bg-purple-900',
    monsters: [
      { id: 'm16', name: 'Espectro del Vacío', avatar: '👤', level: 85, hp: 5000, maxHp: 5000, damage: 500, xpReward: 800, goldReward: 600, description: 'Una sombra de lo que podrías haber sido.' },
      { id: 'm17', name: 'Guardián Dimensional', avatar: '👁️', level: 95, hp: 7000, maxHp: 7000, damage: 650, xpReward: 1200, goldReward: 1000, description: 'Vigila las puertas de lo que está por venir.' },
    ],
    boss: { id: 'b8', name: 'El Observador del Destino', avatar: '🧿', level: 110, hp: 20000, maxHp: 20000, damage: 1000, xpReward: 4000, goldReward: 3000, description: 'Conoce todos tus fallos pasados y futuros.' }
  },
  {
    id: 'r9',
    name: 'Abismo de las Sombras',
    description: 'La oscuridad más profunda, donde nacen los miedos.',
    minLevel: 100,
    icon: '🌑',
    color: 'bg-black',
    monsters: [
      { id: 'm18', name: 'Pesadilla Viviente', avatar: '👹', level: 110, hp: 12000, maxHp: 12000, damage: 900, xpReward: 2000, goldReward: 1500, description: 'Toma la forma de tu mayor distracción.' },
      { id: 'm19', name: 'Segador de Almas', avatar: '💀', level: 125, hp: 18000, maxHp: 18000, damage: 1200, xpReward: 3500, goldReward: 2500, description: 'Viene a cobrar las deudas de tu falta de disciplina.' },
    ],
    boss: { id: 'b9', name: 'Avatar del Caos', avatar: '🌀', level: 140, hp: 50000, maxHp: 50000, damage: 2000, xpReward: 10000, goldReward: 8000, description: 'La representación pura del desorden y la falta de control.' }
  },
  {
    id: 'r10',
    name: 'El Infierno',
    description: 'El destino final de los que abandonaron su camino.',
    minLevel: 150,
    icon: '🌋',
    color: 'bg-red-900',
    monsters: [
      { id: 'm20', name: 'Demonio de Fuego', avatar: '🔥', level: 160, hp: 30000, maxHp: 30000, damage: 2500, xpReward: 6000, goldReward: 5000, description: 'Arde con la furia de las oportunidades perdidas.' },
      { id: 'm21', name: 'Cerbero del Hábito', avatar: '🐕‍🦺', level: 180, hp: 45000, maxHp: 45000, damage: 3500, xpReward: 10000, goldReward: 8000, description: 'Tres cabezas que vigilan que nunca vuelvas a ser productivo.' },
    ],
    boss: { id: 'b10', name: 'Lucifer, Señor de la Pereza', avatar: '😈', level: 200, hp: 150000, maxHp: 150000, damage: 7000, xpReward: 50000, goldReward: 25000, description: 'El soberano absoluto del abandono personal. Vencerlo es alcanzar la maestría total.' }
  }
];