import { ShopItem } from "../types/game";

export const ALL_ITEMS: ShopItem[] = [
  // 🧪 Consumibles de Combate y Progreso
  { id: 'c1', title: 'Poción de Vida Menor', cost: 20, category: 'consumible', icon: '🧪', rarity: 'comun', description: 'Restaura 30 HP inmediatamente.', effect: { hp: 30 } },
  { id: 'c2', title: 'Poción de Vida Mayor', cost: 50, category: 'consumible', icon: '⚗️', rarity: 'raro', description: 'Restaura 80 HP inmediatamente.', effect: { hp: 80 } },
  { id: 'c3', title: 'Elixir de Vitalidad', cost: 150, category: 'consumible', icon: '🍶', rarity: 'epico', description: 'Restaura toda tu vida.', effect: { hp: 999 } },
  { id: 'c4', title: 'Pergamino de Sabiduría', cost: 100, category: 'consumible', icon: '📜', rarity: 'raro', description: 'Gana 50 XP instantáneamente.', effect: { xpFlat: 50 } },
  { id: 'c5', title: 'Tomo del Maestro', cost: 400, category: 'consumible', icon: '📕', rarity: 'epico', description: 'Gana 250 XP instantáneamente.', effect: { xpFlat: 250 } },

  // 📱 Pantallas y Dopamina
  { id: 'd1', title: 'El Scroll Permitido', cost: 30, category: 'dopamina', icon: '📱', rarity: 'comun', description: '30 minutos de TikTok, Instagram o Twitter sin sentir culpa.', effect: { timer: 30, daily: true } },
  { id: 'd2', title: 'Siguiente Episodio', cost: 40, category: 'dopamina', icon: '📺', rarity: 'comun', description: 'Permiso para ver 1 capítulo de tu serie actual.', effect: { timer: 45, daily: true } },
  { id: 'd4', title: 'Partida Rápida', cost: 50, category: 'dopamina', icon: '🎮', rarity: 'comun', description: 'Jugar a un videojuego durante 1 hora.', effect: { timer: 60, daily: true } },
  { id: 'd10', title: 'Cine en Casa', cost: 80, category: 'dopamina', icon: '🍿', rarity: 'raro', description: 'Ver una película completa esta noche.', effect: { timer: 120, daily: true } },

  // 🍕 Gastronomía
  { id: 'g1', title: 'El Tesoro Dulce', cost: 40, category: 'gastronomia', icon: '🍫', rarity: 'comun', description: 'Comer una porción de chocolate o tu dulce favorito.', effect: { weekly: true } },
  { id: 'g4', title: 'El Invocador de Pizzas', cost: 200, category: 'gastronomia', icon: '🍕', rarity: 'raro', description: 'Pedir comida a domicilio.', effect: { weekly: true } },

  // 🧘‍♂️ Relax
  { id: 'r1', title: 'Remolonear', cost: 40, category: 'relax', icon: '🛌', rarity: 'comun', description: '30 minutos más en la cama tras despertar.', effect: { timer: 30, weekly: true } },
  { id: 'r2', title: 'Siesta Táctica', cost: 50, category: 'relax', icon: '😴', rarity: 'comun', description: 'Una siesta de 45 minutos.', effect: { timer: 45, weekly: true } },

  // 💸 Hobbies
  { id: 'h1', title: 'Compra Impulsiva', cost: 400, category: 'hobbies', icon: '📦', rarity: 'raro', description: 'Gastar 15€ en algo que no necesitas.', effect: { monthly: true } },
  { id: 'h6', title: 'Juego Nuevo', cost: 1500, category: 'hobbies', icon: '💿', rarity: 'legendario', description: 'Comprarte un videojuego de lanzamiento.', effect: { monthly: true } },
];