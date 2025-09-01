-- Check if RLS is enabled on product_orders table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'product_orders';

-- Check policies on product_orders table
SELECT polname, polrelid::regclass, polcmd, polqual, polwithcheck
FROM pg_policy
WHERE polrelid = 'product_orders'::regclass;

-- Check policies on order_items table
SELECT polname, polrelid::regclass, polcmd, polqual, polwithcheck
FROM pg_policy
WHERE polrelid = 'order_items'::regclass;