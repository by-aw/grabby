"use client";

import { signOut } from "@/app/(app)/actions/auth";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      className="text-muted-foreground hover:text-foreground"
    >
      Sign out
    </Button>
  );
}
