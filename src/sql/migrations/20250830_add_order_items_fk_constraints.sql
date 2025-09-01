-- Add foreign key constraint for order_items.order_id
-- First try to drop the constraint if it exists (to avoid errors)
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
-- Add the foreign key constraint
ALTER TABLE public.order_items
ADD CONSTRAINT order_items_order_id_fkey
FOREIGN KEY (order_id) REFERENCES public.product_orders(id)
ON DELETE CASCADE;

-- Add foreign key constraint for order_items.product_id
-- First try to drop the constraint if it exists (to avoid errors)
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
-- Add the foreign key constraint
ALTER TABLE public.order_items
ADD CONSTRAINT order_items_product_id_fkey
FOREIGN KEY (product_id) REFERENCES public.products(id)
ON DELETE CASCADE;