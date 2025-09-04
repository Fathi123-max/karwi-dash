"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

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
import { Payment } from "@/stores/admin-dashboard/payment-store";

export const usePaymentColumns = (): ColumnDef<Payment>[] => {
  const t = useTranslations("admin.payments");

  return [
    { accessorKey: "booking_id", header: t("bookingId") },
    {
      accessorKey: "amount",
      header: t("amount"),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.getValue("status");
        let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
        if (status === "succeeded") variant = "default";
        if (status === "failed") variant = "destructive";
        if (status === "pending") variant = "secondary";
        if (status === "refunded") variant = "secondary";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    { accessorKey: "provider", header: t("provider") },
    { accessorKey: "provider_txn_id", header: t("transactionId") },
    {
      accessorKey: "created_at",
      header: t("date"),
      cell: ({ row }) => {
        return new Date(row.getValue("created_at")).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                {t("copyId")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/bookings/${payment.booking_id}`}>{t("viewBooking")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/payments/${payment.id}`}>{t("viewPayment")}</Link>
              </DropdownMenuItem>
              {payment.status === "succeeded" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">{t("refund")}</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
