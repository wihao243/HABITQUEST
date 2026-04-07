import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/utils/toast";
import { Sword, Sparkles, Chrome } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const currentOrigin = window.location.origin;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/");
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate("/");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showSuccess("¡Registro con éxito! Revisa tu email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showSuccess("¡Bienvenido de nuevo!");
      }
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: currentOrigin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      showError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/20 rounded-full blur-[120px]" />

      <div className="max-w-md w-full space-y-4 relative z-10">
        <Card className="p-8 bg-slate-900 border-4 border-slate-800 shadow-2xl">
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white text-3xl shadow-lg border-2 border-indigo-400">
              ⚔️
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">HabitQuest</h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
              {isSignUp ? "Comienza tu aventura" : "Continúa tu leyenda"}
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleGoogleLogin}
              variant="outline" 
              className="w-full h-12 border-2 border-slate-700 bg-slate-800 text-white font-bold hover:bg-slate-700"
            >
              <Chrome className="w-5 h-5 mr-2 text-rose-500" />
              Entrar con Google
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500 font-bold">O con email</span></div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-500">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-800 border-2 border-slate-700 text-white font-bold" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-500">Contraseña</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-800 border-2 border-slate-700 text-white font-bold" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase italic">
                {loading ? <Sparkles className="animate-spin mr-2" /> : (isSignUp ? "Registrarse" : "Entrar")}
              </Button>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest">
              {isSignUp ? "¿Ya tienes cuenta? Inicia Sesión" : "¿Eres nuevo? Regístrate aquí"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;