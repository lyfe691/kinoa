import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { searchTitles } from '@/lib/tmdb'

export const metadata: Metadata = {
  title: 'Search • Kinoa',
  description: 'Look up films and shows across the entire Kinoa catalog.',
}

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const q = params.q
  const query = typeof q === 'string' ? q.trim() : ''
  const results = query ? await searchTitles(query) : []

  return (
    <section className='flex flex-col gap-10'>
      <header className='space-y-4'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight'>Search</h1>
          <p className='text-sm text-muted-foreground'>
            Find something to watch by title, genre, or keyword.
          </p>
        </div>
        <form className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4' action='/search' method='get'>
          <Input
            name='q'
            placeholder='Search movies and series'
            defaultValue={query}
            aria-label='Search movies and series'
            autoComplete='off'
            spellCheck={false}
            required
          />
          <Button type='submit' className='sm:w-auto'>
            Search
          </Button>
        </form>
      </header>

      {query ? (
        results.length ? (
          <div className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              Showing {results.length} result{results.length === 1 ? '' : 's'} for “{query}”.
            </p>
            <ul className='grid gap-4'>
              {results.map((item) => (
                <li key={`${item.type}-${item.id}`} className='rounded-lg border border-border/60 p-4 transition hover:border-primary/60'>
                  <Link href={item.href} className='space-y-2 focus:outline-none focus:ring-2 focus:ring-ring/60 focus:ring-offset-2'>
                    <div className='flex flex-col gap-1'>
                      <span className='text-xs uppercase text-muted-foreground'>
                        {item.type} {item.releaseYear ? `• ${item.releaseYear}` : ''}
                      </span>
                      <h2 className='text-lg font-semibold leading-tight'>{item.name}</h2>
                    </div>
                    {item.overview ? (
                      <p className='line-clamp-3 text-sm text-muted-foreground'>{item.overview}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className='rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground'>
            Nothing matched “{query}”. Try a different title or keyword.
          </div>
        )
      ) : (
        <div className='rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground'>
          Start typing a title to explore what’s available.
        </div>
      )}
    </section>
  )
}

