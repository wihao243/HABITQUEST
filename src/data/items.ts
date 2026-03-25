import { ShopItem } from "../types/game";

export const ALL_ITEMS: ShopItem[] = [
  // 📱 Pantallas y Dopamina (Dopamina)
  { id: 'd1', title: 'El Scroll Permitido', cost: 30, category: 'dopamina', icon: '📱', rarity: 'comun', description: '30 minutos de TikTok, Instagram o Twitter sin sentir culpa.' },
  { id: 'd2', title: 'Siguiente Episodio', cost: 40, category: 'dopamina', icon: '📺', rarity: 'comun', description: 'Permiso para ver 1 capítulo de tu serie actual.' },
  { id: 'd3', title: 'Pausa YouTube', cost: 35, category: 'dopamina', icon: '🎥', rarity: 'comun', description: '45 minutos viendo vídeos aleatorios en YouTube.' },
  { id: 'd4', title: 'Partida Rápida', cost: 50, category: 'dopamina', icon: '🎮', rarity: 'comun', description: 'Jugar a un videojuego durante 1 hora.' },
  { id: 'd5', title: 'Cine en Casa', cost: 100, category: 'dopamina', icon: '🍿', rarity: 'raro', description: 'Ver una película completa tumbado en el sofá.' },
  { id: 'd6', title: 'Extensión Nocturna', cost: 80, category: 'dopamina', icon: '🌙', rarity: 'raro', description: 'Quedarte despierto 1 hora más de tu límite para estar con el móvil.' },
  { id: 'd7', title: 'Maratón (Binge-watching)', cost: 120, category: 'dopamina', icon: '🎞️', rarity: 'raro', description: 'Ver 3 episodios seguidos de una serie.' },
  { id: 'd8', title: 'Tarde Gamer', cost: 250, category: 'dopamina', icon: '🕹️', rarity: 'epico', description: 'Desbloquear una tarde entera (4 horas) de videojuegos ininterrumpidos.' },
  { id: 'd9', title: 'Música y Nada Más', cost: 25, category: 'dopamina', icon: '🎧', rarity: 'comun', description: 'Tumbarte a escuchar tu música o podcast favorito 30 minutos sin hacer nada productivo.' },
  { id: 'd10', title: 'Microtransacción', cost: 150, category: 'dopamina', icon: '💎', rarity: 'epico', description: 'Permiso para gastar 5€ en tu juego de móvil favorito.' },

  // 🍕 Gastronomía y Caprichos (Gastronomia)
  { id: 'g1', title: 'El Tesoro Dulce', cost: 40, category: 'gastronomia', icon: '🍫', rarity: 'comun', description: 'Comer una porción de chocolate, un helado o tu dulce favorito.' },
  { id: 'g2', title: 'Café Premium', cost: 60, category: 'gastronomia', icon: '☕', rarity: 'comun', description: 'Tomarte un café de especialidad o un Frappuccino fuera de casa.' },
  { id: 'g3', title: 'Snack Basura', cost: 50, category: 'gastronomia', icon: '🍟', rarity: 'comun', description: 'Comprar esa bolsa de patatas o gominolas que te encanta.' },
  { id: 'g4', title: 'El Invocador de Pizzas', cost: 200, category: 'gastronomia', icon: '🍕', rarity: 'raro', description: 'Pedir comida a domicilio (Pizza, Burger, Sushi, etc.).' },
  { id: 'g5', title: 'Cena de Héroe', cost: 300, category: 'gastronomia', icon: '🍽️', rarity: 'epico', description: 'Ir a cenar a un buen restaurante.' },
  { id: 'g6', title: 'Copa de Victoria', cost: 50, category: 'gastronomia', icon: '🍺', rarity: 'comun', description: 'Tomarte una cerveza, copa de vino o refresco azucarado al final del día.' },
  { id: 'g7', title: 'Desayuno Real', cost: 100, category: 'gastronomia', icon: '🥐', rarity: 'raro', description: 'Comprar cruasanes, churros o hacer tortitas un domingo por la mañana.' },
  { id: 'g8', title: 'Postre Extra', cost: 80, category: 'gastronomia', icon: '🍰', rarity: 'raro', description: 'Pedir postre en un restaurante aunque ya estés lleno.' },
  { id: 'g9', title: 'Cocinero Libre', cost: 150, category: 'gastronomia', icon: '🍳', rarity: 'raro', description: 'Poder saltarte el "tupper" sano que tocaba hoy y comer lo que te apetezca.' },
  { id: 'g10', title: 'Ingrediente Épico', cost: 120, category: 'gastronomia', icon: '🧀', rarity: 'raro', description: 'Comprar algo gourmet en el supermercado que normalmente te parece caro.' },

  // 🧘‍♂️ Pereza, Relax y Autocuidado (Relax)
  { id: 'r1', title: 'Remolonear', cost: 40, category: 'relax', icon: '🛌', rarity: 'comun', description: 'Quedarse 30 minutos más en la cama mirando el móvil tras despertar.' },
  { id: 'r2', title: 'Siesta Táctica', cost: 50, category: 'relax', icon: '😴', rarity: 'comun', description: 'Una siesta de 45 minutos.' },
  { id: 'r3', title: 'El Inmortal', cost: 150, category: 'relax', icon: '⏰', rarity: 'epico', description: 'Permiso para NO poner el despertador al día siguiente.' },
  { id: 'r4', title: 'Día en Pijama', cost: 200, category: 'relax', icon: '👕', rarity: 'epico', description: 'Pasar todo el domingo en pijama sin salir de casa ni hacer tareas.' },
  { id: 'r5', title: 'Baño Termal', cost: 100, category: 'relax', icon: '🛁', rarity: 'raro', description: 'Un baño de espuma largo, con agua caliente, sales y música.' },
  { id: 'r6', title: 'Skin-care Premium', cost: 80, category: 'relax', icon: '🧖', rarity: 'raro', description: 'Tarde de mascarilla facial y cuidado personal con calma.' },
  { id: 'r7', title: 'Amnistía de Tareas', cost: 75, category: 'relax', icon: '🧹', rarity: 'raro', description: 'Aplazar una tarea de limpieza de la casa hasta el día siguiente.' },
  { id: 'r8', title: 'Lectura Inmersiva', cost: 30, category: 'relax', icon: '📚', rarity: 'comun', description: '1 hora de lectura de pura ficción/fantasía.' },
  { id: 'r9', title: 'El Ermitaño', cost: 50, category: 'relax', icon: '✈️', rarity: 'comun', description: 'Poner el móvil en modo avión durante 3 horas para que nadie te moleste.' },
  { id: 'r10', title: 'Masaje Profesional', cost: 800, category: 'relax', icon: '💆', rarity: 'legendario', description: 'Pagar para que te den un masaje real en un centro.' },

  // 💸 Compras Físicas y Hobbies (Hobbies)
  { id: 'h1', title: 'Compra Impulsiva Pequeña', cost: 400, category: 'hobbies', icon: '📦', rarity: 'raro', description: 'Permiso para gastar 15€ en Amazon o AliExpress en algo que no necesitas.' },
  { id: 'h2', title: 'Libro Nuevo', cost: 300, category: 'hobbies', icon: '📖', rarity: 'raro', description: 'Comprarte un libro físico o cómic que tienes en tu lista de deseos.' },
  { id: 'h3', title: 'El Sastre', cost: 600, category: 'hobbies', icon: '👟', rarity: 'epico', description: 'Comprar una prenda de ropa o zapatillas nuevas por puro capricho.' },
  { id: 'h4', title: 'Inversión en Hobby', cost: 500, category: 'hobbies', icon: '🎨', rarity: 'epico', description: 'Gastar 30€ en materiales para tu afición.' },
  { id: 'h5', title: 'Juego Nuevo', cost: 1500, category: 'hobbies', icon: '💿', rarity: 'legendario', description: 'Comprarte un videojuego de lanzamiento de 60€ o 70€.' },
  { id: 'h6', title: 'Pase de Batalla / Skins', cost: 300, category: 'hobbies', icon: '🎭', rarity: 'raro', description: 'Comprar un cosmético digital en un juego al que juegues.' },
  { id: 'h7', title: 'Suscripción Nueva', cost: 250, category: 'hobbies', icon: '💳', rarity: 'raro', description: 'Pagar un mes de un servicio de streaming nuevo.' },
  { id: 'h8', title: 'Cine Total', cost: 350, category: 'hobbies', icon: '🎬', rarity: 'raro', description: 'Ir al cine y pagar la entrada más el combo gigante de palomitas.' },
  { id: 'h9', title: 'Entrada a Evento', cost: 1000, category: 'hobbies', icon: '🎟️', rarity: 'legendario', description: 'Comprar la entrada para un concierto, teatro o festival.' },
  { id: 'h10', title: 'El Gran Botín', cost: 2500, category: 'hobbies', icon: '⌨️', rarity: 'legendario', description: 'Un capricho tecnológico caro.' },

  // 🍻 Vida Social y "Derecho a Decir No" (Social)
  { id: 's1', title: 'Salida Nocturna', cost: 300, category: 'social', icon: '🍻', rarity: 'epico', description: 'Salir de fiesta hasta la madrugada sin límite de hora.' },
  { id: 's2', title: 'Tarde de Cervezas/Cafés', cost: 150, category: 'social', icon: '☕', rarity: 'raro', description: 'Quedar con amigos a tomar algo y pagar una ronda.' },
  { id: 's3', title: 'El Derecho a Cancelar', cost: 200, category: 'social', icon: '🚫', rarity: 'epico', description: 'Comprar el derecho a cancelar un plan social sin sentirte culpable.' },
  { id: 's4', title: 'Escapada Express', cost: 500, category: 'social', icon: '🚗', rarity: 'epico', description: 'Ir a pasar el día a otra ciudad, playa o montaña.' },
  { id: 's5', title: 'Cita Invitada', cost: 600, category: 'social', icon: '🕯️', rarity: 'epico', description: 'Llevar a tu pareja o a un amigo a cenar y pagar tú la cuenta entera.' },
  { id: 's6', title: 'Tarde Temática', cost: 250, category: 'social', icon: '🎳', rarity: 'raro', description: 'Pagar una tarde de bolera, Escape Room o billar con amigos.' },
  { id: 's7', title: 'Viaje de Fin de Semana', cost: 4000, category: 'social', icon: '✈️', rarity: 'legendario', description: 'Pagar un Airbnb y vuelos/tren para una escapada de 2 días.' },
  { id: 's8', title: 'Día de Compras', cost: 300, category: 'social', icon: '🛍️', rarity: 'raro', description: 'Ir a un centro comercial solo a pasear y mirar tiendas.' },
  { id: 's9', title: 'Silencio Social', cost: 100, category: 'social', icon: '🔇', rarity: 'raro', description: 'Avisar de que no vas a contestar WhatsApps en 24 horas para desconectar.' },
  { id: 's10', title: 'El Boleto de Lotería', cost: 100, category: 'social', icon: '🎫', rarity: 'raro', description: 'Gastar 5€ en un rasca o lotería por simple diversión.' },
];