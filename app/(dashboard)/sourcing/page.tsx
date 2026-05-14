"use client";

import { Search, ShoppingCart, Globe, Clock, ShieldCheck, Zap, ArrowUpRight, Filter, ChevronRight, Package, Truck, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useToastStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export default function SourcingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    async function fetchSuppliers() {
      if (!supabase) return;
      const { data } = await supabase.from('suppliers').select('*').order('rating', { ascending: false });
      if (data) setSuppliers(data);
      setLoading(false);
    }
    fetchSuppliers();
  }, []);

  const handleSourceProduct = async () => {
    if (!searchQuery) {
      addToast("Veuillez entrer un nom de produit ou une URL", "error");
      return;
    }

    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check & Deduct credit
    const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single();
    if (profile && profile.credits > 0) {
      await supabase.from('profiles').update({ credits: profile.credits - 1 }).eq('id', user.id);
    } else {
      addToast("Crédits insuffisants pour le sourcing !", "error");
      return;
    }

    // Save search history
    await supabase.from('sourcing_searches').insert({
      user_id: user.id,
      product_name: searchQuery
    });

    addToast(`Recherche de fournisseurs pour "${searchQuery}" terminée (-1 crédit)`, "success");
    setSearchQuery("");
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* ── Hero Section ── */}
      <div className="relative rounded-[3rem] overflow-hidden bg-secondary/30 border border-white/5 p-12 mb-12 group">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
            <Zap className="w-4 h-4" /> Logistique Accélérée
          </div>
          <h1 className="text-5xl font-black tracking-tight leading-tight mb-6">
            Speed <span className="gradient-text-new">Sourcing</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium mb-10 leading-relaxed">
            Trouvez les meilleurs fournisseurs en quelques secondes. Comparez les délais de livraison, les tarifs et la fiabilité pour vos produits gagnants.
          </p>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Entrez un nom de produit ou une URL AliExpress/TikTok..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
            <button 
              onClick={handleSourceProduct}
              className="bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-sm shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              SOURCER <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Dashboard Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Délai Moyen", value: "8.5 Jours", icon: Clock, color: "text-blue-500" },
          { label: "Zones de Stock", value: "24 Pays", icon: Globe, color: "text-emerald-500" },
          { label: "Agents Vérifiés", value: "150+", icon: ShieldCheck, color: "text-primary" },
          { label: "Colis Expédiés", value: "12k+", icon: Truck, color: "text-orange-500" }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border border-white/5 group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-4 mb-3">
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
            </div>
            <div className="text-2xl font-black">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ── Trusted Partners List ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <Award className="w-6 h-6 text-primary" /> Partenaires de Confiance
            </h2>
            <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-all">
              <Filter className="w-4 h-4" /> Filtrer
            </button>
          </div>

          <div className="grid gap-4">
            {loading ? (
              [1,2,3,4].map(i => <div key={i} className="w-full h-24 bg-white/5 rounded-[2rem] animate-pulse" />)
            ) : suppliers.map((s) => (
              <div key={s.id} className="glass-panel p-6 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                    {s.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{s.name}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase">{s.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.shipping_time}</span>
                      <span className="flex items-center gap-1 font-black text-foreground/80">{s.price_range}</span>
                      <span className="flex items-center gap-1"><Award className="w-3 h-3 text-amber-500" /> {s.rating}/5</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">Spécialité</div>
                    <div className="text-sm font-bold">{s.specialty}</div>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary text-muted-foreground hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Sourcing Widget ── */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3">
             <BotIcon className="w-6 h-6 text-primary" /> AI Agent Sourcing
          </h2>
          <div className="glass-panel p-8 rounded-[2.5rem] border-2 border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                   <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-black">Besoin d'un devis groupé ?</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Traitement IA Prioritaire</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs leading-relaxed text-muted-foreground font-medium">
                  "L'IA analyse actuellement 500+ agents pour trouver le meilleur prix pour vos produits winners."
                </div>
                <div className="space-y-3">
                   <button className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
                     LANCER L'ANALYSE IA
                   </button>
                   <button className="w-full bg-white/5 text-foreground py-4 rounded-2xl font-black text-xs border border-white/5 hover:bg-white/10 transition-all">
                     CONTACTER UN AGENT DÉDIÉ
                   </button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-secondary bg-secondary/80 flex items-center justify-center text-[10px] font-bold">
                       {i}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase">12 agents en ligne</div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
             <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-emerald-500" /> Conseils de Sourcing
             </h4>
             <ul className="space-y-3">
               {[
                 "Demandez toujours un échantillon photo/vidéo",
                 "Vérifiez les délais pendant le Nouvel An Chinois",
                 "Négociez à partir de 10 commandes/jour"
               ].map((tip, i) => (
                 <li key={i} className="text-[11px] text-muted-foreground flex gap-2">
                   <span className="text-primary font-black">•</span> {tip}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple internal component for the Bot Icon
function BotIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
