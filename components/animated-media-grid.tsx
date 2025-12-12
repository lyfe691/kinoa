"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useReducedMotion,
} from "framer-motion";
import { MediaCard } from "@/components/media-card";
import type { MediaSummary } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

type AnimatedMediaGridProps = {
  items: MediaSummary[];
  /** Whether items are in the watchlist (shows bookmark as filled) */
  isWatchlist?: boolean;
  /** Priority loading for first N items (default: 4) */
  priorityCount?: number;
  /** Custom grid className */
  className?: string;
  /** Unique ID prefix to avoid layoutId conflicts between grids */
  layoutId?: string;
};

export function AnimatedMediaGrid({
  items,
  isWatchlist = false,
  priorityCount = 4,
  className,
  layoutId = "media",
}: AnimatedMediaGridProps) {
  const prefersReducedMotion = useReducedMotion();
  const hasMountedRef = React.useRef(false);
  React.useEffect(() => {
    hasMountedRef.current = true;
  }, []);
  const initialScale = prefersReducedMotion ? 1 : 0.8;

  return (
    <LayoutGroup id={layoutId}>
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
          className,
        )}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={`${item.type}-${item.id}`}
              layout={!prefersReducedMotion}
              layoutId={`${layoutId}-${item.type}-${item.id}`}
              initial={
                hasMountedRef.current
                  ? { opacity: 0, scale: initialScale }
                  : false
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.8 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.15 }
                  : {
                      layout: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },
                    }
              }
            >
              <MediaCard
                media={item}
                isInWatchlist={isWatchlist}
                priority={index < priorityCount}
                className="h-full"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
