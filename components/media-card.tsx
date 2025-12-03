"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRuntime } from "@/lib/format-runtime";
import { MediaMenu } from "@/components/media-menu";
import { useImageColor } from "@/hooks/use-image-color";

import type { MediaSummary } from "@/lib/tmdb";

type MediaCardProps = {
  media: MediaSummary & {
    runtime?: number | null;
    seasonCount?: number;
    episodeCount?: number;
  };
  isInWatchlist?: boolean;
  className?: string;
  priority?: boolean;
};

export function MediaCard({
  media,
  isInWatchlist,
  className,
  priority = false,
}: MediaCardProps) {
  const {
    href,
    name,
    posterUrl,
    type,
    releaseYear,
    runtime,
    seasonCount,
    rating,
  } = media;

  const color = useImageColor(posterUrl);

  const metadata = [];

  if (releaseYear) metadata.push(releaseYear);
  if (type === "movie" && runtime) metadata.push(formatRuntime(runtime));
  if (type === "tv" && seasonCount)
    metadata.push(`${seasonCount} Season${seasonCount > 1 ? "s" : ""}`);

  const formattedRating = rating ? rating.toFixed(1) : null;

  return (
    <div
      className={cn("flex flex-col gap-2 sm:gap-3 relative group", className)}
    >
      {/* Dynamic Background Layer */}
      <div
        className={cn(
          "absolute -inset-2 rounded-xl pointer-events-none -z-10",
          "transition-all duration-500 ease-out opacity-0 scale-95",
          "group-hover:opacity-100 group-hover:scale-100",
          !color && "bg-muted/50",
        )}
        style={color ? { backgroundColor: `rgba(${color}, 0.15)` } : undefined}
      />

      <Link
        href={href}
        className="relative block aspect-2/3 overflow-hidden rounded-lg bg-muted"
        aria-label={`${name}${releaseYear ? ` (${releaseYear})` : ""}`}
      >
        {posterUrl ? (
          <>
            <Image
              src={posterUrl}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              priority={priority}
            />

            <div className="absolute inset-0 bg-black/0 transition-colors duration-500 ease-out group-hover:bg-black/10" />

            {formattedRating && (
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 backdrop-blur-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium tabular-nums text-white">
                  {formattedRating}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-12 w-12 text-muted-foreground/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}
      </Link>

      <div className="flex items-start justify-between gap-3">
        <Link href={href} className="min-w-0 flex-1 space-y-1">
          <h3 className="line-clamp-1 text-sm font-medium leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>

          {metadata.length > 0 && (
            <p className="truncate text-xs text-muted-foreground">
              {metadata.join(" · ")}
            </p>
          )}
        </Link>

        <div className="shrink-0 relative">
          <MediaMenu
            mediaId={media.id}
            mediaType={type}
            isInWatchlist={isInWatchlist}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
