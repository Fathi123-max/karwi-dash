# Supabase Storage Troubleshooting Guide

This guide addresses common issues with Supabase Storage, particularly the 400 Bad Request error you're experiencing when uploading images.

## Problem: 400 Bad Request Error on Image Upload

From your console logs:
```
POST https://zfpnwfamzzfpxnzupake.supabase.co/storage/v1/object/branches/1756289838560-1ny4ux7vq31.png 400 (Bad Request)
POST https://zfpnwfamzzfpxnzupake.supabase.co/storage/v1/object/images/1756289839629-44pudnzvnd2.png 400 (Bad Request)
```

This error typically occurs due to one of the following reasons:

### 1. Missing or Incorrect Row Level Security (RLS) Policies

Even though your buckets exist and are public, the storage.objects table might not have the proper RLS policies to allow uploads.

**Solution:**
1. Navigate to `/admin/storage/fix-policies` in your application
2. Click "Apply Storage Policies"
3. This will set up the necessary policies for authenticated uploads

### 2. Authentication Issues

The upload request might not be properly authenticated.

**Solution:**
1. Ensure you're logged in to your application
2. Verify that the Supabase client is properly initialized with the session
3. Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correctly set in your `.env.local` file

### 3. Bucket Permissions

While your buckets are marked as public, they might not have the correct policies for uploads.

**Solution:**
1. Go to your Supabase dashboard
2. Navigate to Storage > Buckets
3. Verify that all buckets (images, branches, services) are set to "Public"

### 4. File Size or Type Restrictions

There might be restrictions on file size or allowed MIME types.

**Solution:**
1. Check the bucket settings in your Supabase dashboard
2. Ensure there are no file size limits that your images exceed
3. Verify that the file types you're uploading are allowed

## How to Fix the Issue

### Step 1: Apply Storage Policies

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/admin/storage/fix-policies`
3. Click "Apply Storage Policies"
4. Check the results to ensure all policies were applied successfully

### Step 2: Test Upload Again

1. Go to `http://localhost:3000/admin/storage/test`
2. Select an image file
3. Click "Upload File"
4. The upload should now work correctly

### Step 3: If Issues Persist

If you're still experiencing issues:

1. **Check Environment Variables:**
   - Verify that your `.env.local` file contains the correct Supabase credentials
   - Ensure there are no extra spaces or characters in the values

2. **Verify Bucket Existence:**
   - Check that all three required buckets exist in your Supabase dashboard:
     - images
     - branches
     - services

3. **Check Network Requests:**
   - Open browser dev tools (F12)
   - Go to the Network tab
   - Try uploading an image again
   - Look at the failed request and check:
     - Request headers (especially Authorization header)
     - Response body for detailed error message

4. **Manual Policy Verification:**
   - In Supabase SQL Editor, run:
     ```sql
     SELECT * FROM storage.objects LIMIT 5;
     ```
   - Check if RLS is enabled:
     ```sql
     SELECT relname, relrowsecurity 
     FROM pg_class 
     WHERE relname = 'objects' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'storage');
     ```

## Prevention

To prevent this issue in the future:

1. Always run the storage policy fix after setting up a new Supabase project
2. Regularly check that your environment variables are correctly set
3. Ensure that any changes to your Supabase project configuration are reflected in your application

## Need More Help?

If you're still experiencing issues after following these steps:

1. Check the browser console for more detailed error messages
2. Look at the server logs for any additional information
3. Verify that your Supabase project is not suspended or has any limitations
4. Contact Supabase support if you believe there's an issue with your project