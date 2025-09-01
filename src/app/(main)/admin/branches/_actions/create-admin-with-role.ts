"use server";

import { createClient } from "@/lib/supabase/server";

export async function createAdminUserWithRole(
  email: string,
  password: string,
  role: "general" | "franchise" | "branch",
  associatedId?: string, // franchise_id for franchise admins, branch_id for branch admins
) {
  try {
    const supabase = await createClient();

    // Create the admin user in Supabase auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
    });

    if (authError) {
      console.error("Error creating admin user:", authError);
      return { success: false, error: authError.message };
    }

    // Create entry in admins table with role
    const { error: adminError } = await supabase.from("admins").insert([
      {
        id: authData.user.id,
        email: email,
        role: role,
        name: email.split("@")[0], // Default name to email prefix
      },
    ]);

    if (adminError) {
      console.error("Error creating admin record:", adminError);
      return { success: false, error: adminError.message };
    }

    // If this is a franchise admin, link to franchise
    if (role === "franchise" && associatedId) {
      const { error: franchiseError } = await supabase
        .from("franchises")
        .update({ admin_id: authData.user.id })
        .eq("id", associatedId);

      if (franchiseError) {
        console.error("Error linking franchise admin:", franchiseError);
        return { success: false, error: franchiseError.message };
      }
    }

    // If this is a branch admin, link to branch
    if (role === "branch" && associatedId) {
      const { error: branchError } = await supabase
        .from("branches")
        .update({ admin_id: authData.user.id })
        .eq("id", associatedId);

      if (branchError) {
        console.error("Error linking branch admin:", branchError);
        return { success: false, error: branchError.message };
      }
    }

    return { success: true, userId: authData.user.id };
  } catch (error) {
    console.error("Unexpected error creating admin user:", error);
    return { success: false, error: (error as Error).message };
  }
}
