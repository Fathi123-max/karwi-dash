"use client";

import { useState } from "react";

import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePromotionStore } from "@/stores/admin-dashboard/promotion-store";
import { Promotion } from "@/types/database";

import { PromotionFormDialog } from "./promotion-form-dialog";

interface PromotionListProps {
  promotions: Promotion[];
}

export function PromotionList({ promotions }: PromotionListProps) {
  const t = useTranslations("franchise.promotions.list");
  const { deletePromotion } = usePromotionStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deletePromotion(id);
      toast.success(t("deletedSuccessfully"));
    } catch (error) {
      toast.error(t("failedToDelete"));
      console.error("Error deleting promotion:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (promotions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">{t("noPromotions")}</p>
        <p className="text-muted-foreground mt-2 text-sm">{t("createFirstPromotion")}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("code")}</TableHead>
          <TableHead>{t("discount")}</TableHead>
          <TableHead>{t("validityPeriod")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead className="text-right">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {promotions.map((promotion) => (
          <TableRow key={promotion.id}>
            <TableCell className="font-medium">{promotion.code}</TableCell>
            <TableCell>{promotion.discount}%</TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{new Date(promotion.startDate).toLocaleDateString()}</div>
                <div className="text-muted-foreground">{t("to")}</div>
                <div>{new Date(promotion.endDate).toLocaleDateString()}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={promotion.active ? "default" : "secondary"}>
                {promotion.active ? t("active") : t("inactive")}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <PromotionFormDialog promotion={promotion}>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </PromotionFormDialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(promotion.id)}
                  disabled={deletingId === promotion.id}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
