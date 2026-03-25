import { Achievement } from "../types/game";

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // 🔥 1. Rachas y Constancia
  { id: 'r1', category: 'rachas', title: 'Primer Paso', description: 'Completa tu primera misión diaria.', icon: '🎯', requirement: (s) => s.dailiesCompleted >= 1 },
  { id: 'r2', category: 'rachas', title: 'Semana Perfecta', description: '7 días seguidos completando todo.', icon: '📅', requirement: (s) => s.perfectDays >= 7 },
  { id: 'r3', category: 'rachas', title: 'Luna Llena', description: '30 días de racha en un hábito.', icon: '🌕', requirement: (s) => s.maxStreak >= 30 },
  { id: 'r4', category: 'rachas', title: 'Centurión', description: '100 días de racha en un hábito.', icon: '🛡️', requirement: (s) => s.maxStreak >= 100 },
  { id: 'r5', category: 'rachas', title: 'Un Año Épico', description: '365 días de racha. ¡Leyenda!', icon: '👑', requirement: (s) => s.maxStreak >= 365 },
  { id: 'r6', category: 'rachas', title: 'Imparable', description: 'Completa 500 hábitos en total.', icon: '🚀', requirement: (s) => s.habitsCompleted >= 500 },
  { id: 'r7', category: 'rachas', title: 'Milagro de la Constancia', description: 'Completa 1.000 hábitos en total.', icon: '✨', requirement: (s) => s.habitsCompleted >= 1000 },
  { id: 'r8', category: 'rachas', title: 'El Reloj Suizo', description: 'Hábitos antes de las 9:00 AM (7 días).', icon: '⌚', requirement: (s) => s.noSnoozeDays >= 7 },
  { id: 'r9', category: 'rachas', title: 'Noctámbulo Disciplinado', description: 'Rutinas de noche 7 días seguidos.', icon: '🌙', requirement: (s) => s.journalEntries >= 7 },
  { id: 'r10', category: 'rachas', title: 'Fin de Semana de Hierro', description: 'No falles sábado ni domingo.', icon: '🧱', requirement: (s) => s.perfectDays >= 2 },

  // ⚔️ 2. Salud, Físico y Stats
  { id: 's1', category: 'salud', title: 'Sangre de Hierro', description: 'Fuerza a nivel 10.', icon: '💪', requirement: (_, c) => c.attributes.fuerza >= 10 },
  { id: 's2', category: 'salud', title: 'El Camino del Guerrero', description: 'Ejercicio 3 días/semana un mes.', icon: '🏃', requirement: (s) => s.exerciseDays >= 12 },
  { id: 's3', category: 'salud', title: 'Oasis Personal', description: 'Beber agua 50 veces.', icon: '💧', requirement: (s) => s.waterDrank >= 50 },
  { id: 's4', category: 'salud', title: 'Pulmones de Acero', description: '30 sesiones de cardio.', icon: '🫁', requirement: (s) => s.cardioSessions >= 30 },
  { id: 's5', category: 'salud', title: 'Templo Sagrado', description: 'Evita mal hábito 14 días.', icon: '🏛️', requirement: (s) => s.currentStreak >= 14 },
  { id: 's6', category: 'salud', title: 'Descanso del Héroe', description: 'Duerme 8h durante 7 días.', icon: '💤', requirement: (s) => s.noSnoozeDays >= 7 },
  { id: 's7', category: 'salud', title: 'Fuerza de Voluntad', description: 'Ignora 50 tentaciones.', icon: '🧠', requirement: (s) => s.habitsCompleted >= 50 },
  { id: 's8', category: 'salud', title: 'Alquimista Nutricional', description: 'Cocina sano 20 veces.', icon: '🍳', requirement: (s) => s.healthyMeals >= 20 },
  { id: 's9', category: 'salud', title: 'Caminante de los Reinos', description: '10.000 pasos en un día.', icon: '👣', requirement: (s) => s.stepsMax >= 10000 },
  { id: 's10', category: 'salud', title: 'Maratoniano', description: '100 horas de ejercicio.', icon: '🏅', requirement: (s) => s.exerciseHours >= 100 },

  // 🧠 3. Mente, Calma y Productividad
  { id: 'm1', category: 'mente', title: 'Mente Brillante', description: 'Inteligencia a nivel 10.', icon: '💡', requirement: (_, c) => c.attributes.inteligencia >= 10 },
  { id: 'm2', category: 'mente', title: 'Rata de Biblioteca', description: 'Lee 10 págs durante 30 días.', icon: '📖', requirement: (s) => s.pagesRead >= 300 },
  { id: 'm3', category: 'mente', title: 'El Políglota', description: 'Practica idioma 50 veces.', icon: '🗣️', requirement: (s) => s.languagePractice >= 50 },
  { id: 'm4', category: 'mente', title: 'Monje de la Montaña', description: 'Espíritu a nivel 10.', icon: '🏔️', requirement: (_, c) => c.attributes.espiritualidad >= 10 },
  { id: 'm5', category: 'mente', title: 'Maestro Zen', description: '10 horas de meditación.', icon: '🧘', requirement: (s) => s.meditationHours >= 10 },
  { id: 'm6', category: 'mente', title: 'Foco Láser', description: '100 sesiones de trabajo profundo.', icon: '🎯', requirement: (s) => s.deepWorkSessions >= 100 },
  { id: 'm7', category: 'mente', title: 'Cero Procrastinación', description: 'Tareas en < 24h durante una semana.', icon: '⚡', requirement: (s) => s.tasksCompleted >= 7 },
  { id: 'm8', category: 'mente', title: 'Pantalla Oscura', description: 'Sin redes en trabajo 10 días.', icon: '📵', requirement: (s) => s.deepWorkSessions >= 10 },
  { id: 'm9', category: 'mente', title: 'El Escriba', description: 'Escribe en diario 20 veces.', icon: '✍️', requirement: (s) => s.journalEntries >= 20 },
  { id: 'm10', category: 'mente', title: 'El Despertar', description: 'Sin posponer alarma 14 días.', icon: '⏰', requirement: (s) => s.noSnoozeDays >= 14 },

  // 💰 4. Economía, Tienda y Recompensas
  { id: 'e1', category: 'economia', title: 'Primer Sueldo', description: 'Gana tus primeras 100 monedas.', icon: '🪙', requirement: (s) => s.totalGoldEarned >= 100 },
  { id: 'e2', category: 'economia', title: 'El Tesorero', description: 'Acumula 5.000 monedas.', icon: '🏦', requirement: (_, c) => c.gold >= 5000 },
  { id: 'e3', category: 'economia', title: 'Rey Midas', description: 'Gana 50.000 monedas en total.', icon: '💰', requirement: (s) => s.totalGoldEarned >= 50000 },
  { id: 'e4', category: 'economia', title: 'El Coleccionista', description: 'Compra 10 artículos cosméticos.', icon: '🧥', requirement: (s) => s.cosmeticsBought >= 10 },
  { id: 'e5', category: 'economia', title: 'Armadura Brillante', description: 'Primer set de grado raro.', icon: '✨', requirement: (s) => s.itemsBought >= 3 },
  { id: 'e6', category: 'economia', title: 'Amigo Fiel', description: 'Eclosiona tu primera mascota.', icon: '🥚', requirement: (s) => s.petsOwned >= 1 },
  { id: 'e7', category: 'economia', title: 'Zoológico Épico', description: 'Colecciona 5 mascotas.', icon: '🐾', requirement: (s) => s.petsOwned >= 5 },
  { id: 'e8', category: 'economia', title: 'Jinete Legendario', description: 'Compra tu primera montura.', icon: '🐎', requirement: (s) => s.itemsBought >= 15 },
  { id: 'e9', category: 'economia', title: 'Auto-Recompensa', description: 'Primer capricho de la vida real.', icon: '🎁', requirement: (s) => s.realLifeRewardsBought >= 1 },
  { id: 'e10', category: 'economia', title: 'Hedonista Responsable', description: 'Gasta 10.000 en recompensas reales.', icon: '🥂', requirement: (s) => s.realLifeRewardsBought >= 10 },

  // 🛡️ 5. Social, Resiliencia y Castigos
  { id: 'so1', category: 'social', title: 'El Carismático', description: 'Carisma a nivel 10.', icon: '🎭', requirement: (_, c) => c.attributes.carisma >= 10 },
  { id: 'so2', category: 'social', title: 'Llamada a las Armas', description: 'Únete a tu primera Party.', icon: '🤝', requirement: (s) => s.friendsInvited >= 1 },
  { id: 'so3', category: 'social', title: 'Cazador de Monstruos', description: 'Derrota a tu primer Jefe.', icon: '👹', requirement: (s) => s.bossesDefeated >= 1 },
  { id: 'so4', category: 'social', title: 'Héroe del Gremio', description: 'Golpe de gracia a un Jefe.', icon: '⚔️', requirement: (s) => s.bossesDefeated >= 2 },
  { id: 'so5', category: 'social', title: 'Superviviente', description: 'Cúrate con menos de 5 HP.', icon: '🩹', requirement: (s) => s.lowHpHeals >= 1 },
  { id: 'so6', category: 'social', title: 'Caída y Alzamiento', description: 'Muere por primera vez.', icon: '💀', requirement: (s) => s.totalDeaths >= 1 },
  { id: 'so7', category: 'social', title: 'Deuda de Sangre', description: 'Cumple un castigo para revivir.', icon: '🩸', requirement: (s) => s.totalDeaths >= 1 },
  { id: 'so8', category: 'social', title: 'El Ave Fénix', description: 'Racha de 7 días tras morir.', icon: '🔥', requirement: (s) => s.currentStreak >= 7 && s.totalDeaths >= 1 },
  { id: 'so9', category: 'social', title: 'El Mentor', description: 'Invita a un amigo.', icon: '👨‍🏫', requirement: (s) => s.friendsInvited >= 1 },
  { id: 'so10', category: 'social', title: 'Ascensión', description: 'Llega al Nivel 100.', icon: '🌌', requirement: (_, c) => c.level >= 100 },
];