import { UrlLog } from "@/lib/type";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const headersList = headers();
  const ipAddress = headersList.get("x-forwarded-for") || "unknown";
  const userAgent = headersList.get("user-agent");
  const referer = headersList.get("referer") || "";

  // Don't track visits from the edit page
  const isFromEditPage = referer.includes("/edit/");

  // Validate slug format
  if (!/^[a-zA-Z0-9_-]{8}$/.test(slug)) {
    return NextResponse.redirect(
      env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : "https://grabby.co/"
    );
  }

  const redis = Redis.fromEnv();
  const urlLog = await redis.get<UrlLog>(slug);

  if (!urlLog) {
    return NextResponse.redirect(
      env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : "https://grabby.co/"
    );
  }

  let isp = null;
  let country_name = null;

  if (ipAddress && urlLog.track === "true" && !isFromEditPage) {
    try {
      const response = await fetch(
        `https://api.iplocation.net/?ip=${ipAddress}`
      );
      if (response.ok) {
        const data = await response.json();
        isp = data.isp;
        country_name = data.country_code2;
      }
    } catch (error) {}
  }

  if (urlLog.track === "true" && !isFromEditPage) {
    await redis.set(
      slug,
      JSON.stringify(<UrlLog>{
        ...urlLog,
        track: "true",
        visits: urlLog.visits + 1,
        visitors: [
          ...urlLog.visitors,
          {
            ip: ipAddress,
            agent: userAgent,
            timestamp: Date.now().toString(),
            isp: isp,
            country_name: country_name,
          },
        ],
      })
    );
  }

  return NextResponse.redirect(urlLog.longUrl, { status: 302 });
}
