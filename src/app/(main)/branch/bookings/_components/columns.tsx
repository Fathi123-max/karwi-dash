"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/franchise";

export const columns: ColumnDef<Booking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Booking ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id").slice(0, 8)}</div>,
  },
  {
    accessorKey: "scheduled_at",
    header: "Scheduled Time",
    cell: ({ row }) => <div>{format(new Date(row.getValue("scheduled_at")), "PPpp")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge
          className={cn({
            "bg-green-100 text-green-800": status === "completed",
            "bg-yellow-100 text-yellow-800": status === "pending",
            "bg-blue-100 text-blue-800": status === "confirmed",
            "bg-red-100 text-red-800": status === "cancelled",
          })}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "service_id",
    header: "Service",
    cell: ({ row }) => {
      // In a real implementation, you would map this to the actual service name
      return <div>Service #{row.getValue("service_id").slice(0, 8)}</div>;
    },
  },
  {
    accessorKey: "washer_id",
    header: "Washer",
    cell: ({ row }) => {
      // In a real implementation, you would map this to the actual washer name
      return <div>Washer #{row.getValue("washer_id").slice(0, 8)}</div>;
    },
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.id)}>
              Copy booking ID
            </DropdownMenuItem>
            <DropdownMenuItem>View booking details</DropdownMenuItem>
            <DropdownMenuItem>Update status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
