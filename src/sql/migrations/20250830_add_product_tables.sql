-- Add Product Tables

-- Create product_categories table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_categories_pkey PRIMARY KEY (id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  stock_quantity integer DEFAULT 0,
  pictures text[], -- Using proper array syntax for Postgres
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

-- Add foreign key constraint for products.category_id
-- First try to drop the constraint if it exists (to avoid errors)
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
-- Add the foreign key constraint
ALTER TABLE public.products
ADD CONSTRAINT products_category_id_fkey
FOREIGN KEY (category_id) REFERENCES public.product_categories(id);

-- Create product_orders table
CREATE TABLE IF NOT EXISTS public.product_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  franchise_id uuid,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_orders_pkey PRIMARY KEY (id)
);

-- Add foreign key constraint for product_orders.franchise_id
-- First try to drop the constraint if it exists (to avoid errors)
ALTER TABLE public.product_orders DROP CONSTRAINT IF EXISTS product_orders_franchise_id_fkey;
-- Add the foreign key constraint
ALTER TABLE public.product_orders
ADD CONSTRAINT product_orders_franchise_id_fkey
FOREIGN KEY (franchise_id) REFERENCES public.franchises(id);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL,
  price_per_unit numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id)
);

-- Add foreign key constraint for order_items.order_id
-- First try to drop the constraint if it exists (to avoid errors)
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
-- Add the foreign key constraint
ALTER TABLE public.order_items
ADD CONSTRAINT order_items_order_id_fkey
FOREIGN KEY (order_id) REFERENCES public.product_orders(id);

-- Add foreign key constraint for order_items.product_id
-- First try to drop the constraint if it exists (to avoid errors)
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
-- Add the foreign key constraint
ALTER TABLE public.order_items
ADD CONSTRAINT order_items_product_id_fkey
FOREIGN KEY (product_id) REFERENCES public.products(id);