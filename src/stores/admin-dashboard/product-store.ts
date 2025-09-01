import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/supabase";

const supabase = createClient();

type ProductState = {
  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  fetchProducts: async () => {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return;
    }

    set({ products: data });
  },
  addProduct: async (product) => {
    const { data, error } = await supabase.from("products").insert(product).select().single();

    if (error) {
      console.error("Error adding product:", error);
      throw error;
    }

    set((state) => ({ products: [data, ...state.products] }));
  },
  updateProduct: async (product) => {
    const { data, error } = await supabase
      .from("products")
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        category_id: product.category_id,
        pictures: product.pictures,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }

    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? data : p)),
    }));
  },
  deleteProduct: async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }

    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },
}));
