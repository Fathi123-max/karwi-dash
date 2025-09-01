import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to create Supabase client",
      },
      { status: 500 },
    );
  }

  try {
    // Test database connection
    const { data: admins, error: adminsError } = await supabase.from("admins").select("id").limit(1);

    if (adminsError) {
      return NextResponse.json(
        {
          success: false,
          error: adminsError.message,
          details: "Database query failed for admins",
        },
        { status: 500 },
      );
    }

    // Check for products
    const { data: products, error: productsError } = await supabase.from("products").select("*");

    if (productsError) {
      return NextResponse.json(
        {
          success: false,
          error: productsError.message,
          details: "Database query failed for products",
        },
        { status: 500 },
      );
    }

    // Test storage connection
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

    if (storageError) {
      return NextResponse.json(
        {
          success: false,
          error: storageError.message,
          details: "Storage connection failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      admins: admins,
      products: products,
      storage: buckets,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
