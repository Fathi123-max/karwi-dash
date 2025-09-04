"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { branchAdminLogin } from "@/app/(main)/auth/_actions/branch-admin-login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BranchAdminLoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await branchAdminLogin({}, formData);

    if (result?.message) {
      setErrorMessage(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t("branchAdminLogin")}</CardTitle>
          <CardDescription>{t("branchAdminLoginDescription")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" name="email" type="email" placeholder={t("emailPlaceholder")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input id="password" name="password" type="password" placeholder={t("passwordPlaceholder")} required />
            </div>
            {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? t("loggingIn") : t("login")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
