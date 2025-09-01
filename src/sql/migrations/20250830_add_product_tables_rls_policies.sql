-- Enable Row Level Security for product tables
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Product Categories policies
-- Allow admins and franchise admins to read product categories
CREATE POLICY "Allow admins and franchise admins to read product categories"
ON public.product_categories FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role IN ('general', 'franchise')
  )
);

-- Allow general admins to insert product categories
CREATE POLICY "Allow general admins to insert product categories"
ON public.product_categories FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Allow general admins to update product categories
CREATE POLICY "Allow general admins to update product categories"
ON public.product_categories FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Allow general admins to delete product categories
CREATE POLICY "Allow general admins to delete product categories"
ON public.product_categories FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Products policies
-- Allow authenticated users to read products
CREATE POLICY "Allow authenticated users to read products"
ON public.products FOR SELECT
TO authenticated
USING (true);

-- Allow general admins to insert products
CREATE POLICY "Allow general admins to insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Allow general admins to update products
CREATE POLICY "Allow general admins to update products"
ON public.products FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Allow general admins to delete products
CREATE POLICY "Allow general admins to delete products"
ON public.products FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Product Orders policies
-- Allow franchise admins to read their own orders
CREATE POLICY "Allow franchise admins to read their own orders"
ON public.product_orders FOR SELECT
TO authenticated
USING (
  franchise_id IN (
    SELECT franchises.id FROM public.franchises 
    WHERE franchises.admin_id = auth.uid()
  )
);

-- Allow franchise admins to insert their own orders
CREATE POLICY "Allow franchise admins to insert their own orders"
ON public.product_orders FOR INSERT
TO authenticated
WITH CHECK (
  franchise_id IN (
    SELECT franchises.id FROM public.franchises 
    WHERE franchises.admin_id = auth.uid()
  )
);

-- Allow franchise admins to update their own orders
CREATE POLICY "Allow franchise admins to update their own orders"
ON public.product_orders FOR UPDATE
TO authenticated
USING (
  franchise_id IN (
    SELECT franchises.id FROM public.franchises 
    WHERE franchises.admin_id = auth.uid()
  )
);

-- Allow franchise admins to delete their own orders
CREATE POLICY "Allow franchise admins to delete their own orders"
ON public.product_orders FOR DELETE
TO authenticated
USING (
  franchise_id IN (
    SELECT franchises.id FROM public.franchises 
    WHERE franchises.admin_id = auth.uid()
  )
);

-- Order Items policies
-- Allow franchise admins to read order items for their orders
CREATE POLICY "Allow franchise admins to read order items for their orders"
ON public.order_items FOR SELECT
TO authenticated
USING (
  order_id IN (
    SELECT product_orders.id FROM public.product_orders
    JOIN public.franchises ON product_orders.franchise_id = franchises.id
    WHERE franchises.admin_id = auth.uid()
  )
);

-- Allow franchise admins to insert order items for their orders
CREATE POLICY "Allow franchise admins to insert order items for their orders"
ON public.order_items FOR INSERT
TO authenticated
WITH CHECK (
  order_id IN (
    SELECT product_orders.id FROM public.product_orders
    JOIN public.franchises ON product_orders.franchise_id = franchises.id
    WHERE franchises.admin_id = auth.uid()
  )
);

-- Allow franchise admins to update order items for their orders
CREATE POLICY "Allow franchise admins to update order items for their orders"
ON public.order_items FOR UPDATE
TO authenticated
USING (
  order_id IN (
    SELECT product_orders.id FROM public.product_orders
    JOIN public.franchises ON product_orders.franchise_id = franchises.id
    WHERE franchises.admin_id = auth.uid()
  )
);

-- Allow franchise admins to delete order items for their orders
CREATE POLICY "Allow franchise admins to delete order items for their orders"
ON public.order_items FOR DELETE
TO authenticated
USING (
  order_id IN (
    SELECT product_orders.id FROM public.product_orders
    JOIN public.franchises ON product_orders.franchise_id = franchises.id
    WHERE franchises.admin_id = auth.uid()
  )
);