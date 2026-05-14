"use client";
import { useState, useEffect } from "react";
import { PlayCircle, Image as ImageIcon, UploadCloud, SearchX, Sparkles, Clock, History, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToastStore } from "@/lib/store";

export default function CreativeFinderPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('creative_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) setHistory(data);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setIsUploading(true);
    addToast("Analyse de l'image en cours...", "info");

    // Simulate search & save to history
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Deduct credit
      const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single();
      if (profile && profile.credits > 0) {
        await supabase.from('profiles').update({ credits: profile.credits - 1 }).eq('id', user.id);
      } else if (profile && profile.credits <= 0) {
        addToast("Crédits insuffisants !", "error");
        setIsUploading(false);
        return;
      }

      const { error } = await supabase.from('creative_searches').insert({
        user_id: user.id,
        image_url: URL.createObjectURL(file), // Local URL for demo
        results_count: Math.floor(Math.random() * 50) + 10
      });

      if (!error) {
        await fetchHistory();
        addToast("Recherche terminée (-1 crédit) !", "success");
      }
    }
    setIsUploading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter gradient-text-new">Creative Finder</h1>
          </div>
          <p className="text-sm font-bold text-muted-foreground ml-13">Trouvez des publicités similaires par image grâce à l'IA.</p>
        </div>
        
        <button className="glass-panel px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all active:scale-95 group">
          <PlayCircle className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          Tutoriel Vidéo
        </button>
      </div>

      {/* ── Main Content Area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Upload Zone */}
        <div className="lg:col-span-2 relative group flex flex-col h-full min-h-[400px]">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-[3rem] group-hover:bg-primary/10 transition-all duration-700" />
          
          <label className={`relative flex-1 flex flex-col items-center justify-center p-12 text-center neo-card border-2 border-dashed border-primary/30 group-hover:border-primary/60 hover:-translate-y-2 cursor-pointer transition-all duration-500 bg-secondary/30 hover:bg-secondary/50 rounded-[2.5rem] ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
            />
            
            <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] transition-all duration-500 relative">
               {isUploading ? (
                 <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
               ) : (
                 <>
                   <UploadCloud className="w-10 h-10 text-primary absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 delay-100" />
                   <ImageIcon className="w-10 h-10 text-primary group-hover:opacity-0 group-hover:translate-y-2 transition-all duration-500" />
                 </>
               )}
            </div>
            
            <h3 className="text-2xl font-black text-foreground mb-2">
              {isUploading ? "Analyse en cours..." : "Déposez une image ici"}
            </h3>
            <p className="text-sm font-bold text-muted-foreground mb-6">ou cliquez pour sélectionner depuis vos fichiers</p>
            
            <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5">PNG</span>
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5">JPG</span>
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5">WEBP</span>
            </div>
          </label>
        </div>

        {/* RIGHT COLUMN: Recent History */}
        <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col border border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-black text-foreground">Recherches Récentes</h3>
          </div>

          <div className="space-y-4 flex-1">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="w-full h-16 bg-white/5 rounded-2xl animate-pulse" />)
            ) : history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden border border-white/10">
                    <img src={item.image_url} alt="Search" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-foreground">{item.results_count} Résultats</div>
                    <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 opacity-40">
                <SearchX className="w-12 h-12 mb-4" />
                <p className="text-xs font-bold">Aucun historique</p>
              </div>
            )}
          </div>

          <button className="w-full mt-8 py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all">
            Effacer l'historique
          </button>
        </div>

      </div>
    </div>
  );
}
