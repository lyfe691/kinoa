import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MediaCard } from '@/components/media-card'
import { getTrending } from '@/lib/tmdb'

export default async function Home() {
  const trending = await getTrending()

  return (
    <section className='flex flex-col gap-10'>
      <header className='space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight'>Find something great to watch</h1>
          <p className='max-w-2xl text-sm text-muted-foreground'>Search across movies and series.</p>
        </div>
        <form className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4' action='/search' method='get'>
          <Input
            name='q'
            placeholder='Enter keywords...'
            aria-label='Search movies and series'
            autoComplete='off'
            spellCheck={false}
          />
          <Button type='submit' className='sm:w-auto'>
            Search
          </Button>
        </form>
      </header>

      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='text-xl font-semibold tracking-tight'>Tonight&apos;s highlights</h2>
          <p className='max-w-2xl text-sm text-muted-foreground'>Quick picks to jump right in.</p>
        </div>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
          {trending.map((item, index) => (
            <MediaCard key={`${item.type}-${item.id}`} media={item} priority={index < 4} />
          ))}
        </div>
      </section>
    </section>
  )
}
