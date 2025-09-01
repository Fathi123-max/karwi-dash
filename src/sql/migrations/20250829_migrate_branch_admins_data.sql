-- Migration to migrate data from branch_admins table to admins table role column
-- This migration should be run after the alignment migration

-- First, update the role for existing branch admins
-- This assumes that entries in branch_admins should have 'branch' role in admins table
UPDATE public.admins 
SET role = 'branch'
WHERE id IN (
  SELECT DISTINCT user_id 
  FROM public.branch_admins
) 
AND (role = 'general' OR role IS NULL);

-- Then, update the branches table to link to the admin
UPDATE public.branches b
SET admin_id = ba.user_id
FROM public.branch_admins ba
WHERE b.id = ba.branch_id
AND b.admin_id IS NULL;

-- Finally, drop the branch_admins table as it's no longer needed
-- This is safe to do after confirming data has been properly migrated
DROP TABLE IF EXISTS public.branch_admins;