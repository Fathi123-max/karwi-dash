import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type WasherSchedule = {
  id: string;
  washer_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
};

type ScheduleState = {
  schedules: WasherSchedule[];
  fetchSchedulesForWasher: (washerId: string) => Promise<void>;
  getSchedulesForWasher: (washerId: string) => WasherSchedule[];
  addSchedule: (schedule: Omit<WasherSchedule, "id">) => Promise<void>;
  deleteSchedule: (scheduleId: string) => Promise<void>;
};

export const useWasherScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: [],
  fetchSchedulesForWasher: async (washerId: string) => {
    const { data, error } = await supabase.from("washer_schedules").select("*").eq("washer_id", washerId);
    if (error) {
      console.error("Error fetching washer schedules:", error);
      return;
    }
    const existingSchedules = get().schedules.filter((s) => s.washer_id !== washerId);
    set({ schedules: [...existingSchedules, ...(data as WasherSchedule[])] });
  },
  getSchedulesForWasher: (washerId: string) => {
    return get().schedules.filter((schedule) => schedule.washer_id === washerId);
  },
  addSchedule: async (schedule) => {
    const { data, error } = await supabase.from("washer_schedules").insert([schedule]).select().single();

    if (error) {
      console.error("Error adding washer schedule:", error);
      throw error;
    }

    set((state) => ({
      schedules: [...state.schedules, data as WasherSchedule],
    }));
  },
  deleteSchedule: async (scheduleId) => {
    const { error } = await supabase.from("washer_schedules").delete().eq("id", scheduleId);

    if (error) {
      console.error("Error deleting washer schedule:", error);
      throw error;
    }

    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== scheduleId),
    }));
  },
}));
