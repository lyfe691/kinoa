'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type EpisodeNavigatorProps = {
  showId: number
  seasons: {
    number: number
    name: string
    episodeCount: number
  }[]
  seasonEpisodes: {
    number: number
    name: string
  }[]
  currentSeason: number
  currentEpisode: number
  className?: string
}

const EPISODES_PER_PAGE = 12

export function EpisodeNavigator({
  showId,
  seasons,
  seasonEpisodes,
  currentSeason,
  currentEpisode,
  className,
}: EpisodeNavigatorProps) {
  const router = useRouter()
  const [page, setPage] = useState(() => {
    // Start on the page containing the current episode
    return Math.floor((currentEpisode - 1) / EPISODES_PER_PAGE)
  })

  useEffect(() => {
    setPage(Math.floor((currentEpisode - 1) / EPISODES_PER_PAGE))
  }, [currentEpisode])

  const totalPages = Math.ceil(seasonEpisodes.length / EPISODES_PER_PAGE)
  const startIdx = page * EPISODES_PER_PAGE
  const endIdx = startIdx + EPISODES_PER_PAGE
  const visibleEpisodes = seasonEpisodes.slice(startIdx, endIdx)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Season selector */}
      <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
        <span className='text-sm font-medium'>Season</span>
        <Select
          value={String(currentSeason)}
          onValueChange={(value) => {
            setPage(0)
            router.push(`/tv/${showId}/${value}/1`)
          }}
        >
          <SelectTrigger className='h-9 min-w-[120px] sm:w-[140px]' aria-label='Select season'>
            <SelectValue placeholder='Season' />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((s) => (
              <SelectItem key={s.number} value={String(s.number)}>
                {`S${s.number}`}{s.episodeCount ? ` • ${s.episodeCount}` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Episode grid */}
      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
        {visibleEpisodes.map((episode) => {
          const isActive = episode.number === currentEpisode
          return (
            <Button
              key={episode.number}
              variant={isActive ? 'default' : 'outline'}
              className='h-auto justify-start gap-2 px-3 py-2 text-left transition-[transform,box-shadow] focus-visible:ring-2 focus-visible:ring-offset-2'
              asChild
            >
              <Link
                href={`/tv/${showId}/${currentSeason}/${episode.number}`}
                scroll={false}
                aria-current={isActive ? 'true' : undefined}
                className='flex w-full items-start gap-2 sm:items-center'
              >
                <Play
                  className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-foreground' : 'opacity-70')}
                  aria-hidden='true'
                />
                <span className='shrink-0 text-xs font-semibold'>Eps {episode.number}:</span>
                <span className='min-w-0 flex-1 text-sm leading-tight line-clamp-2'>{episode.name}</span>
                {isActive && <Check className='h-4 w-4 shrink-0 self-start sm:self-center' aria-hidden='true' />}
              </Link>
            </Button>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex flex-wrap items-center justify-between gap-2 sm:gap-3'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className='h-4 w-4' />
            Previous
          </Button>
          <span className='text-sm text-muted-foreground'>
            Episodes {startIdx + 1}-{Math.min(endIdx, seasonEpisodes.length)} of {seasonEpisodes.length}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            Next
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      )}
    </div>
  )
}

