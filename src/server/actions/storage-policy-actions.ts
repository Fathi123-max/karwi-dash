"use server";

import { createClient } from "@supabase/supabase-js";

export async function fixStoragePolicies() {
  try {
    // Use service role key for administrative operations
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // First, check if the storage schema and tables exist
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "storage");

    if (tablesError) {
      console.error("Error fetching storage tables:", tablesError);
      return { success: false, error: tablesError.message };
    }

    const storageTables = tables.map((t) => t.table_name);
    if (!storageTables.includes("objects")) {
      return { success: false, error: "Storage objects table not found" };
    }

    // Enable RLS on storage.objects table
    const enableRLS = `
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    `;

    const { error: rlsError } = await supabaseAdmin.rpc("execute_sql", { sql: enableRLS });
    if (rlsError) {
      console.warn("Warning: Could not enable RLS (might already be enabled):", rlsError);
    }

    // Drop existing policies if they exist
    const dropPolicies = [
      `DROP POLICY IF EXISTS "Allow public read access on images bucket" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow public read access on branches bucket" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow public read access on services bucket" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow authenticated uploads to images bucket" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow authenticated uploads to branches bucket" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow authenticated uploads to services bucket" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow owners to update their own objects" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow owners to delete their own objects" ON storage.objects;`,
    ];

    for (const policy of dropPolicies) {
      const { error } = await supabaseAdmin.rpc("execute_sql", { sql: policy });
      if (error) {
        console.warn("Warning: Could not drop policy (might not exist):", error);
      }
    }

    // Create policies for public read access
    const createPolicies = [
      `CREATE POLICY "Allow public read access on images bucket" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'images');`,
      `CREATE POLICY "Allow public read access on branches bucket" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'branches');`,
      `CREATE POLICY "Allow public read access on services bucket" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'services');`,
      `CREATE POLICY "Allow authenticated uploads to images bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');`,
      `CREATE POLICY "Allow authenticated uploads to branches bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'branches');`,
      `CREATE POLICY "Allow authenticated uploads to services bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'services');`,
      `CREATE POLICY "Allow owners to update their own objects" ON storage.objects FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());`,
      `CREATE POLICY "Allow owners to delete their own objects" ON storage.objects FOR DELETE TO authenticated USING (owner_id = auth.uid());`,
    ];

    const policyResults = [];
    for (const policy of createPolicies) {
      const { error } = await supabaseAdmin.rpc("execute_sql", { sql: policy });
      if (error) {
        console.error("Error creating policy:", policy, error);
        policyResults.push({ policy, success: false, error: error.message });
      } else {
        policyResults.push({ policy, success: true });
      }
    }

    const allSuccess = policyResults.every((r) => r.success);
    return {
      success: allSuccess,
      message: allSuccess ? "All storage policies applied successfully" : "Some policies failed to apply",
      results: policyResults,
    };
  } catch (error) {
    console.error("Error applying storage policies:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
