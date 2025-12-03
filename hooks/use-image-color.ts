"use client";

import { useState, useEffect } from "react";

export function useImageColor(url: string | null | undefined) {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setColor(null);
      return;
    }

    let mounted = true;
    const imageUrl = url;

    async function fetchColor() {
      try {
        const response = await fetch(
          `/api/color?url=${encodeURIComponent(imageUrl)}`,
        );
        if (!response.ok) return;

        const data = await response.json();
        if (mounted && data.color) {
          setColor(data.color);
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
