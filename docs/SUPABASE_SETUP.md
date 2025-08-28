# Supabase Setup and Configuration

This document provides detailed instructions for setting up and configuring Supabase for the Karwi Dash application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Storage Configuration](#storage-configuration)
6. [Authentication Setup](#authentication-setup)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (version specified in `package.json`)
- A Supabase account (free tier available at supabase.com)
- This Karwi Dash application codebase

## Project Setup

1. Create a new Supabase project:
   - Go to supabase.com and sign in or create an account
   - Click "New Project"
   - Enter project name and password
   - Select region closest to your users
   - Click "Create Project"

2. Wait for the project to be created (this may take a few minutes).

## Environment Configuration

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Found in Project Settings > API > Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Found in Project Settings > API > Project API keys (anon key)
   - `SUPABASE_SERVICE_ROLE_KEY`: Found in Project Settings > API > Project API keys (service role key)

## Database Setup

1. Run the database schema:
   - Go to the Supabase dashboard
   - Navigate to SQL Editor
   - Copy and run the SQL from `src/sql/schema.sql`

2. Set up Row Level Security (RLS):
   - For each table, enable RLS in the Table Editor
   - Add policies as needed for your application

## Storage Configuration

The application requires three storage buckets:
- `images` (default bucket for general images)
- `branches` (for branch-related images)
- `services` (for service-related images)

### Creating Buckets

You can create these buckets in two ways:

#### Method 1: Using the Admin Interface
1. Navigate to your Supabase project dashboard
2. Go to Storage > Buckets
3. Click "New Bucket" and create each of the three buckets
4. Set each bucket to "Public" access

#### Method 2: Using the Application
1. Start the development server: `pnpm run dev`
2. Navigate to `/admin/storage`
3. Click "Initialize Storage Buckets"

### Storage Policies

Ensure your storage buckets have the correct policies. For public read access and authenticated write access:

```sql
-- For each bucket, create policies
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

create policy "Authenticated Users Can Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'images' );
```

## Authentication Setup

The application uses Supabase Auth for authentication. By default, email/password authentication is enabled.

To configure:
1. Go to Authentication > Settings in your Supabase dashboard
2. Enable/disable providers as needed
3. Configure email templates if required
4. Set up redirect URLs for OAuth providers if used

## Testing

### Automated Testing

1. Start the development server:
   ```bash
   pnpm run dev
   ```

2. Navigate to `/test` to run the connection test

3. Navigate to `/admin/storage/test` to test storage functionality

### Manual Testing

1. Check environment variables:
   ```bash
   # Verify .env.local exists and contains the correct values
   cat .env.local
   ```

2. Test database connection using Supabase SQL editor:
   ```sql
   SELECT * FROM admins LIMIT 1;
   ```

3. Test storage using Supabase dashboard:
   - Go to Storage > Buckets
   - Verify the three required buckets exist

## Troubleshooting

### Connection Issues

1. **"Invalid URL" error**:
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is correctly set
   - Ensure there are no extra spaces or quotes

2. **"Invalid API key" error**:
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
   - Make sure you're using the anon key, not the service role key

3. **Network errors**:
   - Check your internet connection
   - Ensure your firewall isn't blocking requests to Supabase

### Storage Issues

1. **"Bucket not found" error**:
   - Verify all three required buckets exist
   - Check bucket names match exactly ("images", "branches", "services")

2. **"new row violates row-level security policy" error**:
   - Check storage policies in Supabase dashboard
   - Ensure authenticated users have insert permissions

3. **Upload failures**:
   - Verify the bucket is set to public
   - Check file size limits (default is 50MB)
   - Ensure the file type is allowed

### Authentication Issues

1. **Login failures**:
   - Verify auth providers are enabled
   - Check redirect URLs are correctly configured
   - Ensure email confirmation settings are correct

2. **Session issues**:
   - Check cookie settings in middleware
   - Verify JWT expiration settings

### Debugging Tips

1. Check browser console for client-side errors
2. Check terminal output for server-side errors
3. Use Supabase dashboard logs for database/storage errors
4. Enable debug logging in Supabase settings for more detailed information

If you continue to experience issues, please:
1. Verify all environment variables are correctly set
2. Check that your Supabase project is not suspended
3. Ensure you're using the correct region URL
4. Contact Supabase support if problems persist