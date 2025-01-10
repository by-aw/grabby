import { createServerSupabase } from "@/lib/supabase/serverClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  if (!token_hash || !type) {
    return NextResponse.json(
      { error: "Missing token_hash or type" },
      { status: 400 }
    );
  }
  if (type === "magiclink") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token_hash,
      type: type as "magiclink",
    });
    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
  } else {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token_hash,
      type: type as "signup" | "invite" | "recovery",
    });
    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
  }
  return NextResponse.json({ message: "OTP verified" }, { status: 200 });
}
