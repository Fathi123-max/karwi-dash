"use client";

import Link from "next/link";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

import { Washer } from "./types";
import { WasherDialog } from "./washer-dialog";

export function WasherBadge({ washer }: { washer: Washer }) {
  const t = useTranslations("admin.washers");
  return (
    <Badge variant={washer.status === "active" ? "default" : "destructive"}>
      {washer.status === "active" ? t("active") : t("inactive")}
    </Badge>
  );
}

export function WasherActions({ washer }: { washer: Washer }) {
  const t = useTranslations("admin.washers");
  const { deleteWasher } = useWasherStore();

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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(washer.id)}>{t("copyId")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <WasherDialog washer={washer}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>{t("edit")}</DropdownMenuItem>
          </WasherDialog>
          <Link href={`/admin/washers/${washer.id}/schedule`}>
            <DropdownMenuItem>{t("manageSchedule")}</DropdownMenuItem>
          </Link>
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
          <AlertDialogAction onClick={() => deleteWasher(washer.id)}>{t("deleteConfirm.continue")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
