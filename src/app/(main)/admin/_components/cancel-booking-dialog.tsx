import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CancelBookingDialogProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingId: string) => void;
}

export function CancelBookingDialog({ bookingId, isOpen, onClose, onConfirm }: CancelBookingDialogProps) {
  const handleCancel = () => {
    onConfirm(bookingId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.bookings.cancel.title")}</DialogTitle>
          <DialogDescription>{t("admin.bookings.cancel.confirm", { bookingId })}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("admin.bookings.cancel.no")}
          </Button>
          <Button variant="destructive" onClick={handleCancel}>
            {t("admin.bookings.cancel.yes")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
