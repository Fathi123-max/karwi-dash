# Product Orders RLS Policy Update

## Overview

This migration adds Row Level Security (RLS) policies to allow general admins to access all product orders and order items in the system. Previously, only franchise admins could access their own orders. With this update, general admins can now view, update, and manage all product orders across all franchises.

## Changes Made

### New RLS Policies

The following policies have been added to the `product_orders` and `order_items` tables:

1. **Allow general admins to read all product orders**
   - Permits general admins to SELECT all records from the product_orders table

2. **Allow general admins to update all product orders**
   - Permits general admins to UPDATE all records in the product_orders table

3. **Allow general admins to delete all product orders**
   - Permits general admins to DELETE all records from the product_orders table

4. **Allow general admins to insert product orders**
   - Permits general admins to INSERT new records into the product_orders table

5. **Allow general admins to read all order items**
   - Permits general admins to SELECT all records from the order_items table

6. **Allow general admins to update all order items**
   - Permits general admins to UPDATE all records in the order_items table

7. **Allow general admins to delete all order items**
   - Permits general admins to DELETE all records from the order_items table

8. **Allow general admins to insert order items**
   - Permits general admins to INSERT new records into the order_items table

## Testing

- Test scripts have been added to verify that the new policies work correctly
- Unit tests have been created to validate both general admin and franchise admin access

## Implementation

To apply these changes, run the migration file:

```
20250830_add_general_admin_product_orders_access.sql
```

This file should be executed in your Supabase SQL editor or via the Supabase CLI.
