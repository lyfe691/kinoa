import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type MediaCardSkeletonProps = {
  className?: string;
};

export function MediaCardSkeleton({ className }: MediaCardSkeletonProps) {
  return (
    <div
      className={cn("flex flex-col gap-2 sm:gap-3 relative", className)}
      aria-hidden="true"
    >
      {/* Poster */}
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-muted">
        <Skeleton className="h-full w-full" />

        {/* Rating badge placeholder */}
        <div className="absolute right-2 top-2">
          <Skeleton className="h-6 w-12 rounded-md" />
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>

        {/* Menu placeholder */}
        <div className="shrink-0 relative">
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
