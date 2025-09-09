"use client";

import { useState } from "react";

import { MoreHorizontal } from "lucide-react";
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
import { useFranchiseUserStore, WasherWithBranch } from "@/stores/franchise-dashboard/user-store";

interface WasherActionsProps {
  washer: WasherWithBranch;
}

export function WasherActions({ washer }: WasherActionsProps) {
  const t = useTranslations("franchise.washers.actions");
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">{t("openMenu")}</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(washer.id)}>{t("copyId")}</DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* EDIT FEATURE DISABLED */}
        {/* DELETE FEATURE DISABLED */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
