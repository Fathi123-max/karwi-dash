-- Add RLS policies for admins table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow admins to read their own record" ON public.admins;
DROP POLICY IF EXISTS "Allow service role to read all admin records" ON public.admins;

-- Create policy to allow authenticated users to read their own admin record
CREATE POLICY "Allow admins to read their own record"
ON public.admins FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Create policy to allow service role to read all admin records (for server-side operations)
CREATE POLICY "Allow service role to read all admin records"
ON public.admins FOR SELECT
TO service_role
USING (true);

-- Create policy to allow admins to insert their own record (for registration)
CREATE POLICY "Allow admins to insert their own record"
ON public.admins FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Create policy to allow service role to insert admin records (for admin creation)
CREATE POLICY "Allow service role to insert admin records"
ON public.admins FOR INSERT
TO service_role
WITH CHECK (true);

-- Create policy to allow admins to update their own record
CREATE POLICY "Allow admins to update their own record"
ON public.admins FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Create policy to allow service role to update admin records
CREATE POLICY "Allow service role to update admin records"
ON public.admins FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Create policy to allow service role to delete admin records
CREATE POLICY "Allow service role to delete admin records"
ON public.admins FOR DELETE
TO service_role
USING (true);