/* eslint-disable no-duplicate-imports */
"use client";

import * as React from "react";
import { useMemo, useState } from "react";

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Download, Plus } from "lucide-react";

import { DataTableToolbar } from "@/app/(main)/admin/_components/data-table-toolbar";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { exportToCSV } from "@/lib/export-utils";
import { useProductCategoryStore } from "@/stores/admin-dashboard/product-category-store";
import { useProductStore } from "@/stores/admin-dashboard/product-store";

import { CategoryManager } from "./category-manager";
import { useProductColumns } from "./columns";
import { ProductWithCategoryName } from "./columns";
import { ProductForm } from "./product-form";

export function ProductList() {
  const products = useProductStore((state) => state.products);
  const { categories } = useProductCategoryStore();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);

  // Edit modal states
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductWithCategoryName | null>(null);

  // Category manager state
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  const handleEdit = (product: ProductWithCategoryName) => {
    setProductToEdit(product);
    setEditModalOpen(true);
  };

  const columns = useProductColumns({
    onEdit: handleEdit,
  });

  // Fetch products and categories on component mount
  React.useEffect(() => {
    useProductStore.getState().fetchProducts();
    useProductCategoryStore.getState().fetchCategories();
  }, []);

  // Memoize products with category names to prevent infinite re-renders
  const productsWithCategoryNames = useMemo(() => {
    return products.map((product) => {
      const category = categories.find((c) => c.id === product.category_id);
      return {
        ...product,
        categoryName: category ? category.name : "Uncategorized",
      };
    });
  }, [products, categories]);

  const table = useReactTable({
    data: productsWithCategoryNames,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Memoize category names for faceted filter
  const categoryNames = useMemo(() => {
    const names = categories.map((category) => category.name);
    names.push("Uncategorized");
    return Array.from(new Set(names));
  }, [categories]);

  const facetedFilters = useMemo(
    () => [
      {
        columnId: "categoryName",
        title: "Category",
        options: categoryNames.map((name) => ({ label: name, value: name })),
      },
    ],
    [categoryNames],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <DataTableToolbar table={table} filterColumn="name" facetedFilters={facetedFilters} />
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsCategoryManagerOpen(true)}>
            Manage Categories
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Product</DialogTitle>
              </DialogHeader>
              <ProductForm onClose={() => setCreateModalOpen(false)} />
            </DialogContent>
          </Dialog>
          <DataTableViewOptions table={table} />
          <Button variant="outline" size="sm" onClick={() => exportToCSV(table, "products.csv")}>
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Export</span>
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <DataTable table={table} columns={columns} />
      </div>
      <DataTablePagination table={table} />
      <CategoryManager open={isCategoryManagerOpen} onOpenChange={setIsCategoryManagerOpen} />
      {/* Edit Product Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) setProductToEdit(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {productToEdit && (
            <ProductForm
              product={productToEdit}
              onClose={() => {
                setEditModalOpen(false);
                setProductToEdit(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
