"use server";
import rateLimit, { createShortLink } from "@/lib/utils";

import { NextRequest, NextResponse } from "next/server";

const limiter = rateLimit({
  interval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
});

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for") || request.ip || "127.0.0.1";

    // Check rate limit - 10 requests per day per IP
    const rateLimitResult = await limiter.check(ip, 10);

    // If it's a NextResponse, it means rate limit was exceeded
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult;
    }

    const { url } = await request.json();
    const result = await createShortLink(url);

    if (!result.success) {
      return NextResponse.json(result, {
        status: 400,
        headers: rateLimitResult.headers,
      });
    }

    return NextResponse.json(result, {
      headers: rateLimitResult.headers,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error creating short link" },
      { status: 500 }
    );
  }
}
