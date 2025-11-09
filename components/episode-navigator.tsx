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
    <div className={cn('space-y-5', className)}>
      {/* Season selector */}
      <div className='flex items-center gap-3'>
        <span className='text-sm font-medium text-muted-foreground'>Season</span>
        <Select
          value={String(currentSeason)}
          onValueChange={(value) => {
            setPage(0)
            router.push(`/tv/${showId}/${value}/1`)
          }}
        >
          <SelectTrigger className='h-9 w-[140px]' aria-label='Select season'>
            <SelectValue placeholder='Season' />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((s) => (
              <SelectItem key={s.number} value={String(s.number)}>
                Season {s.number}{s.episodeCount ? ` · ${s.episodeCount} eps` : ''}
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
              className='h-auto w-full justify-start p-3'
              asChild
            >
              <Link
                href={`/tv/${showId}/${currentSeason}/${episode.number}`}
                scroll={false}
                aria-current={isActive ? 'true' : undefined}
                className='flex w-full min-w-0 items-center gap-3'
              >
                <Play
                  className={cn('h-3.5 w-3.5 shrink-0', isActive && 'fill-primary-foreground')}
                  aria-hidden='true'
                />
                <div className='min-w-0 flex-1 space-y-0.5 text-left'>
                  <div className='text-xs font-medium opacity-70'>Episode {episode.number}</div>
                  <div className='truncate text-sm leading-tight'>{episode.name}</div>
                </div>
                {isActive && <Check className='h-4 w-4 shrink-0' aria-hidden='true' />}
              </Link>
            </Button>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between gap-3 border-t pt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className='h-4 w-4' />
            <span className='hidden sm:inline'>Previous</span>
          </Button>
          <span className='text-xs text-muted-foreground'>
            {startIdx + 1}-{Math.min(endIdx, seasonEpisodes.length)} of {seasonEpisodes.length}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            <span className='hidden sm:inline'>Next</span>
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      )}
    </div>
  )
}

