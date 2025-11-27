import { Skeleton } from "@/components/ui/skeleton";

export default function MovieLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="relative">
        {/* Backdrop skeleton */}
        <div className="absolute left-1/2 -translate-x-1/2 w-screen h-[580px] sm:h-[520px] lg:h-[540px] -z-10 -top-12">
          <Skeleton className="h-full w-full rounded-none" />
        </div>

        {/* Content skeleton */}
        <div className="relative pt-6 sm:pt-10 lg:pt-14">
          <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-end lg:gap-10">
            {/* Poster skeleton */}
            <div className="shrink-0">
              <Skeleton className="w-36 sm:w-48 lg:w-56 aspect-[2/3] rounded-xl" />
            </div>

            {/* Info skeleton */}
            <div className="flex flex-1 flex-col items-center gap-4 lg:items-start lg:pb-3">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-10 sm:h-12 w-64 sm:w-96" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <Skeleton className="h-9 w-36 rounded-full mt-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col gap-8 pt-10">
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2 max-w-3xl">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="aspect-video w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
