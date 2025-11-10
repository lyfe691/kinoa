'use client'

import { Suspense } from 'react'
import { SearchBar } from '@/components/search-bar'
import { Skeleton } from '@/components/ui/skeleton'

export function HomeHeader() {
  return (
    <header className='space-y-6'>
      {/* we're going to shuffle the adjectives
      1. the adjective will be shuffling between other nice adjectives like "arresting", "engrossing", "compelling", "great", "awesome", "fantastic" etc
      */}
        <h1 className='text-3xl font-semibold tracking-tight'>
        Find something transcendent to watch tonight
        </h1>
        <p className='max-w-2xl text-sm text-muted-foreground pl-0.5'>
        Everything you want to watch, in one place.
        </p>
      <Suspense
        fallback={
          <div className='relative overflow-hidden rounded-2xl bg-card border border-border'>
            <div className='relative h-14 w-full'>
              <Skeleton className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full' />
              <Skeleton className='absolute left-10 right-28 top-1/2 h-5 -translate-y-1/2 rounded-md' />
              <Skeleton className='absolute right-2 top-1/2 h-10 w-24 -translate-y-1/2 rounded-xl' />
            </div>
          </div>
        }
      >
        <SearchBar enableSuggestions={true} />
      </Suspense>
    </header>
  )
}


