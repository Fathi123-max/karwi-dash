import Link from "next/link";

import { Globe } from "lucide-react";

import { UnifiedLoginForm } from "@/app/(main)/auth/_components/unified-login-form";
import { APP_CONFIG } from "@/config/app-config";

export default function AdminLogin() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium">Admin Login</h1>
          <p className="text-muted-foreground text-sm">Enter your credentials to access the admin dashboard.</p>
        </div>
        <div className="space-y-4">
          <UnifiedLoginForm role="admin" />
        </div>
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link className="text-foreground" href="/auth/v2/register">
            Register
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="text-muted-foreground size-4" />
          ENG
        </div>
      </div>
    </>
  );
}
