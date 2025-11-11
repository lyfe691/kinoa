import type { Metadata } from "next";
import { Suspense, use } from "react";
import { SearchBar } from "@/components/search-bar";
import { MediaCardSkeleton } from "@/components/media-card-skeleton";
import SearchResults from "./results";
import SearchFilters from "./filters";

export const metadata: Metadata = {
  title: "Search • Kinoa",
  description: "Look up films and shows across the entire Kinoa catalog.",
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const params = use(searchParams);
  const q = params.q;
  const query = typeof q === "string" ? q.trim() : "";
  const typeParam = typeof params.type === "string" ? params.type : "all";
  const genreParam = typeof params.genre === "string" ? params.genre : "";
  const sortParam = typeof params.sort === "string" ? params.sort : "";
  const showAllGenresParam =
    typeof params.showAllGenres === "string" ? params.showAllGenres : "";

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
            <SearchBar placeholder="Search..." />
          </Suspense>
        </div>
      </header>

      {!query && (
        <SearchFilters
          type={(typeParam as "all" | "movie" | "tv") || "all"}
          genre={genreParam}
          sort={sortParam}
          showAllGenres={showAllGenresParam === "1"}
        />
      )}

      <Suspense
        key={`${query}-${typeParam}-${genreParam}-${sortParam}`}
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
          type={(typeParam as "all" | "movie" | "tv") || "all"}
          genre={genreParam}
          sort={sortParam}
        />
      </Suspense>
    </section>
  );
}
