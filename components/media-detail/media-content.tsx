import { cn } from "@/lib/utils";

type MediaContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function MediaContent({ children, className }: MediaContentProps) {
  return (
    <div className={cn("flex flex-col gap-8 pt-8", className)}>{children}</div>
  );
}

type MediaSectionProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function MediaSection({ title, children, className }: MediaSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {title && (
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      )}
      {children}
    </section>
  );
}

