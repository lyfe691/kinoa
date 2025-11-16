'use client'

import * as React from 'react'
import { Film, Tv, ArrowUpDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs'
import type { MediaSummary } from '@/lib/tmdb'
import { MediaCard } from '@/components/media-card'

type WatchlistControlsProps = {
  media: MediaSummary[]
}

type FilterType = 'all' | 'movie' | 'tv'
type SortType = 'recent' | 'title' | 'rating' | 'year'

export function WatchlistControls({ media }: WatchlistControlsProps) {
  const [filter, setFilter] = React.useState<FilterType>('all')
  const [sort, setSort] = React.useState<SortType>('recent')

  const filteredMedia = React.useMemo(() => {
    let result = [...media]

    // Apply filter
    if (filter !== 'all') {
      result = result.filter((item) => item.type === filter)
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sort) {
        case 'title':
          return a.name.localeCompare(b.name)
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0)
        case 'year': {
          const yearA = a.releaseYear ? parseInt(a.releaseYear) : 0
          const yearB = b.releaseYear ? parseInt(b.releaseYear) : 0
          return yearB - yearA
        }
        case 'recent':
        default:
          // Already sorted by created_at DESC from server
          return 0
      }
    })

    return result
  }, [media, filter, sort])

  const movieCount = media.filter((m) => m.type === 'movie').length
  const tvCount = media.filter((m) => m.type === 'tv').length

  return (
    <div className="flex flex-col gap-6">
      {/* Stats and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as FilterType)}
        >
          <TabsList>
            <TabsTab value="all">
              All ({media.length})
            </TabsTab>
            <TabsTab value="movie">
              <Film className="h-4 w-4" />
              Movies ({movieCount})
            </TabsTab>
            <TabsTab value="tv">
              <Tv className="h-4 w-4" />
              Shows ({tvCount})
            </TabsTab>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sort} onValueChange={(value) => setSort(value as SortType)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="year">Release Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      {filteredMedia.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredMedia.length}</span> {filteredMedia.length === 1 ? 'title' : 'titles'}
        </p>
      )}

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {filteredMedia.map((item) => (
            <MediaCard
              key={`${item.type}-${item.id}`}
              media={item}
              isInWatchlist
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              No {filter !== 'all' ? (filter === 'movie' ? 'movies' : 'shows') : 'titles'} found
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

