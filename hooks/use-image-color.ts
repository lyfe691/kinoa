"use client";

import { useState, useEffect } from "react";

// Client-side cache to avoid redundant API calls
const colorCache = new Map<string, string>();

export function useImageColor(url: string | null | undefined) {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setColor(null);
      return;
    }

    // Check cache first (only on client after hydration)
    const cached = colorCache.get(url);
    if (cached) {
      setColor(cached);
      return;
    }

    let mounted = true;
    const imageUrl = url;

    async function fetchColor() {
      try {
        const response = await fetch(
          `/api/color?url=${encodeURIComponent(imageUrl)}`
        );
        if (!response.ok) return;

        const data = await response.json();
        if (data.color) {
          colorCache.set(imageUrl, data.color);
          if (mounted) {
            setColor(data.color);
          }
        }
      } catch {
        // Silently fail
      }
    }

    fetchColor();

    return () => {
      mounted = false;
    };
  }, [url]);

  return color;
}
