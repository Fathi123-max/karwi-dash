"use client";

import { useState } from "react";

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
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";

import { BranchDialog } from "./branch-dialog";
import { Branch } from "./types";

interface BranchActionsProps {
  branch: Branch;
}

export function BranchActions({ branch }: BranchActionsProps) {
  const t = useTranslations("admin.branches");
  const { deleteBranch } = useBranchStore();
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <AlertDialog>
      <DropdownMenu open={isMenuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(branch.id)}>{t("copyId")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <BranchDialog branch={branch} onDialogClose={() => setMenuOpen(false)}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>{t("edit")}</DropdownMenuItem>
          </BranchDialog>
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
          <AlertDialogAction onClick={() => deleteBranch(branch.id)}>{t("deleteConfirm.continue")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
