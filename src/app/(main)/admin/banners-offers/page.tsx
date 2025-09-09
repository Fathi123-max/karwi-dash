"use client";

import { useState } from "react";

import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBannersOffersStore } from "@/stores/admin-dashboard/banners-offers-store";

import { BannerForm } from "./_components/banner-form";
import { BannerList } from "./_components/banner-list";
import { OfferForm } from "./_components/offer-form";
import { OfferList } from "./_components/offer-list";

export default function BannersOffersPage() {
  const t = useTranslations("admin.bannersOffers");
  const { fetchBanners, fetchOffers } = useBannersOffersStore();
  const [activeTab, setActiveTab] = useState("banners");
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const handleEditBanner = (banner: any) => {
    setSelectedBanner(banner);
    setIsBannerFormOpen(true);
  };

  const handleEditOffer = (offer: any) => {
    setSelectedOffer(offer);
    setIsOfferFormOpen(true);
  };

  const handleCloseBannerForm = () => {
    setIsBannerFormOpen(false);
    setSelectedBanner(null);
    // Refresh the banners list after closing the form
    fetchBanners();
  };

  const handleCloseOfferForm = () => {
    setIsOfferFormOpen(false);
    setSelectedOffer(null);
    // Refresh the offers list after closing the form
    fetchOffers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="banners">{t("banners.title")}</TabsTrigger>
          <TabsTrigger value="offers">{t("offers.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("banners.title")}</CardTitle>
                  <CardDescription>{t("banners.description")}</CardDescription>
                </div>
                <Button onClick={() => setIsBannerFormOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("banners.addbanner")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BannerList onEdit={handleEditBanner} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("offers.title")}</CardTitle>
                  <CardDescription>{t("offers.description")}</CardDescription>
                </div>
                <Button onClick={() => setIsOfferFormOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Offer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <OfferList onEdit={handleEditOffer} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isBannerFormOpen && <BannerForm banner={selectedBanner} onClose={handleCloseBannerForm} />}

      {isOfferFormOpen && <OfferForm offer={selectedOffer} onClose={handleCloseOfferForm} />}
    </div>
  );
}
