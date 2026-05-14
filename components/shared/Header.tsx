"use client";
import { Bell, User, Search, Zap, Settings, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/shared/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useToastStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const addToast = useToastStore((state) => state.addToast);
  const menuRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.j@hiproduct.com",
    avatar: "",
    plan: "Pro Plan"
  });

  const channelRef = useRef<RealtimeChannel | null>(null);

  // Load profile from Supabase
  useEffect(() => {
    async function getProfile() {
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Initial fetch
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          name: data.full_name || "Utilisateur",
          email: user.email || "",
          avatar: data.avatar_url || "",
          plan: data.plan_type || "Starter"
        });
      }

      // Cleanup previous channel if exists
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      // Realtime subscription with unique name per session
      const channelId = `profile_${user.id}_${Math.random().toString(36).substring(7)}`;
      channelRef.current = supabase
        .channel(channelId)
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, 
          (payload) => {
            setProfile(prev => ({
              ...prev,
              name: payload.new.full_name,
              avatar: payload.new.avatar_url,
              plan: payload.new.plan_type
            }));
          }
        )
        .subscribe();
    }

    getProfile();

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 flex items-center justify-between px-8 glass-panel rounded-[2rem] z-40 relative">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all relative overflow-hidden group"
        >
          <div className="relative z-10">
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </div>
          <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>

        <button 
          onClick={() => addToast("Vous n'avez pas de nouvelles notifications", "info")}
          className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all relative group"
        >
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-pink-500 rounded-full border-2 border-background shadow-[0_0_10px_rgba(236,72,153,0.5)]"></span>
        </button>
        
        <div className="h-10 w-[1px] bg-white/10 mx-2" />

        <div className="relative" ref={menuRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-2 group cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold">{profile.name}</div>
              <div className="text-[10px] text-primary font-black uppercase tracking-wider">{profile.plan}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 p-[2px] shadow-lg group-hover:scale-105 transition-transform duration-300 relative">
              <div className="w-full h-full rounded-[0.9rem] bg-background flex items-center justify-center overflow-hidden">
                 {profile.avatar ? (
                   <Image 
                     src={profile.avatar} 
                     alt="Profile" 
                     width={48} 
                     height={48} 
                     className="w-full h-full object-cover" 
                   />
                 ) : (
                   <User className="w-6 h-6 text-muted-foreground" />
                 )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background" />
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </div>

          {/* ── Profile Dropdown ── */}
          {showProfileMenu && (
            <div className="absolute top-[calc(100%+1rem)] right-0 w-64 bg-secondary/95 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="px-4 py-3 border-b border-white/5 mb-2">
                <div className="text-sm font-black">{profile.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{profile.email}</div>
              </div>
              
              <button 
                onClick={() => { router.push("/settings"); setShowProfileMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                <User className="w-4 h-4" /> Mon Profil
              </button>
              <button 
                onClick={() => { router.push("/settings"); setShowProfileMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                <Settings className="w-4 h-4" /> Paramètres
              </button>
              <button 
                onClick={() => { router.push("/pricing"); setShowProfileMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                <Zap className="w-4 h-4" /> Améliorer Plan
              </button>
              
              <div className="h-px bg-white/5 my-2 mx-2" />
              
              <button 
                onClick={async () => { 
                  if (!supabase) {
                    addToast("Supabase non configuré", "error");
                    return;
                  }
                  await supabase.auth.signOut();
                  addToast("Déconnexion réussie", "success"); 
                  setShowProfileMenu(false); 
                  router.push("/login");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
