import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type MediaHeaderProps = {
  badgeLabel: string
  title: string
  metadata?: Array<string | null | undefined>
  genres?: string[]
  rating?: number
  voteCount?: number
  className?: string
}

export function MediaHeader({
  badgeLabel,
  title,
  metadata = [],
  genres = [],
  rating,
  voteCount,
  className,
}: MediaHeaderProps) {
  const filteredMetadata = metadata.filter(Boolean) as string[]

  return (
    <div className={cn('space-y-3', className)}>
      <div className='flex flex-wrap items-center gap-2 text-sm'>
        <Badge variant='secondary' className='uppercase text-xs font-semibold'>
          {badgeLabel}
        </Badge>
        {filteredMetadata.map((item, index) => (
          <span key={`${item}-${index}`} className='text-muted-foreground'>
            {item}
          </span>
        ))}
      </div>

      <h1 className='text-4xl font-bold leading-tight'>{title}</h1>

      {genres.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {genres.map((genre) => (
            <span
              key={genre}
              className='rounded bg-muted px-2 py-1 text-xs text-muted-foreground'
            >
              {genre}
            </span>
          ))}
        </div>
      )}

      {typeof rating === 'number' && (
        <div className='flex items-center gap-2'>
          <div
            className='flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5'
            aria-label={`Average rating ${rating.toFixed(1)} out of 10`}
          >
            <Star className='h-4 w-4 fill-yellow-500 text-yellow-500' aria-hidden='true' />
            <span className='font-semibold'>{rating.toFixed(1)}</span>
            <span className='text-xs text-muted-foreground'>/10</span>
          </div>
          {voteCount && (
            <span className='text-sm text-muted-foreground' aria-label={`${voteCount.toLocaleString()} votes`}>
              {voteCount.toLocaleString()} votes
            </span>
          )}
        </div>
      )}
    </div>
  )
}

