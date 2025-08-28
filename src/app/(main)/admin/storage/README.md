# Supabase Storage Setup

This document explains how to set up Supabase Storage for the Karwi Dash application.

## Required Buckets

The application requires the following storage buckets:
- `images` - Default bucket for general image storage
- `branches` - Bucket for branch-related images
- `services` - Bucket for service-related images

## Setup Instructions

1. **Initialize Buckets**:
   - Navigate to the Admin Dashboard
   - Go to the "Storage" section
   - Click "Initialize Storage Buckets"
   - This will create the required buckets if they don't exist

2. **Manual Setup** (if needed):
   - Log into your Supabase project dashboard
   - Go to Storage > Buckets
   - Create the three buckets listed above
   - Set each bucket to "Public" access

3. **Row Level Security (RLS)**:
   - The application handles RLS policy violations automatically
   - If you encounter "new row violates row-level security policy" errors:
     - Ensure your Supabase project has the proper RLS policies configured
     - The application will automatically fall back to the default "images" bucket

## Troubleshooting

### "new row violates row-level security policy" Error

This error occurs when the authenticated user doesn't have permission to upload to the specified bucket. The application automatically handles this by:

1. Trying to upload to the specified bucket (e.g., "branches")
2. If that fails due to RLS policy, falling back to the default "images" bucket
3. Providing appropriate error messages to the user

### "Bucket not found" Error

This error occurs when the specified bucket doesn't exist. The application handles this by:

1. Attempting to upload to the specified bucket
2. If the bucket doesn't exist, falling back to the default "images" bucket

## Testing

Use the Storage Test page (`/admin/storage/test`) to verify that file uploads are working correctly.