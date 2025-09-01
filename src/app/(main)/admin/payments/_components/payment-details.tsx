"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { refundStripePayment } from "@/server/stripe-actions";
import { Payment } from "@/stores/admin-dashboard/payment-store";

interface PaymentDetailsProps {
  payment: Payment;
}

export function PaymentDetails({ payment }: PaymentDetailsProps) {
  const router = useRouter();
  const [isRefunding, setIsRefunding] = useState(false);

  const handleRefund = async () => {
    const confirmRefund = window.confirm(
      `Are you sure you want to refund ${payment.amount} for payment ${payment.id}?`,
    );

    if (!confirmRefund) return;

    try {
      setIsRefunding(true);
      const result = await refundStripePayment(payment.id, payment.amount);

      if (result.success) {
        toast.success("Refund processed", {
          description: "The payment has been successfully refunded.",
        });

        // Refresh the page to show updated status
        router.refresh();
      } else {
        toast.error("Refund failed", {
          description: result.error || "Failed to process refund",
        });
      }
    } catch (err) {
      toast.error("Refund failed", {
        description: "An unexpected error occurred while processing the refund.",
      });
      console.error(err);
    } finally {
      setIsRefunding(false);
    }
  };

  const getStatusIcon = () => {
    switch (payment.status) {
      case "succeeded":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "refunded":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusVariant = () => {
    switch (payment.status) {
      case "succeeded":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Details for payment {payment.id}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <Badge variant={getStatusVariant()}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Amount</h3>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(payment.amount)}
              </p>
            </div>

            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Booking ID</h3>
              <p className="font-medium">{payment.booking_id}</p>
            </div>

            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Provider</h3>
              <p className="font-medium">{payment.provider}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Transaction ID</h3>
              <p className="font-mono text-sm">{payment.provider_txn_id}</p>
            </div>

            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Date</h3>
              <p className="font-medium">
                {new Date(payment.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Status</h3>
              <p className="font-medium capitalize">{payment.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {payment.status === "succeeded" && (
        <Card>
          <CardHeader>
            <CardTitle>Refund Payment</CardTitle>
            <CardDescription>
              Refund the full amount of ${payment.amount} to the customer&apos;s payment method.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleRefund} disabled={isRefunding} className="w-full md:w-auto">
              {isRefunding ? "Processing Refund..." : "Refund Payment"}
            </Button>
          </CardContent>
        </Card>
      )}

      {payment.status === "refunded" && (
        <Alert>
          <AlertTitle>Payment Refunded</AlertTitle>
          <AlertDescription>
            This payment has been refunded. The funds should be returned to the customer&apos;s payment method.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
