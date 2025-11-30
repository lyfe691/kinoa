"use client";

import * as React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MediaCard } from "@/components/media-card";

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

  const renderResultGrid = React.useCallback(
    (items: MediaSummary[]) => (
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item, index) => (
          <MediaCard
            key={`${item.type}-${item.id}`}
            media={item}
            priority={index < 2}
          />
        ))}
      </div>
    ),
    [],
  );

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

      <TabsContent value="all" className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {results.all.length}
          </span>{" "}
          {results.all.length === 1 ? "result" : "results"} for &ldquo;{query}
          &rdquo;
        </p>
        {renderResultGrid(results.all)}
      </TabsContent>

      <TabsContent value="movie" className="space-y-4">
        {results.movie.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {results.movie.length}
              </span>{" "}
              {results.movie.length === 1 ? "movie" : "movies"} for &ldquo;
              {query}&rdquo;
            </p>
            {renderResultGrid(results.movie)}
          </>
        ) : (
          renderEmptyState("movie")
        )}
      </TabsContent>

      <TabsContent value="tv" className="space-y-4">
        {results.tv.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {results.tv.length}
              </span>{" "}
              {results.tv.length === 1 ? "show" : "shows"} for &ldquo;{query}
              &rdquo;
            </p>
            {renderResultGrid(results.tv)}
          </>
        ) : (
          renderEmptyState("tv")
        )}
      </TabsContent>
    </Tabs>
  );
}
