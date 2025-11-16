"use client";

import Link from "next/link";
import { MOVIE_SORTS, TV_SORTS } from "./sort-options";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

type FiltersProps = {
  type: "all" | "movie" | "tv";
  genre: string;
  sort: string;
  query?: string;
  showAllGenres?: boolean;
  movieGenres: { id: number; name: string }[];
  tvGenres: { id: number; name: string }[];
};

function buildHrefFactory(currentQuery?: string) {
  return function buildHref(params: Record<string, string | undefined>) {
    const url = new URLSearchParams();
    const q = params.q ?? currentQuery;
    if (q) url.set("q", q);
    if (params.type && params.type !== "all") url.set("type", params.type);
    if (params.genre) url.set("genre", params.genre);
    if (params.sort) url.set("sort", params.sort);
    if (params.showAllGenres) url.set("showAllGenres", params.showAllGenres);
    const qs = url.toString();
    return qs ? `/search?${qs}` : "/search";
  };
}

export default function SearchFilters({
  type,
  genre,
  sort,
  query,
  showAllGenres = false,
  movieGenres,
  tvGenres,
}: FiltersProps) {
  const allGenres = Array.from(
    new Map([...movieGenres, ...tvGenres].map((g) => [g.id, g])).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));

  const activeGenres =
    type === "movie" ? movieGenres : type === "tv" ? tvGenres : allGenres;

  const sorts = type === "tv" ? TV_SORTS : MOVIE_SORTS;
  const buildHref = buildHrefFactory(query);

  const maxGenresMobile = 8;
  const maxGenresDesktop = 16;
  const visibleGenresMobile = showAllGenres
    ? activeGenres
    : activeGenres.slice(0, maxGenresMobile);
  const visibleGenresDesktop = showAllGenres
    ? activeGenres
    : activeGenres.slice(0, maxGenresDesktop);

  return (
    <div className="space-y-6">
      {!query && (
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "movie", "tv"] as const).map((t) => (
            <Badge
              key={t}
              asChild
              variant={type === t ? "default" : "outline"}
              className="cursor-pointer"
            >
              <Link
                href={buildHref({
                  type: t === "all" ? undefined : t,
                  genre: genre || undefined,
                  sort,
                  showAllGenres: showAllGenres ? "1" : undefined,
                })}
              >
                {t === "all" ? "All" : t === "movie" ? "Movies" : "TV Shows"}
              </Link>
            </Badge>
          ))}
        </div>
      )}

      {!query && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Genres</h3>
            <div className="flex items-center gap-3">
              {!showAllGenres && activeGenres.length > maxGenresMobile && (
                <Link
                  href={buildHref({
                    type,
                    genre: genre || undefined,
                    sort,
                    showAllGenres: "1",
                  })}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Show more
                </Link>
              )}
              {showAllGenres && (
                <Link
                  href={buildHref({
                    type,
                    genre: genre || undefined,
                    sort,
                    showAllGenres: undefined,
                  })}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Show less
                </Link>
              )}
              {genre && (
                <Link
                  href={buildHref({
                    type,
                    sort,
                    showAllGenres: showAllGenres ? "1" : undefined,
                  })}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Link>
              )}
            </div>
          </div>

          {/* Mobile genres */}
          <div className="flex flex-wrap gap-2 md:hidden">
            {visibleGenresMobile.map((g) => {
              const id = String(g.id);
              const selected = genre === id;
              return (
                <Badge
                  key={g.id}
                  asChild
                  variant={selected ? "default" : "secondary"}
                  className="cursor-pointer"
                >
                  <Link
                    href={buildHref({
                      type,
                      genre: id,
                      sort,
                      showAllGenres: showAllGenres ? "1" : undefined,
                    })}
                  >
                    {g.name}
                  </Link>
                </Badge>
              );
            })}
          </div>

          {/* Desktop genres */}
          <div className="hidden flex-wrap gap-2 md:flex">
            {visibleGenresDesktop.map((g) => {
              const id = String(g.id);
              const selected = genre === id;
              return (
                <Badge
                  key={g.id}
                  asChild
                  variant={selected ? "default" : "secondary"}
                  className="cursor-pointer"
                >
                  <Link
                    href={buildHref({
                      type,
                      genre: id,
                      sort,
                      showAllGenres: showAllGenres ? "1" : undefined,
                    })}
                  >
                    {g.name}
                  </Link>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {!query && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Sort by</h3>

            {/* Desktop: Tooltip */}
            <div className="hidden md:block">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Sort information"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[232px] text-xs">
                    Sorting by Rating or Release Date may show less relevant
                    results. Use Popularity for the best experience.
                  </TooltipContent>
                </Tooltip>
            </div>

            {/* Mobile: Drawer */}
            <Drawer>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground md:hidden"
                  aria-label="Sort information"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Sort Options</DrawerTitle>
                  <DrawerDescription>
                    Sorting by Rating or Release Date may show less relevant
                    results. Use Popularity for the best experience.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-8">
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full">
                      Close
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <div className="flex flex-wrap gap-2">
            {sorts.map((s) => {
              const selected =
                sort === s.id || (!sort && s.id === "popularity.desc");
              return (
                <Badge
                  key={s.id}
                  asChild
                  variant={selected ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  <Link
                    href={buildHref({
                      type,
                      genre: genre || undefined,
                      sort: s.id,
                      showAllGenres: showAllGenres ? "1" : undefined,
                    })}
                  >
                    {s.label}
                  </Link>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
