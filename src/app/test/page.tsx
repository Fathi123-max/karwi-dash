import { Metadata } from "next";

import TestSupabaseConnection from "@/app/test-supabase-connection";

export const metadata: Metadata = {
  title: "Supabase Connection Test",
  description: "Test the Supabase connection",
};

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <TestSupabaseConnection />
    </div>
  );
}
