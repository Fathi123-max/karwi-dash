"use client";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useBookingStore } from "@/stores/admin-dashboard/booking-store";

import { BookingDetailsDialog } from "./booking-details-dialog";
import { CancelBookingDialog } from "./cancel-booking-dialog";
import { Booking as BookingType } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { UpdateStatusDialog } from "./update-status-dialog";

// Create columns with View Details functionality
const getColumns = (
  onViewDetails: (booking: BookingType) => void,
  onUpdateStatus: (booking: BookingType) => void,
  onCancelBooking: (booking: BookingType) => void,
  t: ReturnType<typeof useTranslations>,
): ColumnDef<BookingType>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("bookings.bookingId")} />,
  },
  {
    accessorKey: "user",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("bookings.user")} />,
  },
  {
    accessorKey: "branch",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("bookings.branch")} />,
  },
  {
    accessorKey: "service",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("bookings.service")} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("bookings.status.title")} />,
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "pending"
                ? "secondary"
                : status === "in-progress"
                  ? "default"
                  : status === "cancelled"
                    ? "destructive"
                    : "outline"
          }
          className={
            status === "completed"
              ? "bg-green-500"
              : status === "pending"
                ? "bg-yellow-500"
                : status === "in-progress"
                  ? "bg-blue-500"
                  : status === "cancelled"
                    ? "bg-red-500"
                    : "bg-gray-500"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t("bookings.date")} />,
    cell: ({ row }) => format(row.getValue("date"), "MMM d, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.id)}>
              {t("bookings.copyId")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(booking)}>{t("bookings.viewDetails")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(booking)}>{t("bookings.updateStatus")}</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onCancelBooking(booking)}
              disabled={booking.status === "cancelled"}
            >
              {t("bookings.cancelBooking")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function RecentBookingsTable() {
  const t = useTranslations("admin");
  const { bookings, updateBookingStatus, cancelBooking } = useBookingStore();
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handleViewDetails = (booking: BookingType) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (booking: BookingType) => {
    setSelectedBooking(booking);
    setIsUpdateDialogOpen(true);
  };

  const handleCancelBooking = (booking: BookingType) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus as BookingType["status"]);
      toast.success(t("bookings.updateSuccess"));
    } catch (error) {
      toast.error(t("bookings.updateError"));
      console.error("Error updating booking status:", error);
    }
  };

  const handleBookingCancellation = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success(t("bookings.cancelSuccess"));
    } catch (error) {
      toast.error(t("bookings.cancelError"));
      console.error("Error cancelling booking:", error);
    }
  };

  const columns = getColumns(handleViewDetails, handleUpdateStatus, handleCancelBooking, t);

  const table = useDataTableInstance({
    data: bookings,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("bookings.recent.title")}</CardTitle>
        <CardDescription>{t("bookings.recent.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex size-full flex-col gap-4">
        <DataTableToolbar
          table={table}
          filterColumn="user"
          facetedFilters={[
            {
              columnId: "status",
              title: t("bookings.status.title"),
              options: [
                { label: t("bookings.status.pending"), value: "pending" },
                { label: t("bookings.status.inProgress"), value: "in-progress" },
                { label: t("bookings.status.completed"), value: "completed" },
                { label: t("bookings.status.scheduled"), value: "scheduled" },
                { label: t("bookings.status.cancelled"), value: "cancelled" },
              ],
            },
          ]}
        />
        <div className="overflow-hidden rounded-md border">
          <DataTable table={table} columns={columns} />
        </div>
        <DataTablePagination table={table} />
        <BookingDetailsDialog booking={selectedBooking} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
        <UpdateStatusDialog
          bookingId={selectedBooking?.id ?? ""}
          currentStatus={selectedBooking?.status ?? "pending"}
          isOpen={isUpdateDialogOpen}
          onClose={() => setIsUpdateDialogOpen(false)}
          onUpdateStatus={handleStatusUpdate}
        />
        <CancelBookingDialog
          bookingId={selectedBooking?.id ?? ""}
          isOpen={isCancelDialogOpen}
          onClose={() => setIsCancelDialogOpen(false)}
          onConfirm={handleBookingCancellation}
        />
      </CardContent>
    </Card>
  );
}
