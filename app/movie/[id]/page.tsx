import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Player } from '@/components/player'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { formatRuntime, getMovieDetails } from '@/lib/tmdb'

type MoviePageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  const movie = await getMovieDetails(id).catch(() => null)

  if (!movie) {
    notFound()
  }

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : undefined
  const runtime = formatRuntime(movie.runtime)

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
            <BreadcrumbPage>{movie.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Content layout */}
      <div className='grid gap-8 lg:grid-cols-[280px_1fr]'>
        {/* Poster */}
        <div className='flex justify-center lg:justify-start lg:sticky lg:top-6 lg:self-start'>
          <div className='w-full max-w-[280px] overflow-hidden rounded-lg border border-border/40 bg-muted shadow-lg'>
            <div className='relative aspect-[2/3]'>
              {movie.posterUrl ? (
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
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

        {/* Info column */}
        <div className='flex flex-col gap-6'>
          {/* Title & metadata */}
          <div className='space-y-3'>
            <div className='flex flex-wrap items-center gap-2 text-sm'>
              <Badge variant='secondary' className='uppercase text-xs font-semibold'>
                Movie
              </Badge>
              {releaseYear && <span className='text-muted-foreground'>{releaseYear}</span>}
              {runtime && <span className='text-muted-foreground'>{runtime}</span>}
            </div>
            <h1 className='text-4xl font-bold leading-tight'>{movie.title}</h1>
            {movie.genres.length > 0 && (
              <div className='flex flex-wrap gap-1.5'>
                {movie.genres.map((genre) => (
                  <span key={genre} className='rounded bg-muted px-2 py-1 text-xs text-muted-foreground'>
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Overview */}
          {movie.overview && (
            <div className='space-y-2'>
              <h2 className='text-lg font-semibold'>Overview</h2>
              <p className='leading-relaxed text-muted-foreground'>{movie.overview}</p>
            </div>
          )}

          {/* Player */}
          <Player kind='movie' imdbId={movie.imdbId} title={movie.title} />
        </div>
      </div>
    </div>
  )
}

