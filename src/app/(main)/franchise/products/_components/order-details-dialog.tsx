"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFranchiseProductStore, ProductOrder, OrderItem } from "@/stores/franchise-dashboard/product-store";

// Define the type for our order data
type ProductOrderWithItems = ProductOrder & {
  order_items: OrderItem[];
};

interface OrderDetailsDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ orderId, open, onOpenChange }: OrderDetailsDialogProps) {
  const t = useTranslations("franchise.products.orderHistory");
  const { orders } = useFranchiseProductStore();
  const [order, setOrder] = useState<ProductOrderWithItems | null>(null);

  useEffect(() => {
    if (orderId) {
      const foundOrder = orders.find((o) => o.id === orderId) as ProductOrderWithItems | undefined;
      setOrder(foundOrder || null);
    } else {
      setOrder(null);
    }
  }, [orderId, orders]);

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP p");
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            {t("pending")}
          </span>
        );
      case "processing":
        return (
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {t("processing")}
          </span>
        );
      case "shipped":
        return (
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
            {t("shipped")}
          </span>
        );
      case "delivered":
        return (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            {t("delivered")}
          </span>
        );
      case "cancelled":
        return (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            {t("cancelled")}
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {t("unknown")}
          </span>
        );
    }
  };

  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("orderDetails")}</DialogTitle>
          <DialogDescription>
            {t("order")} #{order.id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium">{t("orderDate")}</h4>
              <p className="text-muted-foreground text-sm">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("status")}</h4>
              <div className="mt-1">{getStatusBadge(order.status)}</div>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("totalAmount")}</h4>
              <p className="text-muted-foreground text-sm">${order.total_amount.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">{t("orderItems")}</h4>
            <div className="space-y-2">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded border p-3">
                  <div>
                    <div className="font-medium">
                      {item.product?.name || `${t("product")} #${item.product_id.slice(0, 8)}`}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {t("quantity")}: {item.quantity} @ ${item.price_per_unit.toFixed(2)} {t("each")}
                    </div>
                  </div>
                  <div className="font-medium">${(item.quantity * item.price_per_unit).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>{t("close")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
