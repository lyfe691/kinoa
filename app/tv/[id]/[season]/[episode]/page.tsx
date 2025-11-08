import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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
import { Card, CardContent } from '@/components/ui/card'
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

  return (
    <article className='flex flex-col gap-8'>
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
              Season {details.episode.season}, Episode {details.episode.number}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr]'>
        <Card className='overflow-hidden border-border/60 shadow-sm'>
          <CardContent className='p-0'>
            {details.posterUrl ? (
              <Image
                src={details.posterUrl}
                alt={details.showName}
                width={600}
                height={900}
                className='h-full w-full object-cover'
                priority
              />
            ) : (
              <div className='flex h-full min-h-[480px] items-center justify-center text-sm text-muted-foreground'>
                Artwork unavailable
              </div>
            )}
          </CardContent>
        </Card>

        <div className='flex flex-col gap-6'>
          <div className='space-y-3'>
            <div className='flex flex-wrap items-center gap-3'>
              <Badge variant='outline' className='uppercase tracking-wide'>
                Series
              </Badge>
              <span className='text-sm text-muted-foreground'>
                Season {details.episode.season} · Episode {details.episode.number}
              </span>
              {runtime ? <span className='text-sm text-muted-foreground'>{runtime}</span> : null}
            </div>
            <h1 className='text-3xl font-semibold leading-tight tracking-tight'>{details.showName}</h1>
            {details.genres.length ? (
              <p className='text-sm text-muted-foreground'>{details.genres.join(' • ')}</p>
            ) : null}
          </div>

          {details.seasons.length ? (
            <EpisodeNavigator
              showId={details.showId}
              seasons={details.seasons}
              seasonEpisodes={details.seasonEpisodes}
              currentSeason={details.episode.season}
              currentEpisode={details.episode.number}
              className='max-w-xl'
            />
          ) : null}

          <div className='space-y-3 rounded-lg border border-border/60 bg-muted/10 p-4'>
            <h2 className='text-lg font-medium'>{details.episode.name}</h2>
            {airDate ? <p className='text-sm text-muted-foreground'>Aired {airDate}</p> : null}
            <p className='text-sm leading-relaxed text-muted-foreground'>
              {details.episode.overview || details.overview}
            </p>
          </div>

          {details.episode.stillUrl ? (
            <Card className='overflow-hidden border-border/60'>
              <CardContent className='p-0'>
                <Image
                  src={details.episode.stillUrl}
                  alt={details.episode.name}
                  width={1280}
                  height={720}
                  className='h-full w-full object-cover'
                />
              </CardContent>
            </Card>
          ) : null}

          <Player
            kind='tv'
            tmdbId={details.showId}
            season={details.episode.season}
            episode={details.episode.number}
            title={`${details.showName} - ${details.episode.name}`}
          />
        </div>
      </div>
    </article>
  )
}

