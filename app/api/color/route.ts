import { NextRequest, NextResponse } from "next/server";
import { extractImageColor } from "@/lib/image-color";

export const runtime = "nodejs";

// Simple in-memory cache (persists across warm lambda invocations)
const colorCache = new Map<string, { color: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 },
    );
  }

  // Check in-memory cache first
  const cached = colorCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(
      { color: cached.color },
      {
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      },
    );
  }

  try {
    // Handle relative URLs (e.g. /images/poster.jpg) by making them absolute
    let targetUrl = url;
    try {
      new URL(url);
    } catch {
      targetUrl = new URL(url, request.nextUrl.origin).toString();
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 502 },
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const color = await extractImageColor(buffer);

    if (color) {
      colorCache.set(url, { color, timestamp: Date.now() });

      return NextResponse.json(
        { color },
        {
          headers: {
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        },
      );
    }

    // Cache "no color found" responses for 1 hour to avoid repeated processing
    return NextResponse.json(
      { color: null },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      },
    );
  } catch (error) {
    console.error("Color extraction error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 },
    );
  }
}
