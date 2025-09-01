"use client";

import { useEffect, useState } from "react";

import { Download, ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { exportToCSV } from "@/lib/export-utils";
import { cn } from "@/lib/utils";
import {
  useFranchiseProductStore,
  ProductOrder,
  OrderItemWithProduct,
} from "@/stores/franchise-dashboard/product-store";

export function OrderHistory() {
  const { orders, fetchOrders } = useFranchiseProductStore();
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleExport = () => {
    exportToCSV(orders, "product-orders.csv", ["id", "created_at", "total_amount", "status"]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Pending</span>;
      case "processing":
        return <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Processing</span>;
      case "shipped":
        return <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">Shipped</span>;
      case "delivered":
        return <span className="rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Delivered</span>;
      case "cancelled":
        return <span className="rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Cancelled</span>;
      default:
        return <span className="rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">Unknown</span>;
    }
  };

  // Type guard to check if order has order_items with product information
  const hasOrderItemsWithProducts = (
    order: ProductOrder,
  ): order is ProductOrder & { order_items: OrderItemWithProduct[] } => {
    return Array.isArray(order.order_items) && order.order_items.length > 0 && "product" in order.order_items[0];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View your previous product orders.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border">
                <div
                  className="hover:bg-muted/50 flex cursor-pointer flex-col p-4 transition-colors md:flex-row md:items-center md:justify-between"
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  <div>
                    <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-muted-foreground text-sm">
                      {new Date(order.created_at).toLocaleDateString()} at{" "}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-4 md:mt-0">
                    <div className="text-right">
                      <p className="font-medium">${order.total_amount.toFixed(2)}</p>
                      <p className="text-muted-foreground text-sm">Total</p>
                    </div>
                    {getStatusBadge(order.status)}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      {expandedOrders[order.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedOrders[order.id] && hasOrderItemsWithProducts(order) && (
                  <div className="bg-muted/30 border-t px-4 py-3">
                    <h4 className="mb-2 font-medium">Order Items:</h4>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-background flex items-center justify-between rounded border p-2"
                        >
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
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
