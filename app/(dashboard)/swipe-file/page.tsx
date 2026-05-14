"use client";
import { useState, useEffect } from "react";
import { AdCard, AdData } from "@/components/ads/AdCard";
import { Search } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function SwipeFilePage() {
  const [ads, setAds] = useState<AdData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchSavedAds() {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('swipe_file')
        .select('*')
        .eq('user_id', user.id);

      if (data) {
        setAds(data.map(item => item.ad_data));
      }
      setIsLoaded(true);
    }
    fetchSavedAds();
  }, []);

  const handleRemove = async (id: string) => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('swipe_file')
      .delete()
      .eq('user_id', user.id)
      .filter('ad_data->>id', 'eq', id);

    if (!error) {
      setAds(prev => prev.filter(ad => ad.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter gradient-text-new mb-2">Mon Swipe File</h1>
          <p className="text-sm font-bold text-muted-foreground">Retrouvez toutes vos publicités sauvegardées et organisées.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-8 py-3 rounded-2xl flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-white leading-none">{ads.length}</div>
              <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mt-1">Sauvegardes</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ToolBar (Recherche) ── */}
      <div className="rounded-[2rem] p-3 flex flex-wrap items-center gap-3 relative z-30 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-primary/20 bg-white/5 backdrop-blur-3xl transition-all">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher une marque sauvegardée..." 
            className="w-full bg-black/20 border border-white/5 focus:border-primary/50 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all placeholder:text-muted-foreground text-white"
          />
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} isSwipeFile={true} onRemove={handleRemove} />
        ))}
      </div>
      
      {isLoaded && ads.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-bold">Votre Swipe File est vide. Sauvegardez des pubs depuis l'Ads Explorer !</p>
        </div>
      )}
    </div>
  );
}
