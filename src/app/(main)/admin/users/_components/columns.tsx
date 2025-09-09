"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { User } from "./types";
import { UserActions } from "./user-actions";

// We need to create a component for the columns to use the useTranslations hook
export const useUserColumns = (): ColumnDef<User>[] => {
  const t = useTranslations("admin.users.columns");

  return [
    {
      accessorKey: "name",
      header: t("name"),
    },
    {
      accessorKey: "phone",
      header: t("phone"),
    },
    {
      accessorKey: "cars",
      header: t("cars"),
    },
    {
      accessorKey: "bookings",
      header: t("bookings"),
    },
    {
      accessorKey: "totalWashes",
      header: t("totalWashes"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return <UserActions user={user} />;
      },
    },
  ];
};

// Fallback columns for cases where we can't use the hook
export const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "cars", header: "Cars" },
  { accessorKey: "bookings", header: "Bookings" },
  { accessorKey: "totalWashes", header: "Total Washes" },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return <UserActions user={user} />;
    },
  },
];
