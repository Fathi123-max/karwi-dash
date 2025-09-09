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
import { Branch } from "@/stores/franchise-dashboard/branch-store";

import { BranchForm } from "./branch-form";

interface BranchDialogProps {
  branch?: Branch;
  children?: React.ReactNode;
  onDialogClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BranchDialog({ branch, children, onDialogClose, open, onOpenChange }: BranchDialogProps) {
  const t = useTranslations("franchise.branches.dialog");
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen && onDialogClose) {
      onDialogClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-h-[90vh] max-w-4xl gap-0 overflow-y-auto p-0 sm:rounded-lg">
        <div className="bg-background sticky top-0 z-10 border-b p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl">{branch ? t("manageBranchServices") : t("addNewBranch")}</DialogTitle>
            <DialogDescription>{branch ? t("manageServicesDescription") : t("addBranchDescription")}</DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6">
          <BranchForm branch={branch} onSuccess={() => handleOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
