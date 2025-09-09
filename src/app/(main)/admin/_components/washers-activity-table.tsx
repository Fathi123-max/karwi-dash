"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Washer } from "@/app/(main)/admin/washers/_components/types";
import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

const getColumns = (t: ReturnType<typeof useTranslations>): ColumnDef<Washer>[] => [
  {
    accessorKey: "name",
    header: t("washers.name"),
  },
  {
    accessorKey: "branch",
    header: t("washers.branch"),
  },
  {
    accessorKey: "status",
    header: t("washers.status"),
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <Badge variant={status === "active" ? "default" : "destructive"}>{status}</Badge>;
    },
  },
  {
    accessorKey: "rating",
    header: t("washers.rating"),
  },
];

export function WashersActivityTable() {
  const t = useTranslations("admin");
  const { washers } = useWasherStore();
  const columns = getColumns(t);
  const table = useDataTableInstance({
    data: washers,
    columns,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("washersActivity.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable table={table} columns={columns} />
      </CardContent>
    </Card>
  );
}
