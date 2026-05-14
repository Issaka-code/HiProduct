"use client";
import { useState, useEffect } from "react";
import { Bot, Lock, CheckCircle2, Zap, Send, Target, Sparkles, Save, BellRing } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToastStore } from "@/lib/store";

export default function AIAgentPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    telegram_token: "",
    telegram_chat_id: "",
    min_likes: 1000,
    is_active: false
  });

  useEffect(() => {
    async function loadConfig() {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_agent_configs')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setConfig({
          telegram_token: data.telegram_token || "",
          telegram_chat_id: data.telegram_chat_id || "",
          min_likes: data.min_likes || 1000,
          is_active: data.is_active || false
        });
      }
      setLoading(false);
    }
    loadConfig();
  }, []);

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('ai_agent_configs')
      .upsert({
        user_id: user.id,
        ...config,
        updated_at: new Date().toISOString()
      });

    if (error) {
      addToast(error.message, "error");
    } else {
      addToast("Configuration de l'Agent IA sauvegardée !", "success");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] space-y-12 pb-20 animate-in fade-in duration-700 relative">
      
      {/* ── Background Elements ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* ── Header ── */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.4)]">
              <Bot className="w-10 h-10 text-white" />
            </div>
            {config.is_active && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#0a0a0c] animate-pulse" />
            )}
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-4">
          AI Winner <span className="gradient-text-new">Agent</span>
        </h1>
        <p className="text-base md:text-lg font-medium text-muted-foreground leading-relaxed">
          Configurez votre agent intelligent pour qu'il travaille pour vous 24h/24.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* ── Configuration Form ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <BellRing className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-black">Configuration des Alertes</h2>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status de l'Agent</label>
                <button 
                  onClick={() => setConfig(prev => ({ ...prev, is_active: !prev.is_active }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${config.is_active ? 'bg-emerald-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.is_active ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Telegram Bot Token</label>
                <input 
                  type="password" 
                  value={config.telegram_token}
                  onChange={(e) => setConfig(prev => ({ ...prev, telegram_token: e.target.value }))}
                  placeholder="123456789:ABCDEF..."
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl py-4 px-6 text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Telegram Chat ID</label>
                <input 
                  type="text" 
                  value={config.telegram_chat_id}
                  onChange={(e) => setConfig(prev => ({ ...prev, telegram_chat_id: e.target.value }))}
                  placeholder="-100123456789"
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl py-4 px-6 text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Engagement Minimum (Likes)</label>
                <input 
                  type="number" 
                  value={config.min_likes}
                  onChange={(e) => setConfig(prev => ({ ...prev, min_likes: parseInt(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl py-4 px-6 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {saving ? "Sauvegarde..." : <><Save className="w-4 h-4" /> Sauvegarder la Configuration</>}
            </button>
          </div>
        </section>

        {/* ── How it works (Simplified) ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-black">Comment ça marche</h2>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 space-y-10 relative overflow-hidden">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">1</div>
              <div className="space-y-1">
                <h4 className="font-bold">Analyse 24/7</h4>
                <p className="text-sm text-muted-foreground font-medium">L'IA scanne en permanence Meta et TikTok Ads pour détecter des anomalies de croissance.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">2</div>
              <div className="space-y-1">
                <h4 className="font-bold">Validation AI Winner</h4>
                <p className="text-sm text-muted-foreground font-medium">Un algorithme croise les données d'engagement avec les volumes de vente estimés.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">3</div>
              <div className="space-y-1">
                <h4 className="font-bold">Alerte Immédiate</h4>
                <p className="text-sm text-muted-foreground font-medium">Dès qu'un "Winner" est validé, vous recevez une fiche produit complète sur Telegram.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-tight">Le robot est prêt à être activé</span>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
