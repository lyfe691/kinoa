'use client'

import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
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

export function EpisodeNavigator({
  showId,
  seasons,
  seasonEpisodes,
  currentSeason,
  currentEpisode,
  className,
}: EpisodeNavigatorProps) {
  const router = useRouter()

  const handleSeasonChange = (value: string) => {
    const seasonNumber = Number(value)
    const destination = `/tv/${showId}/${seasonNumber}/1`
    router.push(destination)
  }

  const handleEpisodeChange = (value: string) => {
    const episodeNumber = Number(value)
    const destination = `/tv/${showId}/${currentSeason}/${episodeNumber}`
    router.push(destination)
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='season-select'>Season</Label>
        <Select
          defaultValue={String(currentSeason)}
          onValueChange={handleSeasonChange}
        >
          <SelectTrigger id='season-select'>
            <SelectValue placeholder='Select season' />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((season) => (
              <SelectItem key={season.number} value={String(season.number)}>
                {season.name} {season.episodeCount ? `(${season.episodeCount})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='episode-select'>Episode</Label>
        <Select
          defaultValue={String(currentEpisode)}
          onValueChange={handleEpisodeChange}
          disabled={!seasonEpisodes.length}
        >
          <SelectTrigger id='episode-select'>
            <SelectValue placeholder='Select episode' />
          </SelectTrigger>
          <SelectContent>
            {seasonEpisodes.map((episode) => (
              <SelectItem key={episode.number} value={String(episode.number)}>
                {`Episode ${episode.number}`}
                {episode.name ? ` — ${episode.name}` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

