import Link from "next/link";
import { getMovieGenres, getTvGenres } from "@/lib/tmdb";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FiltersProps = {
  type: "all" | "movie" | "tv";
  genre: string;
  sort: string;
  query?: string;
  showAllGenres?: boolean;
};

const MOVIE_SORTS = [
  { id: "popularity.desc", label: "Popularity" },
  { id: "vote_average.desc", label: "Rating" },
  { id: "primary_release_date.desc", label: "Release date" },
];

const TV_SORTS = [
  { id: "popularity.desc", label: "Popularity" },
  { id: "vote_average.desc", label: "Rating" },
  { id: "first_air_date.desc", label: "Air date" },
];

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

export default async function SearchFilters({
  type,
  genre,
  sort,
  query,
  showAllGenres = false,
}: FiltersProps) {
  const [movieGenres, tvGenres] = await Promise.all([
    getMovieGenres(),
    getTvGenres(),
  ]);

  const allGenres = Array.from(
    new Map([...movieGenres, ...tvGenres].map((g) => [g.id, g])).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));

  const sorts = type === "tv" ? TV_SORTS : MOVIE_SORTS;
  const buildHref = buildHrefFactory(query);

  const maxGenresMobile = 8;
  const maxGenresDesktop = 16;
  const visibleGenresMobile = showAllGenres
    ? allGenres
    : allGenres.slice(0, maxGenresMobile);
  const visibleGenresDesktop = showAllGenres
    ? allGenres
    : allGenres.slice(0, maxGenresDesktop);

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
                  genre,
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
              {!showAllGenres && allGenres.length > maxGenresMobile && (
                <Link
                  href={buildHref({ type, genre, sort, showAllGenres: "1" })}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Show more
                </Link>
              )}
              {showAllGenres && (
                <Link
                  href={buildHref({
                    type,
                    genre,
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
              const selected = genre === String(g.id);
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
                      genre: String(g.id),
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
              const selected = genre === String(g.id);
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
                      genre: String(g.id),
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
            <TooltipProvider>
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
                <TooltipContent side="top" className="max-w-[232px] text-xs ">
                  Sorting by Rating or Release Date may show less relevant
                  results. Use Popularity for the best experience.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                      genre,
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
