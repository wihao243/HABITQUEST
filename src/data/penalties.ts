import { Penalty } from "../types/game";

export const ALL_PENALTIES: Penalty[] = [
  { 
    id: 'p1', 
    category: 'fisico', 
    icon: '🏃‍♂️', 
    title: 'La Tasa Metabólica', 
    description: 'Hacer 15 burpees, 30 sentadillas o aguantar 1 minuto en posición de plancha. Corto, pero intenso.' 
  },
  { 
    id: 'p2', 
    category: 'fisico', 
    icon: '❄️', 
    title: 'Ducha Escocesa', 
    description: 'Terminar tu próxima ducha con 30 a 60 segundos de agua completamente fría. ¡Despierta a cualquiera!' 
  },
  { 
    id: 'p3', 
    category: 'digital', 
    icon: '📵', 
    title: 'Desconexión Forzada', 
    description: 'Bloquear las redes sociales o apagar el teléfono durante 2 horas.' 
  },
  { 
    id: 'p4', 
    category: 'digital', 
    icon: '🍰', 
    title: 'Día sin Postre', 
    description: 'Prohibido consumir azúcar o tu snack favorito durante las próximas 24 horas.' 
  },
  { 
    id: 'p5', 
    category: 'digital', 
    icon: '🪑', 
    title: 'El Rincón del Aburrimiento', 
    description: 'Sentarte en una silla mirando a la pared, sin teléfono, sin música y sin hablar con nadie durante 10 minutos enteros.' 
  },
  { 
    id: 'p6', 
    category: 'social', 
    icon: '💰', 
    title: 'El Tarro de las Excusas', 
    description: 'Poner una moneda en un bote de cristal. Ese dinero al final del mes se dona a una causa o se usa para invitar a alguien, nunca para ti.' 
  },
  { 
    id: 'p7', 
    category: 'social', 
    icon: '📉', 
    title: 'Pérdida de Privilegios', 
    description: 'Perder un porcentaje de tus puntos o renunciar a una recompensa que ya habías desbloqueado.' 
  },
  { 
    id: 'p8', 
    category: 'limpieza', 
    icon: '🧹', 
    title: 'La Rana Pequeña', 
    description: 'Hacer inmediatamente esa tarea aburrida de la casa que llevas días posponiendo (doblar ropa, limpiar microondas, etc).' 
  },
  { 
    id: 'p9', 
    category: 'limpieza', 
    icon: '⏰', 
    title: 'Madrugón Penalizado', 
    description: 'Configurar la alarma 30 minutos antes de lo habitual al día siguiente y usar ese tiempo para leer o estirar.' 
  },
  { 
    id: 'p10', 
    category: 'social', 
    icon: '🤡', 
    title: 'El Sirviente por un Día', 
    description: 'Hacer una tarea del hogar de otra persona o enviarle un audio a un amigo cantando el estribillo de una canción vergonzosa.' 
  },
];