import { Skeleton } from '@/components/ui/skeleton'

export default function EpisodeLoading() {
  return (
    <article className='flex flex-col gap-6'>
      {/* Breadcrumb skeleton */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-4 w-12' />
        <Skeleton className='h-4 w-4' />
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-4 w-4' />
        <Skeleton className='h-4 w-20' />
      </div>

      {/* Hero skeleton */}
      <Skeleton className='relative -mx-4 h-[40vh] min-h-[300px] rounded-lg sm:-mx-6 lg:-mx-8' />

      {/* Content grid skeleton */}
      <div className='grid gap-8 lg:grid-cols-[240px_1fr]'>
        {/* Poster skeleton */}
        <div className='flex justify-center lg:justify-start'>
          <Skeleton className='aspect-[2/3] w-full max-w-[240px] rounded-lg' />
        </div>

        {/* Info skeleton */}
        <div className='flex flex-col gap-6'>
          <div className='space-y-4'>
            <div className='flex flex-wrap gap-2'>
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-6 w-12' />
            </div>
            <Skeleton className='h-12 w-3/4' />
            <div className='flex flex-wrap gap-2'>
              <Skeleton className='h-7 w-20 rounded-full' />
              <Skeleton className='h-7 w-24 rounded-full' />
            </div>
          </div>

          {/* Episode navigator skeleton */}
          <div className='grid gap-4 sm:grid-cols-2'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>

          {/* Episode info skeleton */}
          <div className='space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4'>
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-3 w-24' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
            </div>
          </div>

          {/* Player skeleton */}
          <Skeleton className='aspect-video w-full rounded-lg' />
        </div>
      </div>
    </article>
  )
}
