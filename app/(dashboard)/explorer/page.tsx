"use client";
import { useState, useEffect } from "react";
import { FilterBar } from "@/components/ads/FilterBar";
import { AdCard, AdData } from "@/components/ads/AdCard";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const FilterSchema = z.object({
  Pays: z.string().optional(),
  Plateforme: z.string().optional(),
  Catégorie: z.string().optional(),
});

export default function AdsExplorerPage() {
  const [ads, setAds] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAds = async (filters: Record<string, string | undefined> = {}) => {
    // Validation
    const validatedFilters = FilterSchema.parse(filters);
    
    if (!supabase) return;
    setLoading(true);

    let query = supabase
      .from('ads')
      .select('*');

    if (filters.Pays) {
      query = query.eq('country', filters.Pays);
    }
    if (filters.Plateforme) {
      const platform = filters.Plateforme.toLowerCase().includes('meta') ? 'meta' : 'tiktok';
      query = query.eq('platform', platform);
    }
    if (filters.Catégorie) {
      query = query.eq('category', filters.Catégorie);
    }
    
    // Default sorting by engagement
    query = query.order('likes', { ascending: false });

    const { data, error } = await query;

    if (data) {
      const formattedAds: AdData[] = data.map(ad => ({
        id: ad.id,
        brandName: ad.brand_name,
        platform: ad.platform as "meta" | "tiktok",
        country: ad.country,
        format: ad.format as "video" | "image",
        thumbnail: ad.thumbnail_url || "",
        likes: ad.likes,
        activeDays: ad.active_days
      }));
      setAds(formattedAds);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div className="space-y-6">
      <FilterBar onFilterChange={fetchAds} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-50">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="aspect-[4/5] bg-white/5 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}

      {!loading && ads.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5">
          <p className="text-muted-foreground font-bold">Aucune publicité trouvée pour ces critères.</p>
        </div>
      )}
    </div>
  );
}
