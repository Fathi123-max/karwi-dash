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

import { User } from "./types";
import { UserForm } from "./user-form";

interface UserDialogProps {
  user: User;
  children: React.ReactNode;
}

export function UserDialog({ user, children }: UserDialogProps) {
  const t = useTranslations("admin.users");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("edit")}</DialogTitle>
          <DialogDescription>{t("editDescription")}</DialogDescription>
        </DialogHeader>
        <UserForm user={user} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
