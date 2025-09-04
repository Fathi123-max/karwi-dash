"use client";

import React from "react";

import { useTranslations } from "next-intl";

import { usePaymentStore } from "@/stores/admin-dashboard/payment-store";

import { columns } from "./_components/columns";
import { PaymentDataTable } from "./_components/payment-data-table";

export default function PaymentsPage() {
  const t = useTranslations("admin.payments");
  const { payments, fetchPayments } = usePaymentStore();

  React.useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>
      <PaymentDataTable data={payments} />
    </div>
  );
}
