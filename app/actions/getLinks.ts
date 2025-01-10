"use server";

import { UrlLog } from "@/lib/type";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function getLinks(shortUrlList: string[]) {
  if (!shortUrlList.length) return {};

  try {
    // Fetch URL logs from Redis using hmget
    const urlLogs = await redis.hmget<Record<string, UrlLog>>(
      "urls",
      ...shortUrlList
    );
    return urlLogs;
  } catch (error) {
    return {};
  }
}
