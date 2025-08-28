import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function uploadImage(
  file: File,
  bucket: string = "images",
): Promise<{ url: string; error: Error | null }> {
  try {
    // Generate a unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    if (!fileExt) {
      return { url: "", error: new Error("Invalid file extension") };
    }

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error(`Error uploading to ${bucket} bucket:`, error.message);
      console.error(`Full error details:`, error);

      // Handle specific error cases
      if (error.message.includes("new row violates row-level security policy")) {
        // Try with default bucket if RLS policy is blocking access
        if (bucket !== "images") {
          console.warn(`RLS policy blocked upload to ${bucket} bucket, trying default bucket`);
          return await uploadImage(file, "images");
        }
      }

      // Handle bucket not found error
      if (error.message.includes("not found")) {
        console.warn(`Bucket ${bucket} not found, trying default bucket`);
        return await uploadImage(file, "images");
      }

      // Handle 400 Bad Request errors
      if (error.status === 400) {
        console.warn(`Bad Request error (400) when uploading to ${bucket} bucket. This might be due to RLS policies.`);
        // Try with default bucket
        if (bucket !== "images") {
          console.warn(`Trying default bucket due to 400 error`);
          return await uploadImage(file, "images");
        }
      }

      return { url: "", error: new Error(`Upload failed: ${error.message} (Status: ${error.status || "unknown"})`) };
    }

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Unexpected error during upload:", error);
    return { url: "", error: error as Error };
  }
}

export async function deleteImage(url: string, bucket: string = "images"): Promise<{ error: Error | null }> {
  try {
    // Extract the file name from the URL
    const fileName = url.split("/").pop();

    if (!fileName) {
      return { error: new Error("Invalid URL") };
    }

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage.from(bucket).remove([fileName]);

    if (error) {
      console.error(`Error deleting from ${bucket} bucket:`, error.message);
      console.error(`Full error details:`, error);

      // If RLS policy blocks deletion, try with default bucket
      if (error.message.includes("new row violates row-level security policy") && bucket !== "images") {
        console.warn(`RLS policy blocked deletion from ${bucket} bucket, trying default bucket`);
        return await deleteImage(url, "images");
      }

      // Handle bucket not found error
      if (error.message.includes("not found")) {
        console.warn(`Bucket ${bucket} not found, trying default bucket`);
        return await deleteImage(url, "images");
      }

      return { error: new Error(`Deletion failed: ${error.message} (Status: ${error.status || "unknown"})`) };
    }

    return { error: null };
  } catch (error) {
    console.error("Unexpected error during deletion:", error);
    return { error: error as Error };
  }
}
