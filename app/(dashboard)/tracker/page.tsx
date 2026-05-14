"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutDashboard, Plus, TrendingUp, TrendingDown, Activity, Bell, ExternalLink, ShieldCheck, Trash2 } from "lucide-react";
import { AdDetailsModal } from "@/components/ads/AdDetailsModal";
import { AdData } from "@/components/ads/AdCard";
import { useToastStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

interface Brand {
  id: string;
  name: string;
  category: string;
  active_ads: number;
  growth: string;
  trend: 'up' | 'down';
  status: string;
  last_seen: string;
}

function BrandTrackerContent() {
  const searchParams = useSearchParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const addToast = useToastStore((state) => state.addToast);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedBrandAd, setSelectedBrandAd] = useState<AdData | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    const fetchBrands = async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('tracked_brands')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setBrands(data);
      }
      setIsLoaded(true);
    };
    fetchBrands();
  }, []);

  // Add brand from URL params
  useEffect(() => {
    if (!isLoaded || !supabase) return;

    const brandToAdd = searchParams.get("add");
    if (brandToAdd) {
      const addBrand = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if exists
        const exists = brands.some(b => b.name.toLowerCase() === brandToAdd?.toLowerCase());
        if (exists) return;

        const newBrand = {
          user_id: user.id,
          name: brandToAdd,
          category: "Nouvelle Marque",
          active_ads: Math.floor(Math.random() * 50) + 10,
          growth: "+0%",
          trend: "up" as const,
          status: "Active"
        };

        const { data } = await supabase
          .from('tracked_brands')
          .insert(newBrand)
          .select()
          .single();

        if (data) {
          setBrands(prev => [data, ...prev]);
          addToast(`${brandToAdd} ajouté au tracker`, "success");
        }
      };
      addBrand();
    }
  }, [searchParams, isLoaded, brands, addToast]);

  const handleAnalyze = (brand: Brand) => {
    setSelectedBrandAd({
      id: "brand-top-" + brand.id,
      brandName: brand.name,
      platform: "meta",
      country: "Global",
      format: "video",
      thumbnail: "",
      likes: (brand.active_ads || 0) * 120, // fake stats
      activeDays: 30,
    });
  };

  const handleRemoveBrand = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('tracked_brands')
      .delete()
      .eq('id', id);

    if (!error) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      addToast("Marque retirée du tracker", "info");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter gradient-text-new">Brand Tracker</h1>
          </div>
          <p className="text-sm font-bold text-muted-foreground ml-13">Surveillez vos concurrents et analysez leurs stratégies en temps réel.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-foreground leading-none">{brands.length}</div>
              <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mt-1">Marques</div>
            </div>
            <div className="w-px h-8 bg-foreground/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-foreground leading-none">
                {brands.reduce((acc, b) => acc + (b.active_ads || 0), 0)}
              </div>
              <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mt-1">Pubs Actives</div>
            </div>
          </div>
          
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-[0_10px_30px_rgba(124,58,237,0.4)] transition-all hover:-translate-y-1 active:scale-95">
            <Plus className="w-5 h-5" />
            Ajouter une marque
          </button>
        </div>
      </div>

      {/* ── Brands List ── */}
      <div className="space-y-4">
        {brands.map((brand) => (
          <div key={brand.id} className="neo-card group p-5 border border-white/5 hover:border-primary/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-300">
            
            {/* Brand Info */}
            <div className="flex items-center gap-5 flex-1">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-foreground/10 to-foreground/5 border border-foreground/10 flex items-center justify-center text-2xl font-black shadow-inner">
                  {brand.name.charAt(0)}
                </div>
                {brand.status === "Active" && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                  {brand.name}
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                </h3>
                <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mt-1">
                  {brand.category}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-8 lg:gap-12 flex-wrap">
              
              <div className="text-center">
                <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Pubs Actives</div>
                <div className="text-xl font-black text-foreground flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  {brand.active_ads}
                </div>
              </div>

              <div className="w-px h-8 bg-foreground/10 hidden sm:block" />

              <div className="text-center">
                <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Croissance (7j)</div>
                <div className={`text-xl font-black flex items-center justify-center gap-1 ${brand.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {brand.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {brand.growth}
                </div>
              </div>

              <div className="w-px h-8 bg-foreground/10 hidden sm:block" />

              <div className="text-center">
                <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Dernière Activité</div>
                <div className="text-sm font-bold text-foreground mt-1.5">
                  {new Date(brand.last_seen).toLocaleDateString()}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleRemoveBrand(brand.id)}
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95 group/btn"
                title="Arrêter de suivre"
              >
                <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
              <button 
                onClick={() => addToast(`Alerte activée pour ${brand.name}`, "success")}
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all active:scale-95"
                title="Activer les alertes"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleAnalyze(brand)}
                className="px-5 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold text-sm flex items-center gap-2 transition-all active:scale-95 border border-foreground/5"
              >
                Analyser <ExternalLink className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {selectedBrandAd && (
        <AdDetailsModal ad={selectedBrandAd} onClose={() => setSelectedBrandAd(null)} />
      )}
    </div>
  );
}

export default function BrandTrackerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground font-bold">Chargement du tracker...</div>}>
      <BrandTrackerContent />
    </Suspense>
  );
}
