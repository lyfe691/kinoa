'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRuntime } from '@/lib/tmdb'
import { AspectRatio } from '@/components/ui/aspect-ratio' // maybe use this later

// I think we should also add a movie or tv icon to the card or under the name of the media, next to the year, show or episode etc.

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

export function MediaCard({ media, className, priority = false }: MediaCardProps) {
  const { href, name, posterUrl, type, releaseYear, runtime, seasonCount, episodeCount, rating } = media

  const metadata = []
  
  if (releaseYear) metadata.push(releaseYear)
  if (type === 'movie' && runtime) metadata.push(formatRuntime(runtime))
  if (type === 'tv' && seasonCount) metadata.push(`${seasonCount} Season${seasonCount > 1 ? 's' : ''}`)

  const formattedRating = rating ? rating.toFixed(1) : null

  return (
    <Link
      href={href}
      className={cn('group block space-y-3', className)}
      aria-label={`${name}${releaseYear ? ` (${releaseYear})` : ''}`}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-muted">
        {posterUrl ? (
          <>
            <Image
              src={posterUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-105"
              priority={priority}
            />
            
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/40" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm">
                <Play className="ml-0.5 h-5 w-5 fill-black text-black" />
              </div>
            </div>

            {formattedRating && (
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 backdrop-blur-sm">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs font-medium tabular-nums text-white">
                  {formattedRating}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-12 w-12 text-muted-foreground/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="line-clamp-1 text-sm font-medium leading-tight">
          {name}
        </h3>
        
        {metadata.length > 0 && (
          <p className="truncate text-xs text-muted-foreground">
            {metadata.join(' · ')}
          </p>
        )}
      </div>
    </Link>
  )
}