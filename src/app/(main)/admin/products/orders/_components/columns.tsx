"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductOrderWithItems } from "@/stores/admin-dashboard/product-order-store";

interface OrderColumnsProps {
  onViewDetails: (orderId: string) => void;
}

export function useOrderColumns({ onViewDetails }: OrderColumnsProps): ColumnDef<ProductOrderWithItems>[] {
  const t = useTranslations("admin.products");
  const statusT = useTranslations("admin.products.statuses");

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("columns.orderId")} />,
      cell: ({ row }) => <div className="font-medium">{row.original.id.slice(0, 8)}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "franchise",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("columns.franchise")} />,
      cell: ({ row }) => <div className="font-medium">{row.original.franchise?.name || "Unknown"}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "total_amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("columns.total")} />,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("columns.status")} />,
      cell: ({ row }) => {
        const status = row.getValue("status");

        const statusColors: Record<string, string> = {
          pending: "bg-yellow-100 text-yellow-800",
          processing: "bg-blue-100 text-blue-800",
          shipped: "bg-indigo-100 text-indigo-800",
          delivered: "bg-green-100 text-green-800",
          cancelled: "bg-red-100 text-red-800",
        };

        return (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
          >
            {statusT(status) || status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("columns.date")} />,
      cell: ({ row }) => <div>{formatDate(row.getValue("created_at"))}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t("columns.actions")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("columns.actions")}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onViewDetails(order.id)}>{t("actions.viewDetails")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t("actions.updateStatus")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
