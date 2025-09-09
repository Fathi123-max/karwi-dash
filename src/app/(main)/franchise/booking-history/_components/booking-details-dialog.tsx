"use client";

import { useTranslations } from "next-intl";
import { EnrichedBooking } from "@/app/(main)/franchise/utils/bookings";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BookingDetailsDialogProps {
  booking: EnrichedBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailsDialog({ booking, isOpen, onClose }: BookingDetailsDialogProps) {
  const t = useTranslations("franchise.bookingDetails");
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("detailsForBooking", { id: booking.id })}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <strong>{t("user")}:</strong> {booking.user}
          </div>
          <div>
            <strong>{t("branch")}:</strong> {booking.branch}
          </div>
          <div>
            <strong>{t("service")}:</strong> {booking.service}
          </div>
          <div>
            <strong>{t("status")}:</strong> {booking.status}
          </div>
          <div>
            <strong>{t("date")}:</strong> {new Date(booking.date).toLocaleString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
