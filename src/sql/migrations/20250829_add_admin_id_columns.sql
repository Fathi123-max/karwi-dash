-- Add admin_id column to branches table
ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS admin_id uuid;

-- Add foreign key constraint to link to auth.users table
ALTER TABLE public.branches 
ADD CONSTRAINT branches_admin_id_fkey 
FOREIGN KEY (admin_id) REFERENCES auth.users(id);

-- Add admin_id column to franchises table
ALTER TABLE public.franchises 
ADD COLUMN IF NOT EXISTS admin_id uuid;

-- Add foreign key constraint to link to auth.users table
ALTER TABLE public.franchises 
ADD CONSTRAINT franchises_admin_id_fkey 
FOREIGN KEY (admin_id) REFERENCES auth.users(id);