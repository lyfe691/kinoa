import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/supabase/session'
import { getWatchlist } from '@/lib/supabase/watchlist'
import { getMovieDetails, getTvEpisodeDetails } from '@/lib/tmdb'
import { MediaCard } from '@/components/media-card'
import type { MediaSummary } from '@/lib/tmdb'

export const metadata: Metadata = {
  title: 'My Watchlist • Kinoa',
  description: 'Your saved movies and TV shows',
}

export default async function WatchlistPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const watchlistItems = await getWatchlist()

  const mediaDetails = await Promise.all(
    watchlistItems.map(async (item) => {
      try {
        if (item.media_type === 'movie') {
          const movie = await getMovieDetails(String(item.media_id))
          return {
            id: movie.id,
            type: 'movie' as const,
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
          } satisfies MediaSummary
        } else {
          const show = await getTvEpisodeDetails(
            String(item.media_id),
            '1',
            '1',
          )
          return {
            id: show.showId,
            type: 'tv' as const,
            name: show.showName,
            overview: show.overview,
            posterUrl: show.posterUrl,
            backdropUrl: show.backdropUrl,
            releaseYear: undefined,
            href: `/tv/${show.showId}/1/1`,
            imdbId: show.imdbId ?? null,
            seasonCount: show.seasons.length,
            episodeCount: show.seasons.reduce(
              (acc, s) => acc + s.episodeCount,
              0,
            ),
            rating: show.rating,
            voteCount: show.voteCount,
          } satisfies MediaSummary
        }
      } catch (error) {
        console.error(
          `Failed to fetch details for ${item.media_type} ${item.media_id}`,
          error,
        )
        return null
      }
    }),
  )

  const validMedia = mediaDetails.filter(
    (item): item is MediaSummary => item !== null,
  )

  return (
    <section className="flex flex-col gap-12">
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          My Watchlist
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          {validMedia.length === 0
            ? 'Your watchlist is empty. Start adding movies and shows!'
            : `${validMedia.length} ${validMedia.length === 1 ? 'item' : 'items'} saved`}
        </p>
      </header>

      {validMedia.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {validMedia.map((media) => (
            <MediaCard key={`${media.type}-${media.id}`} media={media} isInWatchlist />
          ))}
        </div>
      )}
    </section>
  )
}

