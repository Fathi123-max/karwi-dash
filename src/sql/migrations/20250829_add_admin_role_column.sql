-- Add role column to admins table
ALTER TABLE public.admins 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'general';

-- Add constraint to ensure role is one of the allowed values
ALTER TABLE public.admins 
ADD CONSTRAINT valid_admin_role 
CHECK (role IN ('general', 'franchise', 'branch'));

-- Update any existing admins to have the 'general' role (if not already set)
UPDATE public.admins 
SET role = 'general' 
WHERE role = '' OR role IS NULL;

-- For franchise admins, we'll link them to franchises in the existing franchises table
-- For branch admins, we'll link them to branches in the existing branches table