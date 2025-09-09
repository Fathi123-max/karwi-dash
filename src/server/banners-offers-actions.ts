"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { Banner, Offer } from "@/types/banners-offers";

// Helper function to get Supabase client
async function getSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // We're just reading, so we don't need to set cookies
      },
    },
  });
}

// Banners CRUD operations
export async function getBanners(): Promise<Banner[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching banners:", error);
    throw new Error("Failed to fetch banners");
  }

  return data.map((item) => ({
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
}

export async function getActiveBanners(): Promise<Banner[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching active banners:", error);
    throw new Error("Failed to fetch active banners");
  }

  // Filter by date if start_date and end_date are set
  const today = new Date();
  return data
    .map((item) => ({
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
    }))
    .filter((banner) => {
      if (banner.start_date && new Date(banner.start_date) > today) return false;
      if (banner.end_date && new Date(banner.end_date) < today) return false;
      return true;
    });
}

export async function createBanner(banner: Omit<Banner, "id" | "created_at" | "updated_at">) {
  const supabase = await getSupabaseClient();
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
    console.error("Error creating banner:", error);
    throw new Error("Failed to create banner");
  }

  return {
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
}

export async function updateBanner(id: string, banner: Partial<Banner>) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("banners")
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating banner:", error);
    throw new Error("Failed to update banner");
  }

  return {
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
}

export async function deleteBanner(id: string) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);

  if (error) {
    console.error("Error deleting banner:", error);
    throw new Error("Failed to delete banner");
  }

  return { success: true };
}

// Offers CRUD operations
export async function getOffers(): Promise<Offer[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.from("offers").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching offers:", error);
    throw new Error("Failed to fetch offers");
  }

  return data.map((item) => ({
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
}

export async function getActiveOffers(): Promise<Offer[]> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching active offers:", error);
    throw new Error("Failed to fetch active offers");
  }

  // Filter by date if start_date and end_date are set
  const today = new Date();
  return data
    .map((item) => ({
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
    }))
    .filter((offer) => {
      if (offer.start_date && new Date(offer.start_date) > today) return false;
      if (offer.end_date && new Date(offer.end_date) < today) return false;
      return true;
    });
}

export async function createOffer(offer: Omit<Offer, "id" | "created_at" | "updated_at">) {
  const supabase = await getSupabaseClient();
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
    console.error("Error creating offer:", error);
    throw new Error("Failed to create offer");
  }

  return {
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
}

export async function updateOffer(id: string, offer: Partial<Offer>) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("offers")
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating offer:", error);
    throw new Error("Failed to update offer");
  }

  return {
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
}

export async function deleteOffer(id: string) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("offers").delete().eq("id", id);

  if (error) {
    console.error("Error deleting offer:", error);
    throw new Error("Failed to delete offer");
  }

  return { success: true };
}
