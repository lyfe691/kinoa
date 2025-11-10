import { Suspense } from 'react'
import { SearchBar } from '@/components/search-bar'
import { Skeleton } from '@/components/ui/skeleton'

export function HomeHeader() {
  return (
    <header className='space-y-6'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-semibold tracking-tight'>Find something great to watch</h1>
        <p className='max-w-2xl text-sm text-muted-foreground'>Search across movies and series.</p>
      </div>
      <Suspense fallback={<Skeleton className='w-full h-10 rounded-full' />}>
        <SearchBar enableSuggestions={true} />
      </Suspense>
    </header>
  )
}


