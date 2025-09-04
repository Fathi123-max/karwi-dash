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
import { useUserStore } from "@/stores/admin-dashboard/user-store";

import { User } from "./types";
import { UserDialog } from "./user-dialog";

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const t = useTranslations("admin.users");
  const { deleteUser } = useUserStore();

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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>{t("copyId")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <UserDialog user={user}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>{t("edit")}</DropdownMenuItem>
          </UserDialog>
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
          <AlertDialogAction onClick={() => deleteUser(user.id)}>{t("deleteConfirm.continue")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
