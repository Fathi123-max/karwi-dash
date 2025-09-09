"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { updateBookingStatus } from "@/server/server-actions";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";
import { Booking } from "@/types/franchise";

const formSchema = z.object({
  status: z.enum(["pending", "in-progress", "completed", "cancelled"]),
});

interface BranchBookingManagementProps {
  branchId: string;
}

export function BranchBookingManagement({ branchId }: BranchBookingManagementProps) {
  const t = useTranslations("franchise.branches.bookings");
  const { bookings, services, washers, updateBooking } = useFranchiseDashboardStore();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter bookings for this branch
  const branchBookings = bookings.filter((booking) => booking.branch_id === branchId);

  // Enrich bookings with service and washer names
  const enrichedBookings = branchBookings.map((booking: Booking) => {
    const service = services.find((s) => s.id === booking.service_id);
    const washer = washers.find((w) => w.id === booking.washer_id);

    return {
      ...booking,
      service_name: service?.name ?? t("unknownService"),
      washer_name: washer?.name ?? t("unassigned"),
    };
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: selectedBooking?.status as "pending" | "in-progress" | "completed" | "cancelled" | undefined,
    },
  });

  useEffect(() => {
    if (selectedBooking) {
      form.setValue("status", selectedBooking.status as any);
    }
  }, [selectedBooking, form]);

  const handleUpdateStatus = async (values: z.infer<typeof formSchema>) => {
    if (!selectedBooking) return;

    try {
      const updatedBooking = await updateBookingStatus(selectedBooking.id, values.status);
      if (updatedBooking) {
        updateBooking(updatedBooking[0]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: t("bookingId"),
    },
    {
      accessorKey: "service_name",
      header: t("service"),
    },
    {
      accessorKey: "washer_name",
      header: t("washer"),
    },
    {
      accessorKey: "scheduled_at",
      header: t("date"),
      cell: ({ row }) => {
        const date = new Date(row.getValue("scheduled_at"));
        return <span>{date.toLocaleString()}</span>;
      },
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
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
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
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setSelectedBooking(booking);
                    setIsDialogOpen(true);
                  }}
                >
                  {t("updateStatus")}
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useDataTableInstance({
    data: enrichedBookings,
    columns,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("branchBookings")}</h3>
        <p className="text-muted-foreground text-sm">
          {branchBookings.length} {t("booking", { count: branchBookings.length })}
        </p>
      </div>

      <DataTable table={table} columns={columns} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("updateBookingStatus")}</DialogTitle>
            <DialogDescription>{t("updateStatusForBooking", { id: selectedBooking?.id })}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateStatus)} className="space-y-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("status")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">{t("pending")}</SelectItem>
                        <SelectItem value="in-progress">{t("inProgress")}</SelectItem>
                        <SelectItem value="completed">{t("completed")}</SelectItem>
                        <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit">{t("saveChanges")}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
