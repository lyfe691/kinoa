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
import { Card, CardContent } from '@/components/ui/card'
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
            <BreadcrumbPage>{movie.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr]'>
        <Card className='overflow-hidden border-border/60 shadow-sm'>
          <CardContent className='p-0'>
            {movie.posterUrl ? (
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                width={600}
                height={900}
                className='h-full w-full object-cover'
                priority
              />
            ) : (
              <div className='flex h-full min-h-[480px] items-center justify-center text-sm text-muted-foreground'>
                Poster unavailable
              </div>
            )}
          </CardContent>
        </Card>

        <div className='flex flex-col gap-6'>
          <div className='space-y-3'>
            <div className='flex items-center gap-3'>
              <Badge variant='outline' className='uppercase tracking-wide'>
                Movie
              </Badge>
              {releaseYear ? <span className='text-sm text-muted-foreground'>{releaseYear}</span> : null}
              {runtime ? <span className='text-sm text-muted-foreground'>{runtime}</span> : null}
            </div>
            <h1 className='text-3xl font-semibold leading-tight tracking-tight'>{movie.title}</h1>
            {movie.genres.length ? (
              <p className='text-sm text-muted-foreground'>{movie.genres.join(' • ')}</p>
            ) : null}
          </div>

          <p className='text-base leading-relaxed text-muted-foreground'>{movie.overview}</p>

          <Player kind='movie' imdbId={movie.imdbId} title={movie.title} className='mt-auto' />
        </div>
      </div>
    </article>
  )
}

