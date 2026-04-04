import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan las credenciales de Supabase. Asegúrate de haber conectado la integración correctamente.");
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');