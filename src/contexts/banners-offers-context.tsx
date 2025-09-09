"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Banner, Offer } from "@/types/banners-offers";

type BannersOffersContextType = {
  banners: Banner[];
  offers: Offer[];
  loading: boolean;
  refreshBanners: () => Promise<void>;
  refreshOffers: () => Promise<void>;
};

const BannersOffersContext = createContext<BannersOffersContextType | undefined>(undefined);

export function BannersOffersProvider({ children }: { children: ReactNode }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedBanners = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        is_active: item.is_active,
        link_url: item.link_url,
        start_date: item.start_date,
        end_date: item.end_date,
        priority: item.priority,
        target_audience: item.target_audience,
        metadata: item.metadata,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      setBanners(formattedBanners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase.from("offers").select("*").order("created_at", { ascending: false });

      if (error) throw error;

      const formattedOffers = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        is_active: item.is_active,
        link_url: item.link_url,
        start_date: item.start_date,
        end_date: item.end_date,
        code: item.code,
        discount_type: item.discount_type,
        discount_value: item.discount_value,
        terms: item.terms,
        target_audience: item.target_audience,
        metadata: item.metadata,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      setOffers(formattedOffers);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const refreshBanners = async () => {
    await fetchBanners();
  };

  const refreshOffers = async () => {
    await fetchOffers();
  };

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([fetchBanners(), fetchOffers()]);
      setLoading(false);
    };

    initialize();

    // Set up real-time subscriptions
    const bannersChannel = supabase
      .channel("banners-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "banners",
        },
        (payload) => {
          refreshBanners();
        },
      )
      .subscribe();

    const offersChannel = supabase
      .channel("offers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "offers",
        },
        (payload) => {
          refreshOffers();
        },
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(bannersChannel);
      supabase.removeChannel(offersChannel);
    };
  }, []);

  return (
    <BannersOffersContext.Provider
      value={{
        banners,
        offers,
        loading,
        refreshBanners,
        refreshOffers,
      }}
    >
      {children}
    </BannersOffersContext.Provider>
  );
}

export function useBannersOffers() {
  const context = useContext(BannersOffersContext);
  if (context === undefined) {
    throw new Error("useBannersOffers must be used within a BannersOffersProvider");
  }
  return context;
}
