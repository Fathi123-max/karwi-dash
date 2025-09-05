"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

import { Washer } from "./types";
import { WasherActions } from "./washer-actions";

// We need to define the columns inside a component to use hooks properly
export const useWasherColumns = () => {
  const t = useTranslations("admin.washers");

  const columns: ColumnDef<Washer>[] = [
    {
      accessorKey: "name",
      header: t("table.name"),
    },
    {
      accessorKey: "branch",
      header: t("table.branch"),
    },
    {
      accessorKey: "status",
      header: t("table.status"),
      cell: ({ row }) => {
        const status = row.getValue("status");
        return <Badge variant={status === "active" ? "default" : "destructive"}>{t(status)}</Badge>;
      },
    },
    {
      accessorKey: "rating",
      header: t("table.rating"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const washer = row.original;
        return <WasherActions washer={washer} />;
      },
    },
  ];

  return columns;
};
