import { MediaCardSkeleton } from "@/components/media-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

type SectionSkeletonProps = {
  title: string;
  description?: string;
  columns?: number;
};

export function SectionSkeleton({
  title,
  description,
  columns = 5,
}: SectionSkeletonProps) {
  return (
    <section className="space-y-6" aria-label={`${title} section loading`}>
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" aria-hidden="true" />
        {description && <Skeleton className="h-4 w-48" aria-hidden="true" />}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: columns }).map((_, index) => (
          <MediaCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
