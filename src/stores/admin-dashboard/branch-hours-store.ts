import { create } from "zustand";

import { formatDate, getNextTwoWeeksRange } from "@/lib/date-utils";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type BranchHours = {
  id: string;
  branch_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  open_time: string | null; // "HH:MM"
  close_time: string | null; // "HH:MM"
  is_closed: boolean;
  specific_date?: string | null; // Date-specific hours (YYYY-MM-DD format)
};

type HoursState = {
  hours: BranchHours[];
  fetchHoursForBranch: (branchId: string) => Promise<void>;
  fetchHoursForBranchForNextTwoWeeks: (branchId: string) => Promise<void>;
  getHoursForBranch: (branchId: string) => BranchHours[];
  getHoursForBranchAndDate: (branchId: string, date: Date) => Promise<BranchHours | null>;
  getHoursForBranchForNextTwoWeeks: (branchId: string) => BranchHours[];
  updateHours: (hour: BranchHours) => Promise<void>;
  addHours: (hour: Omit<BranchHours, "id">) => Promise<void>;
  deleteHours: (id: string) => Promise<void>;
};

export const useBranchHoursStore = create<HoursState>((set, get) => ({
  hours: [],
  fetchHoursForBranch: async (branchId: string) => {
    console.log("Fetching hours for branch:", branchId);
    const { data, error } = await supabase.from("branch_hours").select("*").eq("branch_id", branchId);
    if (error) {
      console.error("Error fetching branch hours:", error);
      return;
    }
    console.log("Fetched branch hours:", data);
    const existingHours = get().hours.filter((h) => h.branch_id !== branchId);
    set({ hours: [...existingHours, ...(data as BranchHours[])] });
    console.log("Updated store with branch hours");
  },
  fetchHoursForBranchForNextTwoWeeks: async (branchId: string) => {
    console.log("Fetching hours for branch for next two weeks:", branchId);
    const { startDate, endDate } = getNextTwoWeeksRange();

    // Fetch both default hours and date-specific hours for the next two weeks
    const { data, error } = await supabase
      .from("branch_hours")
      .select("*")
      .eq("branch_id", branchId)
      .or(`specific_date.is.null,specific_date.gte.${formatDate(startDate)},specific_date.lte.${formatDate(endDate)}`);

    if (error) {
      console.error("Error fetching branch hours for next two weeks:", error);
      return;
    }

    console.log("Fetched branch hours for next two weeks:", data);
    const existingHours = get().hours.filter((h) => h.branch_id !== branchId);
    set({ hours: [...existingHours, ...(data as BranchHours[])] });
    console.log("Updated store with branch hours for next two weeks");
  },
  getHoursForBranch: (branchId: string) => {
    console.log("Getting hours for branch:", branchId);
    const branchHours = get().hours.filter((h) => h.branch_id === branchId);
    console.log("Found branch hours:", branchHours);
    // Ensure all 7 days are present for a branch (default hours)
    const days = Array.from({ length: 7 }, (_, i) => i);
    const result = days.map((day) => {
      // First check for date-specific hours
      const dateSpecific = branchHours.find(
        (h) => h.day_of_week === day && h.specific_date !== null && h.specific_date !== undefined,
      );
      if (dateSpecific) {
        console.log("Found date-specific hour for day", day, ":", dateSpecific);
        return dateSpecific;
      }

      // Then check for default hours
      const existing = branchHours.find(
        (h) => h.day_of_week === day && (h.specific_date === null || h.specific_date === undefined),
      );
      if (existing) {
        console.log("Found existing default hour for day", day, ":", existing);
        return existing;
      }

      const defaultHour = {
        id: `default-${branchId}-${day}`,
        branch_id: branchId,
        day_of_week: day,
        open_time: "09:00",
        close_time: "17:00",
        is_closed: day === 0 || day === 6, // Default Sunday/Saturday to closed
      };
      console.log("Creating default hour for day", day, ":", defaultHour);
      return defaultHour;
    });
    console.log("Returning hours for branch:", result);
    return result;
  },
  getHoursForBranchAndDate: async (branchId: string, date: Date): Promise<BranchHours | null> => {
    console.log("Getting hours for branch and date:", branchId, date);

    // First try to get date-specific hours
    const { data: dateSpecificData, error: dateSpecificError } = await supabase
      .from("branch_hours")
      .select("*")
      .eq("branch_id", branchId)
      .eq("specific_date", formatDate(date));

    if (dateSpecificError) {
      console.error("Error fetching date-specific hours:", dateSpecificError);
    }

    if (dateSpecificData && dateSpecificData.length > 0) {
      console.log("Found date-specific hours:", dateSpecificData[0]);
      return dateSpecificData[0] as BranchHours;
    }

    // If no date-specific hours found, get default hours
    const dayOfWeek = date.getDay();
    const { data: defaultData, error: defaultError } = await supabase
      .from("branch_hours")
      .select("*")
      .eq("branch_id", branchId)
      .eq("day_of_week", dayOfWeek)
      .is("specific_date", null);

    if (defaultError) {
      console.error("Error fetching default hours:", defaultError);
      return null;
    }

    if (defaultData && defaultData.length > 0) {
      console.log("Found default hours:", defaultData[0]);
      return defaultData[0] as BranchHours;
    }

    // If no hours found at all, return default
    const defaultHour = {
      id: `default-${branchId}-${dayOfWeek}`,
      branch_id: branchId,
      day_of_week: dayOfWeek,
      open_time: "09:00",
      close_time: "17:00",
      is_closed: dayOfWeek === 0 || dayOfWeek === 6, // Default Sunday/Saturday to closed
    };
    console.log("Creating default hour:", defaultHour);
    return defaultHour;
  },
  getHoursForBranchForNextTwoWeeks: (branchId: string) => {
    console.log("Getting hours for branch for next two weeks:", branchId);
    const branchHours = get().hours.filter((h) => h.branch_id === branchId);
    console.log("Found branch hours:", branchHours);

    // Get the next two weeks range
    const { startDate, endDate } = getNextTwoWeeksRange();

    // Create an array of 14 days (2 weeks)
    const result: BranchHours[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 14; i++) {
      const dayOfWeek = currentDate.getDay();
      const formattedDate = formatDate(currentDate);

      // First check for date-specific hours
      const dateSpecific = branchHours.find((h) => h.day_of_week === dayOfWeek && h.specific_date === formattedDate);

      if (dateSpecific) {
        result.push({
          ...dateSpecific,
          specific_date: formattedDate,
        });
      } else {
        // Then check for default hours
        const existing = branchHours.find(
          (h) => h.day_of_week === dayOfWeek && (h.specific_date === null || h.specific_date === undefined),
        );

        if (existing) {
          result.push({
            ...existing,
            specific_date: formattedDate,
          });
        } else {
          // Create default hours
          result.push({
            id: `default-${branchId}-${dayOfWeek}-${formattedDate}`,
            branch_id: branchId,
            day_of_week: dayOfWeek,
            open_time: "09:00",
            close_time: "17:00",
            is_closed: dayOfWeek === 0 || dayOfWeek === 6, // Default Sunday/Saturday to closed
            specific_date: formattedDate,
          });
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("Returning hours for branch for next two weeks:", result);
    return result;
  },
  updateHours: async (updatedHour) => {
    console.log("Updating hour:", updatedHour);
    // Check if this is a default hour (not in DB yet)
    if (updatedHour.id.startsWith("default-")) {
      console.log("This is a default hour, inserting new record");
      // Add new hour to database
      const { data, error } = await supabase
        .from("branch_hours")
        .insert([
          {
            branch_id: updatedHour.branch_id,
            day_of_week: updatedHour.day_of_week,
            open_time: updatedHour.open_time,
            close_time: updatedHour.close_time,
            is_closed: updatedHour.is_closed,
            specific_date: updatedHour.specific_date || null,
          },
        ])
        .select();

      if (error) {
        console.log("Error inserting new hour:", error);
        // Check if it's a unique constraint violation
        if (error.code === "23505") {
          // Unique constraint violation, try updating instead
          console.log("Unique constraint violation, updating instead");

          // Build update query based on whether it's a date-specific hour or default hour
          let query = supabase
            .from("branch_hours")
            .update({
              open_time: updatedHour.open_time,
              close_time: updatedHour.close_time,
              is_closed: updatedHour.is_closed,
            })
            .eq("branch_id", updatedHour.branch_id)
            .eq("day_of_week", updatedHour.day_of_week);

          if (updatedHour.specific_date) {
            query = query.eq("specific_date", updatedHour.specific_date);
          } else {
            query = query.is("specific_date", null);
          }

          const { data: updateData, error: updateError } = await query.select();

          if (updateError) {
            console.error("Error updating branch hours:", updateError);
            throw updateError;
          }

          console.log("Successfully updated existing hour:", updateData[0]);
          // Update the store with the updated hour
          set((state) => ({
            hours: state.hours
              .filter(
                (h) =>
                  !(
                    h.branch_id === updatedHour.branch_id &&
                    h.day_of_week === updatedHour.day_of_week &&
                    h.specific_date === updatedHour.specific_date
                  ),
              )
              .concat(updateData[0] as BranchHours),
          }));
        } else {
          console.error("Error adding branch hours:", error);
          throw error;
        }
      } else {
        console.log("Successfully inserted new hour:", data[0]);
        // Update the store with the new hour
        set((state) => ({
          hours: state.hours
            .filter(
              (h) =>
                !(
                  h.branch_id === updatedHour.branch_id &&
                  h.day_of_week === updatedHour.day_of_week &&
                  h.specific_date === updatedHour.specific_date
                ),
            )
            .concat(data[0] as BranchHours),
        }));
      }
    } else {
      // Update existing hour in database
      console.log("Updating existing hour in database");

      // Build update query based on whether it's a date-specific hour or default hour
      const query = supabase
        .from("branch_hours")
        .update({
          open_time: updatedHour.open_time,
          close_time: updatedHour.close_time,
          is_closed: updatedHour.is_closed,
        })
        .eq("id", updatedHour.id);

      const { data, error } = await query.select();

      if (error) {
        console.error("Error updating branch hours:", error);
        throw error;
      }

      console.log("Successfully updated existing hour:", data[0]);
      // Update the store
      set((state) => {
        const index = state.hours.findIndex((h) => h.id === updatedHour.id);
        if (index !== -1) {
          const newHours = [...state.hours];
          newHours[index] = data[0] as BranchHours;
          return { hours: newHours };
        }
        return state;
      });
    }
  },
  addHours: async (newHour) => {
    const { data, error } = await supabase.from("branch_hours").insert([newHour]).select();

    if (error) {
      console.error("Error adding branch hours:", error);
      throw error;
    }

    set((state) => ({
      hours: [...state.hours, ...(data as BranchHours[])],
    }));
  },
  deleteHours: async (id: string) => {
    // Don't delete default hours, just mark them as closed
    if (id.startsWith("default-")) {
      // This is a default hour, we can't delete it from DB, just update it
      // In this case, we'll just update the store locally
      set((state) => ({
        hours: state.hours.map((h) => (h.id === id ? { ...h, is_closed: true, open_time: null, close_time: null } : h)),
      }));
    } else {
      // Delete from database
      const { error } = await supabase.from("branch_hours").delete().eq("id", id);

      if (error) {
        console.error("Error deleting branch hours:", error);
        throw error;
      }

      // Remove from store
      set((state) => ({
        hours: state.hours.filter((h) => h.id !== id),
      }));
    }
  },
}));
