"use client";
import { useState, useEffect } from "react";
import { Flame, TrendingUp, ArrowUpRight, Activity } from "lucide-react";
import { AdDetailsModal } from "@/components/ads/AdDetailsModal";
import { AdData } from "@/components/ads/AdCard";
import { supabase } from "@/lib/supabase";

export default function TrendsPage() {
  const [trends, setTrends] = useState<any[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<AdData | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from('ads')
        .select('*')
        .eq('is_trending', true)
        .order('score', { ascending: false });

      if (data) {
        setTrends(data);
      }
    };
    fetchTrends();
  }, []);

  const handleOpenModal = (trend: any) => {
    setSelectedTrend({
      id: trend.id,
      brandName: trend.brand_name,
      platform: trend.platform as "meta" | "tiktok",
      country: trend.country,
      format: trend.format as "video" | "image",
      thumbnail: trend.thumbnail_url || "",
      likes: trend.likes,
      activeDays: trend.active_days,
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Top Trends</h1>
          </div>
          <p className="text-sm font-bold text-muted-foreground ml-13">Découvrez les produits les plus viraux des dernières 24 heures.</p>
        </div>
        
        <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-black text-white leading-none">2,450</div>
            <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mt-1">Produits Scannés</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-emerald-500 tracking-widest uppercase">Live Data</span>
          </div>
        </div>
      </div>

      {/* ── Top 3 Podium ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end relative z-20">
        
        {/* RANK 2 */}
        {trends[1] && (
        <div className="md:order-1 order-2 neo-card relative overflow-hidden group flex flex-col items-center text-center p-8 border-slate-300/20 hover:border-slate-300/40">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-300 to-slate-400" />
           <div className="absolute -top-10 -right-10 text-[150px] font-black text-white/5 font-['Outfit'] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">2</div>
           
           <div className="w-24 h-24 rounded-full bg-slate-400/20 mb-6 flex items-center justify-center border-4 border-slate-300/30 shadow-[0_0_30px_rgba(203,213,225,0.2)]">
             <span className="text-4xl font-black text-slate-300 font-['Outfit']">2</span>
           </div>
           
           <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black mb-4">
             <TrendingUp className="w-3.5 h-3.5" /> {trends[1].growth}
           </div>
           
           <h3 className="text-lg font-black leading-tight mb-2 text-white">{trends[1].brand_name}</h3>
           <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-6">{trends[1].category}</p>
           
           <button 
             onClick={() => handleOpenModal(trends[1])}
             className="w-full py-3 rounded-xl glass-panel text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
           >
             Analyser <ArrowUpRight className="w-4 h-4" />
           </button>
        </div>
        )}

        {/* RANK 1 (Larger, Gold) */}
        {trends[0] && (
        <div className="md:order-2 order-1 neo-card relative overflow-hidden group flex flex-col items-center text-center p-10 border-yellow-500/30 hover:border-yellow-500/50 transform md:-translate-y-4 hover:-translate-y-6 transition-all duration-500 shadow-[0_20px_60px_-15px_rgba(234,179,8,0.2)]">
           <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500" />
           <div className="absolute -top-10 -right-10 text-[180px] font-black text-yellow-500/5 font-['Outfit'] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">1</div>
           
           <div className="w-32 h-32 rounded-full bg-yellow-500/20 mb-6 flex items-center justify-center border-4 border-yellow-400/50 shadow-[0_0_50px_rgba(234,179,8,0.3)] relative group-hover:shadow-[0_0_80px_rgba(234,179,8,0.5)] transition-shadow duration-500">
             <span className="text-6xl font-black text-yellow-400 font-['Outfit']">1</span>
             <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg animate-bounce">
               <Flame className="w-4 h-4 text-orange-500" fill="currentColor" />
             </div>
           </div>
           
           <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-black mb-4 border border-emerald-500/20">
             <TrendingUp className="w-4 h-4" /> {trends[0].growth}
           </div>
           
           <h3 className="text-xl font-black leading-tight mb-2 text-white">{trends[0].brand_name}</h3>
           <p className="text-xs font-bold text-yellow-500/70 uppercase tracking-widest mb-8">{trends[0].category}</p>
           
           <button 
             onClick={() => handleOpenModal(trends[0])}
             className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-sm font-black flex items-center justify-center gap-2 hover:shadow-[0_10px_30px_rgba(234,179,8,0.4)] transition-all active:scale-95"
           >
             ANALYSE DÉTAILLÉE <ArrowUpRight className="w-5 h-5" />
           </button>
        </div>
        )}

        {/* RANK 3 */}
        {trends[2] && (
        <div className="md:order-3 order-3 neo-card relative overflow-hidden group flex flex-col items-center text-center p-8 border-orange-700/20 hover:border-orange-700/40">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-700 to-orange-800" />
           <div className="absolute -top-10 -right-10 text-[150px] font-black text-white/5 font-['Outfit'] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">3</div>
           
           <div className="w-24 h-24 rounded-full bg-orange-700/20 mb-6 flex items-center justify-center border-4 border-orange-700/30 shadow-[0_0_30px_rgba(194,65,12,0.2)]">
             <span className="text-4xl font-black text-orange-700 font-['Outfit']">3</span>
           </div>
           
           <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black mb-4">
             <TrendingUp className="w-3.5 h-3.5" /> {trends[2].growth}
           </div>
           
           <h3 className="text-lg font-black leading-tight mb-2 text-white">{trends[2].brand_name}</h3>
           <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-6">{trends[2].category}</p>
           
           <button 
             onClick={() => handleOpenModal(trends[2])}
             className="w-full py-3 rounded-xl glass-panel text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
           >
             Analyser <ArrowUpRight className="w-4 h-4" />
           </button>
        </div>
        )}

      </div>

      {/* ── The Rest of the Trends (4+) ── */}
      <div className="relative z-20">
        <h2 className="text-2xl font-black tracking-tighter mb-6 flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary" /> 
          Suite du Classement
        </h2>
        
        <div className="space-y-3">
          {trends.slice(3).map((trend, idx) => (
            <div 
              key={trend.id} 
              onClick={() => handleOpenModal(trend)}
              className="glass-panel hover:bg-white/5 border border-white/5 hover:border-primary/30 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 group cursor-pointer"
            >
              
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl font-black text-muted-foreground font-['Outfit'] group-hover:text-primary transition-colors">
                  {idx + 4}
                </div>
                
                <div>
                  <h4 className="font-bold text-base text-foreground group-hover:text-white transition-colors">{trend.brand_name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{trend.category}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{trend.platform}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-black text-emerald-400">{trend.growth}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">Croissance</div>
                </div>
                
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-col">
                  <span className="text-sm font-black text-white leading-none">{trend.score}</span>
                  <span className="text-[8px] font-bold text-primary uppercase mt-1">Score</span>
                </div>
                
                <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 hidden md:flex">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {selectedTrend && (
        <AdDetailsModal ad={selectedTrend} onClose={() => setSelectedTrend(null)} />
      )}
    </div>
  );
}
