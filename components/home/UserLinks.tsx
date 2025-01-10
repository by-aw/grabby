"use client";

import { getLinks } from "@/app/actions/getLinks";
import useLocalStorage from "@/hooks/useLocalStorage";
import { UrlLog } from "@/lib/type";
import { MousePointer } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserLinks() {
  const [savedLinks, setSavedLinks] = useLocalStorage<string[]>("links", []);
  const [links, setLinks] = useState<Record<string, UrlLog>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      setIsLoading(true);
      const dbLinks = await getLinks(savedLinks);

      // Batch update links state
      setLinks(dbLinks);

      // Filter out non-existent links
      const validLinks = savedLinks.filter((shortUrl) => dbLinks[shortUrl]);
      if (validLinks.length !== savedLinks.length) {
        setSavedLinks(validLinks);
      }

      setIsLoading(false);
    }

    if (savedLinks.length > 0) {
      fetchLinks();
    } else {
      setIsLoading(false);
    }
  }, [savedLinks]);

  return (
    <section className="fade-in-0 animate-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full pb-4 h-max mt-auto">
      <h2 className="text-xl font-bold mt-4 mb-2 col-span-1 md:col-span-2 lg:col-span-3 sticky top-0">
        Your links
      </h2>
      {savedLinks.length <= 0 || isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div className="flex flex-col rounded-2xl border border-border p-3 hover:bg-secondary transition-colors overflow-hidden">
              <div className="h-6 w-16 bg-muted animate-pulse rounded-full"></div>
              <div className="h-4 my-2 w-32 bg-muted animate-pulse rounded-full mb-3"></div>
              <div className="h-6 w-10 bg-muted animate-pulse rounded-full"></div>
            </div>
          ))
        : savedLinks.map((link) => (
            <Link
              key={`${link}`}
              href={`/edit/${links?.[link]?.editUrl}`}
              className="flex flex-col rounded-2xl border border-border p-3 hover:bg-secondary transition-colors overflow-hidden"
            >
              <h3 className="font-semibold">{link}</h3>
              <p className="text-muted-foreground mb-3 truncate">
                {links?.[link]?.longUrl || "No long URL found"}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MousePointer className="w-4 h-4" />
                <span>{links?.[link]?.visits || 0}</span>
              </p>
            </Link>
          ))}
    </section>
  );
}
