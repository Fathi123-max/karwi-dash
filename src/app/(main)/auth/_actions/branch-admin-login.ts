"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function branchAdminLogin(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    if (!email || !password) {
      return {
        message: "Email and password are required.",
      };
    }

    // Attempt to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Sign in error:", signInError);
      return {
        message: "Invalid email or password. Please try again.",
      };
    }

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Get user error:", userError);
      return {
        message: "Authentication failed. Please try again.",
      };
    }

    // Check if the user is an admin with branch role
    const { data: adminProfile, error: adminError } = await supabase
      .from("admins")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (adminError) {
      console.error("Admin check error:", adminError);
      await supabase.auth.signOut();
      return {
        message: "Authentication error. Please try again.",
      };
    }

    // Check if admin has branch role
    if (!adminProfile || adminProfile.role !== "branch") {
      await supabase.auth.signOut();
      return {
        message: "You are not authorized to access this application.",
      };
    }

    // Redirect to branch dashboard
    revalidatePath("/", "layout");
    redirect("/branch");
  } catch (error) {
    console.error("Unexpected error in branchAdminLogin:", error);
    // Check if it's a redirect error (which is expected when redirect is called)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // Re-throw redirect errors as they are expected
      throw error;
    }
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
