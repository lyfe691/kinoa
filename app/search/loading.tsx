import { MediaCardSkeleton } from '@/components/media-card-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function SearchLoading() {
  return (
    <section className='flex flex-col gap-10'>
      <div className='space-y-3'>
        <Skeleton className='h-6 w-24' />
        <Skeleton className='h-8 w-48' />
        <div className='flex gap-3'>
          <Skeleton className='h-10 w-full max-w-xl' />
          <Skeleton className='h-10 w-28' />
        </div>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
        {Array.from({ length: 10 }).map((_, i) => (
          <MediaCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}


