import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import type { MediaSummary } from '@/lib/tmdb'

type MediaCardProps = {
  media: MediaSummary & {
    runtime?: number | null
    seasonCount?: number
    episodeCount?: number
  }
  className?: string
  priority?: boolean
}

function formatRuntime(minutes?: number | null) {
  if (!minutes) return null
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (!hours) return `${mins}m`
  if (!mins) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function MediaCard({ media, className, priority = false }: MediaCardProps) {
  const { href, name, posterUrl, type, releaseYear, runtime, seasonCount, episodeCount, rating } = media

  // Format metadata based on type
  const metadata = []
  
  if (releaseYear) {
    metadata.push(releaseYear)
  }

  if (type === 'movie' && runtime) {
    metadata.push(formatRuntime(runtime))
  } else if (type === 'tv') {
    if (seasonCount) {
      metadata.push(`SS ${seasonCount}`)
    }
    if (episodeCount) {
      metadata.push(`EPS ${episodeCount}`)
    }
  }

  const formattedRating = rating ? rating.toFixed(1) : null

  return (
    <article className={cn('group', className)}>
      <Link
        href={href}
        aria-label={`${name}${releaseYear ? ` (${releaseYear})` : ''}`}
        className="block focus-visible:outline-none"
      >
        {/* Poster */}
        <div className="relative overflow-hidden rounded-md bg-muted ring-offset-background transition-shadow duration-200 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-foreground/20">
          <AspectRatio ratio={2 / 3}>
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03]"
                priority={priority}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg
                  className="h-12 w-12 text-muted-foreground/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>
            )}
          </AspectRatio>

          {/* Rating Badge */}
          {formattedRating && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {formattedRating}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-3 space-y-2 px-0.5">
          <h3 className="line-clamp-1 text-sm font-medium leading-tight tracking-tight">
            {name}
          </h3>
          
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-1.5 text-xs text-muted-foreground">
              {metadata.map((item, index) => (
                <span key={index} className="flex items-center gap-1.5 whitespace-nowrap">
                  {item}
                  {index < metadata.length - 1 && <span className="text-[10px]">•</span>}
                </span>
              ))}
            </div>
            
            <span className="inline-flex shrink-0 items-center rounded border border-border/60 bg-muted/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {type === 'movie' ? 'Movie' : 'TV'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}