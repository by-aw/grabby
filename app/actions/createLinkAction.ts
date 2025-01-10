"use server";

import { UrlLog } from "@/lib/type";
import { Redis } from "@upstash/redis";

import { nanoid } from "nanoid";

export default async function createLink(formData: FormData) {
  const longUrl = formData.get("link")?.toString();
  const redis = Redis.fromEnv();

  if (!longUrl) {
    return { success: false, message: "URL is required" };
  }

  // Ensure URL has protocol
  const urlToShorten = longUrl.startsWith("http")
    ? longUrl
    : `https://${longUrl}`;

  try {
    // Generate a short URL using nanoid
    const shortUrl = nanoid(8);
    const editUrl = nanoid(16); // Longer for security

    const urlLog: UrlLog = {
      longUrl: urlToShorten,
      visits: 0,
      visitors: [],
      track: "true",
      editUrl,
    };

    // Store in Redis KV
    await redis.set(shortUrl, JSON.stringify(urlLog));
    return { success: true, shortUrl, editUrl };
  } catch (error) {
    return { success: false, message: "Error creating short link" };
  }
}
