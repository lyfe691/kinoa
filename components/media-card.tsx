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
    <article className={cn('group', className)}>
      <Link
        href={href}
        aria-label={`${name}${releaseYear ? ` (${releaseYear})` : ''}`}
        className="block focus-visible:outline-none"
      >
        <div className="relative overflow-hidden rounded-md transition-transform duration-200 ease-out group-hover:scale-[1.02] group-focus-visible:ring-2 group-focus-visible:ring-foreground/20 group-focus-visible:ring-offset-2">
          <AspectRatio ratio={2 / 3} className="bg-muted">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
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
        </div>
        
        <div className="mt-2 space-y-0.5">
          <h3 className="line-clamp-1 text-sm font-medium leading-tight transition-colors group-hover:text-foreground/80">
            {name}
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="capitalize">{type}</span>
            {releaseYear && (
              <>
                <span aria-hidden="true">·</span>
                <span>{releaseYear}</span>
              </>
            )}
          </p>
        </div>
      </Link>
    </article>
  )
}