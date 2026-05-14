"use client";

import { Check, Zap, Star, Shield, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToastStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

const PLANS = [
  {
    name: "Starter",
    price: { monthly: "29", yearly: "19" },
    description: "Parfait pour débuter votre recherche de produits gagnants.",
    features: [
      "1,000 crédits par mois",
      "Accès à l'Explorer de base",
      "Filtres standards",
      "Swipe File (jusqu'à 50 ads)",
      "Support par email"
    ],
    highlight: false,
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    name: "Pro Premium",
    price: { monthly: "79", yearly: "59" },
    description: "L'outil ultime pour les entrepreneurs E-commerce sérieux.",
    features: [
      "Illimité crédits",
      "Accès complet Ads Explorer",
      "Filtres avancés & Technologie",
      "AI Winner Agent inclus",
      "Creative Finder illimité",
      "Support prioritaire 24/7"
    ],
    highlight: true,
    color: "from-violet-500/20 to-pink-500/20"
  },
  {
    name: "Entreprise",
    price: { monthly: "199", yearly: "149" },
    description: "Solutions sur mesure pour les agences et grosses équipes.",
    features: [
      "Tout ce qui est dans Pro",
      "Comptes multi-utilisateurs",
      "API Access",
      "Tracking de marques illimité",
      "Gestionnaire de compte dédié",
      "Onboarding personnalisé"
    ],
    highlight: false,
    color: "from-amber-500/20 to-orange-500/20"
  }
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const addToast = useToastStore((state) => state.addToast);

  const handleSubscribe = async (planName: string) => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      addToast("Veuillez vous connecter pour choisir un plan", "error");
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ plan_type: planName })
      .eq('id', user.id);
    
    if (error) {
      addToast(error.message, "error");
    } else {
      addToast(`Félicitations ! Vous êtes maintenant abonné au plan ${planName}.`, "success");
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header section */}
      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest animate-bounce-slow">
          <Sparkles className="w-4 h-4" /> Tarification Flexible
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
          Passez au <span className="gradient-text-new">Niveau Supérieur</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
          Choisissez le plan qui correspond à vos ambitions et débloquez la puissance de HiProduct.
        </p>

        {/* Toggle Monthly/Yearly */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <span className={`text-sm font-bold transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Mensuel</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-16 h-8 rounded-full bg-white/5 border border-white/10 p-1 relative transition-all"
          >
            <div className={`w-6 h-6 rounded-full bg-primary shadow-lg shadow-primary/40 transition-all duration-300 transform ${isYearly ? 'translate-x-8' : 'translate-x-0'}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Annuel</span>
            <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-tighter border border-emerald-500/20">
              Économisez 30%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {PLANS.map((plan) => (
          <div 
            key={plan.name}
            className={`relative group rounded-[3rem] p-8 transition-all duration-500 flex flex-col h-full ${
              plan.highlight 
                ? 'bg-secondary/40 border-2 border-primary shadow-[0_30px_60px_rgba(124,58,237,0.2)] scale-105 z-10' 
                : 'bg-white/5 border border-white/10 hover:border-white/20 hover:-translate-y-2'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                <Star className="w-4 h-4 fill-white" /> Recommandé
              </div>
            )}

            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem] -z-10`} />

            {/* Plan Header */}
            <div className="mb-8">
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tighter">
                ${isYearly ? plan.price.yearly : plan.price.monthly}
              </span>
              <span className="text-muted-foreground font-bold">/mois</span>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => handleSubscribe(plan.name)}
              className={`w-full py-4 rounded-2xl font-black text-sm mb-10 transition-all active:scale-95 flex items-center justify-center gap-2 ${
                plan.highlight
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50'
                  : 'bg-white/5 text-foreground border border-white/10 hover:bg-white/10'
              }`}
            >
              DÉMARRER MAINTENANT <ArrowRight className="w-4 h-4" />
            </button>

            {/* Features List */}
            <div className="space-y-4 flex-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">Inclus dans ce plan :</div>
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 group/feat">
                  <div className={`p-1 rounded-full transition-colors ${plan.highlight ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground group-hover/feat:text-foreground'}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-medium text-foreground/90">{feature}</span>
                </div>
              ))}
            </div>

            {/* Bottom Seal */}
            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Shield className="w-3 h-3" /> Paiement Sécurisé & SSL
            </div>
          </div>
        ))}
      </div>

      {/* Trust Section */}
      <div className="mt-24 text-center">
        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-8">Plus de 2,000+ marques nous font confiance</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Logos placeholders icons could be here */}
           <Zap className="w-12 h-12" />
           <Shield className="w-12 h-12" />
           <Star className="w-12 h-12" />
           <Sparkles className="w-12 h-12" />
        </div>
      </div>
    </div>
  );
}
