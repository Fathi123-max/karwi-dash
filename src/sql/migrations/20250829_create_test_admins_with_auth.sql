-- Create test admin users with proper auth integration
-- Note: This script needs to be run in the Supabase SQL editor, not through the app
-- as it requires service role privileges to create auth users

-- First, let's create the auth users (this would typically be done through the app)
-- For testing purposes, you'll need to manually create these users in Supabase Auth
-- with the same emails as below, then run this script to link them to the admins table

-- Create test admins records (assuming auth users already exist)
-- You'll need to replace the UUIDs with actual auth user IDs after creating the auth users

-- General admin
INSERT INTO public.admins (id, name, email, role) 
VALUES (
  '00000000-0000-0000-0000-000000000001', -- Replace with actual auth user ID
  'General Admin', 
  'general@test.com', 
  'general'
);

-- Franchise admin
INSERT INTO public.admins (id, name, email, role) 
VALUES (
  '00000000-0000-0000-0000-000000000002', -- Replace with actual auth user ID
  'Franchise Admin', 
  'franchise@test.com', 
  'franchise'
);

-- Branch admin
INSERT INTO public.admins (id, name, email, role) 
VALUES (
  '00000000-0000-0000-0000-000000000003', -- Replace with actual auth user ID
  'Branch Admin', 
  'branch@test.com', 
  'branch'
);

-- To properly test login functionality:
-- 1. Create auth users in Supabase Dashboard with the emails above
-- 2. Get their user IDs from the auth.users table
-- 3. Update the UUIDs in this script with the actual auth user IDs
-- 4. Run this script to create the admin records