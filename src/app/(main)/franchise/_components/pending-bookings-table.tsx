"use client";
import React from "react";

import { useTranslations } from "next-intl";

import { EnrichedBooking } from "@/app/(main)/franchise/utils/bookings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Booking } from "@/types/franchise";

interface PendingBookingsTableProps {
  bookings: EnrichedBooking[];
}

const PendingBookingsTable: React.FC<PendingBookingsTableProps> = ({ bookings }) => {
  const t = useTranslations("franchise.pendingBookings");
  const pending = bookings.filter((b) => b.status === "pending");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("bookingId")}</TableHead>
              <TableHead>{t("user")}</TableHead>
              <TableHead>{t("branch")}</TableHead>
              <TableHead>{t("service")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pending.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  {t("noPendingBookings")}
                </TableCell>
              </TableRow>
            ) : (
              pending.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.id}</TableCell>
                  <TableCell>{b.user}</TableCell>
                  <TableCell>{b.branch}</TableCell>
                  <TableCell>{b.service}</TableCell>
                  <TableCell>{b.date ? new Date(b.date).toLocaleString() : "-"}</TableCell>
                  <TableCell>
                    <span className="rounded bg-yellow-100 px-2 py-1 text-yellow-800 capitalize dark:bg-yellow-900 dark:text-yellow-200">
                      {b.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingBookingsTable;
