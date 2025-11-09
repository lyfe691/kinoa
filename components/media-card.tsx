import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import type { MediaSummary } from '@/lib/tmdb'

type MediaCardProps = {
  media: MediaSummary
  className?: string
  priority?: boolean
}

export function MediaCard({ media, className, priority = false }: MediaCardProps) {
  const { href, name, posterUrl, type, releaseYear } = media

  return (
    <Link
      href={href}
      aria-label={`${name}${releaseYear ? ` (${releaseYear})` : ''}`}
      className={cn(
        'group relative block overflow-hidden rounded-lg transition-all duration-500 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-4',
        'hover:scale-[1.02]',
        className
      )}
    >
      <AspectRatio ratio={2 / 3} className="bg-muted/30">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-75"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-16 w-16 text-muted-foreground/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
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

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2 text-white/60">
            <span className="text-[10px] font-medium uppercase tracking-widest">
              {type}
            </span>
            {releaseYear && (
              <>
                <span className="text-[8px]">•</span>
                <span className="text-xs tabular-nums">{releaseYear}</span>
              </>
            )}
          </div>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  )
}