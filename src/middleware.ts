/* eslint-disable max-depth */
/* eslint-disable complexity */

/* eslint-disable no-useless-escape */
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    console.log("=== Middleware execution started ===");
    console.log("Request URL:", request.url);
    console.log("Request path:", request.nextUrl.pathname);

    const { supabase, response } = createClient(request);
    console.log("Supabase client created in middleware");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("Auth result:", { user: !!user, authError: !!authError });

    const { pathname } = request.nextUrl;

    // Exclude login and register pages from authentication checks to prevent redirect loops
    const isAuthPage =
      pathname === "/admin/login" ||
      pathname === "/franchise/login" ||
      pathname === "/branch/login" ||
      pathname.startsWith("/auth");
    console.log("Is auth page:", isAuthPage);

    // If user is already logged in and trying to access auth pages, redirect them to appropriate dashboard
    if (user && isAuthPage) {
      console.log("User is logged in and accessing auth page, checking admin profile");
      // Check if user is an admin and their role
      const { data: adminProfile } = await supabase.from("admins").select("id, role").eq("id", user.id).single();
      console.log("Admin profile check result:", adminProfile);

      if (adminProfile) {
        // Redirect based on admin role
        switch (adminProfile.role) {
          case "franchise": {
            console.log("User is franchise admin, checking franchise association");
            // Check if they manage a franchise
            const { data: franchises } = await supabase.from("franchises").select("id").eq("admin_id", adminProfile.id);
            console.log("Franchise association check result:", franchises);

            // If they manage a franchise, redirect to franchise dashboard
            if (franchises && franchises.length > 0) {
              console.log("Redirecting franchise admin to franchise dashboard");
              return Response.redirect(new URL("/franchise", request.url));
            } else {
              // Fallback to admin dashboard if no franchise found
              console.log("Franchise admin with no franchise, redirecting to admin dashboard");
              return Response.redirect(new URL("/admin", request.url));
            }
          }
          case "branch":
            console.log("Redirecting branch admin to branch dashboard");
            // Redirect branch admins to branch dashboard
            return Response.redirect(new URL("/branch", request.url));
          case "general":
          default:
            console.log("Redirecting general admin to admin dashboard");
            // General admins go to admin dashboard
            return Response.redirect(new URL("/admin", request.url));
        }
      } else {
        // Not an admin - redirect to unauthorized
        console.log("User is not an admin, redirecting to unauthorized");
        return Response.redirect(new URL("/unauthorized", request.url));
      }
    }

    // Handle authentication errors - if it's a session missing error, allow access to auth pages
    if (authError) {
      console.log("Auth error occurred:", authError);
      // For auth pages, allow access even if there's an auth error
      if (isAuthPage) {
        console.log("Allowing access to auth page despite auth error");
        return response;
      }

      // For protected pages, redirect to appropriate login
      if (pathname.startsWith("/admin")) {
        console.log("Redirecting to admin login");
        return Response.redirect(new URL("/admin/login", request.url));
      }
      if (pathname.startsWith("/franchise")) {
        console.log("Redirecting to franchise login");
        return Response.redirect(new URL("/franchise/login", request.url));
      }
      if (pathname.startsWith("/branch")) {
        console.log("Redirecting to branch login");
        return Response.redirect(new URL("/branch/login", request.url));
      }

      // Allow the request to continue for non-protected pages
      console.log("Allowing request to continue for non-protected page");
      return response;
    }

    // Redirect unauthenticated users from protected routes to the appropriate login page
    if (!user && !isAuthPage) {
      console.log("Unauthenticated user accessing protected route");
      if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        console.log("Redirecting to admin login");
        return Response.redirect(new URL("/admin/login", request.url));
      }
      if (pathname.startsWith("/franchise") && pathname !== "/franchise/login") {
        console.log("Redirecting to franchise login");
        return Response.redirect(new URL("/franchise/login", request.url));
      }
      if (pathname.startsWith("/branch") && pathname !== "/branch/login") {
        console.log("Redirecting to branch login");
        return Response.redirect(new URL("/branch/login", request.url));
      }
      console.log("Allowing request to continue");
      return response;
    }

    // If the user is logged in, check their role and restrict access appropriately
    if (user && !isAuthPage) {
      console.log("Checking role for logged in user accessing protected route");
      // Check if user is an admin and their role
      const { data: adminProfile, error: adminError } = await supabase
        .from("admins")
        .select("id, role")
        .eq("id", user.id) // Using user.id to match admins.id
        .single();

      // Handle admin check errors
      if (adminError) {
        console.log("Admin check error:", adminError);
        // User is not an admin
        if (pathname.startsWith("/admin") || pathname.startsWith("/franchise") || pathname.startsWith("/branch")) {
          console.log("User is not an admin, redirecting to unauthorized");
          return Response.redirect(new URL("/unauthorized", request.url));
        }
        console.log("Allowing request to continue");
        return response;
      }

      console.log("Admin profile:", adminProfile);

      if (adminProfile) {
        // Redirect based on admin role
        switch (adminProfile.role) {
          case "franchise": {
            console.log("User is franchise admin, checking franchise permissions");
            // Check if they manage a specific franchise
            const { data: franchises, error: franchiseError } = await supabase
              .from("franchises")
              .select("id")
              .eq("admin_id", adminProfile.id);

            // Handle franchise check errors
            if (franchiseError) {
              console.log("Franchise check error:", franchiseError);
              // Redirect to unauthorized page for protected routes
              if (pathname.startsWith("/admin") || pathname.startsWith("/franchise")) {
                console.log("Redirecting to unauthorized due to franchise check error");
                return Response.redirect(new URL("/unauthorized", request.url));
              }
              console.log("Allowing request to continue");
              return response;
            }

            // Check if accessing a specific franchise
            const franchiseIdMatch = pathname.match(/^\/admin\/franchises\/([^\/]+)/);
            if (franchiseIdMatch) {
              const requestedFranchiseId = franchiseIdMatch[1];
              const hasAccess = franchises.some((f) => f.id === requestedFranchiseId);
              console.log("Franchise access check:", { requestedFranchiseId, hasAccess });

              if (!hasAccess) {
                // User doesn't have access to this specific franchise
                console.log("User doesn't have access to requested franchise, redirecting to admin dashboard");
                return Response.redirect(new URL("/admin", request.url));
              }
            }

            // Allow access to both admin and franchise dashboards
            // The franchise dashboard will scope data based on the franchise ID
            console.log("Allowing franchise admin access");
            break;
          }

          case "branch":
            console.log("User is branch admin");
            // User is a branch admin, allow access to branch routes
            if (!pathname.startsWith("/branch")) {
              // Redirect branch admins from non-branch routes to branch dashboard
              console.log("Redirecting branch admin to branch dashboard");
              return Response.redirect(new URL("/branch", request.url));
            }
            console.log("Allowing branch admin access to branch routes");
            break;

          case "general":
          default:
            console.log("User is general admin");
            // This is a general admin with no specific franchise
            if (pathname.startsWith("/franchise") && pathname !== "/franchise/login") {
              // Redirect general admins from franchise routes to main admin dashboard
              console.log("Redirecting general admin from franchise route to admin dashboard");
              return Response.redirect(new URL("/admin", request.url));
            }
            console.log("Allowing general admin access");
            break;
        }
      }
    }

    console.log("=== Middleware execution completed ===");
    return response;
  } catch (error) {
    console.error("Unexpected error in middleware:", error);
    // In case of unexpected errors, allow access to auth pages but redirect others to unauthorized
    const { pathname } = request.nextUrl;
    const isAuthPage =
      pathname === "/admin/login" ||
      pathname === "/franchise/login" ||
      pathname === "/branch/login" ||
      pathname.startsWith("/auth");
    console.log("Unexpected error, isAuthPage:", isAuthPage);

    if (isAuthPage) {
      console.log("Allowing access to auth page despite error");
      return NextResponse.next();
    }
    console.log("Redirecting to unauthorized due to error");
    return Response.redirect(new URL("/unauthorized", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/franchise/:path*", "/branch/:path*", "/auth/:path*"],
};
