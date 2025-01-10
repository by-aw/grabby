"use server";

import { isEmailAllowed } from "@/lib/auth/allowlist";
import { createServerSupabase } from "@/lib/supabase/serverClient";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/admin";

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=missing_code`
    );
  }

  const supabase = await createServerSupabase();
  const cookieStore = cookies();

  try {
    // Exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );
    if (exchangeError) {
      console.error("Auth callback error:", exchangeError);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=invalid_code`
      );
    }

    // Verify the user is properly authenticated and allowed
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User verification error:", userError);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=verification_failed`
      );
    }

    // Check if the user's email is allowed
    if (!isEmailAllowed(user.email || "")) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=unauthorized_email`
      );
    }

    // Get the session cookies
    const response = NextResponse.redirect(`${requestUrl.origin}${next}`);

    // Copy over the session cookies
    const supabaseCookies = cookieStore.getAll();
    for (const cookie of supabaseCookies) {
      response.cookies.set(cookie.name, cookie.value, {
        ...cookie,
        sameSite: "lax",
        httpOnly: true,
      });
    }

    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=server_error`
    );
  }
}
