"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getActiveOffers } from "@/server/banners-offers-actions";
import { Offer } from "@/types/banners-offers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function OfferGrid() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const activeOffers = await getActiveOffers();
        setOffers(activeOffers);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();

    // Set up real-time subscription
    const channel = supabase
      .channel("offers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "offers",
        },
        (payload) => {
          // Refetch offers when there are changes
          fetchOffers();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted h-48 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (offers.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {offers.map((offer) => (
        <Card key={offer.id} className="overflow-hidden">
          {offer.image_url ? (
            <div className="aspect-video bg-muted relative">
              <img
                src={offer.image_url}
                alt={offer.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E";
                }}
              />
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{offer.title}</h3>
            {offer.description && (
              <p className="text-muted-foreground text-sm mt-1">
                {offer.description}
              </p>
            )}
            {offer.discount_type && offer.discount_value && (
              <div className="mt-2">
                <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-2 py-1 rounded">
                  {offer.discount_type === "percentage" 
                    ? `${offer.discount_value}% off` 
                    : `${offer.discount_value.toFixed(2)} off`}
                </span>
              </div>
            )}
            <div className="mt-4 flex justify-between items-center">
              {offer.code && (
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  Code: {offer.code}
                </span>
              )}
              {offer.link_url && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(offer.link_url!, "_blank")}
                >
                  View Offer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}