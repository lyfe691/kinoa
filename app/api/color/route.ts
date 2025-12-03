import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

type RGB = { r: number; g: number; b: number };

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

function getVibrantColor(pixels: Buffer, width: number, height: number): RGB | null {
  let best: RGB | null = null;
  let bestScore = -1;

  // Sample pixels (RGB format, 3 bytes per pixel)
  const totalPixels = width * height;
  const step = Math.max(1, Math.floor(totalPixels / 100)); // Sample ~100 pixels

  for (let i = 0; i < totalPixels; i += step) {
    const offset = i * 3;
    const r = pixels[offset];
    const g = pixels[offset + 1];
    const b = pixels[offset + 2];

    const [, s, l] = rgbToHsl(r, g, b);
    const saturationScore = s / 100;
    const lightnessScore = 1 - Math.abs(l - 50) / 50;
    const score = saturationScore * 0.7 + lightnessScore * 0.3;

    if (score > bestScore) {
      bestScore = score;
      best = { r, g, b };
    }
  }

  return best;
}

// Simple in-memory cache
const colorCache = new Map<string, { color: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Check cache
  const cached = colorCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ color: cached.color });
  }

  try {
    // Fetch image server-side (no CORS issues)
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Resize to small size for fast processing and get raw RGB pixels
    const { data, info } = await sharp(buffer)
      .resize(50, 50, { fit: "cover" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const vibrant = getVibrantColor(data, info.width, info.height);

    if (vibrant) {
      const color = `${vibrant.r}, ${vibrant.g}, ${vibrant.b}`;
      colorCache.set(url, { color, timestamp: Date.now() });
      return NextResponse.json({ color });
    }

    return NextResponse.json({ color: null });
  } catch (error) {
    console.error("Color extraction error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
