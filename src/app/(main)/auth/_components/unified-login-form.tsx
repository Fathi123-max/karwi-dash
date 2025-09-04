"use client";

import { useEffect, useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { unifiedRoleLogin } from "../_actions/unified-role-login";

const initialState = {
  message: "",
};

function SubmitButton() {
  const t = useTranslations("auth");
  const { pending } = useFormStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button className="w-full" type="submit" disabled={pending || !mounted}>
      {pending ? t("loggingIn") : t("login")}
    </Button>
  );
}

export function UnifiedLoginForm({ role }: { role: "admin" | "franchise" }) {
  const t = useTranslations("auth");
  const [state, formAction] = useFormState(unifiedRoleLogin, initialState);
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="role" value={role} />
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          required
          disabled={!isClient}
          className="text-left rtl:text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
            required
            disabled={!isClient}
            className="text-left rtl:text-right"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-muted-foreground absolute inset-y-0 right-0 flex items-center pr-3 rtl:right-auto rtl:left-0 rtl:pl-3"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {state?.message && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{state.message}</p>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
