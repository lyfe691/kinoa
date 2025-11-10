import { cn } from "@/lib/utils";

type MediaDetailLayoutProps = {
  poster: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function MediaDetailLayout({
  poster,
  children,
  className,
}: MediaDetailLayoutProps) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-[280px_1fr]", className)}>
      {poster}
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}
