"use server";
import { UrlLog } from "@/lib/type";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Get URL log by short URL
export async function getUrlLog(shortUrl: string) {
  const urlLog = await redis.hget<UrlLog>("urls", shortUrl);
  return urlLog;
}

// Get URL log by edit URL
export async function getUrlLogByEditUrl(editUrl: string) {
  // First get the short URL from the edit URL lookup
  const shortUrl = await redis.hget<string>("edit_urls", editUrl);
  if (!shortUrl) {
    return null;
  }

  // Then get the URL log using the short URL
  const urlLog = await redis.hget<UrlLog>("urls", shortUrl);
  if (!urlLog) {
    return null;
  }

  return { shortUrl, ...urlLog };
}

// Update URL log
export async function updateUrlLog(shortUrl: string, urlLog: UrlLog) {
  await redis.hset("urls", { [shortUrl]: JSON.stringify(urlLog) });
}
