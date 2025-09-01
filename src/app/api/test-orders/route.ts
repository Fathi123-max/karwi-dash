import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const supabase = createClient();

    // Test the exact query from the product order store
    const { data, error } = await supabase
      .from("product_orders")
      .select(
        `
        *,
        order_items(*),
        franchise:franchises(*)
        `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Found ${data.length} orders`,
      orders: data.slice(0, 3), // Return first 3 orders
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
