"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { register } from "../_actions/register";

const FormSchema = z
  .object({
    email: z.string().email({ message: "auth.validEmail" }),
    password: z.string().min(6, { message: "auth.passwordMinLength" }),
    confirmPassword: z.string().min(6, { message: "auth.confirmPasswordMinLength" }),
    role: z.enum(["admin", "franchise"], { required_error: "auth.selectRole" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

function SubmitButton() {
  const t = useTranslations("auth");
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? t("registering") : t("register")}
    </Button>
  );
}

const initialState = {
  message: "",
};

export function RegisterForm() {
  const t = useTranslations("auth");
  const [state, formAction] = useFormState(register, initialState);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "admin", // Default to admin
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
                  {...field}
                  className="text-left rtl:text-right"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  autoComplete="new-password"
                  {...field}
                  className="text-left rtl:text-right"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("confirmPassword")}</FormLabel>
              <FormControl>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  autoComplete="new-password"
                  {...field}
                  className="text-left rtl:text-right"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{t("selectRole")}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-y-0 space-x-3 rtl:space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="admin" />
                    </FormControl>
                    <FormLabel className="font-normal">{t("admin")}</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-y-0 space-x-3 rtl:space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="franchise" />
                    </FormControl>
                    <FormLabel className="font-normal">{t("franchiseManager")}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {state?.message && <p className="text-sm text-red-500">{state.message}</p>}
        <SubmitButton />
      </form>
    </Form>
  );
}
