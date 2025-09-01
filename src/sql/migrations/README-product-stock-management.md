# Product Stock Management

This document explains how product stock is managed in the Karwi Dash system.

## Overview

Product stock is automatically managed through database triggers that update the `stock_quantity` field in the `products` table whenever order items are created, modified, or deleted.

## How It Works

1. **Database Triggers**: 
   - When an order item is inserted, the product's stock quantity is decreased by the ordered quantity
   - When an order item is updated, the product's stock quantity is adjusted accordingly (old quantity is returned, new quantity is deducted)
   - When an order item is deleted, the product's stock quantity is increased by the removed quantity

2. **Application Layer**:
   - Before placing an order, the application checks if sufficient stock is available
   - Stock information is displayed in both admin and franchise order views
   - Current stock levels are shown alongside order items

## Files Modified

1. `src/sql/migrations/20250830_add_product_stock_management_triggers.sql` - Database triggers for automatic stock management
2. `src/stores/franchise-dashboard/product-store.ts` - Added stock checking functionality and updated order fetching
3. `src/app/(main)/franchise/products/_components/product-order-form.tsx` - Added stock availability check before placing orders
4. `src/app/(main)/franchise/products/_components/order-history.tsx` - Enhanced order history with product details and stock information
5. `src/app/(main)/admin/products/orders/_components/order-details-dialog.tsx` - Enhanced order details with product names and stock information

## Benefits

- Automatic stock management reduces the risk of inconsistencies
- Real-time stock information helps prevent overselling
- Better visibility into current stock levels for both admins and franchise users