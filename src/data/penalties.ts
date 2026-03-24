import { Penalty } from "../types/game";

export const ALL_PENALTIES: Penalty[] = [
  // 🏃‍♂️ Físicos
  { id: 'p1', category: 'fisico', icon: '💪', title: 'Tributo de Sangre', description: 'Hacer 50 flexiones (repartidas como quieras) antes de revivir.' },
  { id: 'p2', category: 'fisico', icon: '🦵', title: 'Castigo de Piernas', description: 'Hacer 100 sentadillas en el transcurso del día.' },
  { id: 'p3', category: 'fisico', icon: '🧘', title: 'La Plancha de la Tortura', description: 'Aguantar en posición de plancha abdominal (plank) durante 2 minutos en total.' },
  { id: 'p4', category: 'fisico', icon: '🏃', title: 'Corredor Penintente', description: 'Salir a correr o caminar rápido al menos 3 kilómetros hoy mismo.' },
  { id: 'p5', category: 'fisico', icon: '🔥', title: 'Burpees de la Muerte', description: 'Hacer 30 burpees obligatorios.' },
  { id: 'p6', category: 'fisico', icon: '🪜', title: 'Escalador', description: 'Subir y bajar las escaleras de tu edificio 5 veces seguidas.' },
  { id: 'p7', category: 'fisico', icon: '❄️', title: 'Ducha Congelada', description: 'Tu próxima ducha debe terminar con 2 minutos completos de agua totalmente fría.' },
  { id: 'p8', category: 'fisico', icon: '🚫', title: 'Sin Ascensor', description: 'Prohibido usar ascensores o escaleras mecánicas durante 48 horas.' },
  { id: 'p9', category: 'fisico', icon: '👣', title: 'Pasos de Expiación', description: 'No te puedes ir a dormir hasta que tu podómetro marque 12.000 pasos hoy.' },
  { id: 'p10', category: 'fisico', icon: '🧘‍♂️', title: 'Yoga Forzado', description: 'Completar una sesión guiada de yoga de 30 minutos sin mirar el móvil.' },

  // 🧹 Limpieza
  { id: 'p11', category: 'limpieza', icon: '🚽', title: 'El Guardián del Trono', description: 'Limpiar a fondo el baño de casa (inodoro, azulejos y espejos incluidos).' },
  { id: 'p12', category: 'limpieza', icon: '🍽️', title: 'Señor de los Platos', description: 'Fregar todos los platos y limpiar la cocina a fondo.' },
  { id: 'p13', category: 'limpieza', icon: '👕', title: 'El Purgatorio del Armario', description: 'Ordenar tu armario y separar al menos 3 prendas para donar.' },
  { id: 'p14', category: 'limpieza', icon: '🧹', title: 'Cenicienta', description: 'Barrer y fregar el suelo de toda la casa.' },
  { id: 'p15', category: 'limpieza', icon: '🧊', title: 'Limpieza Glacial', description: 'Vaciar la nevera, tirar lo caducado y limpiar las baldas.' },
  { id: 'p16', category: 'limpieza', icon: '💨', title: 'El Domador de Arrugas', description: 'Planchar toda la ropa acumulada que te daba pereza tocar.' },
  { id: 'p17', category: 'limpieza', icon: '📦', title: 'El Cajón del Caos', description: 'Vaciar y organizar ese cajón de "cosas varias" que llevas meses ignorando.' },
  { id: 'p18', category: 'limpieza', icon: '🗑️', title: 'Esclavo de la Basura', description: 'Ser el único encargado de sacar la basura y el reciclaje durante una semana.' },
  { id: 'p19', category: 'limpieza', icon: '🪟', title: 'Visión Clara', description: 'Limpiar los cristales de las ventanas de tu habitación o del salón.' },
  { id: 'p20', category: 'limpieza', icon: '🚗', title: 'El Rescate del Vehículo', description: 'Aspirar y limpiar el interior de tu coche, bicicleta o patinete.' },

  // 📱 Digitales
  { id: 'p21', category: 'digital', icon: '📵', title: 'Desintoxicación', description: 'Desinstalar Instagram, TikTok o Twitter de tu móvil durante 24 horas.' },
  { id: 'p22', category: 'digital', icon: '✈️', title: 'Modo Monje', description: 'Poner el móvil en Modo Avión durante 3 horas seguidas en tu tiempo libre.' },
  { id: 'p23', category: 'digital', icon: '📺', title: 'Apagón de Entretenimiento', description: 'Nada de Netflix, YouTube, Twitch o videojuegos durante todo el día.' },
  { id: 'p24', category: 'digital', icon: '🌑', title: 'Escala de Grises', description: 'Configurar la pantalla de tu móvil en blanco y negro durante 48 horas.' },
  { id: 'p25', category: 'digital', icon: '📧', title: 'Bandeja Limpia', description: 'Organizar tu correo hasta que tengas 0 emails sin leer.' },
  { id: 'p26', category: 'digital', icon: '📸', title: 'Limpieza Digital', description: 'Borrar 100 fotos inútiles o capturas de pantalla del móvil.' },
  { id: 'p27', category: 'digital', icon: '🔇', title: 'Silencio Musical', description: 'Prohibido escuchar música o podcasts durante tus trayectos de hoy.' },
  { id: 'p28', category: 'digital', icon: '📧', title: 'Purga de Suscripciones', description: 'Desuscribirte de 10 newsletters o canales de YouTube que no aporten valor.' },
  { id: 'p29', category: 'digital', icon: '🔋', title: 'Bloqueo Nocturno', description: 'Dejar el móvil cargando en otra habitación al irte a dormir.' },
  { id: 'p30', category: 'digital', icon: '🔑', title: 'Contraseña Secuestrada', description: 'Cambiar la contraseña de una red social y dársela a un amigo por 2 días.' },

  // 💸 Sociales/Mentales
  { id: 'p31', category: 'social', icon: '❤️', title: 'Impuesto Benéfico', description: 'Donar 5€ o 10€ reales a una ONG de forma inmediata.' },
  { id: 'p32', category: 'social', icon: '💰', title: 'El Tarro de la Vergüenza', description: 'Meter un billete de 10€ en una hucha física que no podrás gastar en ti.' },
  { id: 'p33', category: 'social', icon: '📢', title: 'Humillación Pública', description: 'Avisar a tu grupo de amigos de que has muerto por falta de disciplina.' },
  { id: 'p34', category: 'social', icon: '☕', title: 'Invitación Forzada', description: 'Pagarle un café o cena a un amigo para compensar tu falta de disciplina.' },
  { id: 'p35', category: 'social', icon: '📖', title: 'Lectura Obligatoria', description: 'Leer 30 páginas de un libro educativo o filosófico antes de dormir.' },
  { id: 'p36', category: 'social', icon: '⏰', title: 'El Madrugón Repentino', description: 'Configurar la alarma 1.5h antes de lo habitual y levantarse de verdad.' },
  { id: 'p37', category: 'social', icon: '🎙️', title: 'Confesión de Audio', description: 'Enviar un audio a un amigo admitiendo tu pereza y prometiendo mejorar.' },
  { id: 'p38', category: 'social', icon: '🍳', title: 'Chef a la Fuerza', description: 'Cocinar tu próxima comida desde cero usando ingredientes sanos.' },
  { id: 'p39', category: 'social', icon: '📝', title: 'Ensayo de Reflexión', description: 'Escribir una página entera detallando por qué fallaste y cómo lo evitarás.' },
  { id: 'p40', category: 'social', icon: '🥦', title: 'Consumo Desagradable', description: 'Comer un alimento muy sano que no te guste nada (brócoli, ajo crudo, etc.).' },
];