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

    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
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

    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
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

/**
 * Refund a payment in Stripe
 * @param paymentIntentId The Stripe payment intent ID to refund
 * @param amount The amount to refund (in dollars)
 * @returns Refund details or error
 */
export async function refundStripePayment(paymentIntentId: string, amount: number) {
  try {
    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("STRIPE_SECRET_KEY not configured, skipping Stripe integration");
      return { success: false, error: "Stripe not configured" };
    }

    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100), // Convert to cents
    });

    return { success: true, data: refund };
  } catch (error) {
    console.error(`Error refunding payment ${paymentIntentId}:`, error);
    return { success: false, error: "Failed to refund payment" };
  }
}
