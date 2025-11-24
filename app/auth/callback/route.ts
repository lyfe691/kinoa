import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthError } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    
    // Check if this is an email change confirmation or a regular login/signup
    // For email change, we just need to exchange the code to confirm the change.
    // The user might not have a session yet if they clicked the link in a new browser/incognito.
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";

      let redirectUrl: string;

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        redirectUrl = `${requestUrl.origin}${next}`;
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`;
      } else {
        redirectUrl = `${requestUrl.origin}${next}`;
      }

      // Append verified=true for UI feedback
      const separator = redirectUrl.includes('?') ? '&' : '?';
      return NextResponse.redirect(`${redirectUrl}${separator}verified=true`);
    } else {
      console.error("[Auth Callback] Code exchange error:", error);

      const errorMessage = error.message?.toLowerCase() ?? "";
      // Check for PKCE verifier errors (missing cookie or mismatch)
      // "both auth code and code verifier should be non-empty" -> Missing cookie (cross-browser)
      // "code challenge does not match previously saved code verifier" -> Mismatch (race condition or bad state)
      if (
        errorMessage.includes("verifier") || 
        errorMessage.includes("code challenge") ||
        (error as AuthError)?.code === "bad_code_verifier"
      ) {
         return NextResponse.redirect(
          `${requestUrl.origin}/auth/error?type=cross_browser_pkce`
        );
      }

      // Allow fall-through to error page for better debugging
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/error?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(new URL("/auth/error", request.url));
}
