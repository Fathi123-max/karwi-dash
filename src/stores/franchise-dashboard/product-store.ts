import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { getCurrentUserFranchiseId } from "@/server/server-actions";
import { Product, ProductOrder, OrderItemWithProduct } from "@/types/supabase";

export type { Product, ProductOrder, OrderItemWithProduct as OrderItem };

type FranchiseProductState = {
  products: Product[];
  orders: ProductOrder[];
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  checkStockAvailability: (productId: string, quantity: number) => Promise<boolean>;
  placeOrder: (orderItem: { product_id: string; quantity: number; price_per_unit: number }) => Promise<void>;
};

const supabase = createClient();

export const useFranchiseProductStore = create<FranchiseProductState>((set, get) => ({
  products: [],
  orders: [],
  fetchProducts: async () => {
    const { data, error } = await supabase.from("products").select("*").order("name");

    if (error) {
      console.error("Error fetching products:", error);
      return;
    }

    set({ products: data });
  },
  fetchOrders: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      console.error("Franchise ID not found for current user");
      return;
    }

    const { data, error } = await supabase
      .from("product_orders")
      .select(
        `
        *,
        order_items(*, product:products(*))
      `,
      )
      .eq("franchise_id", franchiseId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }

    set({ orders: data });
  },
  checkStockAvailability: async (productId: string, quantity: number) => {
    const { data, error } = await supabase.from("products").select("stock_quantity").eq("id", productId).single();

    if (error) {
      console.error("Error fetching product:", error);
      return false;
    }

    return data.stock_quantity >= quantity;
  },
  placeOrder: async (orderItem) => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Check if there's sufficient stock
    const isAvailable = await get().checkStockAvailability(orderItem.product_id, orderItem.quantity);
    if (!isAvailable) {
      throw new Error("Insufficient stock for this product");
    }

    // Start a Supabase transaction
    const { data: orderData, error: orderError } = await supabase
      .from("product_orders")
      .insert({
        franchise_id: franchiseId,
        total_amount: orderItem.quantity * orderItem.price_per_unit,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw orderError;
    }

    // Add the order item
    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: orderData.id,
      product_id: orderItem.product_id,
      quantity: orderItem.quantity,
      price_per_unit: orderItem.price_per_unit,
    });

    if (itemError) {
      console.error("Error adding order item:", itemError);
      throw itemError;
    }

    // Refresh products and orders
    await get().fetchProducts();
    await get().fetchOrders();
  },
}));
