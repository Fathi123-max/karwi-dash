"use client";

import { useEffect } from "react";

import { useWasherScheduleStore } from "@/stores/admin-dashboard/washer-schedule-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

import { ScheduleView } from "./_components/schedule-view";

export default function SchedulePage() {
  const { fetchSchedulesForWasher } = useWasherScheduleStore();
  const { washers, fetchWashers } = useWasherStore();

  useEffect(() => {
    const initializeData = async () => {
      await fetchWashers();
    };

    initializeData();
  }, [fetchWashers]);

  useEffect(() => {
    // Fetch schedules for all washers when washers change
    washers.forEach(washer => {
      fetchSchedulesForWasher(washer.id);
    });
  }, [washers, fetchSchedulesForWasher]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Washer Schedule</h1>
        <p className="text-muted-foreground">
          Manage and view washer schedules across all branches
        </p>
      </div>
      
      <ScheduleView />
    </div>
  );
}