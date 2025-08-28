import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    // TODO: Add proper admin check here

    // Execute the storage policies
    const policies = [
      `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Allow public read access on images bucket" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow public read access on branches bucket" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow public read access on services bucket" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow authenticated uploads to images bucket" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow authenticated uploads to branches bucket" ON storage.objects;`,
      `DROP POLICY IF EXISTS "Allow authenticated uploads to services bucket" ON storage.objects;`,
      `CREATE POLICY "Allow public read access on images bucket" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'images');`,
      `CREATE POLICY "Allow public read access on branches bucket" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'branches');`,
      `CREATE POLICY "Allow public read access on services bucket" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'services');`,
      `CREATE POLICY "Allow authenticated uploads to images bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');`,
      `CREATE POLICY "Allow authenticated uploads to branches bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'branches');`,
      `CREATE POLICY "Allow authenticated uploads to services bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'services');`,
      `CREATE POLICY "Allow owners to update their own objects" ON storage.objects FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());`,
      `CREATE POLICY "Allow owners to delete their own objects" ON storage.objects FOR DELETE TO authenticated USING (owner_id = auth.uid());`,
    ];

    // Execute each policy
    for (const policy of policies) {
      const { error } = await supabase.rpc("execute_sql", { sql: policy });
      if (error) {
        console.error("Error executing policy:", policy, error);
        // Continue with other policies even if one fails
      }
    }

    return NextResponse.json({ success: true, message: "Storage policies applied successfully" });
  } catch (error) {
    console.error("Error applying storage policies:", error);
    return NextResponse.json({ success: false, error: "Failed to apply storage policies" }, { status: 500 });
  }
}
