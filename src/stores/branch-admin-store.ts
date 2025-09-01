/* eslint-disable @typescript-eslint/no-unused-vars */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { getCurrentBranchAdminBranchId } from "@/server/branch-admin-actions";
import { Booking, Service, Washer } from "@/types/franchise";

// Define types for our branch admin data
export type BranchAdminState = {
  // Data
  services: Service[];
  washers: Washer[];
  bookings: Booking[];

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAllData: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchWashers: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  refreshAll: () => Promise<void>;
};

const supabase = createClientComponentClient();

export const useBranchAdminStore = create<BranchAdminState>((set, get) => ({
  services: [],
  washers: [],
  bookings: [],
  isLoading: false,
  error: null,

  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      await Promise.all([get().fetchServices(), get().fetchWashers(), get().fetchBookings()]);
    } catch (error) {
      set({ error: "Failed to fetch data" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchServices: async () => {
    const branchId = await getCurrentBranchAdminBranchId();
    if (!branchId) {
      throw new Error("Branch ID not found for current user");
    }

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .or(`branch_id.eq.${branchId},is_global.eq.true`);

    if (error) {
      console.error("Error fetching services:", error);
      throw error;
    }

    set({ services: data as Service[] });
  },

  fetchWashers: async () => {
    const branchId = await getCurrentBranchAdminBranchId();
    if (!branchId) {
      throw new Error("Branch ID not found for current user");
    }

    const { data, error } = await supabase.from("washers").select("*").eq("branch_id", branchId);

    if (error) {
      console.error("Error fetching washers:", error);
      throw error;
    }

    set({ washers: data as Washer[] });
  },

  fetchBookings: async () => {
    const branchId = await getCurrentBranchAdminBranchId();
    if (!branchId) {
      throw new Error("Branch ID not found for current user");
    }

    const { data, error } = await supabase.from("bookings").select("*").eq("branch_id", branchId);

    if (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }

    set({ bookings: data as Booking[] });
  },

  refreshAll: async () => {
    set({ isLoading: true, error: null });
    try {
      await get().fetchAllData();
    } catch (error) {
      set({ error: "Failed to refresh data" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
