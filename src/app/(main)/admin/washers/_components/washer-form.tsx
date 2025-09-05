"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

import { Washer } from "./types";

const formSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z.string().min(2, {
      message: t("form.nameMinLength"),
    }),
    branch: z.string({
      required_error: t("form.branchRequired"),
    }),
    status: z.enum(["active", "inactive"]),
    rating: z.coerce.number().min(0).max(5),
  });

type WasherFormValues = z.infer<ReturnType<typeof formSchema>>;

interface WasherFormProps {
  washer?: Washer;
  onSuccess: () => void;
}

export function WasherForm({ washer, onSuccess }: WasherFormProps) {
  const t = useTranslations("admin.washers");
  const { addWasher, updateWasher } = useWasherStore();
  const { branches } = useBranchStore();
  const form = useForm<WasherFormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: washer ?? {
      name: "",
      status: "inactive",
      rating: 0,
    },
  });

  const onSubmit = (data: WasherFormValues) => {
    if (washer) {
      updateWasher({ ...washer, ...data });
    } else {
      addWasher(data);
    }
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
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.branch")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.selectBranch")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.name}>
                      {branch.name}
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.status")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.selectStatus")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">{t("active")}</SelectItem>
                  <SelectItem value="inactive">{t("inactive")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.rating")}</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{washer ? t("form.updateButton") : t("form.createButton")}</Button>
      </form>
    </Form>
  );
}
