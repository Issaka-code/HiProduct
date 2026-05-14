"use client";

import { useTheme } from "@/components/shared/ThemeProvider";
import { Moon, Sun, Check, Palette, User, Mail, Shield, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

const ACCENT_COLORS = [
  { name: "Violet", color: "250 100% 65%", hex: "#6366f1" },
  { name: "Blue", color: "217 91% 60%", hex: "#3b82f6" },
  { name: "Emerald", color: "142 71% 45%", hex: "#10b981" },
  { name: "Rose", color: "330 81% 60%", hex: "#f43f5e" },
];

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [accent, setAccent] = useState("Violet");
  const addToast = useToastStore((state) => state.addToast);
  
  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.j@hiproduct.com",
    avatar: "",
    plan: "Pro Plan"
  });

  useEffect(() => {
    // Load profile & accent from Supabase
    async function loadProfile() {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          name: data.full_name || "",
          email: user.email || "",
          avatar: data.avatar_url || "",
          plan: data.plan_type || "Starter"
        });
        
        if (data.accent_color) {
          setAccent(data.accent_color);
          const color = ACCENT_COLORS.find(c => c.name === data.accent_color)?.color;
          if (color) {
            document.documentElement.style.setProperty("--primary", color);
          }
        }
      }
    }

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.name,
        avatar_url: profile.avatar,
        accent_color: accent,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      addToast(error.message, "error");
    } else {
      setIsEditing(false);
      addToast("Profil et préférences mis à jour !", "success");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
        addToast("Photo de profil prête (cliquez sur Sauvegarder)", "info");
      };
      reader.readAsDataURL(file);
    }
  };

  const changeAccent = async (name: string, color: string) => {
    setAccent(name);
    document.documentElement.style.setProperty("--primary", color);
    
    // Auto-save accent color
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ accent_color: name }).eq('id', user.id);
      }
    }
  };

  return (
    <div className="max-w-4xl space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight gradient-text-new">Mon Profil & Paramètres</h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Gérez vos informations personnelles et personnalisez votre interface.
        </p>
      </div>

      {/* ── Profile Section ── */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-black">Informations Personnelles</h2>
          </div>
          {isEditing && (
            <div className="flex gap-3 animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={handleSaveProfile}
                className="px-6 py-2 text-sm font-black bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Sauvegarder
              </button>
            </div>
          )}
        </div>

        <div className="glass-panel rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
          
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            {/* Large Avatar */}
            <div className="relative group/avatar">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-violet-500 to-pink-500 p-[3px] shadow-2xl transition-transform duration-500 group-hover/avatar:scale-105">
                <div className="w-full h-full rounded-[2.3rem] bg-[#0a0a0c] flex items-center justify-center overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-white/20" />
                  )}
                </div>
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center border-4 border-[#0a0a0c] shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer">
                <Camera className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            {/* Info Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
              <div className="space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom Complet</div>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/5 border border-primary/30 focus:border-primary px-4 py-3 rounded-2xl outline-none font-bold text-sm transition-all"
                  />
                ) : (
                  <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-3 rounded-2xl">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-bold text-foreground text-sm">{profile.name}</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</div>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-white/5 border border-primary/30 focus:border-primary px-4 py-3 rounded-2xl outline-none font-bold text-sm transition-all"
                  />
                ) : (
                  <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-3 rounded-2xl">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="font-bold text-foreground text-sm">{profile.email}</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Plan Actuel</div>
                <div 
                  onClick={() => router.push("/pricing")}
                  className="flex items-center justify-between bg-primary/10 border border-primary/20 px-4 py-3 rounded-2xl cursor-pointer hover:bg-primary/20 transition-all group/plan h-[46px]"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-black text-primary text-[11px] uppercase tracking-tighter">{profile.plan}</span>
                  </div>
                  <div className="text-[10px] font-bold text-primary underline underline-offset-2 opacity-0 group-hover/plan:opacity-100 transition-opacity">Changer</div>
                </div>
              </div>
              {!isEditing && (
                <div className="flex items-end">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-white/5 hover:bg-white/10 text-foreground py-3 rounded-2xl font-bold text-sm transition-all border border-white/5 active:scale-95"
                  >
                    Modifier le profil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Appearance Section ── */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Apparence</h2>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mode de Couleur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light Theme Card */}
            <div 
              onClick={() => theme === "dark" && toggleTheme()}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 relative overflow-hidden group ${
                theme === "light" 
                  ? "border-primary bg-white shadow-xl shadow-primary/10" 
                  : "border-border bg-secondary/30 hover:border-muted-foreground/50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${theme === "light" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Sun className="w-6 h-6" />
                </div>
                {theme === "light" && (
                  <div className="bg-primary text-white p-1 rounded-full animate-in zoom-in duration-300">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <h3 className={`text-lg font-bold ${theme === "light" ? "text-slate-900" : "text-foreground"}`}>Thème Clair</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Une apparence lumineuse et épurée.
              </p>
            </div>

            {/* Dark Theme Card */}
            <div 
              onClick={() => theme === "light" && toggleTheme()}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 relative overflow-hidden group ${
                theme === "dark" 
                  ? "border-primary bg-slate-900 shadow-xl shadow-primary/20" 
                  : "border-border bg-secondary/30 hover:border-muted-foreground/50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Moon className="w-6 h-6" />
                </div>
                {theme === "dark" && (
                  <div className="bg-primary text-white p-1 rounded-full animate-in zoom-in duration-300">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-foreground"}`}>Thème Sombre</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Moderne, élégant et reposant pour les yeux.
              </p>
            </div>
          </div>
        </div>

        {/* ── Accent Color Selection ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Couleur d'Accentuation</h3>
          <div className="flex flex-wrap gap-4">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => changeAccent(c.name, c.color)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  accent === c.name 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                <div 
                  className="w-5 h-5 rounded-full shadow-inner" 
                  style={{ backgroundColor: c.hex }} 
                />
                <span className="font-medium">{c.name}</span>
                {accent === c.name && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <h2 className="text-2xl font-bold">Notifications</h2>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 flex items-center justify-between group hover:border-primary/30 transition-colors">
          <div>
            <h3 className="text-lg font-bold">Alertes par Email</h3>
            <p className="text-muted-foreground mt-1">Recevez une notification dès qu'un nouveau produit "winner" est détecté.</p>
          </div>
          <div className="w-14 h-7 bg-primary/20 rounded-full relative cursor-pointer border border-primary/20">
            <div className="absolute right-1 top-1 w-5 h-5 bg-primary rounded-full shadow-lg" />
          </div>
        </div>
      </section>
    </div>
  );
}


