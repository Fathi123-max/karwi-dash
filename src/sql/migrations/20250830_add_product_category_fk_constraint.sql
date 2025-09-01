-- Add foreign key constraint for products.category_id
-- First try to drop the constraint if it exists (to avoid errors)
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
-- Add the foreign key constraint
ALTER TABLE public.products
ADD CONSTRAINT products_category_id_fkey
FOREIGN KEY (category_id) REFERENCES public.product_categories(id)
ON DELETE SET NULL;