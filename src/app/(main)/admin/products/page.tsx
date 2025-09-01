"use client";

import Link from "next/link";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ProductList } from "./_components/product-list";

export default function ProductsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Link href="/admin/products/orders">
          <Button variant="outline">
            <ShoppingCart className="mr-2 h-4 w-4" />
            View Orders
          </Button>
        </Link>
      </div>
      <ProductList />
    </div>
  );
}
