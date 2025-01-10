"use server";

import { UrlLog } from "@/lib/type";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function setTracking(
  slug: string,
  urlLog: UrlLog,
  track: "true" | "false" | "disabled"
) {
  await redis.set(slug, JSON.stringify(<UrlLog>{ ...urlLog, track }));
}
