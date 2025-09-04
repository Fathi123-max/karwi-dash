"use client";

import { useState } from "react";

import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FranchiseForm } from "./franchise-form";
import { Franchise } from "./types";

interface FranchiseDialogProps {
  franchise?: Franchise;
  children: React.ReactNode;
}

export function FranchiseDialog({ franchise, children }: FranchiseDialogProps) {
  const t = useTranslations("admin.franchises");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{franchise ? t("edit") : t("add")}</DialogTitle>
          <DialogDescription>{franchise ? t("editDescription") : t("addDescription")}</DialogDescription>
        </DialogHeader>
        {!franchise && <p className="text-muted-foreground text-sm">{t("note")}</p>}
        <FranchiseForm franchise={franchise} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
