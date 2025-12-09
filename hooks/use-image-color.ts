"use client";

import { useState, useEffect } from "react";

// In-memory cache for the current session
// We store "__NO_COLOR__" to indicate we've fetched and found nothing, avoiding retries
const memoryCache = new Map<string, string>();

// Keep track of in-flight requests to deduplicate calls
const promiseCache = new Map<string, Promise<string | null>>();

const NO_COLOR = "__NO_COLOR__";

export function useImageColor(url: string | null | undefined) {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setColor(null);
      return;
    }

    // 1. Check in-memory cache
    if (memoryCache.has(url)) {
      const cached = memoryCache.get(url);
      setColor(cached === NO_COLOR ? null : cached!);
      return;
    }

    // 2. Check session storage (persists across reloads)
    try {
      const stored = sessionStorage.getItem(`color-cache-${url}`);
      if (stored) {
        memoryCache.set(url, stored);
        setColor(stored === NO_COLOR ? null : stored);
        return;
      }
    } catch {
      // Ignore storage errors (e.g. cookies disabled, quota exceeded)
    }

    let mounted = true;

    async function getColor() {
      // 3. Check for existing in-flight request, create if missing
      let promise = promiseCache.get(url!);

      if (!promise) {
        promise = fetch(`/api/color?url=${encodeURIComponent(url!)}`)
          .then(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            return (data.color as string) || null;
          })
          .catch(() => null)
          .finally(() => {
            // Remove from promise cache after completion
            promiseCache.delete(url!);
          });

        promiseCache.set(url!, promise);
      }

      try {
        const fetchedColor = await promise;

        if (mounted) {
          // Cache the result (even if null) to prevent future unnecessary requests
          const cacheValue = fetchedColor || NO_COLOR;

          memoryCache.set(url!, cacheValue);
          try {
            sessionStorage.setItem(`color-cache-${url!}`, cacheValue);
          } catch {
            // Ignore storage errors
          }

          setColor(fetchedColor);
        }
      } catch {
        // Should catch the promise errors
      }
    }

    getColor();

    return () => {
      mounted = false;
    };
  }, [url]);

  return color;
}
