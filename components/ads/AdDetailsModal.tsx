"use client";

import { X, Play, Bookmark, MessageCircle, Music, ExternalLink } from "lucide-react";
import { AdData } from "./AdCard";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useToastStore } from "@/lib/store";

interface AdDetailsModalProps {
  ad: AdData;
  onClose: () => void;
}

export function AdDetailsModal({ ad, onClose }: AdDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Mock data for the ad details
  const mockCopyText = `🔥 VOTRE CUISINE EST TOUJOURS EN DÉSORDRE ? 😩 Entre les épices éparpillées, les bouteilles difficiles à attraper et le manque de place... cuisiner devient vite agaçant 😱 ✨ Découvrez enfin la solution pratique qui transforme votre cuisine en quelques secondes : 👉 LE SUPPORT À ÉPICES ROTATIF 360° 🧂 ✅ Rotation fluide à 360° ✅ Retrouvez vos épices instantanément ✅ Gain de place incroyable ✅ Cuisine plus propre et organisée ✅ Design moderne et élégant ✨ Tournez simplement le support... et trouvez immédiatement l'épice qu'il vous faut 😍 Fini les placards en désordre et les épices cachées partout ! 💥 Parfait pour : ✔️ petites cuisines ✔️ appartements ✔️ familles ✔️ passionnés de cuisine 📦 Disponible dès maintenant avec paiement à la livraison 🚚 ⚠️ Stock limité ! Commandez avant la rupture.`;

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] border border-white/20 shadow-[0_0_100px_rgba(124,58,237,0.3)] flex flex-col overflow-hidden bg-[#0a0a0c]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xl font-black shadow-inner">
              {ad.brandName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black">{ad.brandName}</h2>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">id: {ad.id}9828081742</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => addToast("Téléchargement en cours...", "info")}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95"
            >
              Télécharger
            </button>
            <button 
              onClick={() => addToast("Demande de devis envoyée !", "success")}
              className="bg-pink-500/10 text-pink-500 border border-pink-500/20 hover:bg-pink-500/20 px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
            >
              Devis
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-all ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Left Column (Media & Copy) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Media Player Mockup */}
              <div className="relative aspect-[4/5] sm:aspect-video lg:aspect-[4/5] rounded-3xl bg-black overflow-hidden border border-white/5 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/40 via-transparent to-pink-900/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-110 transition-all duration-500 cursor-pointer hover:bg-white/20">
                    <Play className="w-6 h-6 ml-1 fill-white/20" />
                  </div>
                </div>
                {/* Overlay Text Mockup */}
                <div className="absolute inset-x-8 bottom-20">
                  <div className="bg-white text-black font-black text-2xl p-4 rounded-xl inline-block shadow-2xl">
                    Livraison <br/> gratuite
                  </div>
                </div>
                {/* Fake progress bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-xs font-bold text-white/80">
                  <Play className="w-4 h-4 fill-white" />
                  <span>0:00</span>
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-primary" />
                  </div>
                  <span>1:00</span>
                </div>
              </div>

              {/* Ad Copy */}
              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 text-sm leading-relaxed text-foreground/90 font-medium">
                {mockCopyText}
              </div>
            </div>

            {/* Right Column (Metadata) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Swipe File Button */}
              <button className="w-full glass-panel border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-3 font-bold">
                  <Bookmark className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  Save to Swipe File
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Stats & Meta Card */}
              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="text-sm font-bold text-muted-foreground">Statut</span>
                  <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="text-sm font-bold text-muted-foreground">Plateformes</span>
                  <div className="flex items-center gap-2">
                    {ad.platform === 'meta' ? (
                      <MessageCircle className="w-5 h-5 fill-blue-500 text-blue-500" />
                    ) : (
                      <Music className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="text-sm font-bold text-muted-foreground">Créée le</span>
                  <span className="text-sm font-black">13 mai 2026</span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="text-sm font-bold text-muted-foreground">Sauvegardée le</span>
                  <span className="text-sm font-black">14 mai 2026</span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="text-sm font-bold text-muted-foreground">Durée</span>
                  <span className="text-sm font-black">{ad.activeDays} jours</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted-foreground">Format</span>
                  <span className="text-sm font-black capitalize">{ad.format}</span>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-2">Source</div>
                  <a href="#" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 truncate">
                    https://facebook.com/ads/library/?id=... <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
                <div>
                  <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-2">Landing Page</div>
                  <a href="#" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 truncate">
                    https://puremau.myshopify.com/products/... <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Other Ads */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xs shadow-inner">
                {ad.brandName.charAt(0)}
              </div>
              Autres pubs de <span className="text-primary">{ad.brandName}</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {/* Just showing 3 mock compact ad cards */}
               {[1, 2, 3].map((i) => (
                 <div key={i} className="neo-card group overflow-hidden border border-white/5 relative p-4 flex flex-col cursor-pointer">
                    <div className="relative aspect-video rounded-xl bg-black mb-4 overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/40 via-transparent to-pink-900/40" />
                       <div className="absolute inset-0 flex items-center justify-center">
                         <Play className="w-8 h-8 fill-white/50 text-white/50 group-hover:scale-110 transition-transform" />
                       </div>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="font-bold text-sm">{ad.brandName}</span>
                       <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                         <MessageCircle className="w-3 h-3" /> Meta Ads
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}

// Quick helper for missing lucide icon in this file
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
