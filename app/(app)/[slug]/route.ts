import { getUrlLog, updateUrlLog } from "@/app/(app)/actions/getLink";
import { UrlLog } from "@/lib/type";
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

  // Validate slug format
  if (!/^[a-zA-Z0-9_-]{8}$/.test(slug)) {
    return NextResponse.redirect(
      env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : "https://grabby.co/"
    );
  }

  const urlLog = await getUrlLog(slug);
  if (!urlLog) {
    return NextResponse.redirect(
      env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : "https://grabby.co/"
    );
  }

  let isp = null;
  let country_name = null;

  if (ipAddress && urlLog.track === "true") {
    try {
      const response = await fetch(
        `https://api.iplocation.net/?ip=${ipAddress}`
      );
      if (response.ok) {
        const data = await response.json();
        isp = data.isp || null;
        country_name = data.country_code2 || null;
      }
    } catch (error) {
      // Silently handle API errors
    }
  }

  if (urlLog.track === "true") {
    const updatedLog: UrlLog = {
      ...urlLog,
      visits: urlLog.visits + 1,
      visitors: [
        ...urlLog.visitors,
        {
          ip: ipAddress,
          agent: userAgent,
          timestamp: Date.now().toString(),
          isp,
          country_name,
        },
      ],
    };

    await updateUrlLog(slug, updatedLog);
  }

  return NextResponse.redirect(urlLog.longUrl, { status: 302 });
}
