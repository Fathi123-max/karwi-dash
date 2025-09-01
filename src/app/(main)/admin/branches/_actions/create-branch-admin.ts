"use server";

import { createClient } from "@/lib/supabase/server";

export async function createBranchAdminUser(email: string, password: string, branchId: string) {
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

    // Link the admin user to the branch
    const { error: linkError } = await supabase.from("branch_admins").insert([
      {
        user_id: authData.user.id,
        branch_id: branchId,
      },
    ]);

    if (linkError) {
      console.error("Error linking admin user to branch:", linkError);
      return { success: false, error: linkError.message };
    }

    return { success: true, userId: authData.user.id };
  } catch (error) {
    console.error("Unexpected error creating admin user:", error);
    return { success: false, error: (error as Error).message };
  }
}
