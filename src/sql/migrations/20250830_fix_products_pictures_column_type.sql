-- Alter products table to ensure pictures column is of type text[]
ALTER TABLE public.products
ALTER COLUMN pictures TYPE text[] USING pictures::text[];