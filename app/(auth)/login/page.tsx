"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, ArrowRight, Globe, Cpu } from "lucide-react";
import Link from "next/link";
import { useToastStore } from "@/lib/store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      addToast("Supabase non configuré. Veuillez vérifier vos clés dans .env.local", "error");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      addToast(error.message, "error");
      setLoading(false);
    } else {
      addToast("Connexion réussie !", "success");
      router.push("/explorer");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-10 rounded-[3rem] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-xl mb-4 group hover:scale-110 transition-transform duration-500">
              <Zap className="w-8 h-8 text-white" fill="white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter gradient-text-new">HiProduct</h1>
            <p className="text-muted-foreground text-sm font-medium mt-2">Bon retour parmi nous !</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="votre@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mot de passe</label>
                <Link href="#" className="text-[10px] font-bold text-primary hover:underline">Oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "CONNEXION..." : "SE CONNECTER"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ou continuer avec</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/5 py-3 rounded-xl hover:bg-white/10 transition-all text-xs font-bold">
              <Cpu className="w-4 h-4" /> Github
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/5 py-3 rounded-xl hover:bg-white/10 transition-all text-xs font-bold">
              <Globe className="w-4 h-4" /> Google
            </button>
          </div>

          <p className="mt-10 text-center text-sm font-medium text-muted-foreground">
            Pas encore de compte ? {" "}
            <Link href="/signup" className="text-primary font-black hover:underline underline-offset-4">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
