"use client";

import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Service } from "@/types/database";

import { ServiceActions } from "./service-actions";

// Define a type that extends Service with branchName
type ServiceWithBranchName = Service & { branchName?: string; description?: string };

export const useServiceColumns = (): ColumnDef<ServiceWithBranchName>[] => {
  const isMobile = useIsMobile();
  const t = useTranslations("admin.services.columns");

  const columns = useMemo(() => {
    const baseColumns: ColumnDef<ServiceWithBranchName>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("name")} />,
      },
      {
        accessorKey: "description",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("description")} />,
        cell: ({ row }) => {
          const description = row.original.description;
          return description ? (
            <div className="max-w-xs truncate" title={description}>
              {description}
            </div>
          ) : (
            <span className="text-muted-foreground">{t("noDescription")}</span>
          );
        },
      },
      {
        accessorKey: "branchName",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("branch")} />,
        cell: ({ row }) => {
          const service = row.original;
          const branchName = service.is_global ? "Global" : service.branchName || "N/A";
          return (
            <div className="flex items-center gap-2">
              <span>{branchName}</span>
              {service.is_global && (
                <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs">Global</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("price")} />,
      },
      {
        accessorKey: "duration_min",
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("duration")} />,
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const service = row.original;
          return <ServiceActions service={service} />;
        },
      },
    ];

    if (isMobile) {
      return baseColumns.filter(
        (col) =>
          ("accessorKey" in col &&
            col.accessorKey !== "branchName" &&
            col.accessorKey !== "duration_min" &&
            col.accessorKey !== "description") ||
          ("id" in col && col.id === "actions"),
      );
    }

    return baseColumns;
  }, [isMobile, t]);

  return columns;
};
