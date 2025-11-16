import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Bookmark, Film, Tv } from 'lucide-react'
import { getSession } from '@/lib/supabase/session'
import { getWatchlist } from '@/lib/supabase/watchlist'
import { getMovieDetails, getTvEpisodeDetails } from '@/lib/tmdb'
import { MediaCard } from '@/components/media-card'
import { Button } from '@/components/ui/button'
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
    watchlistItems.map(async (item): Promise<MediaSummary | null> => {
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
          }
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
          }
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
    (item): item is NonNullable<typeof item> => item !== null,
  )

  const movieCount = validMedia.filter((m) => m.type === 'movie').length
  const tvCount = validMedia.filter((m) => m.type === 'tv').length

  return (
    <section className="flex flex-col gap-12">
      <header className="space-y-4">
        <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
          My Watchlist
        </h1>

        {validMedia.length > 0 && (
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              <span>
                {movieCount} {movieCount === 1 ? 'Movie' : 'Movies'}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Tv className="h-4 w-4" />
              <span>
                {tvCount} {tvCount === 1 ? 'Show' : 'Shows'}
              </span>
            </div>
          </div>
        )}
      </header>

      {validMedia.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-12 text-center">
          <div className="rounded-full bg-muted p-6">
            <Bookmark className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your watchlist is empty</h2>
            <p className="text-sm text-muted-foreground">
              Start adding movies and shows you want to watch by clicking the
              bookmark icon on any title.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/">Browse Trending</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/search">Search</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {validMedia.map((media) => (
            <MediaCard
              key={`${media.type}-${media.id}`}
              media={media}
              isInWatchlist
            />
          ))}
        </div>
      )}
    </section>
  )
}

