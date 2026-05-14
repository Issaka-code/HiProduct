"use client";
import { useState, useRef, useEffect } from "react";
import { Play, Heart, Bookmark, ExternalLink, Share2, MoreHorizontal, MessageCircle, Music, Copy, Eye, Download, Activity, Trash2 } from "lucide-react";
import { AdDetailsModal } from "./AdDetailsModal";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export interface AdData {
  id: string;
  brandName: string;
  platform: "meta" | "tiktok";
  country: string;
  format: "video" | "image";
  thumbnail: string;
  likes: number;
  activeDays: number;
}

export function AdCard({ ad, isSwipeFile, onRemove }: { ad: AdData, isSwipeFile?: boolean, onRemove?: (id: string) => void }) {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleSwipeFile = async () => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      addToast("Veuillez vous connecter pour sauvegarder des publicités", "error");
      return;
    }

    if (isSwipeFile && onRemove) {
      onRemove(ad.id);
      return;
    }

    // Check if already exists in Supabase
    const { data: existing } = await supabase
      .from('swipe_file')
      .select('id')
      .eq('user_id', user.id)
      .filter('ad_data->>id', 'eq', ad.id)
      .single();

    if (existing) {
      addToast("Déjà dans votre Swipe File", "info");
      setShowMenu(false);
      return;
    }

    const { error } = await supabase
      .from('swipe_file')
      .insert({
        user_id: user.id,
        ad_data: ad
      });

    if (error) {
      addToast(error.message, "error");
    } else {
      addToast("Publicité ajoutée au Swipe File !", "success");
    }
    setShowMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://hiproduct.com/ad/${ad.id}`);
    addToast("Lien copié dans le presse-papier", "success");
    setShowMenu(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Publicité de ${ad.brandName}`,
        text: `Découvrez cette publicité gagnante sur HiProduct !`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      handleCopyLink();
    }
  };

  const handleDownload = () => {
    addToast("Préparation du téléchargement...", "info");
    setTimeout(() => {
      addToast("Téléchargement démarré", "success");
    }, 1500);
    setShowMenu(false);
  };

  return (
    <>
      <div className="neo-card group overflow-hidden border border-white/5 relative">
        {/* ── Background Glow ── */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
      
      {/* ── Media container ── */}
      <div className="relative aspect-[4/5] rounded-2xl bg-secondary flex items-center justify-center overflow-hidden z-10">
        {ad.format === "video" ? (
          <>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-500 z-10 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                <Play className="w-6 h-6 ml-1 fill-white/20" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/40 via-transparent to-pink-900/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-teal-900/40" />
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg flex items-center gap-1.5 ${
            ad.platform === 'meta' 
              ? 'bg-[#1877F2] border border-blue-400/30' 
              : 'bg-black border border-white/20'
          }`}>
            {ad.platform === 'meta' ? (
              <MessageCircle className="w-3 h-3 fill-white" />
            ) : (
              <Music className="w-3 h-3 text-cyan-400" />
            )}
            {ad.platform === 'meta' ? 'Meta Ads' : 'TikTok'}
          </div>
          <div className="glass-panel px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
            {ad.country}
          </div>
        </div>

        {/* Action Overlay */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
           <button 
             onClick={handleToggleSwipeFile}
             className={`w-10 h-10 rounded-xl glass-panel flex items-center justify-center transition-all ${isSwipeFile ? 'text-rose-500 hover:bg-rose-500/20' : 'text-white hover:bg-primary'}`}
           >
             {isSwipeFile ? <Trash2 className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
           </button>
           <button 
             onClick={handleShare}
             className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-white hover:bg-primary transition-all"
           >
             <Share2 className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* ── Details ── */}
      <div className="mt-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-sm font-black shadow-inner">
              {ad.brandName.charAt(0)}
            </div>
            <div>
              <span className="font-bold text-base block leading-tight">{ad.brandName}</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Verified Brand</span>
            </div>
          </div>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`transition-colors p-2 rounded-lg ${showMenu ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-white/5'}`}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {/* ── More Dropdown Menu ── */}
            {showMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-56 glass-panel rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 p-2 border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button 
                  onClick={() => window.open(ad.platform === 'meta' ? 'https://www.facebook.com/ads/library' : 'https://www.tiktok.com/business/library', '_blank')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                >
                  <Eye className="w-4 h-4" /> Voir sur {ad.platform === 'meta' ? 'Meta' : 'TikTok'}
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                >
                  <Copy className="w-4 h-4" /> Copier le lien
                </button>
                <button 
                  onClick={handleToggleSwipeFile}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-xl transition-all border-t border-white/5 mt-1 pt-2 ${isSwipeFile ? 'text-rose-500 hover:bg-rose-500/10' : 'text-foreground/80 hover:text-primary hover:bg-primary/5'}`}
                >
                  {isSwipeFile ? <Trash2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />} 
                  {isSwipeFile ? 'Retirer du Swipe File' : 'Save to Swipe File'}
                </button>
                <button 
                  onClick={() => router.push(`/tracker?add=${encodeURIComponent(ad.brandName)}`)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all mt-1"
                >
                  <Activity className="w-4 h-4" /> Tracker
                </button>
                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all mt-1 border-t border-white/5 pt-2"
                >
                  <Download className="w-4 h-4" /> Télécharger la vidéo
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 group/stat hover:border-primary/30 transition-all">
            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Impact</div>
            <div className="font-black text-lg flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500/20" />
              {ad.likes > 1000 ? (ad.likes / 1000).toFixed(1) + 'k' : ad.likes}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 group/stat hover:border-primary/30 transition-all">
            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Visibility</div>
            <div className="font-black text-lg">{ad.activeDays}d</div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95"
        >
          ANALYZE PRODUCT <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    {isModalOpen && (
      <AdDetailsModal ad={ad} onClose={() => setIsModalOpen(false)} />
    )}
    </>
  );
}
