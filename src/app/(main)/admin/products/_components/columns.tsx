"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProductStore } from "@/stores/admin-dashboard/product-store";
import { Product } from "@/types/supabase";

type ProductWithCategoryName = Product & {
  categoryName: string;
};

interface ProductColumnsProps {
  onEdit: (product: ProductWithCategoryName) => void;
}

export function useProductColumns({ onEdit }: ProductColumnsProps): ColumnDef<ProductWithCategoryName>[] {
  const t = useTranslations("admin.products");
  const handleDelete = (productId: string) => {
    useProductStore.getState().deleteProduct(productId);
  };

  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("columns.name")} />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "categoryName",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("columns.category")} />,
      cell: ({ row }) => <div>{row.getValue("categoryName")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("columns.price")} />,
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);

        return <div className="font-medium">{formatted}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "stock_quantity",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("columns.stock")} />,
      cell: ({ row }) => <div>{row.getValue("stock_quantity")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t("columns.actions")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("columns.actions")}</DropdownMenuLabel>
                <DropdownMenuItem
                  onSelect={() => {
                    onEdit(product);
                  }}
                >
                  {t("actions.edit")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDelete(product.id)}>{t("actions.delete")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
