-- Create function to manage product stock when order items are modified
CREATE OR REPLACE FUNCTION public.manage_product_stock()
RETURNS TRIGGER AS $function$
BEGIN
  -- If this is an INSERT (new order item)
  IF (TG_OP = 'INSERT') THEN
    -- Decrease product stock by the ordered quantity
    UPDATE public.products 
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;
    
  -- If this is an UPDATE (modified order item)
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Adjust product stock: add back the old quantity and subtract the new quantity
    UPDATE public.products 
    SET stock_quantity = stock_quantity + OLD.quantity - NEW.quantity
    WHERE id = NEW.product_id;
    
  -- If this is a DELETE (removed order item)
  ELSIF (TG_OP = 'DELETE') THEN
    -- Increase product stock by the removed quantity
    UPDATE public.products 
    SET stock_quantity = stock_quantity + OLD.quantity
    WHERE id = OLD.product_id;
    
    -- Return the old record for DELETE operations
    RETURN OLD;
  END IF;
  
  -- Return the new record for INSERT/UPDATE operations
  RETURN NEW;
END;
$function$ language 'plpgsql';

-- Create triggers for order_items table
DROP TRIGGER IF EXISTS manage_order_items_stock ON public.order_items;
CREATE TRIGGER manage_order_items_stock 
AFTER INSERT OR UPDATE OR DELETE ON public.order_items 
FOR EACH ROW 
EXECUTE FUNCTION public.manage_product_stock();

-- Add a comment to the products table to document the stock_quantity field
COMMENT ON COLUMN public.products.stock_quantity IS 'Current available stock quantity. Automatically updated when order items are created, modified, or deleted.';