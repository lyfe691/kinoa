import { Skeleton } from "@/components/ui/skeleton";
import { MediaHeroSkeleton } from "@/components/media-detail/media-hero-skeleton";

export default function MovieLoading() {
  return (
    <div>
      <MediaHeroSkeleton />

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
