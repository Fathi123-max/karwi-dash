import * as fs from "fs";
import * as path from "path";

import { createClient } from "@supabase/supabase-js";

// Read .env.local directly
const envPath = path.resolve(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envLines = envContent.split("\n");

let supabaseUrl = "";
let supabaseServiceKey = "";

envLines.forEach((line) => {
  if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
    supabaseUrl = line.split("=")[1].trim();
  }
  if (line.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) {
    supabaseServiceKey = line.split("=")[1].trim();
  }
});

async function linkFranchiseAdmin() {
  try {
    // Create Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Finding franchises with null admin_id...");
    const { data: franchises, error: fetchError } = await supabase
      .from("franchises")
      .select("id, name, admin_id")
      .is("admin_id", null);

    if (fetchError) {
      console.log("Error fetching franchises:", fetchError.message);
      return;
    }

    console.log("Franchises with null admin_id:", franchises?.length || 0);
    franchises?.forEach((f) => {
      console.log(`- ${f.name} (${f.id})`);
    });

    if (franchises && franchises.length > 0) {
      const franchise = franchises[0];
      console.log("Linking franchise:", franchise.name);

      // Link the franchise to the admin
      const { error: updateError } = await supabase
        .from("franchises")
        .update({ admin_id: "e138a7e3-0515-4878-916a-4f318fb3d465" })
        .eq("id", franchise.id);

      if (updateError) {
        console.log("Error linking franchise to admin:", updateError.message);
        return;
      }

      console.log("Successfully linked franchise to admin");
    } else {
      console.log("No franchises with null admin_id found. Creating a new one...");

      // Create a new franchise
      const { data: newFranchise, error: createError } = await supabase
        .from("franchises")
        .insert({
          name: "Test Franchise for franchise@test.com",
          status: "active",
        })
        .select()
        .single();

      if (createError) {
        console.log("Error creating new franchise:", createError.message);
        return;
      }

      console.log("Created new franchise:", newFranchise);

      // Link the franchise to the admin
      const { error: updateError } = await supabase
        .from("franchises")
        .update({ admin_id: "e138a7e3-0515-4878-916a-4f318fb3d465" })
        .eq("id", newFranchise.id);

      if (updateError) {
        console.log("Error linking franchise to admin:", updateError.message);
        return;
      }

      console.log("Successfully linked new franchise to admin");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

linkFranchiseAdmin();
