-- Create indexes for better query performance
-- Index on products.category_id for faster joins
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- Index on product_orders.franchise_id for faster queries
CREATE INDEX IF NOT EXISTS idx_product_orders_franchise_id ON public.product_orders(franchise_id);

-- Index on order_items.order_id for faster joins
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Index on order_items.product_id for faster joins
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Index on products name for faster search
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);

-- Index on product_categories name for faster search
CREATE INDEX IF NOT EXISTS idx_product_categories_name ON public.product_categories(name);