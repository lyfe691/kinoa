import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'

export function MediaCardSkeleton() {
  return (
    <div className='overflow-hidden rounded-xl border border-border/60'>
      <AspectRatio ratio={2 / 3}>
        <Skeleton className='h-full w-full rounded-xl' />
      </AspectRatio>
    </div>
  )
}


