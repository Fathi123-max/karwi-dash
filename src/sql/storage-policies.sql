-- Enable RLS on storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access on images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access on branches bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access on services bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to branches bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to services bucket" ON storage.objects;

-- Create policies for public read access
CREATE POLICY "Allow public read access on images bucket"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'images');

CREATE POLICY "Allow public read access on branches bucket"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'branches');

CREATE POLICY "Allow public read access on services bucket"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'services');

-- Create policies for authenticated uploads
CREATE POLICY "Allow authenticated uploads to images bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow authenticated uploads to branches bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'branches');

CREATE POLICY "Allow authenticated uploads to services bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'services');

-- Create policies for owners to update and delete their own objects
CREATE POLICY "Allow owners to update their own objects"
ON storage.objects FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Allow owners to delete their own objects"
ON storage.objects FOR DELETE
TO authenticated
USING (owner_id = auth.uid());