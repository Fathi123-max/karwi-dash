"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminProductOrderStore, ProductOrderWithItems } from "@/stores/admin-dashboard/product-order-store";

interface OrderDetailsDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ orderId, open, onOpenChange }: OrderDetailsDialogProps) {
  const [order, setOrder] = useState<ProductOrderWithItems | null>(null);
  const [status, setStatus] = useState<ProductOrderWithItems["status"]>("pending");
  const { getOrderDetails, updateOrderStatus } = useAdminProductOrderStore();

  useEffect(() => {
    if (orderId && open) {
      const fetchOrderDetails = async () => {
        const orderDetails = await getOrderDetails(orderId);
        if (orderDetails) {
          setOrder(orderDetails);
          setStatus(orderDetails.status);
        }
      };

      fetchOrderDetails();
    }
  }, [orderId, open, getOrderDetails]);

  const handleStatusChange = async (newStatus: ProductOrderWithItems["status"]) => {
    if (!orderId) return;

    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setStatus(newStatus);
      setOrder(updatedOrder);
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  if (!order) {
    return null;
  }

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order #{order.id.slice(0, 8)} placed on {formatDate(order.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Franchise</Label>
              <div className="mt-1 font-medium">{order.franchise?.name || "Unknown"}</div>
            </div>

            <div>
              <Label>Status</Label>
              <div className="mt-1">
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Total Amount</Label>
              <div className="mt-1 font-medium">${order.total_amount.toFixed(2)}</div>
            </div>

            <div>
              <Label>Date Placed</Label>
              <div className="mt-1 font-medium">{formatDate(order.created_at)}</div>
            </div>
          </div>

          <div>
            <Label>Items</Label>
            <div className="mt-2 space-y-3">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium">
                        {item.product?.name || `Product #${item.product_id.slice(0, 8)}`}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Quantity: {item.quantity} @ ${item.price_per_unit.toFixed(2)} each
                      </div>
                      {item.product && (
                        <div className="text-muted-foreground mt-1 text-xs">
                          Current stock: {item.product.stock_quantity}
                        </div>
                      )}
                    </div>
                    <div className="font-medium">${(item.quantity * item.price_per_unit).toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground py-4 text-center">No items found for this order</div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
