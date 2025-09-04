-- RLS Policies for Banners and Offers Storage Buckets
-- These policies work with Supabase's existing storage setup

-- Note: In Supabase, the storage.objects table already has RLS enabled
-- We just need to add policies for our specific buckets

-- Public read access for banners bucket
CREATE POLICY "Public read access to banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'banners');

-- Authenticated admins can upload banners
CREATE POLICY "Admins can upload banners"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'banners');

-- Authenticated admins can update banners
CREATE POLICY "Admins can update banners"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'banners');

-- Authenticated admins can delete banners
CREATE POLICY "Admins can delete banners"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'banners');

-- Public read access for offers bucket
CREATE POLICY "Public read access to offers"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'offers');

-- Authenticated admins can upload offers
CREATE POLICY "Admins can upload offers"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'offers');

-- Authenticated admins can update offers
CREATE POLICY "Admins can update offers"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'offers');

-- Authenticated admins can delete offers
CREATE POLICY "Admins can delete offers"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'offers');