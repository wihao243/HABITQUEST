import { ShopItem } from "../types/game";

export const ALL_ITEMS: ShopItem[] = [
  // 🗡️ Armas y Herramientas (Dan stats permanentes al usarse)
  { id: 'w1', title: 'Espada de Madera', cost: 10, category: 'armas', icon: '🗡️', rarity: 'comun', description: 'Un juguete, pero te hace sentir más fuerte. (+1 Fuerza)', effect: { type: 'stat', value: 1, stat: 'fuerza' } },
  { id: 'w2', title: 'Daga del Madrugador', cost: 50, category: 'armas', icon: '✨', rarity: 'comun', description: 'Ideal para cortar la pereza matutina. (+2 Fuerza)', effect: { type: 'stat', value: 2, stat: 'fuerza' } },
  { id: 'w3', title: 'Báculo de Concentración', cost: 150, category: 'armas', icon: '🔮', rarity: 'raro', description: 'Canaliza tu energía en una sola tarea. (+3 Inteligencia)', effect: { type: 'stat', value: 3, stat: 'inteligencia' } },
  { id: 'w9', title: 'Espada Larga Disciplinaria', cost: 1000, category: 'armas', icon: '⚔️', rarity: 'legendario', description: 'La legendaria hoja forjada en el fuego del hábito. (+10 Fuerza)', effect: { type: 'stat', value: 10, stat: 'fuerza' } },

  // 🛡️ Armaduras y Ropa
  { id: 'a1', title: 'Túnica del Erudito', cost: 100, category: 'armaduras', icon: '🧥', rarity: 'comun', description: 'Te hace ver más inteligente de lo que eres. (+2 Inteligencia)', effect: { type: 'stat', value: 2, stat: 'inteligencia' } },
  { id: 'a3', title: 'Casco de Mente Despejada', cost: 200, category: 'armaduras', icon: '🪖', rarity: 'raro', description: 'Bloquea las distracciones externas. (+4 Inteligencia)', effect: { type: 'stat', value: 4, stat: 'inteligencia' } },
  { id: 'a10', title: 'Alas de Ángel Caído', cost: 5000, category: 'armaduras', icon: '🪽', rarity: 'legendario', description: 'Vuela por encima de tus excusas. (+15 Espíritu)', effect: { type: 'stat', value: 15, stat: 'espiritualidad' } },

  // 🐾 Mascotas
  { id: 'p2', title: 'Slime de Agua', cost: 100, category: 'mascotas', icon: '💧', rarity: 'comun', description: 'Un compañero pegajoso pero fiel. (+2 Carisma)', effect: { type: 'stat', value: 2, stat: 'carisma' } },
  { id: 'p3', title: 'Búho Sabio', cost: 250, category: 'mascotas', icon: '🦉', rarity: 'raro', description: 'Te observa mientras estudias. (+5 Inteligencia)', effect: { type: 'stat', value: 5, stat: 'inteligencia' } },
  { id: 'p9', title: 'Fénix de Resurrección', cost: 3000, category: 'mascotas', icon: '🐦‍🔥', rarity: 'legendario', description: 'Renace de tus fracasos. (+50 HP)', effect: { type: 'hp', value: 50 } },

  // 🧪 Consumibles
  { id: 'c1', title: 'Poción Salud Pequeña', cost: 20, category: 'consumibles', icon: '🧪', rarity: 'comun', description: 'Restaura un poco de vitalidad. (+10 HP)', effect: { type: 'hp', value: 10 } },
  { id: 'c2', title: 'Poción Salud Mayor', cost: 100, category: 'consumibles', icon: '⚗️', rarity: 'raro', description: 'Restaura mucha vitalidad. (+40 HP)', effect: { type: 'hp', value: 40 } },
  { id: 'c4', title: 'Orbe Reencarnación', cost: 300, category: 'consumibles', icon: '🔮', rarity: 'epico', description: 'Te otorga una gran cantidad de experiencia. (+100 XP)', effect: { type: 'xp', value: 100 } },
  { id: 'c10', title: 'Cofre de Botín', cost: 200, category: 'consumibles', icon: '📦', rarity: 'raro', description: 'Contiene monedas de oro de un aventurero caído. (+500 Oro)', effect: { type: 'gold', value: 500 } },

  // 🍕 Recompensas Vida Real
  { id: 'r1', title: 'Episodio Extra', cost: 40, category: 'real', icon: '📺', rarity: 'comun', description: 'Canjea esto por un episodio extra de tu serie favorita.', effect: { type: 'xp', value: 5 } },
  { id: 'r5', title: 'Cheat Meal', cost: 250, category: 'real', icon: '🍕', rarity: 'raro', description: '¡Te lo has ganado! Disfruta de una comida libre.', effect: { type: 'hp', value: 20 } },
];