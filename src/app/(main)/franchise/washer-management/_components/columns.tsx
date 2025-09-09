"use client";

import { ColumnDef } from "@tanstack/react-table";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { WasherWithBranch } from "@/stores/franchise-dashboard/user-store";
import { Washer } from "@/types/franchise";

import { WasherActions } from "./washer-actions";

// We'll create a function that returns the columns with translations
export const getColumns = (t: (key: string) => string): ColumnDef<WasherWithBranch>[] => [
  {
    accessorKey: "name",
    header: t("name"),
  },
  {
    id: "branch", // Use a simple, unique ID for the column
    header: t("branch"),
    accessorFn: (row) => row.branches?.name, // Use a function to get the nested value
    cell: ({ row }) => {
      const branchName = row.original.branches?.name;
      return branchName ?? <span className="text-muted-foreground">{t("unassigned")}</span>;
    },
  },
  {
    accessorKey: "status",
    header: t("status"),
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <Badge variant={status === "active" ? "default" : "destructive"}>{status}</Badge>;
    },
  },
  {
    accessorKey: "rating",
    header: t("rating"),
    cell: ({ row }) => {
      const rating = row.original.rating;
      return rating ? rating.toFixed(2) : t("na");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const washer = row.original;
      return <WasherActions washer={washer} />;
    },
  },
];
