import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { fetchStripePayments } from "@/server/stripe-actions";

const supabase = createClient();

export type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  status: "succeeded" | "failed" | "pending" | "refunded";
  provider: string;
  provider_txn_id: string;
  created_at: string;
};

type PaymentState = {
  payments: Payment[];
  fetchPayments: () => Promise<void>;
};

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  fetchPayments: async () => {
    try {
      // Fetch payments from Stripe via server action
      const stripeResult = await fetchStripePayments();

      if (stripeResult.success) {
        set({ payments: stripeResult.data });
        return;
      }

      // Fallback to Supabase if Stripe fails
      console.warn("Stripe fetch failed, falling back to Supabase:", stripeResult.error);
      const { data, error } = await supabase.from("payments").select("*");
      if (error) {
        console.error("Error fetching payments from Supabase:", error);
        return;
      }

      set({ payments: data as Payment[] });
    } catch (error) {
      console.error("Error in fetchPayments:", error);

      // Last resort fallback to Supabase
      const { data, error: supabaseError } = await supabase.from("payments").select("*");
      if (supabaseError) {
        console.error("Error fetching payments from Supabase:", supabaseError);
        return;
      }

      set({ payments: data as Payment[] });
    }
  },
}));
