import { isEmailAllowed } from "@/lib/auth/allowlist";
import { createServerSupabase } from "@/lib/supabase/serverClient";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip auth check for callback route
  if (request.nextUrl.pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // Skip if already on login page to prevent redirect loops
  if (request.nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.next();
  }

  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Store the original URL to redirect back after login
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Double check if the authenticated email is still allowed
    if (!isEmailAllowed(user.email || "")) {
      // Sign out the user if their email is not allowed
      await supabase.auth.signOut();
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("error", "unauthorized_email");
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    // Only redirect to login if not already there
    if (!request.nextUrl.pathname.startsWith("/auth/login")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
