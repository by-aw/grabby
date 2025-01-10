import { signIn } from "@/app/(app)/actions/auth";
import SigninForm from "@/components/auth/SigninForm";
import { createServerSupabase } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If already logged in, redirect to the requested page or admin
  if (user) {
    redirect(searchParams.redirect || "/admin");
  }

  const handleLogin = async (email: string) => {
    "use server";
    return signIn(email, searchParams.redirect || "/admin");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Login</h1>
      <div className="w-full max-w-md">
        <SigninForm signIn={handleLogin} />
      </div>
    </main>
  );
}
