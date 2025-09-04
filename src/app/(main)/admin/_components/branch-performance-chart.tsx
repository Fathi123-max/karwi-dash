"use client";

import { useState, useMemo } from "react";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";

export function BranchPerformanceChart() {
  const { branches } = useBranchStore();
  const { franchises } = useFranchiseStore();
  const [selectedFranchise, setSelectedFranchise] = useState<string>("all");

  // Filter branches based on selected franchise
  const filteredBranches = useMemo(() => {
    if (selectedFranchise === "all") {
      return branches;
    }
    return branches.filter((branch) => branch.franchise_id === selectedFranchise);
  }, [branches, selectedFranchise]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return filteredBranches.map((branch) => ({
      name: branch.name.length > 15 ? `${branch.name.substring(0, 15)}...` : branch.name,
      services: branch.services?.length ?? 0,
      "Active Bookings": branch.activeBookings ?? 0,
      franchise: branch.franchise,
    }));
  }, [filteredBranches]);

  // Get unique franchises for filter dropdown
  const franchiseOptions = useMemo(() => {
    return [
      { value: "all", label: "All Franchises" },
      ...franchises.map((franchise) => ({
        value: franchise.id,
        label: franchise.name,
      })),
    ];
  }, [franchises]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{t("admin.branchPerformance.title")}</CardTitle>
          <Select value={selectedFranchise} onValueChange={setSelectedFranchise}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by franchise" />
            </SelectTrigger>
            <SelectContent>
              {franchiseOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 40,
              }}
            >
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip formatter={(value) => [value, "Count"]} labelFormatter={(value) => `Branch: ${value}`} />
              <Legend />
              <Bar dataKey="services" fill="#3b82f6" name="Services Offered" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Active Bookings" fill="#10b981" name="Active Bookings" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-muted-foreground flex h-[350px] items-center justify-center">
            No branch data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
