import { createClient } from "@/lib/supabase/server";

/**
 * Check if a user is an admin (for server components)
 * @param userId The user ID to check
 * @returns true if user is an admin, false otherwise
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    console.log("Checking admin status for user:", userId);
    const supabase = await createClient();

    const { data, error } = await supabase.from("admins").select("id").eq("id", userId).single();

    if (error) {
      console.error("Error checking admin status:", error);
      console.log("Admin check failed for user:", userId);
      return false;
    }

    const isAdmin = !!data;
    console.log("Admin check result for user:", { userId, isAdmin });
    return isAdmin;
  } catch (error) {
    console.error("Unexpected error checking admin status:", error);
    console.log("Unexpected error during admin check for user:", userId);
    return false;
  }
}
