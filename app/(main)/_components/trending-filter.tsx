"use client";

import { useState } from "react";
import { PillTabs } from "@/components/ui/pill-tabs";
import { TrendingSection } from "@/components/trending-section";
import { Section } from "./section";
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
    <Section
      title="Trending"
      description="What everyone is watching this week."
      delay={0.5}
      action={
        <PillTabs
          tabs={CONTENT_TABS}
          defaultActiveId="all"
          onTabChange={setActiveTab}
        />
      }
    >
      <TrendingSection items={items} filter={activeTab} />
    </Section>
  );
}
