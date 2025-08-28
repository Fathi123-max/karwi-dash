/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

import { Clock, Save, CheckCircle, XCircle, Calendar, Sun, Moon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate, getNextTwoWeeksRange } from "@/lib/date-utils";
import { useBranchHoursStore } from "@/stores/admin-dashboard/branch-hours-store";

interface TimeSlot {
  id: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
  date?: string; // Date in YYYY-MM-DD format
}

interface BranchTimeSlotsForTwoWeeksProps {
  branchId: string;
  className?: string;
  onTimeSlotsChange?: (timeSlots: TimeSlot[]) => void;
  onSaveTimeSlots?: () => Promise<boolean>; // Returns true if save was successful
  showSaveButton?: boolean; // Whether to show the save button
  title?: string; // Custom title for the card
  description?: string; // Custom description for the card
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const BranchTimeSlotsForTwoWeeks = forwardRef<
  { handleSaveAll: () => Promise<boolean> },
  BranchTimeSlotsForTwoWeeksProps
>(
  (
    {
      branchId,
      className,
      onTimeSlotsChange,
      onSaveTimeSlots,
      showSaveButton = true,
      title = "Hours for Next 2 Weeks",
      description = "Set specific operating hours for each day in the next 2 weeks. These hours will override the regular weekly hours for the specified dates.",
    }: BranchTimeSlotsForTwoWeeksProps,
    ref,
  ) => {
    const { fetchHoursForBranchForNextTwoWeeks, getHoursForBranchForNextTwoWeeks, updateHours } = useBranchHoursStore();
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);

    // Get the date range for display
    const { startDate, endDate } = getNextTwoWeeksRange();
    const startDateString = formatDate(startDate);
    const endDateString = formatDate(endDate);

    useEffect(() => {
      const fetchHours = async () => {
        setIsLoading(true);
        try {
          // For new branches, create default time slots for 2 weeks
          if (branchId === "new") {
            const { startDate } = getNextTwoWeeksRange();
            const slots: TimeSlot[] = [];
            const currentDate = new Date(startDate);

            for (let i = 0; i < 14; i++) {
              const dayOfWeek = currentDate.getDay();
              slots.push({
                id: `new-${i}`,
                dayOfWeek,
                openTime: dayOfWeek === 0 || dayOfWeek === 6 ? null : "09:00", // Sunday and Saturday closed by default
                closeTime: dayOfWeek === 0 || dayOfWeek === 6 ? null : "17:00",
                isClosed: dayOfWeek === 0 || dayOfWeek === 6, // Sunday and Saturday closed by default
                date: formatDate(currentDate),
              });
              currentDate.setDate(currentDate.getDate() + 1);
            }

            setTimeSlots(slots);
            console.log("Set default time slots for new branch for 2 weeks:", slots);
          } else {
            console.log("Fetching hours for branch for next 2 weeks:", branchId);
            await fetchHoursForBranchForNextTwoWeeks(branchId);
            const hours = getHoursForBranchForNextTwoWeeks(branchId);
            console.log("Got hours from store for 2 weeks:", hours);

            // Transform to our local format
            const slots = hours.map((h) => ({
              id: h.id,
              dayOfWeek: h.day_of_week,
              openTime: h.open_time,
              closeTime: h.close_time,
              isClosed: h.is_closed,
              date: h.specific_date || undefined,
            }));

            console.log("Transformed slots for 2 weeks:", slots);
            setTimeSlots(slots);

            // Always initialize hasUnsavedChanges to false when loading data
            setHasUnsavedChanges(false);
            console.log("Initialized hasUnsavedChanges to false");

            if (onTimeSlotsChange) {
              onTimeSlotsChange(slots);
            }
          }
        } catch (error) {
          console.error("Error fetching branch hours for 2 weeks:", error);
        } finally {
          setIsLoading(false);
        }
      };

      if (branchId) {
        fetchHours();
      }
    }, [branchId, fetchHoursForBranchForNextTwoWeeks, getHoursForBranchForNextTwoWeeks]);

    const handleTimeChange = (index: number, field: "openTime" | "closeTime", value: string) => {
      console.log(`Time change for slot ${index}, field ${field}, value ${value}`);
      const updatedSlots = timeSlots.map((slot, i) => {
        if (i === index) {
          const updatedSlot = {
            ...slot,
            [field]: value,
          };
          console.log(`Updating slot at index ${index}:`, updatedSlot);
          return updatedSlot;
        }
        return slot;
      });
      console.log("Updated slots:", updatedSlots);
      setTimeSlots(updatedSlots);
      setHasUnsavedChanges(true);
      console.log("Time slot changed, hasUnsavedChanges set to:", true);
      if (onTimeSlotsChange) {
        onTimeSlotsChange(updatedSlots);
      }
    };

    const handleClosedChange = (index: number, checked: boolean) => {
      console.log(`Closed change for slot ${index}, checked ${checked}`);
      setTimeSlots((prev) =>
        prev.map((slot, i) =>
          i === index
            ? {
                ...slot,
                isClosed: checked,
                openTime: checked ? null : (slot.openTime ?? "09:00"),
                closeTime: checked ? null : (slot.closeTime ?? "17:00"),
              }
            : slot,
        ),
      );
      setHasUnsavedChanges(true);
      console.log("Time slot closed state changed, hasUnsavedChanges set to:", true);
    };

    // Expose save function to parent component
    useImperativeHandle(ref, () => ({
      handleSaveAll,
    }));

    const handleSaveAll = async (): Promise<boolean> => {
      console.log("handleSaveAll called for 2 weeks");
      // For new branches, we don't save to database yet
      if (branchId === "new") {
        console.log("This is a new branch, not saving to database yet");
        setHasUnsavedChanges(false);
        setSaveStatus("success");
        // Reset success status after 3 seconds
        setTimeout(() => {
          setSaveStatus(null);
        }, 3000);
        return true; // Return success
      }

      console.log("Saving time slots for existing branch for 2 weeks:", branchId);
      setIsSaving(true);
      setSaveStatus(null);

      try {
        // Log the time slots being saved for debugging
        console.log("Saving time slots for 2 weeks:", timeSlots);

        const promises = timeSlots.map((slot) =>
          updateHours({
            id: slot.id,
            branch_id: branchId,
            day_of_week: slot.dayOfWeek,
            open_time: slot.isClosed ? null : slot.openTime,
            close_time: slot.isClosed ? null : slot.closeTime,
            is_closed: slot.isClosed,
            specific_date: slot.date || null,
          }),
        );
        await Promise.all(promises);
        setHasUnsavedChanges(false);
        setSaveStatus("success");
        console.log("Time slots saved successfully for 2 weeks, hasUnsavedChanges set to:", false);

        // Reset success status after 3 seconds
        setTimeout(() => {
          setSaveStatus(null);
        }, 3000);
        return true; // Return success
      } catch (error) {
        console.error("Error saving time slots for 2 weeks:", error);
        setSaveStatus("error");
        return false; // Return failure
      } finally {
        setIsSaving(false);
      }
    };

    if (isLoading) {
      return (
        <Card className={className}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              <span className="ml-2">Loading time slots...</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={`${className} flex h-full flex-col`}>
        <CardHeader className="bg-muted/30 sticky top-0 z-10 border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="mt-1">
                  {description} ({startDateString} to {endDateString})
                </CardDescription>
              )}
            </div>

            <div className="flex items-center gap-2">
              {saveStatus === "success" && (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Changes saved successfully
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center text-sm text-red-600">
                  <XCircle className="mr-1 h-4 w-4" />
                  Error saving changes
                </div>
              )}
              {/* Always show the save button for time slots, even when showSaveButton is false */}
              {hasUnsavedChanges && (
                <Button onClick={() => handleSaveAll()} disabled={isSaving} className="w-full sm:w-auto">
                  {isSaving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Hours
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <div className="h-full overflow-auto p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {timeSlots.map((slot, index) => {
                const dateObj = slot.date ? new Date(slot.date) : null;
                const dateString = dateObj
                  ? dateObj.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })
                  : "";

                // Determine if it's a weekend
                const isWeekend = slot.dayOfWeek === 0 || slot.dayOfWeek === 6;

                return (
                  <div
                    key={index}
                    className={`flex flex-col rounded-xl border p-4 transition-all duration-200 ${
                      slot.isClosed
                        ? "bg-muted/50 opacity-80"
                        : isWeekend
                          ? "bg-orange-50/50 hover:border-orange-200 hover:bg-orange-50"
                          : "bg-background hover:bg-accent hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            slot.isClosed
                              ? "bg-muted"
                              : isWeekend
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <span className="text-sm font-medium">{dayAbbreviations[slot.dayOfWeek]}</span>
                        </div>
                        <div>
                          <div className="font-medium">{dayNames[slot.dayOfWeek]}</div>
                          <div className="text-muted-foreground text-xs">{dateString}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Checkbox
                          id={`closed-${index}`}
                          checked={slot.isClosed}
                          onCheckedChange={(checked) => handleClosedChange(index, checked as boolean)}
                          className="data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground"
                        />
                        <Label htmlFor={`closed-${index}`} className="ml-2 cursor-pointer text-xs font-medium">
                          Closed
                        </Label>
                      </div>
                    </div>

                    {!slot.isClosed ? (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <Label
                            htmlFor={`open-${index}`}
                            className="text-muted-foreground flex items-center gap-1 text-xs font-medium"
                          >
                            <Sun className="h-3 w-3" />
                            Open
                          </Label>
                          <Input
                            id={`open-${index}`}
                            type="time"
                            value={slot.openTime ?? "09:00"}
                            onChange={(e) => {
                              console.log(`Open time change for slot ${index}:`, e.target.value);
                              console.log(`Current slot openTime:`, slot.openTime);
                              handleTimeChange(index, "openTime", e.target.value);
                            }}
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label
                            htmlFor={`close-${index}`}
                            className="text-muted-foreground flex items-center gap-1 text-xs font-medium"
                          >
                            <Moon className="h-3 w-3" />
                            Close
                          </Label>
                          <Input
                            id={`close-${index}`}
                            type="time"
                            value={slot.closeTime ?? "17:00"}
                            onChange={(e) => {
                              console.log(`Close time change for slot ${index}:`, e.target.value);
                              console.log(`Current slot closeTime:`, slot.closeTime);
                              handleTimeChange(index, "closeTime", e.target.value);
                            }}
                            className="w-full"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted/50 mt-4 flex items-center justify-center rounded-lg py-3">
                        <XCircle className="text-muted-foreground mr-2 h-4 w-4" />
                        <span className="text-muted-foreground text-sm">Closed all day</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {showSaveButton && hasUnsavedChanges && (
              <div className="bg-background/80 sticky bottom-0 mt-6 py-4 backdrop-blur-sm">
                <Button onClick={() => handleSaveAll()} disabled={isSaving} className="w-full sm:w-auto">
                  {isSaving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save All Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

BranchTimeSlotsForTwoWeeks.displayName = "BranchTimeSlotsForTwoWeeks";

export { BranchTimeSlotsForTwoWeeks };
