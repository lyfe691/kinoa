"use client";

import { useState } from "react";
import { PillTabs } from "@/components/ui/pill-tabs";
import { TrendingSection } from "@/components/trending-section";
import type { MediaSummary } from "@/lib/tmdb";

const CONTENT_TABS = [
  { id: "all", label: "All" },
  { id: "movies", label: "Movies" },
  { id: "tv", label: "TV Shows" },
];

type TrendingFilterProps = {
  items: MediaSummary[];
};

export function TrendingFilter({ items }: TrendingFilterProps) {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">Trending</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            What everyone is watching this week.
          </p>
        </div>
        <PillTabs
          tabs={CONTENT_TABS}
          defaultActiveId="all"
          onTabChange={setActiveTab}
        />
      </div>

      <TrendingSection items={items} filter={activeTab} />
    </div>
  );
}
