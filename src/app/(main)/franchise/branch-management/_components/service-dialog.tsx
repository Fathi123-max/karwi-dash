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
import { Service } from "@/stores/franchise-dashboard/service-store";

import { ServiceForm } from "./service-form";

interface ServiceDialogProps {
  branchId: string;
  service?: Service;
  children: React.ReactNode;
}

export function ServiceDialog({ branchId, service, children }: ServiceDialogProps) {
  const t = useTranslations("franchise.services.dialog");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {service ? t("edit") : t("add")} {t("service")}
          </DialogTitle>
          <DialogDescription>{service ? t("updateServiceDescription") : t("addServiceDescription")}</DialogDescription>
        </DialogHeader>
        <ServiceForm branchId={branchId} service={service} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
