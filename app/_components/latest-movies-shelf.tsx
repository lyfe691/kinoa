import { MediaCard } from '@/components/media-card'
import { getLatestMovies } from '@/lib/tmdb'

export async function LatestMoviesShelf() {
  const latestMovies = await getLatestMovies()

  return (
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
  )
}
