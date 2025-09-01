import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { ProductCategory } from "@/types/supabase";

const supabase = createClient();

type ProductCategoryState = {
  categories: ProductCategory[];
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<ProductCategory, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateCategory: (category: ProductCategory) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useProductCategoryStore = create<ProductCategoryState>((set, get) => ({
  categories: [],
  fetchCategories: async () => {
    const { data, error } = await supabase.from("product_categories").select("*").order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }

    set({ categories: data });
  },
  addCategory: async (category) => {
    const { data, error } = await supabase.from("product_categories").insert(category).select().single();

    if (error) {
      console.error("Error adding category:", error);
      throw error;
    }

    set((state) => ({ categories: [...state.categories, data] }));
  },
  updateCategory: async (category) => {
    const { data, error } = await supabase
      .from("product_categories")
      .update({
        name: category.name,
        description: category.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", category.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      throw error;
    }

    set((state) => ({
      categories: state.categories.map((c) => (c.id === category.id ? data : c)),
    }));
  },
  deleteCategory: async (id) => {
    const { error } = await supabase.from("product_categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      throw error;
    }

    set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
  },
}));
