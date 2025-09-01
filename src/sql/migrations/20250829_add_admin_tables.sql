-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  name text,
  email text NOT NULL UNIQUE,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);

-- Create branch_admins table
CREATE TABLE IF NOT EXISTS public.branch_admins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT branch_admins_pkey PRIMARY KEY (id),
  CONSTRAINT branch_admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT branch_admins_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);

-- Add RLS policies for admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for branch_admins table
ALTER TABLE public.branch_admins ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON TABLE public.admins TO authenticated;
GRANT ALL ON TABLE public.branch_admins TO authenticated;