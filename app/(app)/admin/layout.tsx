import { getLinks } from "@/app/(app)/actions/getLinks";
import SignOutButton from "@/components/auth/SignOutButton";
import { createServerSupabase } from "@/lib/supabase/serverClient";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { total } = await getLinks();

  return (
    <section className="flex gap-2 min-h-screen min-w-screen">
      <aside className="flex flex-col gap-2 p-4 rounded-2xl bg-accent max-w-64 min-w-64 w-full m-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Admin</h1>
          <SignOutButton />
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          {session.user.email}
        </div>
        <Link href="/admin/links" className="flex items-center gap-2">
          Links
          <span className="bg-background text-foreground px-2 py-0.5 rounded-full text-sm">
            {total}
          </span>
        </Link>
      </aside>
      {children}
    </section>
  );
}
