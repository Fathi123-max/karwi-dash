# Supabase Connection Setup Guide

This guide will help you set up and troubleshoot your Supabase connection for the Karwi Dash application.

## Prerequisites

1. A Supabase project (free tier is sufficient)
2. Supabase project URL and API keys

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in your Supabase project dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`: Project Settings > API > Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project Settings > API > Project API keys (anon key)
- `SUPABASE_SERVICE_ROLE_KEY`: Project Settings > API > Project API keys (service role key)

### 2. Storage Buckets

The application requires three storage buckets:

- `images` (default bucket for general images)
- `branches` (for branch-related images)
- `services` (for service-related images)

You can create these buckets in two ways:

#### Option A: Using the Admin Interface

1. Navigate to your Supabase project dashboard
2. Go to Storage > Buckets
3. Create each of the three buckets listed above
4. Set each bucket to "Public" access

#### Option B: Using the Application

1. Start the development server
2. Navigate to `/admin/storage`
3. Click "Initialize Storage Buckets"

### 3. Row Level Security (RLS)

Ensure RLS is properly configured for your tables. The application handles RLS policy violations automatically by falling back to the default "images" bucket.

## Testing the Connection

1. Start the development server: `pnpm run dev`
2. Navigate to `/test` to run the connection test
3. Check the console for detailed error messages if the test fails

## Troubleshooting

### "new row violates row-level security policy" Error

This error occurs when the authenticated user doesn't have permission to upload to the specified bucket. The application automatically handles this by:

1. Trying to upload to the specified bucket (e.g., "branches")
2. If that fails due to RLS policy, falling back to the default "images" bucket

### "Bucket not found" Error

This error occurs when the specified bucket doesn't exist. Ensure you've created all required buckets as described in the setup instructions.

### "Invalid JWT" or Authentication Errors

Verify that:

1. Your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
2. You're using the correct keys (not the service role key for client-side operations)
3. The Supabase project is not suspended or has network connectivity

### Network Issues

If you're experiencing network issues:

1. Ensure your Supabase project URL is correct
2. Check that your firewall or network settings aren't blocking requests to Supabase
3. Try accessing the Supabase dashboard directly to verify connectivity

## Manual Verification

You can manually verify your Supabase connection by:

1. Checking the Supabase dashboard to ensure your project is active
2. Verifying the environment variables are correctly set
3. Testing the database connection with a simple query in the Supabase SQL editor
4. Ensuring the required tables exist (refer to `src/sql/schema.sql`)

If you continue to experience issues, please check the browser console and server logs for detailed error messages.
