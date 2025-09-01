import { cookies } from "next/headers";

import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function createClient() {
  console.log("Creating Supabase server client");

  // Log environment variables (but not the actual values for security)
  console.log("Supabase URL configured:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Supabase Anon Key configured:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  }

  const cookieStore = await cookies();

  const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch (error) {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
          console.log("Cookie set error (can be ignored in Server Components):", error);
        }
      },
    },
  });

  console.log("Supabase server client created successfully");
  return client;
}
