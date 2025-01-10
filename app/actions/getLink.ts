"use server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const getLongUrl = async (shortUrl: string): Promise<string[]> => {
  const link = redis.get(shortUrl);
  if (typeof link !== "string") {
    throw Error("Short link not found");
  }
  return link;
};
