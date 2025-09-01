"use client";

import { CategoryList } from "./_components/category-list";

export default function ProductCategoriesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Product Categories</h2>
      <CategoryList />
    </div>
  );
}
