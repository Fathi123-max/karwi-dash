"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { fetchStripePaymentById } from "@/server/stripe-actions";
import { Payment } from "@/stores/admin-dashboard/payment-store";

import { PaymentDetails } from "../_components/payment-details";

export default function PaymentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayment = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const result = await fetchStripePaymentById(id as string);

        if (result.success && result.data) {
          setPayment(result.data);
        } else {
          setError(result.error || "Failed to load payment details");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading payment details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex h-full items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment not found</AlertTitle>
          <AlertDescription>The requested payment could not be found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Details</h2>
          <p className="text-muted-foreground">View detailed information about this payment.</p>
        </div>
        <Button onClick={() => router.back()}>Back to Payments</Button>
      </div>

      <PaymentDetails payment={payment} />
    </div>
  );
}
