import { Suspense } from 'react'
import { SearchBar } from '@/components/search-bar'
import { SectionSkeleton } from './_components/section-skeleton'
import { TrendingShelf } from './_components/trending-shelf'
import { LatestMoviesShelf } from './_components/latest-movies-shelf'
import { LatestTvShelf } from './_components/latest-tv-shelf'
import { TopRatedShelf } from './_components/top-rated-shelf'

export default function Home() {
  return (
    <section className='flex flex-col gap-10'>
      <header className='space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight'>Find something great to watch</h1>
          <p className='max-w-2xl text-sm text-muted-foreground'>Search across movies and series.</p>
        </div>
        <SearchBar />
      </header>

      <Suspense fallback={<SectionSkeleton title='Trending' columns={5} />}>
        <TrendingShelf />
      </Suspense>

      <Suspense fallback={<SectionSkeleton title='Latest Movies' description='Fresh in theaters and newly available.' />}>
        <LatestMoviesShelf />
      </Suspense>

      <Suspense fallback={<SectionSkeleton title='Latest TV Shows' description='New episodes airing now.' />}>
        <LatestTvShelf />
      </Suspense>

      <Suspense fallback={<SectionSkeleton title='Top Rated' description='Timeless classics and critically acclaimed films.' />}>
        <TopRatedShelf />
      </Suspense>
    </section>
  )
}
