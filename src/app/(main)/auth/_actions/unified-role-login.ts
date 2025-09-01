"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function unifiedRoleLogin(prevState: any, formData: FormData) {
  try {
    console.log("=== Admin Login Process Started ===");

    const supabase = await createClient();
    console.log("Supabase client created successfully");

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const requestedRole = formData.get("role") as string;

    console.log("Login attempt for:", { email, requestedRole });

    // Validate input
    if (!email || !password) {
      console.log("Validation failed: Email or password missing");
      return {
        message: "Email and password are required.",
      };
    }

    // Validate role
    if (requestedRole !== "admin" && requestedRole !== "franchise") {
      console.log("Validation failed: Invalid role", requestedRole);
      return {
        message: "Invalid role specified.",
      };
    }

    console.log("Attempting to sign in with email and password");
    // Attempt to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Sign in error:", signInError);
      console.log("Login failed: Invalid credentials for email", email);
      return {
        message: "Invalid email or password. Please try again.",
      };
    }

    console.log("Sign in successful, retrieving user data");
    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Get user error:", userError);
      console.log("Failed to retrieve user data after sign in");
      return {
        message: "Authentication failed. Please try again.",
      };
    }

    console.log("User authenticated:", { userId: user.id, email: user.email });

    // Check if the user is an admin
    console.log("Checking if user is an admin");
    const { data: adminProfile, error: adminError } = await supabase
      .from("admins")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (adminError) {
      console.error("Admin check error:", adminError);
      console.log("Database error when checking admin status for user", user.id);
      await supabase.auth.signOut();
      return {
        message: "Authentication error. Please try again.",
      };
    }

    if (!adminProfile) {
      console.log("User is not registered as an admin", user.id);
      await supabase.auth.signOut();
      return {
        message: "You are not authorized to access this application.",
      };
    }

    console.log("Admin profile found:", adminProfile);

    // Check if the admin is associated with a franchise
    console.log("Checking franchise association for admin", adminProfile.id);
    const { data: franchise, error: franchiseError } = await supabase
      .from("franchises")
      .select("id")
      .eq("admin_id", adminProfile.id)
      .limit(1)
      .single();

    // Handle the case where no franchise is found
    if (franchiseError && franchiseError.code !== "PGRST116") {
      // PGRST116 is "no rows found"
      console.error("Franchise check error:", franchiseError);
      console.log("Database error when checking franchise association");
      await supabase.auth.signOut();
      return {
        message: "System error. Please try again later.",
      };
    }

    console.log("Franchise check result:", { franchise, franchiseError });

    // Redirect based on requested role and actual franchise association
    revalidatePath("/", "layout");

    if (requestedRole === "franchise") {
      console.log("Franchise login requested");
      // Franchise login requested
      if (franchise) {
        // This admin manages a franchise, redirect to franchise dashboard
        console.log("Redirecting franchise admin to franchise dashboard");
        redirect("/franchise");
      } else {
        // This admin doesn't manage a franchise but tried to log in as franchise
        console.log("User is not a franchise admin, logging out");
        await supabase.auth.signOut();
        return {
          message: "You are registered as a general admin. Please use the admin login page.",
        };
      }
    } else {
      console.log("Admin login requested");
      // Admin login requested
      if (franchise) {
        // This admin manages a franchise, but tried to log in through admin login
        console.log("User is a franchise admin, logging out");
        await supabase.auth.signOut();
        return {
          message: "You are registered as a franchise admin. Please use the franchise login page.",
        };
      } else {
        // This is a general admin, redirect to the main admin dashboard
        console.log("Redirecting general admin to admin dashboard");
        redirect("/admin");
      }
    }
  } catch (error) {
    console.error("Unexpected error in unifiedRoleLogin:", error);
    // Check if it's a redirect error (which is expected when redirect is called)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // Re-throw redirect errors as they are expected
      console.log("Redirecting user (NEXT_REDIRECT)");
      throw error;
    }
    console.log("An unexpected error occurred during login");
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
