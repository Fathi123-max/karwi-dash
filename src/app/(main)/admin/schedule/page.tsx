"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";

import { useWasherScheduleStore } from "@/stores/admin-dashboard/washer-schedule-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

import { ScheduleView } from "./_components/schedule-view";

export default function SchedulePage() {
  const t = useTranslations("admin.schedule");
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
    washers.forEach((washer) => {
      fetchSchedulesForWasher(washer.id);
    });
  }, [washers, fetchSchedulesForWasher]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <ScheduleView />
    </div>
  );
}
