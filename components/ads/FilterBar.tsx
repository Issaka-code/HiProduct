"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown, Search } from "lucide-react";
import { DateRangePicker } from "./DateRangePicker";

export function FilterBar({ onFilterChange }: { onFilterChange: (filters: Record<string, string>) => void }) {
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const handleApply = () => {
    onFilterChange(selectedFilters);
  };

  const handleSelect = (filterName: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName] === option ? "" : option
    }));
  };

  const filters = [
    { name: "Plateforme", options: ["Meta Ads", "TikTok", "Pinterest", "Google Ads", "Snapchat"] },
    { name: "Pays", options: [
      "Afghanistan", "Afrique du Sud", "Albanie", "Algérie", "Allemagne", "Andorre", "Angola", "Antigua-et-Barbuda", "Arabie Saoudite", "Argentine", "Arménie", "Australie", "Autriche", "Azerbaïdjan", "Bahamas", "Bahreïn", "Bangladesh", "Barbade", "Belgique", "Belize", "Bénin", "Bhoutan", "Biélorussie", "Birmanie", "Bolivie", "Bosnie-Herzégovine", "Botswana", "Brésil", "Brunei", "Bulgarie", "Burkina Faso", "Burundi", "Cambodge", "Cameroun", "Canada", "Cap-Vert", "Chili", "Chine", "Chypre", "Colombie", "Comores", "Congo-Brazzaville", "Congo-Kinshasa", "Corée du Nord", "Corée du Sud", "Costa Rica", "Côte d'Ivoire", "Croatie", "Cuba", "Danemark", "Djibouti", "Dominique", "Égypte", "Émirats arabes unis", "Équateur", "Érythrée", "Espagne", "Estonie", "Eswatini", "États-Unis", "Éthiopie", "Fidji", "Finlande", "France", "Gabon", "Gambie", "Géorgie", "Ghana", "Grèce", "Grenade", "Guatemala", "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Guyana", "Haïti", "Honduras", "Hongrie", "Inde", "Indonésie", "Irak", "Iran", "Irlande", "Islande", "Israël", "Italie", "Jamaïque", "Japon", "Jordanie", "Kazakhstan", "Kenya", "Kirghizistan", "Kiribati", "Koweït", "Laos", "Lesotho", "Lettonie", "Liban", "Libéria", "Libye", "Liechtenstein", "Lituanie", "Luxembourg", "Macédoine du Nord", "Madagascar", "Malaisie", "Malawi", "Maldives", "Mali", "Malte", "Maroc", "Maurice", "Mauritanie", "Mexique", "Micronésie", "Moldavie", "Monaco", "Mongolie", "Monténégro", "Mozambique", "Namibie", "Nauru", "Népal", "Nicaragua", "Niger", "Nigéria", "Niue", "Norvège", "Nouvelle-Zélande", "Oman", "Ouganda", "Ouzbékistan", "Pakistan", "Palaos", "Palestine", "Panama", "Papouasie-Nouvelle-Guinée", "Paraguay", "Pays-Bas", "Pérou", "Philippines", "Pologne", "Portugal", "Qatar", "République centrafricaine", "République dominicaine", "République tchèque", "Roumanie", "Royaume-Uni", "Russie", "Rwanda", "Saint-Christophe-et-Niévès", "Saint-Marin", "Saint-Vincent-et-les-Grenadines", "Sainte-Lucie", "Salvador", "Samoa", "Sao Tomé-et-Principe", "Sénégal", "Serbie", "Seychelles", "Sierra Leone", "Singapour", "Slovaquie", "Slovénie", "Somalie", "Soudan", "Soudan du Sud", "Sri Lanka", "Suède", "Suisse", "Suriname", "Syrie", "Tadjikistan", "Tanzanie", "Tchad", "Thaïlande", "Timor oriental", "Togo", "Tonga", "Trinité-et-Tobago", "Tunisie", "Turkménistan", "Turquie", "Tuvalu", "Ukraine", "Uruguay", "Vanuatu", "Vatican", "Venezuela", "Vietnam", "Yémen", "Zambie", "Zimbabwe"
    ] },
    { name: "Catégorie", options: ["E-commerce", "SaaS", "Info-Produit", "Services Locaux", "Immobilier", "Santé & Beauté"] },
    { name: "Engagement", options: ["Viral (+50k likes)", "Élevé (+10k likes)", "Moyen (+1k likes)", "Faible"] },
    { name: "Format", options: ["Vidéo Verticale", "Vidéo Carrée", "Image", "Carousel", "Collection"] },
    { name: "Boutique", options: ["Shopify", "WooCommerce", "YouCan", "ClickFunnels", "Systeme.io", "Custom Store"] },
    { name: "Langue", options: ["Français", "Arabe", "Anglais", "Wolof", "Yoruba"] },
  ];

  return (
    <div className="rounded-[2rem] p-4 flex flex-wrap items-center gap-4 mb-12 relative z-30 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-primary/30 bg-white/90 dark:bg-black/40 backdrop-blur-3xl transition-all hover:border-primary/50">
      <div className="flex items-center gap-3 px-4 border-r-2 border-primary/10 mr-2">
        <div className="p-2 bg-primary/10 rounded-xl">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
        </div>
        <span className="font-black text-xs tracking-[0.15em] text-foreground uppercase">Filtres</span>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <DateRangePicker />
        {filters.map((filter) => (
          <div key={filter.name} className="relative group cursor-pointer">
            <div className="flex items-center gap-3 bg-secondary/40 hover:bg-secondary/80 px-4 py-2.5 rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-300">
              <span className="text-[13px] font-bold text-foreground/70 group-hover:text-foreground transition-colors truncate max-w-[150px]">
                {selectedFilters[filter.name] || filter.name}
              </span>
              <ChevronDown className="w-4 h-4 text-primary transition-transform group-hover:rotate-180 duration-500" />
            </div>
            
            {/* ── High-Contrast Dropdown ── */}
            <div className="absolute top-[calc(100%+0.5rem)] left-0 w-72 bg-white dark:bg-secondary border-2 border-primary/20 rounded-[1.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-3 scale-95 group-hover:scale-100 origin-top-left backdrop-blur-3xl">
              {filter.name === "Pays" && (
                <div className="px-3 pb-3 pt-1 sticky top-0 bg-inherit z-10">
                  <div className="relative group/search">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within/search:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Rechercher un pays..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-secondary/50 border border-border/50 focus:border-primary/50 rounded-xl py-2.5 pl-10 pr-4 text-[13px] font-bold outline-none transition-all placeholder:text-foreground/30"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1 max-h-[30rem] overflow-y-auto scrollbar-hide pr-1">
                {(filter.name === "Pays" 
                  ? filter.options.filter(opt => opt.toLowerCase().includes(countrySearch.toLowerCase()))
                  : filter.options
                ).map((opt) => (
                  <div 
                    key={opt} 
                    onClick={() => handleSelect(filter.name, opt)}
                    className={`px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-between group/opt ${
                      selectedFilters[filter.name] === opt 
                        ? "text-primary bg-primary/10" 
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {opt}
                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                      selectedFilters[filter.name] === opt 
                        ? "bg-primary scale-100" 
                        : "bg-primary/0 group-hover/opt:bg-primary scale-0 group-hover/opt:scale-100"
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pl-4 border-l-2 border-primary/10 ml-2">
        <button 
          onClick={handleApply}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-2xl text-[13px] font-black tracking-wider transition-all duration-300 shadow-[0_10px_30px_rgba(124,58,237,0.4)] hover:shadow-[0_15px_40px_rgba(124,58,237,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 whitespace-nowrap"
        >
          APPLIQUER
        </button>
      </div>
    </div>
  );
}
