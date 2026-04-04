import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/utils/toast";
import { Sword, Shield, Sparkles } from "lucide-react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showSuccess("¡Registro con éxito! Revisa tu email para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showSuccess("¡Bienvenido de nuevo, Héroe!");
      }
    } catch (error: any) {
      showError(error.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/20 rounded-full blur-[120px]" />

      <Card className="max-w-md w-full p-8 bg-slate-900 border-4 border-slate-800 shadow-2xl relative z-10">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white text-3xl shadow-lg border-2 border-indigo-400">
            ⚔️
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            HabitQuest
          </h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
            {isSignUp ? "Comienza tu aventura" : "Continúa tu leyenda"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-500">Correo Electrónico</Label>
            <Input 
              type="email" 
              placeholder="heroe@reino.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800 border-2 border-slate-700 text-white font-bold h-12 focus:border-indigo-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-500">Contraseña</Label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-800 border-2 border-slate-700 text-white font-bold h-12 focus:border-indigo-500"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase italic text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            {loading ? <Sparkles className="animate-spin mr-2" /> : (isSignUp ? "Crear Personaje" : "Entrar al Reino")}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
          >
            {isSignUp ? "¿Ya tienes cuenta? Inicia Sesión" : "¿Eres nuevo? Regístrate aquí"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;