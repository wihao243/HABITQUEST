import { ShopItem } from "../types/game";

export const ALL_ITEMS: ShopItem[] = [
  // 🗡️ Armas y Herramientas
  { id: 'w1', title: 'Espada de Madera', cost: 10, category: 'armas', icon: '🗡️', rarity: 'comun' },
  { id: 'w2', title: 'Daga del Madrugador', cost: 50, category: 'armas', icon: '✨', rarity: 'comun' },
  { id: 'w3', title: 'Báculo de Concentración', cost: 150, category: 'armas', icon: '🔮', rarity: 'raro' },
  { id: 'w4', title: 'Arco de Precisión', cost: 200, category: 'armas', icon: '🏹', rarity: 'raro' },
  { id: 'w5', title: 'Martillo Forjahábitos', cost: 300, category: 'armas', icon: '🔨', rarity: 'raro' },
  { id: 'w6', title: 'Varita de la Calma', cost: 350, category: 'armas', icon: '🪄', rarity: 'epico' },
  { id: 'w7', title: 'Escudo de Voluntad', cost: 400, category: 'armas', icon: '🛡️', rarity: 'epico' },
  { id: 'w8', title: 'Guanteletes del Trabajador', cost: 500, category: 'armas', icon: '🥊', rarity: 'epico' },
  { id: 'w9', title: 'Espada Larga Disciplinaria', cost: 1000, category: 'armas', icon: '⚔️', rarity: 'legendario' },
  { id: 'w10', title: 'Guadaña Corta-Excusas', cost: 2500, category: 'armas', icon: '💀', rarity: 'legendario' },

  // 🛡️ Armaduras y Ropa
  { id: 'a1', title: 'Túnica del Erudito', cost: 100, category: 'armaduras', icon: '🧥', rarity: 'comun' },
  { id: 'a2', title: 'Capa del Viajero', cost: 150, category: 'armaduras', icon: '🧣', rarity: 'comun' },
  { id: 'a3', title: 'Casco de Mente Despejada', cost: 200, category: 'armaduras', icon: '🪖', rarity: 'raro' },
  { id: 'a4', title: 'Botas de Agilidad', cost: 250, category: 'armaduras', icon: '🥾', rarity: 'raro' },
  { id: 'a5', title: 'Sombrero de Hechicero', cost: 300, category: 'armaduras', icon: '🧙', rarity: 'raro' },
  { id: 'a6', title: 'Traje de Ninja Sombrío', cost: 400, category: 'armaduras', icon: '🥷', rarity: 'epico' },
  { id: 'a7', title: 'Aura de Superación', cost: 800, category: 'armaduras', icon: '🌟', rarity: 'epico' },
  { id: 'a8', title: 'Pechera de Dragón', cost: 1500, category: 'armaduras', icon: '🐲', rarity: 'legendario' },
  { id: 'a9', title: 'Gafas Steampunk', cost: 300, category: 'armaduras', icon: '🥽', rarity: 'raro' },
  { id: 'a10', title: 'Alas de Ángel Caído', cost: 5000, category: 'armaduras', icon: '🪽', rarity: 'legendario' },

  // 🐾 Mascotas y Monturas
  { id: 'p1', title: 'Huevo Misterioso', cost: 50, category: 'mascotas', icon: '🥚', rarity: 'comun' },
  { id: 'p2', title: 'Slime de Agua', cost: 100, category: 'mascotas', icon: '💧', rarity: 'comun' },
  { id: 'p3', title: 'Búho Sabio', cost: 250, category: 'mascotas', icon: '🦉', rarity: 'raro' },
  { id: 'p4', title: 'Lobezno Fiel', cost: 300, category: 'mascotas', icon: '🐺', rarity: 'raro' },
  { id: 'p5', title: 'Gato Cósmico', cost: 500, category: 'mascotas', icon: '🐱', rarity: 'epico' },
  { id: 'p6', title: 'Caballo Castaño', cost: 800, category: 'mascotas', icon: '🐎', rarity: 'epico' },
  { id: 'p7', title: 'Lobo Huargo', cost: 1500, category: 'mascotas', icon: '🐕', rarity: 'legendario' },
  { id: 'p8', title: 'Alfombra Mágica', cost: 2000, category: 'mascotas', icon: '🧹', rarity: 'legendario' },
  { id: 'p9', title: 'Fénix de Resurrección', cost: 3000, category: 'mascotas', icon: '🐦‍🔥', rarity: 'legendario' },
  { id: 'p10', title: 'Dragón Cría', cost: 5000, category: 'mascotas', icon: '🐲', rarity: 'legendario' },

  // 🧪 Consumibles
  { id: 'c1', title: 'Poción Salud Pequeña', cost: 20, category: 'consumibles', icon: '🧪', rarity: 'comun' },
  { id: 'c2', title: 'Poción Salud Mayor', cost: 100, category: 'consumibles', icon: '⚗️', rarity: 'raro' },
  { id: 'c3', title: 'Congelador de Racha', cost: 150, category: 'consumibles', icon: '❄️', rarity: 'raro' },
  { id: 'c4', title: 'Orbe Reencarnación', cost: 300, category: 'consumibles', icon: '🔮', rarity: 'epico' },
  { id: 'c5', title: 'Ticket de Rerroll', cost: 50, category: 'consumibles', icon: '🎟️', rarity: 'comun' },
  { id: 'c6', title: 'Tinte Negro Ónix', cost: 80, category: 'consumibles', icon: '🖤', rarity: 'comun' },
  { id: 'c7', title: 'Tinte Oro Brillante', cost: 150, category: 'consumibles', icon: '💛', rarity: 'raro' },
  { id: 'c8', title: 'Pergamino de Jefe', cost: 200, category: 'consumibles', icon: '📜', rarity: 'epico' },
  { id: 'c9', title: 'Llave Maestra', cost: 100, category: 'consumibles', icon: '🔑', rarity: 'raro' },
  { id: 'c10', title: 'Cofre de Botín', cost: 200, category: 'consumibles', icon: '📦', rarity: 'raro' },

  // 🍕 Recompensas Vida Real
  { id: 'r1', title: 'Episodio Extra', cost: 40, category: 'real', icon: '📺', rarity: 'comun' },
  { id: 'r2', title: 'Pausa Dulce', cost: 30, category: 'real', icon: '🍫', rarity: 'comun' },
  { id: 'r3', title: 'Día de Pereza', cost: 50, category: 'real', icon: '📱', rarity: 'comun' },
  { id: 'r4', title: 'Siesta Épica', cost: 80, category: 'real', icon: '😴', rarity: 'raro' },
  { id: 'r5', title: 'Cheat Meal', cost: 250, category: 'real', icon: '🍕', rarity: 'raro' },
  { id: 'r6', title: 'Día de Spa', cost: 150, category: 'real', icon: '🧖', rarity: 'raro' },
  { id: 'r7', title: 'Noche de Cine', cost: 400, category: 'real', icon: '🍿', rarity: 'epico' },
  { id: 'r8', title: 'Salida Nocturna', cost: 500, category: 'real', icon: '🍻', rarity: 'epico' },
  { id: 'r9', title: 'Compra Impulsiva', cost: 800, category: 'real', icon: '🛍️', rarity: 'legendario' },
  { id: 'r10', title: 'Capricho Gamer', cost: 1500, category: 'real', icon: '🎮', rarity: 'legendario' },
];