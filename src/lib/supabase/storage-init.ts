import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/**
 * Initialize storage buckets with proper permissions
 * This should be run by an admin or during setup
 */
export async function initializeStorageBuckets() {
  try {
    // Check if buckets exist, create them if they don't
    const bucketsToCreate = ["images", "branches", "services"];

    for (const bucketName of bucketsToCreate) {
      // Try to create the bucket (it will fail if it already exists, which is fine)
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true, // Make the bucket publicly accessible
      });

      if (error && !error.message.includes("already exists")) {
        console.error(`Error creating bucket ${bucketName}:`, error);
      } else if (!error) {
        console.log(`Created bucket: ${bucketName}`);
      }
    }

    // Set up RLS policies for the buckets
    // Note: This requires admin privileges and can't be done through the client SDK
    // These policies would typically be set up in Supabase directly

    console.log("Storage buckets initialized successfully");
    return { success: true };
  } catch (error) {
    console.error("Error initializing storage buckets:", error);
    return { success: false, error };
  }
}

/**
 * Check if all required buckets exist and are accessible
 */
export async function checkStorageSetup() {
  try {
    const requiredBuckets = ["images", "branches", "services"];
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Error listing buckets:", error);
      return { success: false, error };
    }

    const missingBuckets = requiredBuckets.filter(
      (bucketName) => !buckets.some((bucket) => bucket.name === bucketName),
    );

    if (missingBuckets.length > 0) {
      console.warn("Missing buckets:", missingBuckets);
      return { success: false, missingBuckets };
    }

    // Test access to each bucket
    for (const bucketName of requiredBuckets) {
      const { error: accessError } = await supabase.storage.from(bucketName).list("", { limit: 1 });
      if (accessError && !accessError.message.includes("The resource was not found")) {
        console.warn(`Access denied for bucket ${bucketName}:`, accessError.message);
        return { success: false, accessError: accessError.message };
      }
    }

    console.log("All storage buckets are properly set up");
    return { success: true };
  } catch (error) {
    console.error("Error checking storage setup:", error);
    return { success: false, error };
  }
}
