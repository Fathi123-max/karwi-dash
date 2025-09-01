"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function branchAdminLogout() {
  const supabase = await createClient();

  // Sign out the user
  await supabase.auth.signOut();

  // Revalidate the home page
  revalidatePath("/", "layout");

  // Redirect to the login page
  redirect("/auth/v2/login");
}
