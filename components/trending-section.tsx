"use client";

import * as React from "react";
import { AnimatedMediaGrid } from "@/components/animated-media-grid";
import type { MediaSummary } from "@/lib/tmdb";

type TrendingSectionProps = {
  items: MediaSummary[];
  filter?: string;
};

export function TrendingSection({
  items,
  filter = "all",
}: TrendingSectionProps) {
  const filtered = React.useMemo(() => {
    if (filter === "all") return items;
    if (filter === "movies") return items.filter((i) => i.type === "movie");
    if (filter === "tv") return items.filter((i) => i.type === "tv");
    return items;
  }, [items, filter]);

  return (
    <AnimatedMediaGrid
      items={filtered}
      layoutId="trending"
      className="lg:grid-cols-4"
    />
  );
}
