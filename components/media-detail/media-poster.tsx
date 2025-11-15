import Image from "next/image";
import { cn } from "@/lib/utils";

type MediaPosterProps = {
  src?: string | null;
  title: string;
  className?: string;
  priority?: boolean;
};

export function MediaPoster({
  src,
  title,
  className,
  priority = false,
}: MediaPosterProps) {
  return (
    <div
      className={cn(
        "flex justify-center lg:justify-start self-start",
        className,
      )}
    >
      <div className="w-full max-w-[280px] overflow-hidden rounded-lg border border-border/40 bg-muted shadow-lg">
        <div className="relative aspect-2/3">
          {src ? (
            <Image
              src={src}
              alt={title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 35vw, 280px"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                className="h-20 w-20 text-muted-foreground/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
