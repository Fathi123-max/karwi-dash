"use server";

import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

/**
 * Get the branch ID for the currently logged-in branch admin
 * @returns The branch ID or null if the user is not a branch admin
 */
export async function getCurrentBranchAdminBranchId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // We're just reading, so we don't need to set cookies
          },
        },
      },
    );

    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return null;
    }

    if (!session?.user) {
      console.log("No session or user found");
      return null;
    }

    console.log("Current user ID:", session.user.id);

    // Get the branch ID by finding the branch_admin entry for this user
    const { data, error } = await supabase
      .from("branch_admins")
      .select("branch_id")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching branch admin data:", error);
      return null;
    }

    console.log("Branch admin data found:", data);

    return data?.branch_id ?? null;
  } catch (error) {
    console.error("Error getting branch admin branch ID:", error);
    return null;
  }
}
