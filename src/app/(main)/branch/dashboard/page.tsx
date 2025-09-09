"use client";

import { useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBranchAdminStore } from "@/stores/branch-admin-store";

import { useTranslations } from "next-intl";

export default function BranchDashboardPage() {
  const { services, washers, bookings, fetchAllData, isLoading, error } = useBranchAdminStore();
  const t = useTranslations();
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (isLoading) {
    return <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">{t("common.loading")}</div>;
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
        <h2 className="text-3xl font-bold tracking-tight">Branch Dashboard</h2>
        <p className="text-muted-foreground">Welcome to your branch administration dashboard</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Washers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{washers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                bookings.filter(
                  (booking) => new Date(booking.scheduled_at).toDateString() === new Date().toDateString(),
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("admin.bookings.recent.title")}</CardTitle>
            <CardDescription>{t("admin.bookings.recent.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings
                .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
                .slice(0, 5)
                .map((booking) => (
                  <div key={booking.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm leading-none font-medium">Booking #{booking.id.slice(0, 8)}</p>
                      <p className="text-muted-foreground text-sm">{new Date(booking.scheduled_at).toLocaleString()}</p>
                    </div>
                    <div className="ml-auto font-medium">
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("admin.services.title")}</CardTitle>
            <CardDescription>{t("admin.services.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.slice(0, 5).map((service) => (
                <div key={service.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm leading-none font-medium">{service.name}</p>
                    <p className="text-muted-foreground text-sm">${service.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
