# Fix for Order Details Dialog Closing Issue

## Problem
When changing the status of orders in the Product Orders dialog, the dialog would close and reopen, providing a bad user experience.

## Root Cause
The `updateOrderStatus` function in the product order store was calling `fetchOrders()` after updating an order's status. This caused the entire orders list to refresh, which in turn caused the dialog to close and reopen.

## Solution
1. **Modified the store function** (`src/stores/admin-dashboard/product-order-store.ts`):
   - Removed the `fetchOrders()` call that was causing the refresh
   - Updated the function to return the updated order data with all details
   - Modified the order update logic to properly update the order in the store with complete data

2. **Updated the dialog component** (`src/app/(main)/admin/products/orders/_components/order-details-dialog.tsx`):
   - Modified `handleStatusChange` to use the returned data from the store update
   - Removed the separate call to `getOrderDetails` since the store now returns the updated data
   - Simplified the status update flow to be more direct and efficient

## Benefits
- The dialog now stays open when changing order status
- The UI updates immediately with the new status
- Better performance as we're not refreshing the entire orders list
- Smoother user experience when managing orders

## Testing
The changes have been tested and verified to work correctly. The dialog no longer closes and reopens when changing order status.