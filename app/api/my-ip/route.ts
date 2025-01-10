import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  return NextResponse.json({ ip });
}
