"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Bookmark, 
  TrendingUp, 
  Bot, 
  Lightbulb, 
  ShoppingCart, 
  Settings,
  MessageCircle,
  Zap,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { useToastStore } from "@/lib/store";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export function Sidebar() {
  const pathname = usePathname();
  const addToast = useToastStore((state) => state.addToast);
  const [credits, setCredits] = useState({ current: 500, max: 1000 });
  const channelRef = useRef<any>(null);

  useEffect(() => {
    async function getCredits() {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('credits, max_credits')
        .eq('id', user.id)
        .single();

      if (data) {
        setCredits({ 
          current: data.credits ?? 500, 
          max: data.max_credits ?? 1000 
        });
      }

      // Cleanup previous channel if exists
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      // Realtime credits update with unique name
      const channelId = `credits_${user.id}_${Math.random().toString(36).substring(7)}`;
      channelRef.current = supabase
        .channel(channelId)
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, 
          (payload) => {
            if (payload.new.credits !== undefined) {
              setCredits(prev => ({ ...prev, current: payload.new.credits }));
            }
          }
        )
        .subscribe();
    }
    
    getCredits();

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  const links = [
    { name: "Ads Explorer",      href: "/explorer",   icon: Search },
    { name: "Brand Tracker",     href: "/tracker",    icon: LayoutDashboard },
    { name: "Swipe File",        href: "/swipe-file", icon: Bookmark },
    { name: "Top Trend",         href: "/trends",     icon: TrendingUp },
    { name: "AI Winner Agent",   href: "/ai-agent",   icon: Bot },
    { name: "Creative Finder",   href: "/creatives",  icon: Lightbulb },
    { name: "Trouver un fournisseur",    href: "/sourcing",   icon: ShoppingCart },
  ];

  return (
    <div className="fixed left-6 top-6 bottom-6 w-64 z-50">
      <div className="h-full flex flex-col glass-panel rounded-[2.5rem] overflow-y-auto overflow-x-hidden p-4 scrollbar-hide">
        
        {/* ── Branding ── */}
        <div className="px-4 py-8 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-violet-500/40 relative group overflow-hidden">
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
             <Zap className="w-8 h-8 text-white relative z-10 animate-float" fill="white" />
          </div>
          <div className="text-center">
            <span className="text-2xl font-black tracking-tighter gradient-text-new">
              HiProduct
            </span>
            <div className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase mt-1 opacity-60">
              Intelligence OS
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-2 space-y-1 mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/25" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  {link.name}
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer / Support ── */}
        <div className="mt-auto p-2 space-y-4">
          <Link 
            href="/pricing"
            className="bg-white/5 rounded-3xl p-4 border border-white/5 hover:border-primary/30 transition-all block group/credits"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover/credits:text-primary transition-colors">Credits</span>
                <div className="relative group/info">
                  <HelpCircle className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-secondary/95 backdrop-blur-xl border border-white/10 rounded-xl text-[10px] font-medium text-foreground opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all shadow-2xl z-[100]">
                    1 recherche = 1 crédit. Les analyses IA avancées peuvent coûter jusqu'à 5 crédits.
                  </div>
                </div>
              </div>
              <span className="text-xs font-black text-primary">{credits.current} / {credits.max}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-pink-500 group-hover/credits:opacity-80 transition-all duration-1000" 
                style={{ width: `${(credits.current / credits.max) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-[8px] font-bold text-primary opacity-0 group-hover/credits:opacity-100 transition-all text-center">OBTENIR PLUS DE CRÉDITS</div>
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-muted-foreground hover:bg-white/5 transition-all"
          >
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>

          <button 
            onClick={() => addToast("Support bientôt disponible !", "info")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold text-sm hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
          >
            <MessageCircle className="w-4 h-4" />
            Support
          </button>
        </div>
      </div>
    </div>
  );
}
