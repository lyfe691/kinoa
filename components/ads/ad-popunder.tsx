"use client";

import { useEffect, useRef } from "react";

const AD_URL = process.env.NEXT_PUBLIC_AD_POPUNDER_URL || "";
const COOLDOWN_MS = 10 * 1000; // 10s
const STORAGE_KEY = "kinoa_ad_last_shown";

export function AdPopunder() {
  const isHandlingClick = useRef(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (isHandlingClick.current || !AD_URL) return;
      const lastShown = window.localStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      if (lastShown && now - parseInt(lastShown) < COOLDOWN_MS) {
        return;
      }
      isHandlingClick.current = true;
      window.localStorage.setItem(STORAGE_KEY, now.toString());
      window.open(AD_URL, "_blank");
      setTimeout(() => {
        isHandlingClick.current = false;
      }, 1000);
    };
    window.addEventListener("click", handleInteraction, { capture: true });

    return () => {
      window.removeEventListener("click", handleInteraction, { capture: true });
    };
  }, []);

  return null;
}
