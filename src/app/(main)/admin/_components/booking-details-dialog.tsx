"use client";

import { useTranslations } from "next-intl";

import { Booking } from "@/app/(main)/admin/_components/columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookingDetailsDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailsDialog({ booking, isOpen, onClose }: BookingDetailsDialogProps) {
  const t = useTranslations("admin");

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("bookings.details.title")}</DialogTitle>
          <DialogDescription>{t("bookings.details.description", { id: booking.id })}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">{t("bookings.details.user")}:</span>
            <span className="col-span-2 text-sm">{booking.user}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">{t("bookings.details.branch")}:</span>
            <span className="col-span-2 text-sm">{booking.branch}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">{t("bookings.details.service")}:</span>
            <span className="col-span-2 text-sm">{booking.service}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">{t("bookings.details.status")}:</span>
            <span className="col-span-2 text-sm capitalize">{booking.status}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">{t("bookings.details.date")}:</span>
            <span className="col-span-2 text-sm">
              {booking.date instanceof Date ? booking.date.toLocaleString() : new Date(booking.date).toLocaleString()}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>{t("common.close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
