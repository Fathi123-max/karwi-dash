"use client";

import { useState, useEffect } from "react";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFranchiseAnalyticsStore } from "@/stores/franchise-dashboard/analytics-store";

import { FranchiseAnalyticsChart } from "./franchise-analytics-chart";

export function BranchAnalyticsView() {
  const t = useTranslations("franchise.branchAnalytics");
  const { branches, services, washers, bookings, fetchAllData } = useFranchiseAnalyticsStore();

  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Filter data based on selected branch
  const filteredBookings =
    selectedBranch === "all" ? bookings : bookings.filter((booking) => booking.branch_id === selectedBranch);

  const filteredWashers =
    selectedBranch === "all" ? washers : washers.filter((washer) => washer.branch_id === selectedBranch);

  const filteredServices =
    selectedBranch === "all"
      ? services
      : services.filter((service) => service.branch_id === selectedBranch || service.is_global);

  // Calculate branch-specific metrics
  const branchMetrics = branches.map((branch) => {
    const branchBookings = bookings.filter((b) => b.branch_id === branch.id);
    const branchWashers = washers.filter((w) => w.branch_id === branch.id);
    const branchServices = services.filter((s) => s.branch_id === branch.id || s.is_global);

    return {
      branch_id: branch.id,
      branch_name: branch.name,
      total_bookings: branchBookings.length,
      total_washers: branchWashers.length,
      total_services: branchServices.length,
    };
  });

  // Service performance for selected branch
  const servicePerformance = filteredServices.map((service) => {
    const serviceBookings = filteredBookings.filter((b) => b.service_id === service.id);
    return {
      service_id: service.id,
      service_name: service.name,
      bookings: serviceBookings.length,
    };
  });

  // Washer performance for selected branch
  const washerPerformance = filteredWashers.map((washer) => {
    const washerBookings = filteredBookings.filter((b) => b.washer_id === washer.id);
    return {
      washer_id: washer.id,
      washer_name: washer.name,
      bookings: washerBookings.length,
      rating: washer.rating,
    };
  });

  // Booking trends for selected branch
  const bookingTrends = filteredBookings.reduce((acc: Record<string, number>, booking) => {
    if (booking.scheduled_at) {
      const date = booking.scheduled_at.split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {});

  const bookingTrendData = Object.entries(bookingTrends).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="w-64">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectBranch")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allBranches")}</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalBookings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredBookings.length}</div>
            <p className="text-muted-foreground text-xs">
              {selectedBranch === "all" ? t("acrossAllBranches") : t("forSelectedBranch")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("activeWashers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredWashers.length}</div>
            <p className="text-muted-foreground text-xs">
              {selectedBranch === "all" ? t("acrossAllBranches") : t("forSelectedBranch")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalServices")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredServices.length}</div>
            <p className="text-muted-foreground text-xs">
              {selectedBranch === "all" ? t("acrossAllBranches") : t("forSelectedBranch")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("bookingTrends")}</CardTitle>
            <CardDescription>{t("dailyBookings")}</CardDescription>
          </CardHeader>
          <CardContent>
            <FranchiseAnalyticsChart data={bookingTrendData} dataKey="count" title={t("bookings")} color="#5eead4" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("servicePerformance")}</CardTitle>
            <CardDescription>{t("bookingsByService")}</CardDescription>
          </CardHeader>
          <CardContent>
            <FranchiseAnalyticsChart
              data={servicePerformance}
              dataKey="bookings"
              title={t("bookings")}
              color="#f87171"
              type="bar"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("washerPerformance")}</CardTitle>
            <CardDescription>{t("bookingsByWasher")}</CardDescription>
          </CardHeader>
          <CardContent>
            <FranchiseAnalyticsChart
              data={washerPerformance}
              dataKey="bookings"
              title={t("bookings")}
              color="#fbbf24"
              type="bar"
            />
          </CardContent>
        </Card>

        {selectedBranch === "all" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("branchComparison")}</CardTitle>
              <CardDescription>{t("bookingsByBranch")}</CardDescription>
            </CardHeader>
            <CardContent>
              <FranchiseAnalyticsChart
                data={branchMetrics}
                dataKey="total_bookings"
                title={t("bookings")}
                color="#a78bfa"
                type="bar"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
