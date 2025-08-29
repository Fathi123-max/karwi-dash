"use server";

import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

import { Booking } from "@/types/franchise";

export async function getValueFromCookie(key: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

export async function setValueToCookie(
  key: string,
  value: string,
  options: { path?: string; maxAge?: number } = {},
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    path: options.path ?? "/",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // default: 7 days
  });
}

export async function getPreference<T extends string>(key: string, allowed: readonly T[], fallback: T): Promise<T> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);
  const value = cookie ? cookie.value.trim() : undefined;
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export async function updateBookingStatus(bookingId: string, status: Booking["status"]) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase.from("bookings").update({ status }).eq("id", bookingId).select();

  if (error) {
    console.error("Error updating booking status:", error);
    throw new Error("Failed to update booking status");
  }

  return data;
}

/**
 * Get the franchise ID for the currently logged-in user
 * @returns The franchise ID or null if the user is not a franchise admin
 */
export async function getCurrentUserFranchiseId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // We're just reading, so we don't need to set cookies
          },
        },
      },
    );

    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return null;
    }

    if (!session?.user) {
      console.log("No session or user found");
      return null;
    }

    console.log("Current user ID:", session.user.id);

    // Get the franchise ID by finding the franchise where admin_id matches the user's ID
    const { data, error } = await supabase
      .from("franchises")
      .select("id")
      .eq("admin_id", session.user.id) // Directly match the admin_id with user.id
      .single();

    if (error) {
      console.error("Error fetching franchise ID:", error);
      return null;
    }

    console.log("Franchise data found:", data);

    return data?.id ?? null;
  } catch (error) {
    console.error("Error getting franchise ID:", error);
    return null;
  }
}

/**
 * Fetch payments from Stripe
 * @returns Array of payments from Stripe
 */
export async function fetchStripePayments() {
  try {
    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("STRIPE_SECRET_KEY not configured, skipping Stripe integration");
      return { success: false, error: "Stripe not configured" };
    }

    // For development, we can return mock data if using test keys
    if (process.env.STRIPE_SECRET_KEY.startsWith("sk_test")) {
      console.log("Using mock Stripe data for development");
      return {
        success: true,
        data: [
          {
            id: "pi_mock_1",
            booking_id: "BK001",
            amount: 49.99,
            status: "succeeded",
            provider: "Stripe",
            provider_txn_id: "pi_mock_1",
            created_at: new Date().toISOString(),
          },
          {
            id: "pi_mock_2",
            booking_id: "BK002",
            amount: 79.99,
            status: "pending",
            provider: "Stripe",
            provider_txn_id: "pi_mock_2",
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          {
            id: "pi_mock_3",
            booking_id: "BK003",
            amount: 39.99,
            status: "failed",
            provider: "Stripe",
            provider_txn_id: "pi_mock_3",
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          },
        ],
      };
    }

    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    // Fetch payments from Stripe
    const payments = await stripe.paymentIntents.list({
      limit: 100, // Adjust as needed
    });

    // Map Stripe payments to our Payment type
    const mappedPayments = payments.data.map((payment) => ({
      id: payment.id,
      booking_id: payment.metadata?.bookingId || "N/A",
      amount: payment.amount / 100, // Convert from cents to dollars
      status: payment.status,
      provider: "Stripe",
      provider_txn_id: payment.id,
      created_at: new Date(payment.created * 1000).toISOString(), // Convert Unix timestamp to ISO string
    }));

    return { success: true, data: mappedPayments };
  } catch (error) {
    console.error("Error fetching payments from Stripe:", error);
    return { success: false, error: "Failed to fetch payments from Stripe" };
  }
}
