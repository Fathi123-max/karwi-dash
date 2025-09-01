"use client";

import { useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminProductOrderStore } from "@/stores/admin-dashboard/product-order-store";

import { OrderList } from "./_components/order-list";

export default function AdminProductOrdersPage() {
  const { fetchOrders, loading } = useAdminProductOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Orders</h2>
          <p className="text-muted-foreground">Manage franchise product orders</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage all franchise product orders</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderList />
        </CardContent>
      </Card>
    </div>
  );
}
