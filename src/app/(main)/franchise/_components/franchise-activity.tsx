"use client";

import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";

export function FranchiseActivity() {
  const t = useTranslations("franchise.activity");
  const { bookings, washers, services } = useFranchiseDashboardStore();

  // Combine and sort activities by date
  const recentActivity = [...bookings]
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(0, 5) // Get the 5 most recent activities
    .map((booking) => {
      const washer = washers.find((w) => w.id === booking.user_id);
      const service = services.find((s) => s.id === booking.service_id);
      return {
        id: booking.id,
        type: "booking",
        date: new Date(booking.scheduled_at),
        description: t("newBooking", { service: service ? service.name : t("aService") }),
        user: washer ? washer.name : t("unknownWasher"),
      };
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentActivity")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/avatars/${activity.user.toLowerCase().replace(" ", "")}.png`} alt={t("avatar")} />
                <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm leading-none font-medium">{activity.description}</p>
                <p className="text-muted-foreground text-sm">
                  {t("byUser", { user: activity.user, date: activity.date.toLocaleDateString() })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">{t("noRecentActivity")}</p>
        )}
      </CardContent>
    </Card>
  );
}
