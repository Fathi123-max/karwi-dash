-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $function$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$function$ language 'plpgsql';

-- Create triggers for product_categories
DROP TRIGGER IF EXISTS update_product_categories_updated_at ON public.product_categories;
CREATE TRIGGER update_product_categories_updated_at 
BEFORE UPDATE ON public.product_categories 
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();

-- Create triggers for products
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON public.products 
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();

-- Create triggers for product_orders
DROP TRIGGER IF EXISTS update_product_orders_updated_at ON public.product_orders;
CREATE TRIGGER update_product_orders_updated_at 
BEFORE UPDATE ON public.product_orders 
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();