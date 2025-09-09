"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { ReviewActions } from "@/app/(main)/admin/reviews/_components/review-actions";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useIsMobile } from "@/hooks/use-mobile";
import { type Review } from "@/types/database";
import { useTranslations } from "next-intl";

export const useReviewColumns = (): ColumnDef<Review>[] => {
  const isMobile = useIsMobile();
  const t = useTranslations("admin.reviews");

  const columns: ColumnDef<Review>[] = [
    {
      accessorKey: "bookingId",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("booking_id")} />,
    },
    {
      accessorKey: "userId",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("user")} />,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("rating")} />,
    },
    {
      accessorKey: "comment",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("comment")} />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const review = row.original;
        return <ReviewActions review={review} />;
      },
    },
  ];

  if (isMobile) {
    return columns.filter(
      (col) =>
        ("accessorKey" in col && col.accessorKey !== "bookingId" && col.accessorKey !== "userId") ||
        ("id" in col && col.id === "actions"),
    );
  }

  return columns;
};
