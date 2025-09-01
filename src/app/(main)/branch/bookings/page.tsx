"use client";

import { useEffect } from "react";

import { useBranchAdminStore } from "@/stores/branch-admin-store";

import { BranchBookingsTable } from "./_components/branch-bookings-table";

export default function BranchBookingsPage() {
  const { bookings, fetchBookings, isLoading, error } = useBranchAdminStore();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (isLoading) {
    return <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">Manage bookings for your branch</p>
      </div>
      <BranchBookingsTable data={bookings} />
    </div>
  );
}
