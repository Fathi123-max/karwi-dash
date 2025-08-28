"use server";

import { createClient } from "@/lib/supabase/server";

export async function testServerSideConnection() {
  try {
    console.log("Testing server-side Supabase connection...");

    const supabase = await createClient();

    // Test database connection with a simple query
    const { data, error } = await supabase.from("admins").select("id").limit(1);

    if (error) {
      console.error("Database query error:", error);
      return { success: false, error: error.message };
    }

    console.log("Server-side Supabase connection successful!");
    return { success: true, data };
  } catch (error) {
    console.error("Server-side connection error:", error);
    return { success: false, error: "Failed to test Supabase connection" };
  }
}
