"use server";

import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import { Product, ProductCategory, ProductOrder, OrderItem } from "@/types/supabase";

// Admin actions for product management
export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase.from("products").insert(product).select().single();

  if (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }

  return data;
}

export async function updateProduct(product: Product) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
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
    throw new Error("Failed to update product");
  }

  return data;
}

export async function deleteProduct(id: string) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }

  return { success: true };
}

// Admin actions for category management
export async function createCategory(category: Omit<ProductCategory, "id" | "created_at" | "updated_at">) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase.from("product_categories").insert(category).select().single();

  if (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }

  return data;
}

export async function updateCategory(category: ProductCategory) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
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
    throw new Error("Failed to update category");
  }

  return data;
}

export async function deleteCategory(id: string) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await supabase.from("product_categories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }

  return { success: true };
}

// Franchise actions for ordering products
export async function placeProductOrder(
  franchiseId: string,
  items: { product_id: string; quantity: number; price_per_unit: number }[],
) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price_per_unit, 0);

  // Create the order
  const { data: orderData, error: orderError } = await supabase
    .from("product_orders")
    .insert({
      franchise_id: franchiseId,
      total_amount: totalAmount,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw new Error("Failed to create order");
  }

  // Add order items
  const orderItems = items.map((item) => ({
    order_id: orderData.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_per_unit: item.price_per_unit,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    console.error("Error adding order items:", itemsError);
    throw new Error("Failed to add order items");
  }

  // Update product stock quantities
  for (const item of items) {
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.product_id)
      .single();

    if (productError) {
      console.error("Error fetching product:", productError);
      throw new Error("Failed to fetch product");
    }

    const newStockQuantity = productData.stock_quantity - item.quantity;

    if (newStockQuantity < 0) {
      throw new Error("Insufficient stock for product " + item.product_id);
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({ stock_quantity: newStockQuantity })
      .eq("id", item.product_id);

    if (updateError) {
      console.error("Error updating product stock:", updateError);
      throw new Error("Failed to update product stock");
    }
  }

  return orderData;
}

// Admin/franchise actions for updating order status
export async function updateOrderStatus(orderId: string, status: ProductOrder["status"]) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase
    .from("product_orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }

  return data;
}
