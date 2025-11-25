import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { normalizeSort } from "./sort-options";
import { SearchBar } from "@/components/search-bar";
import { MediaCardSkeleton } from "@/components/media-card-skeleton";
import SearchResults from "./results";
import SearchFilters from "./filters";
import { getMovieGenres, getTvGenres } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Search",
  description: "Look up films and shows across the entire Kinoa catalog.",
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q;
  const query = typeof q === "string" ? q.trim() : "";
  const typeParam = typeof params.type === "string" ? params.type : "all";
  const genreParam = typeof params.genre === "string" ? params.genre : "";
  const sortParam = typeof params.sort === "string" ? params.sort : undefined;
  const showAllGenresParam =
    typeof params.showAllGenres === "string" ? params.showAllGenres : "";

  const allowedTypes = new Set(["all", "movie", "tv"]);
  const type = allowedTypes.has(typeParam)
    ? (typeParam as "all" | "movie" | "tv")
    : "all";
  const normalizedSort = normalizeSort(type, sortParam);

  const [movieGenres, tvGenres] = await Promise.all([
    getMovieGenres(),
    getTvGenres(),
  ]);

  const movieGenreIds = new Set(movieGenres.map((genre) => String(genre.id)));
  const tvGenreIds = new Set(tvGenres.map((genre) => String(genre.id)));
  const allGenreIds = new Set([...movieGenreIds, ...tvGenreIds]);

  const selectedGenre =
    genreParam && type === "movie" && movieGenreIds.has(genreParam)
      ? genreParam
      : genreParam && type === "tv" && tvGenreIds.has(genreParam)
        ? genreParam
        : genreParam && type === "all" && allGenreIds.has(genreParam)
          ? genreParam
          : "";

  const trimmedQueryChanged = typeof q === "string" && q.trim() !== q;
  const invalidType = typeParam !== type;
  const invalidGenre = Boolean(genreParam) && genreParam !== selectedGenre;
  const invalidSort = sortParam !== undefined && sortParam !== normalizedSort;
  const invalidShowAll =
    showAllGenresParam !== "" && showAllGenresParam !== "1";

  if (
    trimmedQueryChanged ||
    invalidType ||
    invalidGenre ||
    invalidSort ||
    invalidShowAll
  ) {
    const normalizedParams = new URLSearchParams();
    if (query) normalizedParams.set("q", query);
    if (type !== "all") normalizedParams.set("type", type);
    if (selectedGenre) normalizedParams.set("genre", selectedGenre);
    if (sortParam !== undefined && sortParam === normalizedSort) {
      normalizedParams.set("sort", normalizedSort);
    }
    if (showAllGenresParam === "1") {
      normalizedParams.set("showAllGenres", "1");
    }

    const normalizedString = normalizedParams.toString();
    redirect(normalizedString ? `/search?${normalizedString}` : "/search");
  }

  return (
    <section className="flex flex-col gap-12">
      <header className="space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Search
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Find movies and TV shows
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Suspense fallback={null}>
            <SearchBar placeholder="Search..." enableSuggestions={false} />{" "}
            {/* we don't want suggestions here since its the search page */}
          </Suspense>
        </div>
      </header>

      {!query && (
        <SearchFilters
          type={type}
          genre={selectedGenre}
          sort={normalizedSort}
          showAllGenres={showAllGenresParam === "1"}
          movieGenres={movieGenres}
          tvGenres={tvGenres}
        />
      )}

      <Suspense
        key={`${query}-${typeParam}-${selectedGenre}-${sortParam}`}
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <SearchResults
          query={query}
          type={type}
          genre={selectedGenre}
          sort={sortParam ?? ""}
        />
      </Suspense>
    </section>
  );
}
