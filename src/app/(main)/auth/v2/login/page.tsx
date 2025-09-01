import Link from "next/link";

import { Globe, Sparkles, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app-config";

export default function LoginV2() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <div className="bg-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <Sparkles className="text-primary-foreground size-8" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to {APP_CONFIG.name}</h1>
          <p className="text-muted-foreground text-sm">Professional Car Care Management System</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Link href="/admin/login">
              <Button variant="outline" className="h-14 w-full justify-start gap-3 text-base">
                <Shield className="size-5" />
                <span>Admin Login</span>
              </Button>
            </Link>
            <Link href="/franchise/login">
              <Button variant="outline" className="h-14 w-full justify-start gap-3 text-base">
                <Sparkles className="size-5" />
                <span>Franchise Login</span>
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">New to our platform?</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Contact your system administrator to get started with our car care management solution.
            </p>
          </div>
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
