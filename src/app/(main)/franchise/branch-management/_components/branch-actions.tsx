"use client";

import { useState } from "react";

import { MoreHorizontal, Edit } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFranchiseBranchStore, Branch } from "@/stores/franchise-dashboard/branch-store";

import { BranchDialog } from "./branch-dialog";

interface BranchActionsProps {
  branch: Branch;
}

export function BranchActions({ branch }: BranchActionsProps) {
  const t = useTranslations("franchise.branches.actions");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t("openMenu")}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(branch.id)}>{t("copyId")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            {t("editBranch")}
          </DropdownMenuItem>
          {/* DELETE FEATURE DISABLED */}
        </DropdownMenuContent>
      </DropdownMenu>
      <BranchDialog branch={branch} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
    </>
  );
}
