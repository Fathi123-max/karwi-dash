import { createClient } from "@supabase/supabase-js";

// This function uses the service role key for administrative tasks
export async function initializeStorageWithServiceKey() {
  try {
    // Use service role key for administrative operations
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Create buckets if they don't exist
    const bucketsToCreate = [
      { name: "images", options: { public: true } },
      { name: "branches", options: { public: true } },
      { name: "services", options: { public: true } },
    ];

    const results = [];
    for (const { name, options } of bucketsToCreate) {
      try {
        const { error } = await supabaseAdmin.storage.createBucket(name, options);
        if (error && !error.message.includes("already exists")) {
          console.error(`Error creating bucket ${name}:`, error);
          results.push({ name, success: false, error: error.message });
        } else {
          console.log(`Bucket ${name} is ready`);
          results.push({ name, success: true });
        }
      } catch (error) {
        console.error(`Error creating bucket ${name}:`, error);
        results.push({ name, success: false, error: (error as Error).message });
      }
    }

    return { success: true, results };
  } catch (error) {
    console.error("Error initializing storage with service key:", error);
    return { success: false, error: (error as Error).message };
  }
}
