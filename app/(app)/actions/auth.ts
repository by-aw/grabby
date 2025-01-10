"use server";

import { isEmailAllowed } from "@/lib/auth/allowlist";
import { createServerSupabase } from "@/lib/supabase/serverClient";

export async function signIn(email: string, redirectPath: string) {
  // Clean the email first
  const cleanEmail = email.toLowerCase().trim();

  // Check if email is allowed
  if (!isEmailAllowed(cleanEmail)) {
    return {
      success: false,
      error: "This email is not authorized to access the admin area",
    };
  }

  const supabase = await createServerSupabase();
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${redirectPath}`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  return { success: true };
}
