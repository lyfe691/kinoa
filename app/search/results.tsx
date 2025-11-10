import Link from 'next/link'
import { MediaCard } from '@/components/media-card'
import { Button } from '@/components/ui/button'
import { searchTitles, getTrending, getLatestMovies } from '@/lib/tmdb'

export default async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return null
  }

  const results = await searchTitles(query)

  if (!results.length) {
    // Show curated recommendations instead of empty state
    const [trending, latest] = await Promise.all([
      getTrending().catch(() => []),
      getLatestMovies().catch(() => []),
    ])

    return (
      <div className='space-y-8'>
        <div className='space-y-2 text-center'>
          <p className='text-sm text-muted-foreground'>
            No results for <span className='font-medium text-foreground'>&ldquo;{query}&rdquo;</span>
          </p>
          <p className='text-xs text-muted-foreground'>Try a different search or explore what&rsquo;s popular</p>
        </div>

        {trending.length > 0 && (
          <section className='space-y-4'>
            <div className='flex items-baseline justify-between'>
              <h2 className='text-xl font-semibold tracking-tight'>Trending Now</h2>
              <Button asChild variant='ghost' size='sm'>
                <Link href='/'>See more</Link>
              </Button>
            </div>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
              {trending.slice(0, 10).map((item, index) => (
                <MediaCard key={`trending-${item.type}-${item.id}`} media={item} priority={index < 2} />
              ))}
            </div>
          </section>
        )}

        {latest.length > 0 && (
          <section className='space-y-4'>
            <h2 className='text-xl font-semibold tracking-tight'>Latest Movies</h2>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
              {latest.slice(0, 10).map((item) => (
                <MediaCard key={`latest-${item.type}-${item.id}`} media={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>
        <span className='font-medium text-foreground'>{results.length}</span> result
        {results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
      </p>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
        {results.map((item, index) => (
          <MediaCard key={`${item.type}-${item.id}`} media={item} priority={index < 2} />
        ))}
      </div>
    </div>
  )
}
