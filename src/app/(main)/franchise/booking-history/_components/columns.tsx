"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { EnrichedBooking } from "@/app/(main)/franchise/utils/bookings";
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

import { BookingDetailsDialog } from "./booking-details-dialog";
import { UpdateStatusDialog } from "./update-status-dialog";

// Create a function that returns the columns with translations
export const getColumns = (t: (key: string) => string): ColumnDef<EnrichedBooking>[] => [
  {
    accessorKey: "id",
    header: t("bookingId"),
  },
  {
    accessorKey: "user",
    header: t("user"),
  },
  {
    accessorKey: "branch",
    header: t("branch"),
  },
  {
    accessorKey: "service",
    header: t("service"),
  },
  {
    accessorKey: "status",
    header: t("status"),
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
                  : "outline"
          }
          className={
            status === "completed"
              ? "bg-green-500"
              : status === "pending"
                ? "bg-yellow-500"
                : status === "in-progress"
                  ? "bg-blue-500"
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
    header: t("date"),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <span>{date.toLocaleString()}</span>;
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const booking = row.original;
      const [isDetailsOpen, setIsDetailsOpen] = useState(false);
      const [isUpdateOpen, setIsUpdateOpen] = useState(false);

      return (
        <>
          <BookingDetailsDialog booking={booking} isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} />
          <UpdateStatusDialog booking={booking} isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("openMenu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.id)}>
                {t("copyId")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>{t("viewDetails")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>{t("updateStatus")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
