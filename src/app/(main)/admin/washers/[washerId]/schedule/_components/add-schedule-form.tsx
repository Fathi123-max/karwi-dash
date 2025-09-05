"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWasherScheduleStore } from "@/stores/admin-dashboard/washer-schedule-store";

const formSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    day_of_week: z.coerce.number().min(0).max(6),
    start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t("addShift.invalidTimeFormat")),
    end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t("addShift.invalidTimeFormat")),
  });

type ScheduleFormValues = z.infer<ReturnType<typeof formSchema>>;

export function AddScheduleForm({ washerId }: { washerId: string }) {
  const t = useTranslations("admin.washers.schedule");
  const { addSchedule } = useWasherScheduleStore();
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      day_of_week: 1,
      start_time: "09:00",
      end_time: "17:00",
    },
  });

  const daysOfWeek = [
    { value: 1, label: t("days.monday") },
    { value: 2, label: t("days.tuesday") },
    { value: 3, label: t("days.wednesday") },
    { value: 4, label: t("days.thursday") },
    { value: 5, label: t("days.friday") },
    { value: 6, label: t("days.saturday") },
    { value: 0, label: t("days.sunday") },
  ];

  const onSubmit = (data: ScheduleFormValues) => {
    addSchedule({ ...data, washer_id: washerId });
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("addShift.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="day_of_week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("addShift.dayOfWeek")}</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("addShift.selectDay")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={String(day.value)}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("addShift.startTime")}</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("addShift.endTime")}</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t("addShift.button")}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
