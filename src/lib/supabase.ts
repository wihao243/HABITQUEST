import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Solo inicializamos si las variables existen para evitar el error de 'supabaseUrl is required'
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null as any;

if (!supabase) {
  console.warn("⚠️ Supabase no está configurado. Las funciones de base de datos y login no funcionarán hasta que añadas las credenciales.");
}