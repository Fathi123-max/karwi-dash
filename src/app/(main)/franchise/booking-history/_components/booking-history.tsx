"use client";

import React, { useEffect } from "react";

import { useTranslations } from "next-intl";

import { enrichBookings } from "@/app/(main)/franchise/utils/bookings";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";

import { BookingHistoryDataTable } from "./booking-history-data-table";

const BookingHistory: React.FC = () => {
  const t = useTranslations("franchise.bookings");
  const { bookings, branches, washers, services, fetchBookings, fetchBranches, fetchWashers, fetchServices } =
    useFranchiseDashboardStore();

  useEffect(() => {
    fetchBookings();
    fetchBranches();
    fetchWashers();
    fetchServices();
  }, [fetchBookings, fetchBranches, fetchWashers, fetchServices]);

  const enrichedBookings = enrichBookings(bookings, branches, washers, services);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
      <BookingHistoryDataTable data={enrichedBookings} />
    </div>
  );
};

export default BookingHistory;
