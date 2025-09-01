import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { ProductOrder, Franchise, OrderItemWithProduct } from "@/types/supabase";

const supabase = createClient();

export type ProductOrderWithItems = ProductOrder & {
  order_items: OrderItemWithProduct[];
  franchise: Franchise;
};

type AdminProductOrderState = {
  orders: ProductOrderWithItems[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: ProductOrder["status"]) => Promise<ProductOrderWithItems>;
  getOrderDetails: (orderId: string) => Promise<ProductOrderWithItems | null>;
};

export const useAdminProductOrderStore = create<AdminProductOrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  fetchOrders: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from("product_orders")
        .select(
          `
          *,
          order_items(*, product:products(*)),
          franchise:franchises(*)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Type assertion since we know the structure from the join
      const ordersWithDetails = data as ProductOrderWithItems[];

      set({ orders: ordersWithDetails, loading: false });
    } catch (error) {
      console.error("Error fetching product orders:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch orders",
        loading: false,
      });
    }
  },
  updateOrderStatus: async (orderId: string, status: ProductOrder["status"]) => {
    try {
      const { data, error } = await supabase
        .from("product_orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .select(
          `
          *,
          order_items(*, product:products(*)),
          franchise:franchises(*)
        `,
        )
        .single();

      if (error) {
        throw error;
      }

      // Update the order in the store
      const updatedOrder = data as ProductOrderWithItems;
      set((state) => ({
        orders: state.orders.map((order) => (order.id === orderId ? updatedOrder : order)),
      }));

      return updatedOrder;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },
  getOrderDetails: async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("product_orders")
        .select(
          `
          *,
          order_items(*, product:products(*)),
          franchise:franchises(*)
        `,
        )
        .eq("id", orderId)
        .single();

      if (error) {
        throw error;
      }

      return data as ProductOrderWithItems;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return null;
    }
  },
}));
