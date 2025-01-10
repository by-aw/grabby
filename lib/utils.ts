import { Redis } from "@upstash/redis";
import { type ClassValue, clsx } from "clsx";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { UrlLog } from "./type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CreateLinkSuccess = {
  success: true;
  shortUrl: string;
  editUrl: string;
};

type CreateLinkError = {
  success: false;
  message: string;
};

type CreateLinkResult = CreateLinkSuccess | CreateLinkError;

export async function createShortLink(url: string): Promise<CreateLinkResult> {
  try {
    const redis = Redis.fromEnv();

    if (!url) {
      return { success: false, message: "URL is required" };
    }

    const longUrl = url.toString().toLowerCase();

    // Ensure URL has protocol
    const urlToShorten = longUrl.startsWith("http")
      ? longUrl
      : `https://${longUrl}`;

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

    // Store data using Redis hash and maintain lookup index
    await Promise.all([
      // Store URL data in a hash
      redis.hset("urls", { [shortUrl]: JSON.stringify(urlLog) }),
      // Store edit URL lookup
      redis.hset("edit_urls", { [editUrl]: shortUrl }),
    ]);

    return {
      success: true,
      shortUrl,
      editUrl,
    };
  } catch (error) {
    return { success: false, message: "Error creating short link" };
  }
}

export function getOSFromUserAgent(userAgent: string | null): string {
  if (!userAgent) return "Unknown";

  if (userAgent.includes("Win")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("like Mac")) return "iOS";

  return "Unknown";
}

type Options = {
  interval?: number; // in milliseconds
};

type RateLimitResult =
  | NextResponse<{ success: false; message: string }>
  | { success: true; headers: Headers };

export default function rateLimit(options?: Options) {
  const interval = options?.interval || 60000; // default 1 minute

  return {
    check: async (token: string, limit: number): Promise<RateLimitResult> => {
      const redis = Redis.fromEnv();
      const key = `rate_limit:${token}`;

      // Get current count and timestamp
      const current = await redis.get<{ count: number; timestamp: number }>(
        key
      );
      const now = Date.now();

      if (!current) {
        // First request from this token
        await redis.set(
          key,
          { count: 1, timestamp: now },
          { ex: Math.floor(interval / 1000) } // Convert ms to seconds for Redis TTL
        );
        return {
          success: true,
          headers: new Headers({
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": (limit - 1).toString(),
            "X-RateLimit-Reset": (now + interval).toString(),
          }),
        };
      }

      // Check if the window has expired
      if (now - current.timestamp >= interval) {
        // Reset the window
        await redis.set(
          key,
          { count: 1, timestamp: now },
          { ex: Math.floor(interval / 1000) }
        );
        return {
          success: true,
          headers: new Headers({
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": (limit - 1).toString(),
            "X-RateLimit-Reset": (now + interval).toString(),
          }),
        };
      }

      // Check if rate limit exceeded
      if (current.count >= limit) {
        const resetTime = current.timestamp + interval;
        return NextResponse.json(
          {
            success: false,
            message: `Rate limit exceeded. Maximum ${limit} requests allowed per day. Reset at ${new Date(
              resetTime
            ).toISOString()}`,
          },
          {
            status: 429,
            headers: new Headers({
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": resetTime.toString(),
            }),
          }
        );
      }

      // Increment the counter
      await redis.set(
        key,
        { count: current.count + 1, timestamp: current.timestamp },
        { ex: Math.floor((interval - (now - current.timestamp)) / 1000) }
      );

      return {
        success: true,
        headers: new Headers({
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": (limit - current.count - 1).toString(),
          "X-RateLimit-Reset": (current.timestamp + interval).toString(),
        }),
      };
    },
  };
}
