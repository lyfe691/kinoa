import Link from "next/link";
import { normalizeSort } from "./sort-options";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { ErrorState } from "@/components/error-state";
import {
  searchTitles,
  getTrending,
  discoverMovies,
  discoverTv,
} from "@/lib/tmdb";
import { MediaCard } from "@/components/media-card";
import { SearchTypeTabs } from "@/components/search/SearchTypeTabs";

type Props = {
  query: string;
  type: "all" | "movie" | "tv";
  genre: string;
  sort: string;
};

export default async function SearchResults({
  query,
  type,
  genre,
  sort,
}: Props) {
  const sortForMovies = normalizeSort("movie", sort);
  const sortForTv = normalizeSort("tv", sort);
  const sortBy = type === "tv" ? sortForTv : sortForMovies;
  const buildHref = (params: {
    q?: string;
    type?: "all" | "movie" | "tv";
    genre?: string;
    sort?: string;
  }) => {
    const sp = new URLSearchParams();
    if (params.q !== undefined) {
      if (params.q) sp.set("q", params.q);
    } else if (query) {
      sp.set("q", query);
    }
    if (params.type && params.type !== "all") sp.set("type", params.type);
    if (params.genre) sp.set("genre", params.genre);
    if (params.sort) sp.set("sort", params.sort);
    const qs = sp.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  // If searching by text, prefer search endpoint (ignores genre/sort)
  if (query) {
    const results = await searchTitles(query);
    if (!results.length) {
      const trending = await getTrending().catch(() => []);

      return (
        <div className="space-y-12">
          <div className="space-y-2 text-center">
            <div className="text-muted-foreground font-medium sm:text-lg">
              No results for{" "}
              <span className="text-foreground">&ldquo;{query}&rdquo;</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Explore what&rsquo;s trending below or{" "}
              <Link
                href={buildHref({ q: "" })}
                className="underline underline-offset-4 text-foreground"
              >
                clear the search
              </Link>
              .
            </p>
          </div>

          {trending.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Trending Now
                </h2>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/">View All</Link>
                </Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {trending.slice(0, 10).map((item, index) => (
                  <MediaCard
                    key={`trending-${item.type}-${item.id}`}
                    media={item}
                    priority={index < 2}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      );
    }

    return (
      <SearchTypeTabs
        query={query}
        results={{
          all: results,
          movie: results.filter((item) => item.type === "movie"),
          tv: results.filter((item) => item.type === "tv"),
        }}
        initialType={type}
        clearHref={buildHref({ q: "" })}
      />
    );
  }

  // Discover flow (no text query): use filters
  const with_genres = genre || undefined;

  if (type === "movie") {
    let movies: Awaited<ReturnType<typeof discoverMovies>> = [];
    try {
      movies = await discoverMovies({ with_genres, sort_by: sortForMovies });
    } catch {
      return (
        <ErrorState
          title="Could not load movies"
          message="Please try again in a moment."
        />
      );
    }
    if (!movies.length) {
      return (
        <Empty className="border border-dashed border-border">
          <EmptyHeader>
            <EmptyTitle>No movies match your filters</EmptyTitle>
            <EmptyDescription>
              Try removing some filters or adjust the sort order.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-3">
              <Button asChild size="sm" variant="secondary">
                <Link href={buildHref({ type: "movie" })}>Clear filters</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href={buildHref({ type: "all", genre, sort: sortBy })}>
                  See all content
                </Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      );
    }
    return (
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">Movies</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((item, index) => (
            <MediaCard
              key={`movie-${item.id}`}
              media={item}
              priority={index < 2}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "tv") {
    let shows: Awaited<ReturnType<typeof discoverTv>> = [];
    try {
      shows = await discoverTv({ with_genres, sort_by: sortForTv });
    } catch {
      return (
        <ErrorState
          title="Could not load TV shows"
          message="Please try again in a moment."
        />
      );
    }
    if (!shows.length) {
      return (
        <Empty className="border border-dashed border-border">
          <EmptyHeader>
            <EmptyTitle>No TV shows match your filters</EmptyTitle>
            <EmptyDescription>
              Try removing some filters or adjust the sort order.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-3">
              <Button asChild size="sm" variant="secondary">
                <Link href={buildHref({ type: "tv" })}>Clear filters</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href={buildHref({ type: "all", genre, sort: sortBy })}>
                  See all content
                </Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      );
    }
    return (
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">TV Shows</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {shows.map((item, index) => (
            <MediaCard
              key={`tv-${item.id}`}
              media={item}
              priority={index < 2}
            />
          ))}
        </div>
      </div>
    );
  }

  // type === 'all' → show both sections
  const [movies, shows] = await Promise.all([
    discoverMovies({ with_genres, sort_by: sortForMovies }).catch(() => []),
    discoverTv({ with_genres, sort_by: sortForTv }).catch(() => []),
  ]);

  if (!movies.length && !shows.length) {
    return (
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyTitle>No results match your filters</EmptyTitle>
          <EmptyDescription>
            Try removing the selected genre or changing the sort.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild size="sm" variant="secondary">
            <Link href={buildHref({})}>Clear all</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="space-y-12">
      {movies.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">Movies</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {movies.slice(0, 10).map((item, index) => (
              <MediaCard
                key={`movie-${item.id}`}
                media={item}
                priority={index < 2}
              />
            ))}
          </div>
        </section>
      )}

      {shows.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">TV Shows</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {shows.slice(0, 10).map((item, index) => (
              <MediaCard
                key={`tv-${item.id}`}
                media={item}
                priority={index < 2}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
