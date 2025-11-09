'use client'

import * as React from 'react'
import { MediaCard } from '@/components/media-card'
import type { MediaSummary } from '@/lib/tmdb'

type TrendingSectionProps = {
  items: MediaSummary[]
  filter?: string
}

export function TrendingSection({ items, filter = 'all' }: TrendingSectionProps) {
  const filtered = React.useMemo(() => {
    if (filter === 'all') return items
    if (filter === 'movies') return items.filter((i) => i.type === 'movie')
    if (filter === 'tv') return items.filter((i) => i.type === 'tv')
    return items
  }, [items, filter])

  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
      {filtered.map((item, index) => (
        <MediaCard key={`${item.type}-${item.id}`} media={item} priority={index < 4} />
      ))}
    </div>
  )
}


