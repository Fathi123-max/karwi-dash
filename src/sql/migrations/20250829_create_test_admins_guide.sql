-- Script to create test admin users directly in Supabase
-- Run this in the Supabase SQL editor

-- Create auth users and admins in one go
-- Note: This requires service role privileges

-- First, let's check if our test users already exist
SELECT id, email FROM auth.users WHERE email IN (
  'general@test.com', 
  'franchise@test.com', 
  'branch@test.com'
);

-- If they don't exist, you can create them through the Supabase dashboard
-- Then get their IDs and insert into the admins table:

-- Example of how to insert after creating auth users:
-- Replace 'USER_ID_HERE' with actual user IDs from auth.users table

/*
INSERT INTO public.admins (id, name, email, role) 
VALUES 
  ('USER_ID_HERE', 'General Admin', 'general@test.com', 'general'),
  ('USER_ID_HERE', 'Franchise Admin', 'franchise@test.com', 'franchise'),
  ('USER_ID_HERE', 'Branch Admin', 'branch@test.com', 'branch');
*/

-- For testing purposes, here's a simplified approach:
-- 1. Create the auth users manually in Supabase Auth dashboard with these emails:
--    - general@test.com
--    - franchise@test.com  
--    - branch@test.com
-- 2. Use a simple password for all (e.g., "password123")
-- 3. After creating them, run the following query to get their IDs:
-- SELECT id, email FROM auth.users WHERE email IN ('general@test.com', 'franchise@test.com', 'branch@test.com');

-- 4. Then insert the admin records with the actual user IDs