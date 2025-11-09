'use client'

import * as React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MediaCard } from '@/components/media-card'
import type { MediaSummary } from '@/lib/tmdb'

type TrendingSectionProps = {
  items: MediaSummary[]
}

export function TrendingSection({ items }: TrendingSectionProps) {
  const [tab, setTab] = React.useState<'movie' | 'tv'>('movie')

  const filtered = React.useMemo(
    () => items.filter((i) => i.type === tab),
    [items, tab]
  )

  return (
    <section className='space-y-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div className='space-y-2'>
          <h2 className='text-xl font-semibold tracking-tight'>Trending</h2>
          <p className='max-w-2xl text-sm text-muted-foreground'>What everyone is watching this week.</p>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'movie' | 'tv')} className='w-fit'>
          <TabsList>
            <TabsTrigger value='movie'>Movies</TabsTrigger>
            <TabsTrigger value='tv'>TV Shows</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
        {filtered.map((item, index) => (
          <MediaCard key={`${item.type}-${item.id}`} media={item} priority={index < 4} />
        ))}
      </div>
    </section>
  )
}


