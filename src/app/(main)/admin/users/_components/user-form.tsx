"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/admin-dashboard/user-store";

import { User } from "./types";

const formSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z.string().min(2, {
      message: t("form.nameMinLength"),
    }),
    phone: z.string().min(10, {
      message: t("form.phoneMinLength"),
    }),
    cars: z.coerce.number().min(0),
    bookings: z.coerce.number().min(0),
    totalWashes: z.coerce.number().min(0),
  });

type UserFormValues = z.infer<ReturnType<typeof formSchema>>;

interface UserFormProps {
  user: User;
  onSuccess: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const t = useTranslations("admin.users");
  const { updateUser } = useUserStore();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: user,
  });

  const onSubmit = (data: UserFormValues) => {
    updateUser({ ...user, ...data });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.namePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.phone")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.phonePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cars"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("columns.cars")}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bookings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("columns.bookings")}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalWashes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("columns.totalWashes")}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t("form.updateButton")}</Button>
      </form>
    </Form>
  );
}
