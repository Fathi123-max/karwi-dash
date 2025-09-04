"use client";

import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";

import { FranchiseDialog } from "./franchise-dialog";
import { Franchise } from "./types";

interface FranchiseActionsProps {
  franchise: Franchise;
}

export function FranchiseActions({ franchise }: FranchiseActionsProps) {
  const t = useTranslations("admin.franchises");
  const { deleteFranchise } = useFranchiseStore();

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(franchise.id)}>{t("copyId")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <FranchiseDialog franchise={franchise}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>{t("edit")}</DropdownMenuItem>
          </FranchiseDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-red-600">{t("delete")}</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteConfirm.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("deleteConfirm.description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteFranchise(franchise.id)}>
            {t("deleteConfirm.continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
