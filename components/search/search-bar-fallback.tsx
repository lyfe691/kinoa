import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SearchBarFallbackProps {
  className?: string;
}

export function SearchBarFallback({ className }: SearchBarFallbackProps) {
  return (
    <div
      className={cn(
        "relative flex h-14 w-full items-center rounded-2xl border border-border bg-card px-4 shadow-sm",
        className,
      )}
    >
      <Skeleton className="mr-3 h-5 w-5 shrink-0 rounded-full opacity-25" />
      <Skeleton className="h-5 w-40 rounded-md opacity-20" />
      <div className="ml-auto">
        <Skeleton className="h-8 w-8 rounded-lg opacity-10" />
      </div>
    </div>
  );
}
