import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const bypassPrefixes = ["/_next", "/api", "/static"];
const bypassPaths = [
  "/maintenance",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
];

export async function proxy(request: NextRequest) {
  // 1. Handle Maintenance Mode
  if (process.env.MAINTENANCE_MODE === "true") {
    const { pathname } = request.nextUrl;

    if (
      !bypassPaths.includes(pathname) &&
      !pathname.match(/\.[a-zA-Z0-9]+$/) &&
      !bypassPrefixes.some((prefix) => pathname.startsWith(prefix))
    ) {
      const maintenanceUrl = request.nextUrl.clone();
      maintenanceUrl.pathname = "/maintenance";
      maintenanceUrl.search = "";
      return NextResponse.rewrite(maintenanceUrl);
    }
  }

  // 2. Handle Supabase Auth Session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

