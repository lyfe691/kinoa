"use client";

import * as React from "react";
import { Film, Tv, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { MediaSummary } from "@/lib/tmdb";
import { MediaCard } from "@/components/media-card";

type WatchlistControlsProps = {
  media: MediaSummary[];
};

type FilterType = "all" | "movie" | "tv";
type SortType = "recent" | "title" | "rating" | "year";

export function WatchlistControls({ media }: WatchlistControlsProps) {
  const [filter, setFilter] = React.useState<FilterType>("all");
  const [sort, setSort] = React.useState<SortType>("recent");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredMedia = React.useMemo(() => {
    let result = [...media];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(query));
    }

    // Apply filter
    if (filter !== "all") {
      result = result.filter((item) => item.type === filter);
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sort) {
        case "title":
          return a.name.localeCompare(b.name);
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "year": {
          const yearA = a.releaseYear ? parseInt(a.releaseYear) : 0;
          const yearB = b.releaseYear ? parseInt(b.releaseYear) : 0;
          return yearB - yearA;
        }
        case "recent":
        default:
          return 0;
      }
    });

    return result;
  }, [media, filter, sort, searchQuery]);

  const movieCount = media.filter((m) => m.type === "movie").length;
  const tvCount = media.filter((m) => m.type === "tv").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as FilterType)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTab value="all" className="gap-1.5">
              All
              <span className="text-xs text-muted-foreground">
                {media.length}
              </span>
            </TabsTab>
            <TabsTab value="movie" className="gap-1.5">
              <Film className="h-3.5 w-3.5 sm:hidden" />
              Movies
              <span className="text-xs text-muted-foreground">
                {movieCount}
              </span>
            </TabsTab>
            <TabsTab value="tv" className="gap-1.5">
              <Tv className="h-3.5 w-3.5 sm:hidden" />
              Shows
              <span className="text-xs text-muted-foreground">{tvCount}</span>
            </TabsTab>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search your watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as SortType)}
          >
            <SelectTrigger className="h-10 w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="year">Release Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {searchQuery && (
        <div className="rounded-lg border bg-muted/30 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredMedia.length}
            </span>{" "}
            {filteredMedia.length === 1 ? "result" : "results"} for{" "}
            <span className="font-medium text-foreground">
              &quot;{searchQuery}&quot;
            </span>
          </p>
        </div>
      )}

      {filteredMedia.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredMedia.map((item) => (
            <MediaCard
              key={`${item.type}-${item.id}`}
              media={item}
              isInWatchlist
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-muted p-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">No results found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : `No ${filter !== "all" ? (filter === "movie" ? "movies" : "shows") : "items"} in your watchlist`}
              </p>
            </div>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
