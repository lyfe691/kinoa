import Image from 'next/image'
import Link from 'next/link'
import { MediaSummary } from '@/lib/tmdb'
import { cn } from '@/lib/utils'

type MediaCardProps = {
  media: MediaSummary
  className?: string
}

export function MediaCard({ media, className }: MediaCardProps) {
  return (
    <Link
      href={media.href}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-sm transition hover:border-border hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring/60 focus:ring-offset-2',
        className
      )}
    >
      <div className='relative aspect-[2/3] w-full'>
        {media.posterUrl ? (
          <Image
            src={media.posterUrl}
            alt={media.name}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
            className='object-cover transition duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full items-center justify-center bg-muted text-sm text-muted-foreground'>
            Artwork unavailable
          </div>
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 transition group-hover:opacity-100' />
        <div className='absolute inset-x-4 bottom-4 flex flex-col gap-2 text-left text-white'>
          <div className='flex items-center gap-2 text-xs uppercase tracking-wide text-white/70'>
            <span>{media.type === 'movie' ? 'Movie' : 'Series'}</span>
            {media.releaseYear ? <span className='rounded-full bg-white/10 px-2 py-0.5 text-[11px]'>{media.releaseYear}</span> : null}
          </div>
          <h3 className='text-lg font-semibold leading-tight line-clamp-2'>{media.name}</h3>
          {media.overview ? (
            <p className='line-clamp-3 text-xs text-white/70'>{media.overview}</p>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

