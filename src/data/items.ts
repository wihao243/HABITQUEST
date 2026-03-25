import { ShopItem } from "../types/game";

export const ALL_ITEMS: ShopItem[] = [
  // 📱 Pantallas y Dopamina (Diaria - 10 objetos para rotación)
  { id: 'd1', title: 'El Scroll Permitido', cost: 30, category: 'dopamina', icon: '📱', rarity: 'comun', description: '30 minutos de TikTok, Instagram o Twitter sin sentir culpa.', effect: { timer: 30, daily: true } },
  { id: 'd2', title: 'Siguiente Episodio', cost: 40, category: 'dopamina', icon: '📺', rarity: 'comun', description: 'Permiso para ver 1 capítulo de tu serie actual.', effect: { timer: 45, daily: true } },
  { id: 'd3', title: 'Pausa YouTube', cost: 35, category: 'dopamina', icon: '🎥', rarity: 'comun', description: '45 minutos viendo vídeos aleatorios en YouTube.', effect: { timer: 45, daily: true } },
  { id: 'd4', title: 'Partida Rápida', cost: 50, category: 'dopamina', icon: '🎮', rarity: 'comun', description: 'Jugar a un videojuego durante 1 hora.', effect: { timer: 60, daily: true } },
  { id: 'd5', title: 'Música y Nada Más', cost: 25, category: 'dopamina', icon: '🎧', rarity: 'comun', description: 'Tumbarte a escuchar tu música o podcast favorito 30 minutos.', effect: { timer: 30, daily: true } },
  { id: 'd6', title: 'Navegación Libre', cost: 20, category: 'dopamina', icon: '🌐', rarity: 'comun', description: '20 minutos de navegación por internet sin objetivo.', effect: { timer: 20, daily: true } },
  { id: 'd7', title: 'Podcast de Ocio', cost: 30, category: 'dopamina', icon: '🎙️', rarity: 'comun', description: 'Escuchar un episodio de un podcast de entretenimiento.', effect: { timer: 40, daily: true } },
  { id: 'd8', title: 'Meme Master', cost: 15, category: 'dopamina', icon: '🤡', rarity: 'comun', description: '15 minutos viendo memes o hilos de Reddit.', effect: { timer: 15, daily: true } },
  { id: 'd9', title: 'Twitch Time', cost: 45, category: 'dopamina', icon: '🟣', rarity: 'comun', description: 'Ver un stream de Twitch durante 45 minutos.', effect: { timer: 45, daily: true } },
  { id: 'd10', title: 'Cine en Casa', cost: 80, category: 'dopamina', icon: '🍿', rarity: 'raro', description: 'Ver una película completa esta noche.', effect: { timer: 120, daily: true } },

  // 🍕 Gastronomía y Caprichos (Semanal)
  { id: 'g1', title: 'El Tesoro Dulce', cost: 40, category: 'gastronomia', icon: '🍫', rarity: 'comun', description: 'Comer una porción de chocolate o tu dulce favorito.', effect: { weekly: true } },
  { id: 'g2', title: 'Café Premium', cost: 60, category: 'gastronomia', icon: '☕', rarity: 'comun', description: 'Tomarte un café de especialidad fuera de casa.', effect: { weekly: true } },
  { id: 'g3', title: 'Snack Basura', cost: 50, category: 'gastronomia', icon: '🍟', rarity: 'comun', description: 'Comprar esa bolsa de patatas que te encanta.', effect: { weekly: true } },
  { id: 'g4', title: 'El Invocador de Pizzas', cost: 200, category: 'gastronomia', icon: '🍕', rarity: 'raro', description: 'Pedir comida a domicilio.', effect: { weekly: true } },
  { id: 'g5', title: 'Copa de Victoria', cost: 50, category: 'gastronomia', icon: '🍺', rarity: 'comun', description: 'Tomarte una cerveza o refresco al final del día.', effect: { weekly: true } },

  // 🧘‍♂️ Pereza y Relax (Semanal)
  { id: 'r1', title: 'Remolonear', cost: 40, category: 'relax', icon: '🛌', rarity: 'comun', description: '30 minutos más en la cama tras despertar.', effect: { timer: 30, weekly: true } },
  { id: 'r2', title: 'Siesta Táctica', cost: 50, category: 'relax', icon: '😴', rarity: 'comun', description: 'Una siesta de 45 minutos.', effect: { timer: 45, weekly: true } },
  { id: 'r3', title: 'El Ermitaño', cost: 50, category: 'relax', icon: '✈️', rarity: 'comun', description: 'Móvil en modo avión durante 3 horas.', effect: { timer: 180, weekly: true } },
  { id: 'r4', title: 'Lectura Inmersiva', cost: 30, category: 'relax', icon: '📚', rarity: 'comun', description: '1 hora de lectura de pura ficción.', effect: { timer: 60, weekly: true } },
  { id: 'r5', title: 'Amnistía de Tareas', cost: 75, category: 'relax', icon: '🧹', rarity: 'raro', description: 'Aplazar una tarea de limpieza hasta mañana.', effect: { weekly: true } },

  // 💸 Compras y Hobbies (Mensual)
  { id: 'h1', title: 'Compra Impulsiva', cost: 400, category: 'hobbies', icon: '📦', rarity: 'raro', description: 'Gastar 15€ en algo que no necesitas.', effect: { monthly: true } },
  { id: 'h2', title: 'Libro Nuevo', cost: 300, category: 'hobbies', icon: '📖', rarity: 'raro', description: 'Comprarte un libro físico nuevo.', effect: { monthly: true } },
  { id: 'h3', title: 'Inversión Hobby', cost: 500, category: 'hobbies', icon: '🎨', rarity: 'epico', description: 'Gastar 30€ en materiales para tu afición.', effect: { monthly: true } },
  { id: 'h4', title: 'Suscripción', cost: 250, category: 'hobbies', icon: '💳', rarity: 'raro', description: 'Pagar un mes de un servicio de streaming.', effect: { monthly: true } },
  { id: 'h5', title: 'Lotería', cost: 100, category: 'hobbies', icon: '🎫', rarity: 'raro', description: 'Gastar 5€ en un rasca o lotería.', effect: { monthly: true } },

  // 🍻 Vida Social (Semanal/Mensual)
  { id: 's1', title: 'Tarde de Cañas', cost: 150, category: 'social', icon: '🍻', rarity: 'raro', description: 'Quedar con amigos a tomar algo.', effect: { weekly: true } },
  { id: 's2', title: 'Día de Compras', cost: 300, category: 'social', icon: '🛍️', rarity: 'raro', description: 'Ir a un centro comercial a pasear.', effect: { weekly: true } },
  { id: 's3', title: 'Silencio Social', cost: 100, category: 'social', icon: '🔇', rarity: 'raro', description: 'No contestar WhatsApps en 24 horas.', effect: { timer: 1440, weekly: true } },
  { id: 's4', title: 'Cancelar Plan', cost: 200, category: 'social', icon: '🚫', rarity: 'epico', description: 'Cancelar un plan social sin culpa.', effect: { weekly: true } },
  { id: 's5', title: 'Microtransacción', cost: 150, category: 'social', icon: '💎', rarity: 'epico', description: 'Gastar 5€ en tu juego favorito.', effect: { timer: 30, weekly: true } },

  // Más mensuales para variedad
  { id: 'g6', title: 'Cena de Héroe', cost: 300, category: 'gastronomia', icon: '🍽️', rarity: 'epico', description: 'Ir a cenar a un buen restaurante.', effect: { monthly: true } },
  { id: 'r6', title: 'Día en Pijama', cost: 200, category: 'relax', icon: '👕', rarity: 'epico', description: 'Todo el domingo en pijama sin tareas.', effect: { monthly: true } },
  { id: 'h6', title: 'Juego Nuevo', cost: 1500, category: 'hobbies', icon: '💿', rarity: 'legendario', description: 'Comprarte un videojuego de lanzamiento.', effect: { monthly: true } },
  { id: 's6', title: 'Escapada Express', cost: 500, category: 'social', icon: '🚗', rarity: 'epico', description: 'Ir a pasar el día a otra ciudad.', effect: { monthly: true } },
  { id: 'r7', title: 'Masaje Real', cost: 800, category: 'relax', icon: '💆', rarity: 'legendario', description: 'Pagar un masaje profesional.', effect: { monthly: true } },
];