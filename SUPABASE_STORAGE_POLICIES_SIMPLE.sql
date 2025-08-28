-- Simple Storage RLS Policies Fix
-- Run these commands in your Supabase SQL Editor

-- First, check if RLS is enabled on storage.objects
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'objects' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'storage');

-- Enable RLS on storage.objects table (run this if the above query shows relrowsecurity = false)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create simple policies for public read access
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'images');

CREATE POLICY "Public read access for branches"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'branches');

CREATE POLICY "Public read access for services"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'services');

-- Create policies for authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('images', 'branches', 'services'));

-- Create policies for owners to update and delete
CREATE POLICY "Allow owners to update"
ON storage.objects FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Allow owners to delete"
ON storage.objects FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- Grant necessary permissions
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;