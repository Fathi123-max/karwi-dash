-- Migration to align local schema with Supabase database
-- This migration adds missing columns without removing existing data

-- Add admin_id column to branches table if it doesn't exist
ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS admin_id uuid;

-- Add foreign key constraint for admin_id in branches table
-- First try to drop the constraint if it exists (to avoid errors)
ALTER TABLE public.branches DROP CONSTRAINT IF EXISTS branches_admin_id_fkey;

-- Add the foreign key constraint
ALTER TABLE public.branches 
ADD CONSTRAINT branches_admin_id_fkey 
FOREIGN KEY (admin_id) REFERENCES auth.users(id);

-- Update the role column constraint in admins table to match Supabase format
-- First, we need to drop the existing constraint if it exists with a different format
ALTER TABLE public.admins 
DROP CONSTRAINT IF EXISTS admins_role_check;

-- Add the proper constraint matching Supabase format
ALTER TABLE public.admins 
ADD CONSTRAINT admins_role_check 
CHECK (role = ANY (ARRAY['general'::text, 'franchise'::text, 'branch'::text]));

-- Note: We're not dropping the branch_admins table in this migration to preserve existing data
-- It will be dropped in a separate migration after data is migrated