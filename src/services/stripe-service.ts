import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20", // Use the latest API version
});

export type StripePayment = {
  id: string;
  amount: number;
  status: "succeeded" | "failed" | "pending" | "refunded";
  created: number; // Unix timestamp
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
};

export class StripeService {
  /**
   * Fetch all payments from Stripe
   */
  static async fetchPayments(): Promise<StripePayment[]> {
    try {
      const payments = await stripe.paymentIntents.list({
        limit: 100, // Adjust as needed
      });

      return payments.data.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status as StripePayment["status"],
        created: payment.created,
        currency: payment.currency,
        description: payment.description || undefined,
        metadata: payment.metadata,
      }));
    } catch (error) {
      console.error("Error fetching Stripe payments:", error);
      throw new Error("Failed to fetch payments from Stripe");
    }
  }

  /**
   * Fetch a single payment by ID
   */
  static async fetchPaymentById(paymentId: string): Promise<StripePayment | null> {
    try {
      const payment = await stripe.paymentIntents.retrieve(paymentId);

      return {
        id: payment.id,
        amount: payment.amount,
        status: payment.status as StripePayment["status"],
        created: payment.created,
        currency: payment.currency,
        description: payment.description || undefined,
        metadata: payment.metadata,
      };
    } catch (error) {
      console.error(`Error fetching Stripe payment ${paymentId}:`, error);
      return null;
    }
  }
}
