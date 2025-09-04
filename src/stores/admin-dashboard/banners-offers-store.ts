import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { Banner, Offer } from "@/types/banners-offers";

const supabase = createClientComponentClient();

type BannersOffersState = {
  banners: Banner[];
  offers: Offer[];
  loading: boolean;
  fetchBanners: () => Promise<void>;
  fetchOffers: () => Promise<void>;
  addBanner: (banner: Omit<Banner, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateBanner: (banner: Banner) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  addOffer: (offer: Omit<Offer, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateOffer: (offer: Offer) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
};

export const useBannersOffersStore = create<BannersOffersState>((set, get) => ({
  banners: [],
  offers: [],
  loading: true,
  
  fetchBanners: async () => {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching banners:", error);
      return;
    }

    const banners = data.map((item) => ({
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

    set({ banners, loading: false });
  },

  fetchOffers: async () => {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching offers:", error);
      return;
    }

    const offers = data.map((item) => ({
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

    set({ offers, loading: false });
  },

  addBanner: async (banner) => {
    const { data, error } = await supabase
      .from("banners")
      .insert({
        title: banner.title,
        description: banner.description,
        image_url: banner.image_url,
        is_active: banner.is_active,
        link_url: banner.link_url,
        start_date: banner.start_date,
        end_date: banner.end_date,
        priority: banner.priority,
        target_audience: banner.target_audience,
        metadata: banner.metadata,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding banner:", error);
      throw new Error("Failed to add banner: " + error.message);
    }

    const newBanner = {
      id: data.id,
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      is_active: data.is_active,
      link_url: data.link_url,
      start_date: data.start_date,
      end_date: data.end_date,
      priority: data.priority,
      target_audience: data.target_audience,
      metadata: data.metadata,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    set((state) => ({
      banners: [...state.banners, newBanner],
    }));
  },

  updateBanner: async (updatedBanner) => {
    const { data, error } = await supabase
      .from("banners")
      .update({
        title: updatedBanner.title,
        description: updatedBanner.description,
        image_url: updatedBanner.image_url,
        is_active: updatedBanner.is_active,
        link_url: updatedBanner.link_url,
        start_date: updatedBanner.start_date,
        end_date: updatedBanner.end_date,
        priority: updatedBanner.priority,
        target_audience: updatedBanner.target_audience,
        metadata: updatedBanner.metadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", updatedBanner.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating banner:", error);
      throw new Error("Failed to update banner: " + error.message);
    }

    const banner = {
      id: data.id,
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      is_active: data.is_active,
      link_url: data.link_url,
      start_date: data.start_date,
      end_date: data.end_date,
      priority: data.priority,
      target_audience: data.target_audience,
      metadata: data.metadata,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    set((state) => ({
      banners: state.banners.map((b) => (b.id === updatedBanner.id ? banner : b)),
    }));
  },

  deleteBanner: async (id) => {
    const { error } = await supabase.from("banners").delete().eq("id", id);

    if (error) {
      console.error("Error deleting banner:", error);
      throw new Error("Failed to delete banner: " + error.message);
    }

    set((state) => ({
      banners: state.banners.filter((banner) => banner.id !== id),
    }));
  },

  addOffer: async (offer) => {
    const { data, error } = await supabase
      .from("offers")
      .insert({
        title: offer.title,
        description: offer.description,
        image_url: offer.image_url,
        is_active: offer.is_active,
        link_url: offer.link_url,
        start_date: offer.start_date,
        end_date: offer.end_date,
        code: offer.code,
        discount_type: offer.discount_type,
        discount_value: offer.discount_value,
        terms: offer.terms,
        target_audience: offer.target_audience,
        metadata: offer.metadata,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding offer:", error);
      throw new Error("Failed to add offer: " + error.message);
    }

    const newOffer = {
      id: data.id,
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      is_active: data.is_active,
      link_url: data.link_url,
      start_date: data.start_date,
      end_date: data.end_date,
      code: data.code,
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      terms: data.terms,
      target_audience: data.target_audience,
      metadata: data.metadata,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    set((state) => ({
      offers: [...state.offers, newOffer],
    }));
  },

  updateOffer: async (updatedOffer) => {
    const { data, error } = await supabase
      .from("offers")
      .update({
        title: updatedOffer.title,
        description: updatedOffer.description,
        image_url: updatedOffer.image_url,
        is_active: updatedOffer.is_active,
        link_url: updatedOffer.link_url,
        start_date: updatedOffer.start_date,
        end_date: updatedOffer.end_date,
        code: updatedOffer.code,
        discount_type: updatedOffer.discount_type,
        discount_value: updatedOffer.discount_value,
        terms: updatedOffer.terms,
        target_audience: updatedOffer.target_audience,
        metadata: updatedOffer.metadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", updatedOffer.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating offer:", error);
      throw new Error("Failed to update offer: " + error.message);
    }

    const offer = {
      id: data.id,
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      is_active: data.is_active,
      link_url: data.link_url,
      start_date: data.start_date,
      end_date: data.end_date,
      code: data.code,
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      terms: data.terms,
      target_audience: data.target_audience,
      metadata: data.metadata,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    set((state) => ({
      offers: state.offers.map((o) => (o.id === updatedOffer.id ? offer : o)),
    }));
  },

  deleteOffer: async (id) => {
    const { error } = await supabase.from("offers").delete().eq("id", id);

    if (error) {
      console.error("Error deleting offer:", error);
      throw new Error("Failed to delete offer: " + error.message);
    }

    set((state) => ({
      offers: state.offers.filter((offer) => offer.id !== id),
    }));
  },
}));