/* eslint-disable import/no-cycle */

import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { Service } from "@/types/database";

import { useBranchStore } from "./branch-store";

const supabase = createClient();

// Extended service type to include all fields from the database
type ExtendedService = Service & {
  description?: string;
  todos?: string[];
  include?: string[];
  is_global?: boolean;
  pictures?: string[];
};

type ServiceState = {
  services: ExtendedService[];
  fetchServices: () => Promise<void>;
  addService: (service: Omit<ExtendedService, "id" | "branchName" | "createdAt">) => Promise<void>;
  addGlobalService: (service: Omit<ExtendedService, "id" | "branchName" | "createdAt" | "branchId">) => Promise<void>;
  updateService: (service: ExtendedService) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  removeService: (id: string) => void; // For local updates
};

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  fetchServices: async () => {
    const { data, error } = await supabase.from("services").select("*");
    if (error) {
      console.error("Error fetching services:", error);
      return;
    }
    const { branches } = useBranchStore.getState();

    // Filter out duplicate global services, only show one instance
    const uniqueServices = data.filter((service, index, self) => {
      // If it's not a global service, always include it
      if (!service.is_global) return true;

      // For global services, only include the first instance
      return index === self.findIndex((s) => s.name === service.name && s.is_global);
    });

    const transformedServices = uniqueServices.map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price,
      duration_min: service.duration_min,
      description: service.description,
      todos: service.todos,
      include: service.include,
      branchId: service.branch_id,
      branchName: service.is_global ? "Global" : (branches.find((b) => b.id === service.branch_id)?.name ?? "N/A"),
      createdAt: new Date(service.created_at),
      is_global: service.is_global ?? false,
      pictures: service.pictures,
    }));
    set({ services: transformedServices as any[] });
  },
  addService: async (service) => {
    // If it's a global service, create it once with null branch_id
    if (service.is_global) {
      const { error } = await supabase.from("services").insert({
        name: service.name,
        description: service.description,
        price: service.price,
        duration_min: service.duration_min,
        todos: service.todos,
        include: service.include,
        branch_id: null,
        is_global: true,
        pictures: service.pictures,
      });

      if (error) {
        console.error("Error adding global service:", error);
        throw error;
      }
    } else {
      // Regular branch-specific service
      const { error } = await supabase.from("services").insert({
        name: service.name,
        description: service.description,
        price: service.price,
        duration_min: service.duration_min,
        todos: service.todos,
        include: service.include,
        branch_id: service.branchId,
        is_global: false,
        pictures: service.pictures,
      });

      if (error) {
        console.error("Error adding service:", error);
        throw error;
      }
    }
    await get().fetchServices();
  },
  addGlobalService: async (service) => {
    // Create a single global service with null branch_id
    const { error } = await supabase.from("services").insert({
      name: service.name,
      description: service.description,
      price: service.price,
      duration_min: service.duration_min,
      todos: service.todos,
      include: service.include,
      branch_id: null,
      is_global: true,
      pictures: service.pictures,
    });

    if (error) {
      console.error("Error adding global service:", error);
      throw error;
    }

    await get().fetchServices();
  },
  updateService: async (service) => {
    // If it's a global service, update the single instance
    if (service.is_global) {
      const { error } = await supabase
        .from("services")
        .update({
          name: service.name,
          description: service.description,
          price: service.price,
          duration_min: service.duration_min,
          todos: service.todos,
          include: service.include,
          is_global: true,
          pictures: service.pictures,
        })
        .eq("id", service.id);

      if (error) {
        console.error("Error updating global service:", error);
        throw error;
      }
    } else {
      // Regular branch-specific service update
      const { error } = await supabase
        .from("services")
        .update({
          name: service.name,
          description: service.description,
          price: service.price,
          duration_min: service.duration_min,
          todos: service.todos,
          include: service.include,
          branch_id: service.branchId,
          is_global: false,
          pictures: service.pictures,
        })
        .eq("id", service.id);

      if (error) {
        console.error("Error updating service:", error);
        throw error;
      }
    }
    await get().fetchServices();
  },
  deleteService: async (id) => {
    // Check if this is a global service
    const serviceToDelete = get().services.find((s) => s.id === id);

    if (serviceToDelete?.is_global) {
      // For global services, delete all instances with the same name
      const { error } = await supabase.from("services").delete().eq("name", serviceToDelete.name).eq("is_global", true);

      if (error) {
        console.error("Error deleting global service:", error);
        throw error;
      }
    } else {
      // Regular branch-specific service deletion
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) {
        console.error("Error deleting service:", error);
        throw error;
      }
    }
    await get().fetchServices();
  },
  removeService: (id) => {
    set((state) => ({ services: state.services.filter((s) => s.id !== id) }));
  },
}));
