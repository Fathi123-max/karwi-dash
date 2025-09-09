"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WasherWithBranch } from "@/stores/franchise-dashboard/user-store";

import { WasherForm } from "./washer-form";

interface WasherDialogProps {
  washer?: WasherWithBranch;
  children: React.ReactNode;
  onDialogClose?: () => void;
}

export function WasherDialog({ washer, children, onDialogClose }: WasherDialogProps) {
  const t = useTranslations("franchise.washers.dialog");
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onDialogClose) {
      onDialogClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {washer ? t("edit") : t("add")} {t("washer")}
          </DialogTitle>
          <DialogDescription>{washer ? t("updateWasher") : t("addWasher")}</DialogDescription>
        </DialogHeader>
        <WasherForm washer={washer} onSuccess={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
