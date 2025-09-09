"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

import { FranchiseActions } from "./franchise-actions";
import { Franchise } from "./types";

export const columns: ColumnDef<Franchise>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      const t = useTranslations("admin.franchises.table");
      return t("name");
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const t = useTranslations("admin.franchises.table");
      return t("status");
    },
    cell: ({ row }) => {
      const t = useTranslations("admin.franchises.table");
      const { status } = row.original;

      return (
        <Badge variant={status === "active" ? "default" : "destructive"}>
          {status === "active" ? t("active") : t("inactive")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "branches",
    header: ({ column }) => {
      const t = useTranslations("admin.franchises.table");
      return t("branches");
    },
  },
  {
    accessorKey: "washers",
    header: ({ column }) => {
      const t = useTranslations("admin.franchises.table");
      return t("washers");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const franchise = row.original;
      return <FranchiseActions franchise={franchise} />;
    },
  },
];
