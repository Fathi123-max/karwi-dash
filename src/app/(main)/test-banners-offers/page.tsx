"use client";

import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getActiveBanners, getActiveOffers } from "@/server/banners-offers-actions";
import { Banner, Offer } from "@/types/banners-offers";
import { useBannersOffersStore } from "@/stores/admin-dashboard/banners-offers-store";

export default function TestBannersOffersPage() {
  const { banners, offers, loading, fetchBanners, fetchOffers } = useBannersOffersStore();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Fetch initial data
    fetchBanners();
    fetchOffers();

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
          fetchBanners();
        }
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
          fetchOffers();
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(bannersChannel);
      supabase.removeChannel(offersChannel);
    };
  }, [supabase, fetchBanners, fetchOffers]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Banners & Offers Test Page</h1>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Active Banners</h2>
        {banners.length > 0 ? (
          <div className="grid gap-4">
            {banners.map((banner) => (
              <div key={banner.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{banner.title}</h3>
                <p className="text-muted-foreground">{banner.description}</p>
                {banner.image_url && (
                  <img 
                    src={banner.image_url} 
                    alt={banner.title} 
                    className="mt-2 max-w-xs h-auto"
                  />
                )}
                <div className="mt-2 text-sm">
                  <span className="font-medium">Active:</span> {banner.is_active ? 'Yes' : 'No'}
                </div>
                <div className="mt-1 text-sm">
                  <span className="font-medium">Priority:</span> {banner.priority}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No active banners found</p>
        )}
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Active Offers</h2>
        {offers.length > 0 ? (
          <div className="grid gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{offer.title}</h3>
                <p className="text-muted-foreground">{offer.description}</p>
                {offer.image_url && (
                  <img 
                    src={offer.image_url} 
                    alt={offer.title} 
                    className="mt-2 max-w-xs h-auto"
                  />
                )}
                <div className="mt-2 text-sm">
                  <span className="font-medium">Active:</span> {offer.is_active ? 'Yes' : 'No'}
                </div>
                {offer.code && (
                  <div className="mt-1 text-sm">
                    <span className="font-medium">Code:</span> {offer.code}
                  </div>
                )}
                {offer.discount_type && offer.discount_value && (
                  <div className="mt-1 text-sm">
                    <span className="font-medium">Discount:</span> 
                    {offer.discount_type === 'percentage' 
                      ? ` ${offer.discount_value}%` 
                      : ` ${offer.discount_value}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No active offers found</p>
        )}
      </section>
    </div>
  );
}