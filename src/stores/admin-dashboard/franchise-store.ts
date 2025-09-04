import { toast } from "sonner";
import { create } from "zustand";

import { Franchise } from "@/app/(main)/admin/franchises/_components/types";
import { createClient } from "@/lib/supabase/client";

import { useAdminStore } from "./admin-store";

const supabase = createClient();

// Updated type for addFranchise parameter
type NewFranchise = Omit<Franchise, "id" | "admin_id" | "createdAt" | "adminName"> & {
  adminEmail: string;
  adminPassword: string;
};

type FranchiseState = {
  franchises: Franchise[];
  fetchFranchises: () => Promise<void>;
  addFranchise: (franchise: NewFranchise) => Promise<void>;
  updateFranchise: (franchise: Franchise) => Promise<void>;
  deleteFranchise: (id: string) => Promise<void>;
};

export const useFranchiseStore = create<FranchiseState>((set, get) => ({
  franchises: [],
  fetchFranchises: async () => {
    // Only fetch admins if we don't have them yet
    const { admins } = useAdminStore.getState();
    if (admins.length === 0) {
      await useAdminStore.getState().fetchAdmins();
    }

    const { data, error } = await supabase.from("franchises").select("*");
    if (error) {
      console.error("Error fetching franchises:", error);
      return;
    }

    const { admins: updatedAdmins } = useAdminStore.getState();
    const transformedFranchises = data.map((franchise) => ({
      id: franchise.id,
      admin_id: franchise.admin_id,
      name: franchise.name,
      status: franchise.status,
      branches: franchise.branches,
      washers: franchise.washers,
      createdAt: new Date(franchise.created_at),
      adminName: updatedAdmins.find((a) => a.id === franchise.admin_id)?.name ?? "N/A",
    }));

    set({ franchises: transformedFranchises });
  },
  addFranchise: async (franchise) => {
    try {
      let userId: string | null = null;

      // First, try to create the admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: franchise.adminEmail,
        password: franchise.adminPassword,
        options: {
          data: {
            name: franchise.name, // Using franchise name as admin name
          },
        },
      });

      if (authError) {
        console.error("Error creating admin user:", authError);
        // Handle rate limiting error specifically
        if (authError.message.includes("For security purposes, you can only request this after")) {
          toast.warning("Rate limit exceeded for auth user creation", {
            duration: 5000,
            description: "Using existing auth user if available",
          });
          // In this case, we assume the auth user was already created successfully
          // and we try to proceed with the rest of the process
          // We'll need to find the user ID from the admins table
          const { data: adminData, error: adminError } = await supabase
            .from("admins")
            .select("id")
            .eq("email", franchise.adminEmail)
            .single();

          if (adminError || !adminData) {
            toast.error("Could not find existing admin record");
            throw authError;
          }

          userId = adminData.id;
        } else {
          toast.error(`Error creating admin user: ${authError.message}`);
          throw authError;
        }
      } else if (authData.user) {
        // Successfully created auth user
        userId = authData.user.id;
        toast.success("Admin user created successfully");
      }

      // Then, create the admin record in the admins table
      // First check if admin record already exists to avoid duplicates
      const { data: existingAdmin, error: adminCheckError } = await supabase
        .from("admins")
        .select("id")
        .eq("email", franchise.adminEmail)
        .single();

      if (adminCheckError || !existingAdmin) {
        // Admin record doesn't exist, create it
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .insert([
            {
              id: userId,
              name: franchise.name,
              email: franchise.adminEmail,
            },
          ])
          .select();

        if (adminError) {
          console.error("Error creating admin record:", adminError);
          toast.error(`Error creating admin record: ${adminError.message}`);
          throw adminError;
        }
      } else {
        // Admin record already exists, use existing ID
        userId = existingAdmin.id;
        console.log("Admin record already exists, using existing ID");
      }

      // Finally, create the franchise record
      const { data: franchiseData, error: franchiseError } = await supabase
        .from("franchises")
        .insert([
          {
            name: franchise.name,
            status: franchise.status,
            branches: franchise.branches,
            washers: franchise.washers,
            admin_id: userId,
          },
        ])
        .select();

      if (franchiseError) {
        console.error("Error adding franchise:", franchiseError);
        toast.error(`Error adding franchise: ${franchiseError.message}`);
        throw franchiseError;
      }

      toast.success("Franchise created successfully");
      await get().fetchFranchises(); // Refetch to get the transformed data
    } catch (error) {
      console.error("Error in addFranchise:", error);
      throw error;
    }
  },
  updateFranchise: async (franchise) => {
    const { data, error } = await supabase
      .from("franchises")
      .update({
        name: franchise.name,
        status: franchise.status,
        branches: franchise.branches,
        washers: franchise.washers,
      })
      .eq("id", franchise.id)
      .select();

    if (error) {
      console.error("Error updating franchise:", error);
      toast.error(`Error updating franchise: ${error.message}`);
      return;
    }
    toast.success("Franchise updated successfully");
    await get().fetchFranchises(); // Refetch to ensure consistency
  },
  deleteFranchise: async (id) => {
    const { error } = await supabase.from("franchises").delete().eq("id", id);
    if (error) {
      console.error("Error deleting franchise:", error);
      toast.error(`Error deleting franchise: ${error.message}`);
      return;
    }
    toast.success("Franchise deleted successfully");
    set((state) => ({
      franchises: state.franchises.filter((franchise) => franchise.id !== id),
    }));
  },
}));
