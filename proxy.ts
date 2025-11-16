import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const bypassPrefixes = ["/_next", "/api", "/static"];
const bypassPaths = [
  "/maintenance",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
];

export function proxy(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== "true") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    bypassPaths.includes(pathname) ||
    pathname.match(/\.[a-zA-Z0-9]+$/) ||
    bypassPrefixes.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  const maintenanceUrl = request.nextUrl.clone();
  maintenanceUrl.pathname = "/maintenance";
  maintenanceUrl.search = "";

  return NextResponse.rewrite(maintenanceUrl);
}

export const config = {
  matcher: [
    "/((?!_next/|maintenance|api/|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest).*)",
  ],
};
