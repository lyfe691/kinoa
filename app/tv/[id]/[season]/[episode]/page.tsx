import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star } from 'lucide-react'
import { Player } from '@/components/player'
import { EpisodeNavigator } from '@/components/episode-navigator'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { formatRuntime, getTvEpisodeDetails } from '@/lib/tmdb'

type EpisodePageProps = {
  params: Promise<{
    id: string
    season: string
    episode: string
  }>
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { id, season, episode } = await params
  const details = await getTvEpisodeDetails(id, season, episode).catch(() => null)

  if (!details) {
    notFound()
  }

  const runtime = formatRuntime(details.episode.runtime)
  const airDate = details.episode.airDate
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(details.episode.airDate))
    : undefined

  const currentSeasonEpisodes = details.allEpisodes[details.episode.season] || []

  return (
    <div className='flex flex-col gap-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/'>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/tv/${details.showId}/1/1`}>{details.showName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              S{details.episode.season}:E{details.episode.number}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid gap-8 lg:grid-cols-[280px_1fr]'>
        {/* Poster */}
        <div className='flex justify-center lg:justify-start self-start'>
          <div className='w-full max-w-[280px] overflow-hidden rounded-lg border border-border/40 bg-muted shadow-lg'>
            <div className='relative aspect-[2/3]'>
              {details.posterUrl ? (
                <Image
                  src={details.posterUrl}
                  alt={details.showName}
                  fill
                  className='object-cover'
                  sizes='280px'
                />
              ) : (
                <div className='flex h-full items-center justify-center'>
                  <svg className='h-20 w-20 text-muted-foreground/20' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z' />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className='flex flex-col gap-6'>
          <div className='space-y-3'>
            <div className='flex flex-wrap items-center gap-2 text-sm'>
              <Badge variant='secondary' className='uppercase text-xs font-semibold'>
                Series
              </Badge>
              <span className='text-muted-foreground'>
                S{details.episode.season}:E{details.episode.number}
              </span>
              {runtime && <span className='text-muted-foreground'>{runtime}</span>}
            </div>
            <h1 className='text-4xl font-bold leading-tight'>{details.showName}</h1>
            {details.genres.length > 0 && (
              <div className='flex flex-wrap gap-1.5'>
                {details.genres.map((genre) => (
                  <span key={genre} className='rounded bg-muted px-2 py-1 text-xs text-muted-foreground'>
                    {genre}
                  </span>
                ))}
              </div>
            )}
            {details.rating && (
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5'>
                  <Star className='h-4 w-4 fill-yellow-500 text-yellow-500' />
                  <span className='font-semibold'>{details.rating.toFixed(1)}</span>
                  <span className='text-xs text-muted-foreground'>/10</span>
                </div>
                {details.voteCount && (
                  <span className='text-sm text-muted-foreground'>
                    {details.voteCount.toLocaleString()} votes
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Selector (only difference from movie) */}
          {details.seasons.length > 0 && (
            <EpisodeNavigator
              showId={details.showId}
              seasons={details.seasons}
              seasonEpisodes={currentSeasonEpisodes}
              currentSeason={details.episode.season}
              currentEpisode={details.episode.number}
            />
          )}

          {/* Overview (mirrors movie page) */}
          <div className='space-y-2'>
            <h2 className='text-lg font-semibold'>Overview</h2>
            {airDate && (
              <p className='text-xs text-muted-foreground'>Aired {airDate}</p>
            )}
            {(details.episode.overview || details.overview) && (
              <p className='leading-relaxed text-muted-foreground'>
                {details.episode.overview || details.overview}
              </p>
            )}
          </div>

          {/* Player */}
          <Player
            kind='tv'
            tmdbId={details.showId}
            season={details.episode.season}
            episode={details.episode.number}
            title={`${details.showName} - ${details.episode.name}`}
          />
        </div>
      </div>
    </div>
  )
}

