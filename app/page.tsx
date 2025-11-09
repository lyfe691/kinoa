import { SearchBar } from '@/components/search-bar'
import { MediaCard } from '@/components/media-card'
import { getLatestMovies, getLatestTvShows, getTrending, getUpcomingMovies } from '@/lib/tmdb'
import { TrendingSection } from '@/components/trending-section'

export default async function Home() {
  const [trending, latestMovies, latestTv, comingSoon] = await Promise.all([
    getTrending(),
    getLatestMovies(),
    getLatestTvShows(),
    getUpcomingMovies(),
  ])

  return (
    <section className='flex flex-col gap-10'>
      <header className='space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight'>Find something great to watch</h1>
          <p className='max-w-2xl text-sm text-muted-foreground'>Search across movies and series.</p>
        </div>
        <SearchBar />
      </header>

      <TrendingSection items={trending} />

      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='text-xl font-semibold tracking-tight'>Latest Movies</h2>
          <p className='max-w-2xl text-sm text-muted-foreground'>Fresh in theaters and newly available.</p>
        </div>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
          {latestMovies.map((item, index) => (
            <MediaCard key={`movie-${item.id}`} media={item} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='text-xl font-semibold tracking-tight'>Latest TV Shows</h2>
          <p className='max-w-2xl text-sm text-muted-foreground'>New episodes airing now.</p>
        </div>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
          {latestTv.map((item, index) => (
            <MediaCard key={`tv-${item.id}`} media={item} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='text-xl font-semibold tracking-tight'>Coming Soon</h2>
          <p className='max-w-2xl text-sm text-muted-foreground'>Mark your calendar for upcoming releases.</p>
        </div>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
          {comingSoon.map((item, index) => (
            <MediaCard key={`soon-${item.id}`} media={item} priority={index < 2} />
          ))}
        </div>
      </section>
    </section>
  )
}
