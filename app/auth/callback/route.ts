import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";
  const redirectUrl = new URL(next, requestUrl.origin);

  if (code) {
    const supabase = createRouteHandlerClient({
      cookies,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      redirectUrl.searchParams.set("error", "auth-callback");
    }
  }

  return NextResponse.redirect(redirectUrl);
}
