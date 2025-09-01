-- Create products bucket for product-related images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Add storage policies for the products bucket
-- Allow public read access to products bucket
CREATE POLICY "Allow public read access on products bucket"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'products');

-- Allow authenticated uploads to products bucket
CREATE POLICY "Allow authenticated uploads to products bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');