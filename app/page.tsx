import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTrending } from '@/lib/tmdb'

export default async function Home() {
  const trending = await getTrending()

  return (
    <section className='flex flex-col gap-8'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-semibold tracking-tight'>Tonight&apos;s highlights</h1>
        <p className='max-w-2xl text-sm text-muted-foreground'>
          Fresh picks to queue up now — swipe through and jump right in.
        </p>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {trending.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={item.href}
            className='group block focus:outline-none focus:ring-2 focus:ring-ring/60 focus:ring-offset-2'
          >
            <Card className='h-full overflow-hidden border-border/60 transition duration-200 group-hover:border-primary/60 group-hover:shadow-md'>
              <div className='relative aspect-2/3 w-full bg-muted'>
                {item.posterUrl ? (
                  <Image
                    src={item.posterUrl}
                    alt={item.name}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    className='object-cover transition duration-300 group-hover:scale-105'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
                    Artwork unavailable
                  </div>
                )}
              </div>

              <CardHeader className='gap-2 px-4 pb-2 pt-4'>
                <CardTitle className='text-base font-semibold leading-tight'>{item.name}</CardTitle>
                <CardDescription className='text-xs uppercase tracking-wide text-muted-foreground'>
                  {item.type} {item.releaseYear ? `• ${item.releaseYear}` : null}
                </CardDescription>
              </CardHeader>

              <CardContent className='px-4 pb-5'>
                <p className='line-clamp-3 text-sm text-muted-foreground'>{item.overview}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
