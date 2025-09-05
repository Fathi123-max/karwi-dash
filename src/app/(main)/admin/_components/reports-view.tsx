"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useBookingStore } from "@/stores/admin-dashboard/booking-store";
import { usePaymentStore } from "@/stores/admin-dashboard/payment-store";
import { useUserStore } from "@/stores/admin-dashboard/user-store";

type Report = {
  id: string;
  name: string;
  dateRange: string;
  generatedOn: string;
};

// Generate reports based on actual data
const generateReports = (
  bookings: { date: Date }[],
  payments: { created_at: string }[],
  t: ReturnType<typeof useTranslations>,
) => {
  // Get the date range from the data
  const bookingDates = bookings.map((b) => new Date(b.date));
  const paymentDates = payments.map((p) => new Date(p.created_at));
  const allDates = [...bookingDates, ...paymentDates];

  if (allDates.length === 0) {
    // Return mock reports if no data
    return [
      { id: "1", name: t("admin.reports.monthlyRevenue"), dateRange: "June 2024", generatedOn: "2024-07-01" },
      { id: "2", name: t("admin.reports.userGrowth"), dateRange: "Q2 2024", generatedOn: "2024-07-01" },
      { id: "3", name: t("admin.reports.washerPerformance"), dateRange: "June 2024", generatedOn: "2024-07-02" },
      { id: "4", name: t("admin.reports.bookingTrends"), dateRange: "May 2024", generatedOn: "2024-06-01" },
    ];
  }

  // Calculate date range from actual data
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

  const formatDateRange = (start: Date, end: Date) => {
    if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
      return `${start.toLocaleString("default", { month: "long" })} ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const dateRange = formatDateRange(minDate, maxDate);
  const generatedOn = new Date().toISOString().split("T")[0];

  return [
    { id: "1", name: t("admin.reports.monthlyRevenue"), dateRange, generatedOn },
    { id: "2", name: t("admin.reports.userGrowth"), dateRange, generatedOn },
    { id: "3", name: t("admin.reports.washerPerformance"), dateRange, generatedOn },
    { id: "4", name: t("admin.reports.bookingTrends"), dateRange, generatedOn },
  ];
};

const getColumns = (t: ReturnType<typeof useTranslations>): ColumnDef<Report>[] => [
  {
    accessorKey: "name",
    header: t("admin.reports.reportName"),
  },
  {
    accessorKey: "dateRange",
    header: t("admin.reports.dateRange"),
  },
  {
    accessorKey: "generatedOn",
    header: t("admin.reports.generatedOn"),
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        {t("admin.reports.download")}
      </Button>
    ),
  },
];

export function ReportsView() {
  const t = useTranslations("admin");
  const { bookings } = useBookingStore();
  const { payments } = usePaymentStore();
  const { users } = useUserStore();

  const reports = generateReports(bookings, payments, t);
  const columns = getColumns(t);
  const table = useDataTableInstance({
    data: reports,
    columns,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("reports.title")}</CardTitle>
        <CardDescription>{t("reports.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable table={table} columns={columns} />
      </CardContent>
    </Card>
  );
}
