"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserFranchiseId } from "@/server/server-actions";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";

export function DebugData() {
  const t = useTranslations("franchise.debug");
  const { branches, services, washers, bookings } = useFranchiseDashboardStore();
  const [franchiseId, setFranchiseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFranchiseId = async () => {
      try {
        const id = await getCurrentUserFranchiseId();
        setFranchiseId(id);
      } catch (err) {
        setError(t("failedToFetchFranchiseId"));
        console.error("Error fetching franchise ID:", err);
      }
    };

    fetchFranchiseId();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("debugInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>{t("franchiseId")}:</strong> {franchiseId ?? t("notLoaded")}
            </p>
            {error && <p className="text-red-500">{error}</p>}
            <p>
              <strong>{t("branchesCount")}:</strong> {branches.length}
            </p>
            <p>
              <strong>{t("servicesCount")}:</strong> {services.length}
            </p>
            <p>
              <strong>{t("washersCount")}:</strong> {washers.length}
            </p>
            <p>
              <strong>{t("bookingsCount")}:</strong> {bookings.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {branches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("branchesData")}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-40 overflow-auto text-xs">{JSON.stringify(branches, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
