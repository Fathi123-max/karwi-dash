"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay, isSameMonth, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWasherScheduleStore } from "@/stores/admin-dashboard/washer-schedule-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

import { ScheduleDetail } from "./types";

export function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { washers } = useWasherStore();
  const { schedules } = useWasherScheduleStore();

  // Generate days for the current week view
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday as start
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  };

  const getSchedulesForDate = (date: Date): ScheduleDetail[] => {
    const dayOfWeek = date.getDay();
    const dailySchedules = schedules.filter((s) => s.day_of_week === dayOfWeek);

    return dailySchedules
      .map((schedule) => {
        const washer = washers.find((w) => w.id === schedule.washer_id);
        if (!washer) return null;
        
        return {
          id: schedule.id,
          washer,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
        };
      })
      .filter((item): item is ScheduleDetail => item !== null);
  };

  const selectedDaySchedules = getSchedulesForDate(selectedDate);

  // Navigation functions
  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const weekDays = getWeekDays();

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
      </div>

      {/* Week View */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>
            Select a day to view washer schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b">
            <div className="p-2 border-r">
              <div className="text-sm font-medium text-muted-foreground">Time</div>
            </div>
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className={`p-2 text-center cursor-pointer border-l ${
                  isSameDay(day, selectedDate)
                    ? "bg-primary text-primary-foreground"
                    : isToday(day)
                    ? "bg-secondary"
                    : ""
                }`}
                onClick={() => selectDate(day)}
              >
                <div className="text-sm font-medium">
                  {format(day, "EEE")}
                </div>
                <div className="text-lg">{format(day, "d")}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Details */}
      <Card>
        <CardHeader>
          <CardTitle>
            Schedule for {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </CardTitle>
          <CardDescription>
            {selectedDaySchedules.length} {selectedDaySchedules.length === 1 ? 'washer' : 'washers'} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {selectedDaySchedules.length > 0 ? (
              <div className="space-y-4">
                {selectedDaySchedules.map((detail) => (
                  <div 
                    key={detail.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {detail.washer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{detail.washer.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {detail.washer.branch}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {detail.startTime} - {detail.endTime}
                      </Badge>
                      <Badge 
                        variant={detail.washer.status === "active" ? "default" : "destructive"}
                      >
                        {detail.washer.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                  No washers scheduled for this day.
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}