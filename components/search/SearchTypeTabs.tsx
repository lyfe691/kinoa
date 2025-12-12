"use client";

import * as React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AnimatedMediaGrid } from "@/components/animated-media-grid";

import type { MediaSummary } from "@/lib/tmdb";

type SearchType = "all" | "movie" | "tv";

type SearchTypeTabsProps = {
  query: string;
  results: {
    all: MediaSummary[];
    movie: MediaSummary[];
    tv: MediaSummary[];
  };
  initialType: SearchType;
  clearHref: string;
};

const TAB_ITEMS: { id: SearchType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV Shows" },
];

const TYPE_LABEL: Record<Exclude<SearchType, "all">, string> = {
  movie: "Movies",
  tv: "TV Shows",
};

export function SearchTypeTabs({
  query,
  results,
  initialType,
  clearHref,
}: SearchTypeTabsProps) {
  const [value, setValue] = React.useState<SearchType>(initialType);

  const handleTabChange = React.useCallback((next: string) => {
    if (next === "all" || next === "movie" || next === "tv") {
      setValue(next);
    }
  }, []);

  const activeItems = React.useMemo(() => {
    if (value === "movie") return results.movie;
    if (value === "tv") return results.tv;
    return results.all;
  }, [results.all, results.movie, results.tv, value]);

  const renderEmptyState = (type: Exclude<SearchType, "all">) => {
    const otherType: Exclude<SearchType, "all"> =
      type === "movie" ? "tv" : "movie";
    const otherCount = results[otherType].length;
    const otherLabel = TYPE_LABEL[otherType];
    const currentLabel = TYPE_LABEL[type];

    if (otherCount > 0) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No {currentLabel.toLowerCase()} for &ldquo;{query}&rdquo;.{" "}
            <button
              type="button"
              className="underline underline-offset-4 text-foreground"
              onClick={() => setValue(otherType)}
            >
              {otherCount} {otherLabel.toLowerCase()}
            </button>{" "}
            match this search.
          </p>
        </div>
      );
    }

    return (
      <p className="text-sm text-muted-foreground">
        No {currentLabel.toLowerCase()} for &ldquo;{query}&rdquo;.
      </p>
    );
  };

  return (
    <Tabs value={value} onValueChange={handleTabChange} className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <TabsList>
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button
          render={<Link href={clearHref} />}
          size="default"
          variant="secondary"
        >
          Clear search
        </Button>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {activeItems.length}
          </span>{" "}
          {activeItems.length === 1 ? "result" : "results"} for &ldquo;{query}
          &rdquo;
        </p>

        {value !== "all" && activeItems.length === 0 ? (
          renderEmptyState(value)
        ) : (
          <AnimatedMediaGrid
            items={activeItems}
            layoutId="search-results"
            priorityCount={2}
            className="lg:grid-cols-4"
          />
        )}
      </div>
    </Tabs>
  );
}
