import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// This script should be run with service role privileges
// Update with your Supabase credentials
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function createTestAdmins() {
  const testAdmins = [
    {
      email: "general@test.com",
      password: "password123",
      name: "General Admin",
      role: "general",
    },
    {
      email: "franchise@test.com",
      password: "password123",
      name: "Franchise Admin",
      role: "franchise",
    },
    {
      email: "branch@test.com",
      password: "password123",
      name: "Branch Admin",
      role: "branch",
    },
  ];

  for (const admin of testAdmins) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
      });

      if (authError) {
        console.error(`Error creating auth user ${admin.email}:`, authError.message);
        continue;
      }

      // Create admin record
      const { error: adminError } = await supabase.from("admins").insert({
        id: authData.user.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      });

      if (adminError) {
        console.error(`Error creating admin record for ${admin.email}:`, adminError.message);
      } else {
        console.log(`Successfully created ${admin.role} admin: ${admin.email}`);
      }
    } catch (error) {
      console.error(`Unexpected error creating ${admin.email}:`, error);
    }
  }
}

createTestAdmins();
