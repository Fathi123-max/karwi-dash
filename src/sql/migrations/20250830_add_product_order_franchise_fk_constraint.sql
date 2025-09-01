-- Add foreign key constraint for product_orders.franchise_id
-- First try to drop the constraint if it exists (to avoid errors)
ALTER TABLE public.product_orders DROP CONSTRAINT IF EXISTS product_orders_franchise_id_fkey;
-- Add the foreign key constraint
ALTER TABLE public.product_orders
ADD CONSTRAINT product_orders_franchise_id_fkey
FOREIGN KEY (franchise_id) REFERENCES public.franchises(id)
ON DELETE SET NULL;