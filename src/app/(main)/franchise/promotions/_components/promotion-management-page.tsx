"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePromotionStore } from "@/stores/admin-dashboard/promotion-store";

import { PromotionFormDialog } from "./promotion-form-dialog";
import { PromotionList } from "./promotion-list";

export function PromotionManagementPage() {
  const t = useTranslations("franchise.promotions");
  const { promotions, fetchPromotions } = usePromotionStore();

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>{t("promotions")}</CardTitle>
              <CardDescription>{t("manageOffers")}</CardDescription>
            </div>
            <PromotionFormDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("addPromotion")}
              </Button>
            </PromotionFormDialog>
          </div>
        </CardHeader>
        <CardContent>
          <PromotionList promotions={promotions} />
        </CardContent>
      </Card>
    </div>
  );
}
