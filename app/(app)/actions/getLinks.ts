"use server";

import { UrlLog } from "@/lib/type";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export type PaginatedLinks = {
  links: Record<string, UrlLog>;
  total: number;
  hasMore: boolean;
  allShortUrls: string[];
};

export async function getLinks(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PaginatedLinks> {
  try {
    // Get all links with their data
    const allLinks = await redis.hgetall<Record<string, UrlLog>>("urls");

    if (!allLinks) {
      return { links: {}, total: 0, hasMore: false, allShortUrls: [] };
    }

    // Convert and sort entries
    const entries = Object.entries(allLinks)
      .map(([key, value]) => {
        // Handle both string and object values from Redis
        const urlLog = typeof value === "string" ? JSON.parse(value) : value;
        return [key, urlLog] as const;
      })
      .sort(([a], [b]) => a.localeCompare(b));

    // Filter by search term if provided
    const filteredEntries = search
      ? entries.filter(
          ([shortUrl, urlLog]) =>
            shortUrl.toLowerCase().includes(search.toLowerCase()) ||
            urlLog.longUrl.toLowerCase().includes(search.toLowerCase())
        )
      : entries;

    // Calculate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedEntries = filteredEntries.slice(start, end);

    // Convert entries back to record
    const links = Object.fromEntries(paginatedEntries);

    // Get all short URLs for selection
    const allShortUrls = filteredEntries.map(([shortUrl]) => shortUrl);

    return {
      links,
      total: filteredEntries.length,
      hasMore: end < filteredEntries.length,
      allShortUrls,
    };
  } catch (error) {
    console.error("Error fetching links:", error);
    return {
      links: {},
      total: 0,
      hasMore: false,
      allShortUrls: [],
    };
  }
}

// Function specifically for fetching user's saved links
export async function getUserLinks(
  shortUrls: string[]
): Promise<Record<string, UrlLog>> {
  try {
    // Get all links with their data
    const allLinks = await redis.hgetall<Record<string, UrlLog>>("urls");

    if (!allLinks) {
      return {};
    }

    // Filter and convert the links
    const userLinks: Record<string, UrlLog> = {};
    for (const shortUrl of shortUrls) {
      if (allLinks[shortUrl]) {
        const urlLog =
          typeof allLinks[shortUrl] === "string"
            ? JSON.parse(allLinks[shortUrl])
            : allLinks[shortUrl];
        userLinks[shortUrl] = urlLog;
      }
    }

    return userLinks;
  } catch (error) {
    console.error("Error fetching user links:", error);
    return {};
  }
}
