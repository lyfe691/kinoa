import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MediaCard } from '@/components/media-card'
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/'>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Search</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
              {results.map((item, index) => (
                <MediaCard key={`${item.type}-${item.id}`} media={item} priority={index < 2} />
              ))}
            </div>
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

