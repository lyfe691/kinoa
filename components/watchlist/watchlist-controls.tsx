"use client";

import * as React from "react";
import Link from "next/link";
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
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import type { MediaSummary } from "@/lib/tmdb";
import { MediaCard } from "@/components/media-card";
import { motion, AnimatePresence } from "framer-motion";
import {
  AnimatedIcon,
  type AnimatedIconHandle,
} from "@/components/animated-icon";
import optionsIcon from "@/public/icons/options.json";

type WatchlistControlsProps = {
  media: MediaSummary[];
};

type FilterType = "all" | "movie" | "tv";
type SortType = "recent" | "title" | "rating" | "year";

export function WatchlistControls({ media }: WatchlistControlsProps) {
  const [filter, setFilter] = React.useState<FilterType>("all");
  const [sort, setSort] = React.useState<SortType>("recent");
  const [searchQuery, setSearchQuery] = React.useState("");
  const optionsIconRef = React.useRef<AnimatedIconHandle>(null);

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
          return 0; // Assuming initial order is recent
      }
    });

    return result;
  }, [media, filter, sort, searchQuery]);

  const movieCount = media.filter((m) => m.type === "movie").length;
  const tvCount = media.filter((m) => m.type === "tv").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as FilterType)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTab value="all" className="gap-2 px-4">
              All
              <span className="rounded-full bg-muted-foreground/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {media.length}
              </span>
            </TabsTab>
            <TabsTab value="movie" className="gap-2 px-4">
              <Film className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Movies</span>
              <span className="rounded-full bg-muted-foreground/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {movieCount}
              </span>
            </TabsTab>
            <TabsTab value="tv" className="gap-2 px-4">
              <Tv className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Shows</span>
              <span className="rounded-full bg-muted-foreground/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {tvCount}
              </span>
            </TabsTab>
          </TabsList>
        </Tabs>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative flex-1 sm:min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full bg-transparent pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-transparent"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as SortType)}
          >
            <div
              className="relative"
              onMouseEnter={() => optionsIconRef.current?.play()}
            >
              <SelectTrigger className="h-9 w-[180px] bg-transparent">
                <div className="flex items-center gap-2">
                  <AnimatedIcon
                    ref={optionsIconRef}
                    icon={optionsIcon}
                    size={18}
                  />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
            </div>
            <SelectContent align="end" className="min-w-[180px]">
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="year">Release Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {searchQuery && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <p>
            Found{" "}
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
        <motion.div
          layout
          className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredMedia.map((item) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <MediaCard media={item} isInWatchlist className="h-full" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Empty className="min-h-[200px] border-dashed">
          <EmptyHeader>
            <EmptyTitle className="text-base font-normal text-muted-foreground">
              No results found
            </EmptyTitle>
          </EmptyHeader>
          {searchQuery && (
            <EmptyContent className="flex-row gap-2 justify-center">
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
              <Button
                render={
                  <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} />
                }
              >
                Search Kinoa
              </Button>
            </EmptyContent>
          )}
        </Empty>
      )}
    </div>
  );
}
