import { ShopItem } from "../types/game";

export const ALL_ITEMS: ShopItem[] = [
  // 📱 Pantallas y Dopamina (Diaria - 5 objetos)
  { id: 'd1', title: 'El Scroll Permitido', cost: 30, category: 'dopamina', icon: '📱', rarity: 'comun', description: '30 minutos de TikTok, Instagram o Twitter sin sentir culpa.', effect: { timer: 30, daily: true } },
  { id: 'd2', title: 'Siguiente Episodio', cost: 40, category: 'dopamina', icon: '📺', rarity: 'comun', description: 'Permiso para ver 1 capítulo de tu serie actual.', effect: { timer: 45, daily: true } },
  { id: 'd3', title: 'Pausa YouTube', cost: 35, category: 'dopamina', icon: '🎥', rarity: 'comun', description: '45 minutos viendo vídeos aleatorios en YouTube.', effect: { timer: 45, daily: true } },
  { id: 'd4', title: 'Partida Rápida', cost: 50, category: 'dopamina', icon: '🎮', rarity: 'comun', description: 'Jugar a un videojuego durante 1 hora.', effect: { timer: 60, daily: true } },
  { id: 'd5', title: 'Música y Nada Más', cost: 25, category: 'dopamina', icon: '🎧', rarity: 'comun', description: 'Tumbarte a escuchar tu música o podcast favorito 30 minutos sin hacer nada productivo.', effect: { timer: 30, daily: true } },

  // 🍕 Gastronomía y Caprichos (Semanal - 5 objetos)
  { id: 'g1', title: 'El Tesoro Dulce', cost: 40, category: 'gastronomia', icon: '🍫', rarity: 'comun', description: 'Comer una porción de chocolate, un helado o tu dulce favorito.', effect: { weekly: true } },
  { id: 'g2', title: 'Café Premium', cost: 60, category: 'gastronomia', icon: '☕', rarity: 'comun', description: 'Tomarte un café de especialidad o un Frappuccino fuera de casa.', effect: { weekly: true } },
  { id: 'g3', title: 'Snack Basura', cost: 50, category: 'gastronomia', icon: '🍟', rarity: 'comun', description: 'Comprar esa bolsa de patatas o gominolas que te encanta.', effect: { weekly: true } },
  { id: 'g4', title: 'El Invocador de Pizzas', cost: 200, category: 'gastronomia', icon: '🍕', rarity: 'raro', description: 'Pedir comida a domicilio (Pizza, Burger, Sushi, etc.).', effect: { weekly: true } },
  { id: 'g5', title: 'Copa de Victoria', cost: 50, category: 'gastronomia', icon: '🍺', rarity: 'comun', description: 'Tomarte una cerveza, copa de vino o refresco azucarado al final del día.', effect: { weekly: true } },

  // 🧘‍♂️ Pereza, Relax y Autocuidado (Semanal - 5 objetos)
  { id: 'r1', title: 'Remolonear', cost: 40, category: 'relax', icon: '🛌', rarity: 'comun', description: 'Quedarse 30 minutos más en la cama mirando el móvil tras despertar.', effect: { timer: 30, weekly: true } },
  { id: 'r2', title: 'Siesta Táctica', cost: 50, category: 'relax', icon: '😴', rarity: 'comun', description: 'Una siesta de 45 minutos.', effect: { timer: 45, weekly: true } },
  { id: 'r3', title: 'El Ermitaño', cost: 50, category: 'relax', icon: '✈️', rarity: 'comun', description: 'Poner el móvil en modo avión durante 3 horas para que nadie te moleste.', effect: { timer: 180, weekly: true } },
  { id: 'r4', title: 'Lectura Inmersiva', cost: 30, category: 'relax', icon: '📚', rarity: 'comun', description: '1 hora de lectura de pura ficción/fantasía.', effect: { timer: 60, weekly: true } },
  { id: 'r5', title: 'Amnistía de Tareas', cost: 75, category: 'relax', icon: '🧹', rarity: 'raro', description: 'Aplazar una tarea de limpieza de la casa hasta el día siguiente.', effect: { weekly: true } },

  // 💸 Compras Físicas y Hobbies (Mensual - 5 objetos)
  { id: 'h1', title: 'Compra Impulsiva Pequeña', cost: 400, category: 'hobbies', icon: '📦', rarity: 'raro', description: 'Permiso para gastar 15€ en Amazon o AliExpress en algo que no necesitas.', effect: { monthly: true } },
  { id: 'h2', title: 'Libro Nuevo', cost: 300, category: 'hobbies', icon: '📖', rarity: 'raro', description: 'Comprarte un libro físico o cómic que tienes en tu lista de deseos.', effect: { monthly: true } },
  { id: 'h3', title: 'Inversión en Hobby', cost: 500, category: 'hobbies', icon: '🎨', rarity: 'epico', description: 'Gastar 30€ en materiales para tu afición.', effect: { monthly: true } },
  { id: 'h4', title: 'Suscripción Nueva', cost: 250, category: 'hobbies', icon: '💳', rarity: 'raro', description: 'Pagar un mes de un servicio de streaming nuevo.', effect: { monthly: true } },
  { id: 'h5', title: 'El Boleto de Lotería', cost: 100, category: 'hobbies', icon: '🎫', rarity: 'raro', description: 'Gastar 5€ en un rasca o lotería por simple diversión.', effect: { monthly: true } },

  // 🍻 Vida Social y "Derecho a Decir No" (Sin periodo - 5 objetos)
  { id: 's1', title: 'Tarde de Cervezas/Cafés', cost: 150, category: 'social', icon: '☕', rarity: 'raro', description: 'Quedar con amigos a tomar algo y pagar una ronda.', effect: { weekly: true } },
  { id: 's2', title: 'Día de Compras', cost: 300, category: 'social', icon: '🛍️', rarity: 'raro', description: 'Ir a un centro comercial solo a pasear y mirar tiendas.', effect: { weekly: true } },
  { id: 's3', title: 'Silencio Social', cost: 100, category: 'social', icon: '🔇', rarity: 'raro', description: 'Avisar de que no vas a contestar WhatsApps en 24 horas para desconectar.', effect: { timer: 1440, weekly: true } },
  { id: 's4', title: 'El Derecho a Cancelar', cost: 200, category: 'social', icon: '🚫', rarity: 'epico', description: 'Comprar el derecho a cancelar un plan social sin sentirte culpable.', effect: { weekly: true } },
  { id: 's5', title: 'Microtransacción', cost: 150, category: 'social', icon: '💎', rarity: 'epico', description: 'Permiso para gastar 5€ en tu juego de móvil favorito.', effect: { timer: 30, weekly: true } },

  // 🍕 Gastronomía y Caprichos (Mensual - 5 objetos)
  { id: 'g6', title: 'Desayuno Real', cost: 100, category: 'gastronomia', icon: '🥐', rarity: 'raro', description: 'Comprar cruasanes, churros o hacer tortitas un domingo por la mañana.', effect: { monthly: true } },
  { id: 'g7', title: 'Postre Extra', cost: 80, category: 'gastronomia', icon: '🍰', rarity: 'raro', description: 'Pedir postre en un restaurante aunque ya estés lleno.', effect: { monthly: true } },
  { id: 'g8', title: 'Cocinero Libre', cost: 150, category: 'gastronomia', icon: '🍳', rarity: 'raro', description: 'Poder saltarte el "tupper" sano que tocaba hoy y comer lo que te apetezca.', effect: { monthly: true } },
  { id: 'g9', title: 'Ingrediente Épico', cost: 120, category: 'gastronomia', icon: '🧀', rarity: 'raro', description: 'Comprar algo gourmet en el supermercado que normalmente te parece caro.', effect: { monthly: true } },
  { id: 'g10', title: 'Cena de Héroe', cost: 300, category: 'gastronomia', icon: '🍽️', rarity: 'epico', description: 'Ir a cenar a un buen restaurante.', effect: { monthly: true } },

  // 🧘‍♂️ Pereza, Relax y Autocuidado (Mensual - 5 objetos)
  { id: 'r6', title: 'Baño Termal', cost: 100, category: 'relax', icon: '🛁', rarity: 'raro', description: 'Un baño de espuma largo, con agua caliente, sales y música.', effect: { monthly: true } },
  { id: 'r7', title: 'Skin-care Premium', cost: 80, category: 'relax', icon: '🧖', rarity: 'raro', description: 'Tarde de mascarilla facial y cuidado personal con calma.', effect: { monthly: true } },
  { id: 'r8', title: 'Día en Pijama', cost: 200, category: 'relax', icon: '👕', rarity: 'epico', description: 'Pasar todo el domingo en pijama sin salir de casa ni hacer tareas.', effect: { monthly: true } },
  { id: 'r9', title: 'Masaje Profesional', cost: 800, category: 'relax', icon: '💆', rarity: 'legendario', description: 'Pagar para que te den un masaje real en un centro.', effect: { monthly: true } },
  { id: 'r10', title: 'El Inmortal', cost: 150, category: 'relax', icon: '⏰', rarity: 'epico', description: 'Permiso para NO poner el despertador al día siguiente.', effect: { monthly: true } },

  // 💸 Compras Físicas y Hobbies (Mensual - 5 objetos)
  { id: 'h6', title: 'Juego Nuevo', cost: 1500, category: 'hobbies', icon: '💿', rarity: 'legendario', description: 'Comprarte un videojuego de lanzamiento de 60€ o 70€.', effect: { monthly: true } },
  { id: 'h7', title: 'Pase de Batalla / Skins', cost: 300, category: 'hobbies', icon: '🎭', rarity: 'raro', description: 'Comprar un cosmético digital en un juego al que juegues.', effect: { monthly: true } },
  { id: 'h8', title: 'Cine Total', cost: 350, category: 'hobbies', icon: '🎬', rarity: 'raro', description: 'Ir al cine y pagar la entrada más el combo gigante de palomitas.', effect: { monthly: true } },
  { id: 'h9', title: 'Entrada a Evento', cost: 1000, category: 'hobbies', icon: '🎟️', rarity: 'legendario', description: 'Comprar la entrada para un concierto, teatro o festival.', effect: { monthly: true } },
  { id: 'h10', title: 'El Gran Botín', cost: 2500, category: 'hobbies', icon: '⌨️', rarity: 'legendario', description: 'Un capricho tecnológico caro.', effect: { monthly: true } },

  // 🍻 Vida Social y "Derecho a Decir No" (Mensual - 5 objetos)
  { id: 's6', title: 'Escapada Express', cost: 500, category: 'social', icon: '🚗', rarity: 'epico', description: 'Ir a pasar el día a otra ciudad, playa o montaña.', effect: { monthly: true } },
  { id: 's7', title: 'Cita Invitada', cost: 600, category: 'social', icon: '🕯️', rarity: 'epico', description: 'Llevar a tu pareja o a un amigo a cenar y pagar tú la cuenta entera.', effect: { monthly: true } },
  { id: 's8', title: 'Tarde Temática', cost: 250, category: 'social', icon: '🎳', rarity: 'raro', description: 'Pagar una tarde de bolera, Escape Room o billar con amigos.', effect: { monthly: true } },
  { id: 's9', title: 'Viaje de Fin de Semana', cost: 4000, category: 'social', icon: '✈️', rarity: 'legendario', description: 'Pagar un Airbnb y vuelos/tren para una escapada de 2 días.', effect: { monthly: true } },
  { id: 's10', title: 'Salida Nocturna', cost: 300, category: 'social', icon: '🍻', rarity: 'epico', description: 'Salir de fiesta hasta la madrugada sin límite de hora.', effect: { monthly: true } },
];