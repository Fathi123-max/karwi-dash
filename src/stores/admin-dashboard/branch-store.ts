/* eslint-disable import/no-cycle */

import { create } from "zustand";

import { createAdminUserWithRole } from "@/app/(main)/admin/branches/_actions/create-admin-with-role";
import { Branch } from "@/app/(main)/admin/branches/_components/types";
import { calculateBranchRating } from "@/lib/rating-utils";
import { createClient } from "@/lib/supabase/client";

import { useFranchiseStore } from "./franchise-store";
import { useServiceStore } from "./service-store";

const supabase = createClient();

type BranchState = {
  branches: Branch[];
  fetchBranches: () => Promise<void>;
  addBranch: (
    branch: Omit<Branch, "id" | "createdAt"> & {
      adminEmail?: string;
      adminPassword?: string;
      adminRole?: "general" | "franchise" | "branch";
    },
  ) => Promise<void>;
  updateBranch: (branch: Branch) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
};

export const useBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  fetchBranches: async () => {
    // Fetch franchises first to ensure we have the latest data
    await useFranchiseStore.getState().fetchFranchises();
    // Fetch services to ensure we have the latest data
    await useServiceStore.getState().fetchServices();

    const { data, error } = await supabase.from("branches").select("*");
    if (error) {
      console.error("Error fetching branches:", error);
      return;
    }

    const { franchises } = useFranchiseStore.getState();
    const { services } = useServiceStore.getState();

    const transformedBranches = await Promise.all(
      data.map(async (branch) => {
        // Get branch-specific services
        const branchServices = services.filter((s) => s.branchId === branch.id);

        // Get global services (services that are marked as global)
        const globalServices = services.filter((s) => s.is_global);

        // Combine branch-specific and global services, removing duplicates
        const allServices = [...branchServices];
        globalServices.forEach((globalService) => {
          // Only add global service if it's not already in branch services
          if (!allServices.some((s) => s.name === globalService.name)) {
            allServices.push(globalService);
          }
        });

        // Calculate rating if not already set or if it's null
        let ratings = branch.ratings;
        if (ratings === null || ratings === undefined) {
          ratings = await calculateBranchRating(branch.id);
        }

        return {
          id: branch.id,
          name: branch.name,
          location: typeof branch.location === "string" ? branch.location : JSON.stringify(branch.location),
          location_text: branch.location_text,
          franchise_id: branch.franchise_id,
          franchise: franchises.find((f) => f.id === branch.franchise_id)?.name ?? "N/A",
          services: allServices,
          activeBookings: branch.active_bookings,
          createdAt: new Date(branch.created_at),
          address: branch.address,
          city: branch.city,
          phone_number: branch.phone_number,
          ratings: ratings,
          pictures: branch.pictures,
          latitude: branch.latitude,
          longitude: branch.longitude,
        };
      }),
    );

    set({ branches: transformedBranches });
  },
  addBranch: async (branch) => {
    // Start a Supabase transaction
    const { data: branchData, error: branchError } = await supabase
      .from("branches")
      .insert([
        {
          name: branch.name,
          franchise_id: branch.franchise_id,
          location: branch.location,
          address: branch.address,
          city: branch.city,
          phone_number: branch.phone_number,
          ratings: branch.ratings || null,
          pictures: branch.pictures,
          latitude: branch.latitude,
          longitude: branch.longitude,
        },
      ])
      .select();

    if (branchError) {
      console.error("Error adding branch:", branchError);
      throw branchError;
    }

    // If admin credentials are provided, create an admin user with role
    if (branch.adminEmail && branch.adminPassword) {
      try {
        // Use server action to create the admin user with role (requires service role key)
        const result = await createAdminUserWithRole(
          branch.adminEmail,
          branch.adminPassword,
          branch.adminRole || "branch", // Default to branch admin
          branchData[0].id, // Associate with this branch
        );

        if (!result.success) {
          console.error("Error creating admin user:", result.error);
          // Note: We're not throwing here because we still want to create the branch
          // Even if admin user creation fails, the branch should still be created
        }
      } catch (adminError) {
        console.error("Unexpected error creating admin user:", adminError);
        // Continue execution to ensure the branch is created
      }
    }

    await get().fetchBranches();
  },
  updateBranch: async (branch) => {
    const { data, error } = await supabase
      .from("branches")
      .update({
        name: branch.name,
        franchise_id: branch.franchise_id,
        location: branch.location,
        address: branch.address,
        city: branch.city,
        phone_number: branch.phone_number,
        ratings: branch.ratings || null,
        pictures: branch.pictures,
        latitude: branch.latitude,
        longitude: branch.longitude,
      })
      .eq("id", branch.id)
      .select();

    if (error) {
      console.error("Error updating branch:", error);
      return;
    }

    await get().fetchBranches();
  },
  deleteBranch: async (id) => {
    const { error } = await supabase.from("branches").delete().eq("id", id);
    if (error) {
      console.error("Error deleting branch:", error);
      return;
    }
    set((state) => ({
      branches: state.branches.filter((branch) => branch.id !== id),
    }));
  },
}));
