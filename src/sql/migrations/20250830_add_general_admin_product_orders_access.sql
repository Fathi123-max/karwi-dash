-- Allow general admins to read all product orders
CREATE POLICY "Allow general admins to read all product orders"
ON public.product_orders FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Allow general admins to update all product orders
CREATE POLICY "Allow general admins to update all product orders"
ON public.product_orders FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Allow general admins to delete all product orders
CREATE POLICY "Allow general admins to delete all product orders"
ON public.product_orders FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Allow general admins to insert product orders (for testing/override purposes)
CREATE POLICY "Allow general admins to insert product orders"
ON public.product_orders FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Also allow general admins to access all order items
-- Allow general admins to read all order items
CREATE POLICY "Allow general admins to read all order items"
ON public.order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Allow general admins to update all order items
CREATE POLICY "Allow general admins to update all order items"
ON public.order_items FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Allow general admins to delete all order items
CREATE POLICY "Allow general admins to delete all order items"
ON public.order_items FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);

-- Allow general admins to insert order items
CREATE POLICY "Allow general admins to insert order items"
ON public.order_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.id = auth.uid() 
    AND admins.role = 'general'
  )
);