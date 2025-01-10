"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      className="rounded-full"
      size={"sm"}
      onClick={() => router.back()}
    >
      Back
    </Button>
  );
}
