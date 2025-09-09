"use client";

import { useEffect, useState } from "react";

import { MoreHorizontal, PlusCircle, Tag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePromotionStore } from "@/stores/admin-dashboard/promotion-store";
import { useServicePromotionStore } from "@/stores/franchise-dashboard/service-promotion-store";
import { Promotion, ServicePromotion } from "@/types/database";

interface ServicePromotionManagementProps {
  serviceId: string;
}

export function ServicePromotionManagement({ serviceId }: ServicePromotionManagementProps) {
  const t = useTranslations("franchise.services.promotions");
  const { servicePromotions, fetchServicePromotions, addServicePromotion, removeServicePromotion } =
    useServicePromotionStore();
  const { promotions, fetchPromotions } = usePromotionStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchServicePromotions(serviceId);
    fetchPromotions();
  }, [serviceId, fetchServicePromotions, fetchPromotions]);

  // Get promotions that are not yet associated with this service
  const availablePromotions = promotions.filter(
    (promotion) => !servicePromotions.some((sp) => sp.promotionId === promotion.id),
  );

  // Get promotions that are associated with this service
  const servicePromotionDetails = servicePromotions
    .filter((sp) => sp.serviceId === serviceId)
    .map((sp) => {
      const promotion = promotions.find((p) => p.id === sp.promotionId);
      return promotion ? { ...sp, promotion } : null;
    })
    .filter(Boolean) as (ServicePromotion & { promotion: Promotion })[];

  const handleAddPromotion = async (promotionId: string) => {
    setIsLoading(true);
    try {
      await addServicePromotion(serviceId, promotionId);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding promotion to service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePromotion = async (id: string) => {
    try {
      await removeServicePromotion(id);
    } catch (error) {
      console.error("Error removing promotion from service:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("promotions")}</CardTitle>
            <CardDescription>{t("managePromotions")}</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("addPromotion")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("addPromotion")}</DialogTitle>
                <DialogDescription>{t("selectPromotion")}</DialogDescription>
              </DialogHeader>
              <div className="max-h-60 overflow-y-auto">
                {availablePromotions.length > 0 ? (
                  <div className="space-y-2">
                    {availablePromotions.map((promotion) => (
                      <Button
                        key={promotion.id}
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => handleAddPromotion(promotion.id)}
                        disabled={isLoading}
                      >
                        <span>{promotion.code}</span>
                        <span className="text-muted-foreground">
                          {t("percentOff", { percent: promotion.discount })}
                        </span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4 text-center">{t("noAvailablePromotions")}</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {servicePromotionDetails.length > 0 ? (
          <div className="space-y-2">
            {servicePromotionDetails.map((sp) => (
              <div key={sp.id} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <Tag className="text-muted-foreground h-4 w-4" />
                  <span>{sp.promotion.code}</span>
                  <span className="text-muted-foreground">({t("percentOff", { percent: sp.promotion.discount })})</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">{t("openMenu")}</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleRemovePromotion(sp.id)}>{t("remove")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground py-4 text-center">{t("noPromotionsAssociated")}</p>
        )}
      </CardContent>
    </Card>
  );
}
