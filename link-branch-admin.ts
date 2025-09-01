import * as fs from "fs";
import * as path from "path";

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Read .env.local directly
const envPath = path.resolve(__dirname, ".env.local");
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

async function linkBranchAdmin() {
  try {
    // Create Supabase client with service role key for admin access
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    console.log("Finding branches with null admin_id...");
    const { data: branches, error: fetchError } = await supabase
      .from("branches")
      .select("id, name, admin_id")
      .is("admin_id", null)
      .limit(1);

    if (fetchError) {
      console.log("Error fetching branches:", fetchError.message);
      return;
    }

    console.log("Branches with null admin_id:", branches?.length || 0);

    if (branches && branches.length > 0) {
      const branch = branches[0];
      console.log("Linking branch:", branch.name);

      // Link the branch to the admin
      const { error: updateError } = await supabase
        .from("branches")
        .update({ admin_id: "9ecf60f1-1822-48a6-9639-c86a0faad330" })
        .eq("id", branch.id);

      if (updateError) {
        console.log("Error linking branch to admin:", updateError.message);
        return;
      }

      console.log("Successfully linked branch to admin");
    } else {
      console.log("No branches with null admin_id found. Creating a new one...");

      // Create a new branch
      const { data: newBranch, error: createError } = await supabase
        .from("branches")
        .insert({
          name: "Test Branch for branch@test.com",
          active_bookings: 0,
          services: 0,
        })
        .select()
        .single();

      if (createError) {
        console.log("Error creating new branch:", createError.message);
        return;
      }

      console.log("Created new branch:", newBranch);

      // Link the branch to the admin
      const { error: updateError } = await supabase
        .from("branches")
        .update({ admin_id: "9ecf60f1-1822-48a6-9639-c86a0faad330" })
        .eq("id", newBranch.id);

      if (updateError) {
        console.log("Error linking branch to admin:", updateError.message);
        return;
      }

      console.log("Successfully linked new branch to admin");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

linkBranchAdmin();
