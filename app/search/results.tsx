import { MediaCard } from '@/components/media-card'
import { searchTitles } from '@/lib/tmdb'

export default async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return (
      <div className='rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground'>
        Start typing a title to explore what’s available.
      </div>
    )
  }

  const results = await searchTitles(query)

  if (!results.length) {
    return (
      <div className='rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground'>
        Nothing matched “{query}”. Try a different title or keyword.
      </div>
    )
  }

  return (
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
  )
}


