import { Skeleton } from "@/components/ui/skeleton";

export function MediaHeroSkeleton() {
  return (
    <div className="relative">
      {/* Backdrop skeleton */}
      <div className="absolute left-1/2 -translate-x-1/2 w-screen h-[580px] sm:h-[520px] lg:h-[540px] -z-10 -top-12">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-linear-to-r from-background/60 via-transparent to-background/60" />
      </div>

      {/* Content skeleton */}
      <div className="relative pt-6 sm:pt-10 lg:pt-14">
        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-end lg:gap-10">
          {/* Poster skeleton */}
          <div className="shrink-0">
            <Skeleton className="w-36 sm:w-48 lg:w-56 aspect-2/3 rounded-xl" />
          </div>

          {/* Info skeleton */}
          <div className="flex flex-1 flex-col items-center gap-4 lg:items-start lg:pb-3">
            {/* Badges */}
            <div className="flex gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>

            {/* Title */}
            <Skeleton className="h-10 sm:h-12 w-64 sm:w-96" />

            {/* Metadata */}
            <div className="flex gap-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>

            {/* Genres */}
            <div className="flex gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>

            {/* Actions */}
            <Skeleton className="h-9 w-36 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
