"use client";

import { useEffect, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Download, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useFranchiseAnalyticsStore } from "@/stores/franchise-dashboard/analytics-store";

type Report = {
  id: string;
  name: string;
  dateRange: string;
  generatedOn: string;
  type: string;
};

const generateReports = (
  bookings: any[],
  services: any[],
  washers: any[],
  branches: any[],
  t: (key: string) => string,
) => {
  // Calculate date range from data
  const bookingDates = bookings.filter((b) => b.scheduled_at).map((b) => new Date(b.scheduled_at));

  if (bookingDates.length === 0) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return [
      {
        id: "1",
        name: t("monthlyBookingsReport"),
        dateRange: `${thirtyDaysAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`,
        generatedOn: today.toISOString().split("T")[0],
        type: "bookings",
      },
      {
        id: "2",
        name: t("washerPerformanceReport"),
        dateRange: `${thirtyDaysAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`,
        generatedOn: today.toISOString().split("T")[0],
        type: "washers",
      },
      {
        id: "3",
        name: t("servicePopularityReport"),
        dateRange: `${thirtyDaysAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`,
        generatedOn: today.toISOString().split("T")[0],
        type: "services",
      },
      {
        id: "4",
        name: t("branchRevenueReport"),
        dateRange: `${thirtyDaysAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`,
        generatedOn: today.toISOString().split("T")[0],
        type: "branches",
      },
    ];
  }

  const minDate = new Date(Math.min(...bookingDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...bookingDates.map((d) => d.getTime())));

  const formatDateRange = (start: Date, end: Date) => {
    if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
      return `${start.toLocaleString("default", { month: "long" })} ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const dateRange = formatDateRange(minDate, maxDate);
  const generatedOn = new Date().toISOString().split("T")[0];

  return [
    {
      id: "1",
      name: t("monthlyBookingsReport"),
      dateRange,
      generatedOn,
      type: "bookings",
    },
    {
      id: "2",
      name: t("washerPerformanceReport"),
      dateRange,
      generatedOn,
      type: "washers",
    },
    {
      id: "3",
      name: t("servicePopularityReport"),
      dateRange,
      generatedOn,
      type: "services",
    },
    {
      id: "4",
      name: t("branchRevenueReport"),
      dateRange,
      generatedOn,
      type: "branches",
    },
  ];
};

const getColumns = (t: (key: string) => string): ColumnDef<Report>[] => [
  {
    accessorKey: "name",
    header: t("reportName"),
  },
  {
    accessorKey: "dateRange",
    header: t("dateRange"),
  },
  {
    accessorKey: "generatedOn",
    header: t("generatedOn"),
  },
  {
    accessorKey: "type",
    header: t("type"),
    cell: ({ row }) => {
      const type = row.getValue("type");
      const typeLabels: Record<string, string> = {
        bookings: t("bookings"),
        washers: t("washers"),
        services: t("services"),
        branches: t("branches"),
      };
      return <span className="capitalize">{typeLabels[type as string] ?? type}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original;
      return (
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          {t("download")}
        </Button>
      );
    },
  },
];

export function FranchiseReportsView() {
  const t = useTranslations("franchise.reports");
  const { bookings, services, washers, branches, fetchAllData } = useFranchiseAnalyticsStore();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    setReports(generateReports(bookings, services, washers, branches, t));
  }, [bookings, services, washers, branches, t]);

  const columns = getColumns(t);
  const table = useDataTableInstance({
    data: reports,
    columns,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable table={table} columns={columns} />
      </CardContent>
    </Card>
  );
}
