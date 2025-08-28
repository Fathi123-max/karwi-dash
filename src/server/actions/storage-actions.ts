"use server";

import { initializeStorageWithServiceKey } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Server action to initialize storage buckets
 * This should be called by an admin user
 */
export async function initializeStorageBuckets() {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // TODO: Add admin check here
    // This would require checking if the user has admin privileges

    // Create buckets if they don't exist
    const bucketsToCreate = [
      { name: "images", options: { public: true } },
      { name: "branches", options: { public: true } },
      { name: "services", options: { public: true } },
    ];

    const results = [];
    let clientBasedCreationFailed = false;

    for (const { name, options } of bucketsToCreate) {
      try {
        // Try to create the bucket
        const { error } = await supabase.storage.createBucket(name, options);
        if (error && !error.message.includes("already exists")) {
          console.warn(`Client key failed for bucket ${name}:`, error.message);
          clientBasedCreationFailed = true;
          results.push({ name, success: false, error: error.message });
        } else {
          console.log(`Bucket ${name} is ready`);
          results.push({ name, success: true });
        }
      } catch (error) {
        console.error(`Error creating bucket ${name}:`, error);
        clientBasedCreationFailed = true;
        results.push({ name, success: false, error: (error as Error).message });
      }
    }

    // If any failed with client key, try with service key
    if (clientBasedCreationFailed) {
      console.log("Some bucket creations failed with client key, trying with service key...");
      const serviceKeyResult = await initializeStorageWithServiceKey();
      return serviceKeyResult;
    }

    return { success: true, results };
  } catch (error) {
    console.error("Error initializing storage buckets:", error);
    return { success: false, error: (error as Error).message };
  }
}
