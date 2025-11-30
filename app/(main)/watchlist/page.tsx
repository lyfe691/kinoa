import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";
import { getSession } from "@/lib/supabase/session";
import { getWatchlist, type WatchlistItem } from "@/lib/supabase/watchlist";
import { getMovieDetails, getTvShow } from "@/lib/tmdb";
import { WatchlistControls } from "@/components/watchlist/watchlist-controls";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import type { MediaSummary } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "My Watchlist",
  description: "Your saved movies and TV shows",
};

async function fetchMediaItem(
  item: WatchlistItem,
): Promise<MediaSummary | null> {
  try {
    if (item.media_type === "movie") {
      const movie = await getMovieDetails(String(item.media_id));
      return {
        id: movie.id,
        type: "movie" as const,
        name: movie.title,
        overview: movie.overview,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        releaseYear: movie.releaseDate
          ? new Date(movie.releaseDate).getFullYear().toString()
          : undefined,
        href: `/movie/${movie.id}`,
        imdbId: movie.imdbId,
        runtime: movie.runtime,
        rating: movie.rating,
        voteCount: movie.voteCount,
      };
    } else {
      const show = await getTvShow(String(item.media_id));
      return {
        id: show.id,
        type: "tv" as const,
        name: show.name,
        overview: show.overview,
        posterUrl: show.posterUrl,
        backdropUrl: show.backdropUrl,
        releaseYear: undefined,
        href: `/tv/${show.id}`,
        imdbId: show.imdbId ?? null,
        seasonCount: show.seasonCount,
        episodeCount: show.episodeCount,
        rating: show.rating,
        voteCount: show.voteCount,
      };
    }
  } catch (error) {
    console.error(
      `Failed to fetch details for ${item.media_type} ${item.media_id}`,
      error,
    );
    return null;
  }
}

export default async function WatchlistPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const watchlistItems = await getWatchlist();

  // Process items in batches to avoid hitting TMDB rate limits
  const BATCH_SIZE = 5;
  const mediaDetails: (MediaSummary | null)[] = [];

  for (let i = 0; i < watchlistItems.length; i += BATCH_SIZE) {
    const batch = watchlistItems.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(fetchMediaItem));
    mediaDetails.push(...results);
  }

  const validMedia = mediaDetails.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );

  return (
    <section className="flex flex-col gap-12">
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          My Watchlist
        </h1>
        <p className="text-muted-foreground">
          {validMedia.length > 0
            ? `You've saved ${validMedia.length} ${validMedia.length === 1 ? "title" : "titles"}`
            : "Keep track of movies and shows you want to watch"}
        </p>
      </header>

      {validMedia.length === 0 ? (
        <Empty className="min-h-[50vh]">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bookmark />
            </EmptyMedia>
            <EmptyTitle className="font-semibold">Your watchlist is empty</EmptyTitle>
            <EmptyDescription className="pt-3">
              Start adding movies and shows by clicking the bookmark icon
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-3">
            <Button render={<Link href="/" />}>Browse Trending</Button>
            <Button variant="outline" render={<Link href="/search" />}>
              Search
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <WatchlistControls media={validMedia} />
      )}
    </section>
  );
}
