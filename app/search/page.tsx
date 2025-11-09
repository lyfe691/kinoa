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
import { Suspense } from 'react'
import { SearchBar } from '@/components/search-bar'
import { MediaCardSkeleton } from '@/components/media-card-skeleton'
import SearchResults from './results'

export const metadata: Metadata = {
  title: 'Search • Kinoa',
  description: 'Look up films and shows across the entire Kinoa catalog.',
}

type SearchPageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q
  const query = typeof q === 'string' ? q.trim() : ''
  // Results are streamed via a server component to avoid fetching in the page shell

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
        <SearchBar placeholder='Search movies and series' initialQuery={query} />
      </header>

      <Suspense
        key={query || 'empty'}
        fallback={
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
            {Array.from({ length: 10 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <SearchResults query={query} />
      </Suspense>
    </section>
  )
}

