"use server";

import Stripe from "stripe";

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
          {
            id: "pi_mock_4",
            booking_id: "BK004",
            amount: 59.99,
            status: "refunded",
            provider: "Stripe",
            provider_txn_id: "pi_mock_4",
            created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
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

/**
 * Fetch a single payment by ID from Stripe
 * @param paymentId The Stripe payment intent ID
 * @returns Payment details or null if not found
 */
export async function fetchStripePaymentById(paymentId: string) {
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
        data: {
          id: paymentId,
          booking_id: "BK001",
          amount: 49.99,
          status: "succeeded",
          provider: "Stripe",
          provider_txn_id: paymentId,
          created_at: new Date().toISOString(),
        },
      };
    }

    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    // Fetch payment from Stripe
    const payment = await stripe.paymentIntents.retrieve(paymentId);

    // Map Stripe payment to our Payment type
    const mappedPayment = {
      id: payment.id,
      booking_id: payment.metadata?.bookingId || "N/A",
      amount: payment.amount / 100, // Convert from cents to dollars
      status: payment.status,
      provider: "Stripe",
      provider_txn_id: payment.id,
      created_at: new Date(payment.created * 1000).toISOString(), // Convert Unix timestamp to ISO string
    };

    return { success: true, data: mappedPayment };
  } catch (error) {
    console.error(`Error fetching payment ${paymentId} from Stripe:`, error);
    return { success: false, error: "Failed to fetch payment from Stripe" };
  }
}
