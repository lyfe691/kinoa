import Link from 'next/link'
import { Search } from 'lucide-react'
import { MediaCard } from '@/components/media-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getTrending, searchTitles } from '@/lib/tmdb'

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams
  const q = params.q
  const query = typeof q === 'string' ? q.trim() : ''

  const [trending, searchResults] = await Promise.all([
    getTrending(),
    query ? searchTitles(query) : Promise.resolve([]),
  ])

  const highlightItems = query ? searchResults : trending
  const heading = query ? `Results for “${query}”` : 'Tonight’s highlights'
  const subheading = query
    ? 'Here’s what we found — pick something to play instantly.'
    : 'Fresh picks to queue up now — browse and jump right in.'

  return (
    <section className='flex flex-col gap-12'>
      <div className='overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white shadow-lg'>
        <div className='grid gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,540px)_1fr] lg:px-16 lg:py-16'>
          <div className='flex flex-col gap-6'>
            <span className='inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur'>
              Just in
            </span>
            <div className='space-y-4'>
              <h1 className='text-4xl font-semibold tracking-tight sm:text-5xl'>
                Find a perfect watch for tonight
              </h1>
              <p className='text-base text-white/80'>
                Search across movies and series, or scroll for curated suggestions powered by what’s trending right now.
              </p>
            </div>
            <form
              className='flex w-full flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur'
              action='/'
              method='get'
            >
              <div className='flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm'>
                <Search className='h-5 w-5 text-gray-500' aria-hidden />
                <Input
                  name='q'
                  defaultValue={query}
                  placeholder='Search for a movie or show'
                  className='h-auto flex-1 border-none bg-transparent px-0 text-base text-gray-900 placeholder:text-gray-500 focus-visible:ring-0'
                  autoComplete='off'
                  spellCheck={false}
                />
                <Button type='submit' className='rounded-xl px-4 py-2 text-sm'>
                  Explore
                </Button>
              </div>
              <p className='px-2 text-xs text-white/70'>
                Try something like <span className='font-semibold'>Inception</span> or <span className='font-semibold'>The
                Last of Us</span>.
              </p>
            </form>
          </div>
          <div className='relative hidden min-h-[320px] overflow-hidden rounded-2xl border border-white/20 bg-black/30 lg:block'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)]' />
            <div className='absolute inset-0 flex items-end justify-end p-8'>
              <div className='w-60 rounded-2xl border border-white/20 bg-black/50 p-4 text-left shadow-2xl backdrop-blur'>
                <p className='text-xs uppercase tracking-[0.2em] text-white/50'>Now playing</p>
                <p className='mt-3 text-lg font-semibold'>
                  {trending[0]?.name ?? 'Your next favorite story'}
                </p>
                <p className='mt-2 text-sm text-white/70 line-clamp-3'>
                  {trending[0]?.overview ?? 'Cue up something fresh and start watching instantly.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight'>{heading}</h2>
            <p className='text-sm text-muted-foreground'>{subheading}</p>
          </div>
          {query ? (
            <Button variant='ghost' size='sm' asChild>
              <Link href='/'>Clear search</Link>
            </Button>
          ) : null}
        </div>

        {query && !highlightItems.length ? (
          <div className='rounded-2xl border border-dashed border-border/70 bg-muted/40 p-6 text-sm text-muted-foreground'>
            Nothing matched “{query}”. Try another title or check back later for updates.
          </div>
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {highlightItems.map((item) => (
              <MediaCard key={`${item.type}-${item.id}`} media={item} />
            ))}
          </div>
        )}
      </div>

      {!query ? null : (
        <div className='space-y-3'>
          <h3 className='text-xl font-semibold tracking-tight'>Trending right now</h3>
          <p className='text-sm text-muted-foreground'>
            Still unsure? These picks are popular across the community today.
          </p>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {trending.map((item) => (
              <MediaCard key={`trending-${item.type}-${item.id}`} media={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
