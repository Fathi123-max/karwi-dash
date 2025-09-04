"use client";

import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { login } from "../_actions/login";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("auth");

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? t("loggingIn") : t("login")}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);
  const t = useTranslations("auth");

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" placeholder={t("emailPlaceholder")} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input id="password" name="password" type="password" placeholder={t("passwordPlaceholder")} required />
      </div>

      {state?.message && <p className="text-sm text-red-500">{state.message}</p>}

      <SubmitButton />
    </form>
  );
}
