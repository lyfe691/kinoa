import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingEpisodePage() {
  return (
    <div className='grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr]'>
      <div className='overflow-hidden rounded-xl border border-border/60'>
        <Skeleton className='aspect-[2/3] w-full' />
      </div>
      <div className='flex flex-col gap-4'>
        <Skeleton className='h-6 w-24' />
        <Skeleton className='h-10 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-32 w-full' />
        <Skeleton className='aspect-[16/9] w-full rounded-lg' />
        <Skeleton className='aspect-video w-full rounded-lg' />
      </div>
    </div>
  )
}

