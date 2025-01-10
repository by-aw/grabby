"use server";

import { Redis } from "@upstash/redis";
import { getUrlLog } from "./getLink";

const redis = Redis.fromEnv();

export async function deleteLink(shortUrl: string) {
  try {
    const urlLog = await getUrlLog(shortUrl);
    if (!urlLog) {
      return { success: false, message: "Link not found" };
    }

    // Delete both the URL data and edit URL lookup
    await Promise.all([
      redis.hdel("urls", shortUrl),
      redis.hdel("edit_urls", urlLog.editUrl),
    ]);

    return { success: true };
  } catch (error) {
    return { success: false, message: "Error deleting link" };
  }
}

export async function deleteAllLinks() {
  await redis.flushall();
}
