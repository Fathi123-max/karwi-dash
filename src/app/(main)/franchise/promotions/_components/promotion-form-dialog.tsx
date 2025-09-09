"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePromotionStore } from "@/stores/admin-dashboard/promotion-store";
import { Promotion } from "@/types/database";

import { PromotionForm } from "./promotion-form";

interface PromotionFormDialogProps {
  promotion?: Promotion;
  children: React.ReactNode;
}

export function PromotionFormDialog({ promotion, children }: PromotionFormDialogProps) {
  const t = useTranslations("franchise.promotions.formDialog");
  const [open, setOpen] = useState(false);
  const { addPromotion, updatePromotion } = usePromotionStore();

  const handleSubmit = async (data: Omit<Promotion, "id"> | Promotion) => {
    try {
      if (promotion) {
        await updatePromotion(data as Promotion);
        toast.success(t("updatedSuccessfully"));
      } else {
        await addPromotion(data as Omit<Promotion, "id">);
        toast.success(t("createdSuccessfully"));
      }
      setOpen(false);
    } catch (error) {
      toast.error(t("failedToSave"));
      console.error("Error saving promotion:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{promotion ? t("edit") : t("create")}</DialogTitle>
          <DialogDescription>{promotion ? t("updateDescription") : t("createDescription")}</DialogDescription>
        </DialogHeader>
        <PromotionForm promotion={promotion} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
