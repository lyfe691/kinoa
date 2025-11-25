import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";

      // Construct the redirect URL
      // We append ?verified=true to the 'next' path so the destination page knows auth just succeeded
      // We need to handle if 'next' already has params
      const nextUrl = new URL(next, requestUrl.origin);
      nextUrl.searchParams.set("verified", "true");
      const nextPath = nextUrl.pathname + nextUrl.search;

      if (isLocalEnv) {
        return NextResponse.redirect(`${requestUrl.origin}${nextPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${nextPath}`);
      } else {
        return NextResponse.redirect(`${requestUrl.origin}${nextPath}`);
      }
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(new URL("/auth/error", request.url));
}
