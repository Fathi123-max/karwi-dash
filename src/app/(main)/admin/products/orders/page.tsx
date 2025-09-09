"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminProductOrderStore } from "@/stores/admin-dashboard/product-order-store";

import { OrderList } from "./_components/order-list";

export default function AdminProductOrdersPage() {
  const t = useTranslations("admin.products.orders");
  const tProducts = useTranslations("admin.products");
  const { fetchOrders, loading } = useAdminProductOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tProducts("orders.title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderList />
        </CardContent>
      </Card>
    </div>
  );
}
