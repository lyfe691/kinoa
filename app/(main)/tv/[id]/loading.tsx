import { Skeleton } from "@/components/ui/skeleton";
import { MediaHeroSkeleton } from "@/components/media-detail/media-hero-skeleton";

export default function TvShowLoading() {
  return (
    <div>
      <MediaHeroSkeleton />

      {/* Content skeleton */}
      <div className="flex flex-col gap-8 pt-10">
        {/* Episode info */}
        <div className="space-y-3">
          <Skeleton className="h-7 w-56" />
          <div className="space-y-2 max-w-3xl">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>

        {/* Player */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="aspect-video w-full rounded-lg" />
        </div>

        {/* Episode selector */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-9 w-44 rounded-lg" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
