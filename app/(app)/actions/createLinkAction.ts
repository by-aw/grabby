"use server";

import { createShortLink } from "@/lib/utils";

export default async function createLink(formData: FormData) {
  const longUrl = formData.get("link")?.toString();
  if (!longUrl) {
    return { success: false, message: "URL is required" } as const;
  }

  return createShortLink(longUrl);
}
