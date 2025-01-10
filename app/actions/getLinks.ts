"use server";

import { UrlLog } from "@/lib/type";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function getLinks(shortUrlList: string[]) {
  if (!shortUrlList.length) return {};

  try {
    // Fetch URL logs from Redis
    const urlLogs = await redis.mget<UrlLog[]>(...shortUrlList);

    // Create a map of shortUrl to UrlLog
    const urlMap = shortUrlList.reduce((acc, shortUrl, index) => {
      const urlLog = urlLogs[index];
      if (!urlLog) return acc;

      return {
        ...acc,
        [shortUrl]: urlLog,
      };
    }, {} as Record<string, UrlLog>);

    return urlMap;
  } catch (error) {
    return {};
  }
}
