import { Achievement } from "../types/game";

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'Primer Paso', description: 'Completa tu primera tarea única.', icon: '🎯', requirement: (s) => s.tasksCompleted >= 1 },
  { id: 'a2', title: 'Hábito de Hierro', description: 'Completa 10 hábitos.', icon: '⛓️', requirement: (s) => s.habitsCompleted >= 10 },
  { id: 'a3', title: 'Cazador Novato', description: 'Derrota a 5 monstruos.', icon: '⚔️', requirement: (s) => s.monstersDefeated >= 5 },
  { id: 'a4', title: 'Matagigantes', description: 'Derrota a tu primer jefe de zona.', icon: '👑', requirement: (s) => s.bossesDefeated >= 1 },
  { id: 'a5', title: 'Ahorrador', description: 'Gana un total de 1000 monedas de oro.', icon: '💰', requirement: (s) => s.totalGoldEarned >= 1000 },
  { id: 'a6', title: 'Comprador Compulsivo', description: 'Compra 5 objetos en la tienda.', icon: '🛒', requirement: (s) => s.itemsBought >= 5 },
  { id: 'a7', title: 'Disciplina Diaria', description: 'Completa 20 misiones diarias.', icon: '📅', requirement: (s) => s.dailiesCompleted >= 20 },
  { id: 'a8', title: 'Veterano de Guerra', description: 'Derrota a 50 monstruos.', icon: '💀', requirement: (s) => s.monstersDefeated >= 50 },
  { id: 'a9', title: 'Magnate del Hábito', description: 'Gana un total de 10,000 monedas de oro.', icon: '💎', requirement: (s) => s.totalGoldEarned >= 10000 },
  { id: 'a10', title: 'Inmortal (Casi)', description: 'Muere 5 veces y sigue adelante.', icon: '🧟', requirement: (s) => s.totalDeaths >= 5 },
];