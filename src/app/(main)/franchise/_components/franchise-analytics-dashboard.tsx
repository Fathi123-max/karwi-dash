"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFranchiseAnalyticsStore } from "@/stores/franchise-dashboard/analytics-store";

import { FranchiseAnalyticsChart } from "./franchise-analytics-chart";
import FranchiseMetrics from "./franchise-metrics";

export function FranchiseAnalyticsDashboard() {
  const t = useTranslations("franchise.analytics");
  const {
    branches,
    services,
    washers,
    bookings,
    bookingTrends,
    revenueData,
    servicePerformance,
    washerPerformance,
    branchPerformance,
    fetchAllData,
    fetchBookingTrends,
    fetchRevenueData,
    fetchServicePerformance,
    fetchWasherPerformance,
    fetchBranchPerformance,
  } = useFranchiseAnalyticsStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchAllData(),
          fetchBookingTrends(),
          fetchRevenueData(),
          fetchServicePerformance(),
          fetchWasherPerformance(),
          fetchBranchPerformance(),
        ]);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, [
    fetchAllData,
    fetchBookingTrends,
    fetchRevenueData,
    fetchServicePerformance,
    fetchWasherPerformance,
    fetchBranchPerformance,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <FranchiseMetrics
        totalBranches={branches.length}
        totalServices={services.length}
        activeWashers={washers.length}
        totalBookings={bookings.length}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("bookingTrends.title")}</CardTitle>
            <CardDescription>{t("bookingTrends.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <FranchiseAnalyticsChart
              data={bookingTrends}
              dataKey="count"
              title={t("bookingTrends.chartTitle")}
              color="#5eead4"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("revenueTrends.title")}</CardTitle>
            <CardDescription>{t("revenueTrends.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <FranchiseAnalyticsChart
              data={revenueData}
              dataKey="amount"
              title={t("revenueTrends.chartTitle")}
              color="#60a5fa"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("servicePerformance.title")}</CardTitle>
            <CardDescription>{t("servicePerformance.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <FranchiseAnalyticsChart
              data={servicePerformance}
              dataKey="bookings"
              title={t("servicePerformance.chartTitle")}
              color="#f87171"
              type="bar"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("washerPerformance.title")}</CardTitle>
            <CardDescription>{t("washerPerformance.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <FranchiseAnalyticsChart
              data={washerPerformance}
              dataKey="bookings"
              title={t("washerPerformance.chartTitle")}
              color="#fbbf24"
              type="bar"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("branchPerformance.title")}</CardTitle>
          <CardDescription>{t("branchPerformance.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <FranchiseAnalyticsChart
            data={branchPerformance}
            dataKey="bookings"
            title={t("branchPerformance.chartTitle")}
            color="#a78bfa"
            type="bar"
          />
        </CardContent>
      </Card>
    </div>
  );
}
