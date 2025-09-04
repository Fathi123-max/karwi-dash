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

import { Washer } from "./types";
import { WasherForm } from "./washer-form";

interface WasherDialogProps {
  washer?: Washer;
  children: React.ReactNode;
}

export function WasherDialog({ washer, children }: WasherDialogProps) {
  const t = useTranslations("admin.washers");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{washer ? t("edit") : t("add")}</DialogTitle>
          <DialogDescription>{washer ? t("editDescription") : t("addDescription")}</DialogDescription>
        </DialogHeader>
        <WasherForm washer={washer} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
