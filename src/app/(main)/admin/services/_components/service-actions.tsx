"use client";

import * as React from "react";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useServiceStore } from "@/stores/admin-dashboard/service-store";
import { Service } from "@/types/database";

import { ServiceForm } from "./service-form";

export function ServiceActions({ service }: { service: Service }) {
  const deleteService = useServiceStore((state) => state.deleteService);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const t = useTranslations("common");
  const tAdmin = useTranslations("admin.services");

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("actions")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
            <DialogTrigger asChild>
              <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
            </DialogTrigger>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>{t("delete")}</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              <span>{service.is_global ? tAdmin("deleteConfirm.globalService") : t("deleteConfirm.description")}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteService(service.id)}>
              {t("deleteConfirm.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("edit")} {tAdmin("title")}
          </DialogTitle>
        </DialogHeader>
        <ServiceForm service={service} onClose={() => setEditModalOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
