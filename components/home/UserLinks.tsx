"use client";

import { getUserLinks } from "@/app/(app)/actions/getLinks";
import useLocalStorage from "@/hooks/useLocalStorage";
import { UrlLog } from "@/lib/type";
import { MousePointer } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Cache for storing link data between page navigations
const linkCache: Record<string, UrlLog> = {};

export default function UserLinks() {
  const [savedLinks, setSavedLinks] = useLocalStorage<string[]>("links", []);
  const [links, setLinks] = useState<Record<string, UrlLog>>(() => {
    // Initialize with cached data if available
    const initialData: Record<string, UrlLog> = {};
    savedLinks.forEach((link) => {
      if (linkCache[link]) {
        initialData[link] = linkCache[link];
      }
    });
    return initialData;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    async function fetchLinks() {
      // Only show loading state if we don't have cached data
      const shouldShowLoading = Object.keys(links).length === 0;
      setIsRefreshing(shouldShowLoading);

      const dbLinks = await getUserLinks(savedLinks);

      // Update cache
      Object.entries(dbLinks).forEach(([key, value]) => {
        linkCache[key] = value;
      });

      setLinks(dbLinks);

      // Filter out non-existent links
      const validLinks = savedLinks.filter((shortUrl) => dbLinks[shortUrl]);
      if (validLinks.length !== savedLinks.length) {
        setSavedLinks(validLinks);
      }

      setIsRefreshing(false);
    }

    if (savedLinks.length > 0) {
      fetchLinks();
    }
  }, [savedLinks]);

  if (savedLinks.length <= 0) {
    return (
      <section className="fade-in-0 animate-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full pb-4 h-max mt-auto">
        <h2 className="text-xl font-bold mt-4 mb-2 col-span-1 md:col-span-2 lg:col-span-3 sticky top-0">
          Your links
        </h2>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col rounded-2xl border border-border p-3 hover:bg-secondary transition-colors overflow-hidden"
          >
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full"></div>
            <div className="h-4 my-2 w-32 bg-muted animate-pulse rounded-full mb-3"></div>
            <div className="h-6 w-10 bg-muted animate-pulse rounded-full"></div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="fade-in-0 animate-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full pb-4 h-max mt-auto">
      <h2 className="text-xl font-bold mt-4 mb-2 col-span-1 md:col-span-2 lg:col-span-3 sticky top-0">
        Your links
      </h2>
      {savedLinks.map((link) => {
        const urlData = links[link];
        const isLoadingLink = isRefreshing && !urlData;

        return (
          <Link
            key={`${link}`}
            href={`/edit/${urlData?.editUrl}`}
            className={`flex flex-col rounded-2xl border border-border p-3 hover:bg-secondary transition-colors overflow-hidden ${
              isLoadingLink ? "animate-pulse" : ""
            }`}
          >
            <h3 className="font-semibold">{link}</h3>
            <p className="text-muted-foreground mb-3 truncate">
              {isLoadingLink || !urlData ? (
                <span className="inline-block h-4 w-32 bg-muted rounded-full" />
              ) : (
                urlData.longUrl
              )}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MousePointer className="w-4 h-4" />
              <span>
                {isLoadingLink || !urlData ? "-" : urlData.visits || 0}
              </span>
            </p>
          </Link>
        );
      })}
    </section>
  );
}
