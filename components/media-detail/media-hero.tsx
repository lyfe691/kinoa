"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Clock, Calendar, Tv, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type MediaHeroProps = {
  type: "movie" | "tv";
  title: string;
  backdropUrl?: string | null;
  posterUrl?: string | null;
  rating?: number;
  voteCount?: number;
  releaseYear?: string;
  runtime?: string | null;
  genres?: string[];
  episodeLabel?: string;
  className?: string;
  children?: React.ReactNode;
};

export function MediaHero({
  type,
  title,
  backdropUrl,
  posterUrl,
  rating,
  voteCount,
  releaseYear,
  runtime,
  genres = [],
  episodeLabel,
  className,
  children,
}: MediaHeroProps) {
  const TypeIcon = type === "movie" ? Film : Tv;
  const [isBackdropLoaded, setIsBackdropLoaded] = React.useState(false);
  const [isPosterLoaded, setIsPosterLoaded] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      {/* Full-bleed backdrop */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-screen h-[580px] sm:h-[520px] lg:h-[540px] -z-10 -top-12"
        aria-hidden="true"
      >
        {backdropUrl ? (
          <>
            <Image
              src={backdropUrl}
              alt=""
              fill
              priority
              unoptimized
              className={cn(
                "object-cover object-center transition-opacity duration-700",
                isBackdropLoaded ? "opacity-100" : "opacity-0",
              )}
              sizes="100vw"
              onLoad={() => setIsBackdropLoaded(true)}
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/30" />
            <div className="absolute inset-0 bg-linear-to-r from-background/60 via-transparent to-background/60" />
          </>
        ) : (
          <div className="h-full w-full bg-linear-to-b from-muted/30 to-background" />
        )}
      </div>

      {/* Content */}
      <div className="relative pt-6 sm:pt-10 lg:pt-14">
        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-end lg:gap-10">
          {/* Poster */}
          <div className="shrink-0">
            <div className="relative w-36 sm:w-48 lg:w-56 overflow-hidden rounded-xl shadow-2xl shadow-black/50 ring-1 ring-white/10">
              <div className="relative aspect-2/3">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={title}
                    fill
                    priority
                    unoptimized
                    className={cn(
                      "object-cover transition-opacity duration-700",
                      isPosterLoaded ? "opacity-100" : "opacity-0",
                    )}
                    sizes="(max-width: 640px) 144px, (max-width: 1024px) 192px, 224px"
                    onLoad={() => setIsPosterLoaded(true)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <TypeIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col items-center gap-4 text-center lg:items-start lg:text-left lg:pb-3">
            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                <TypeIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">
                  {type === "movie" ? "Movie" : "Series"}
                </span>
              </Badge>
              {episodeLabel && (
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                  {episodeLabel}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground lg:justify-start">
              {releaseYear && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {releaseYear}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {runtime}
                </span>
              )}
              {typeof rating === "number" && (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold text-foreground">
                    {rating.toFixed(1)}
                  </span>
                  {voteCount && (
                    <span className="text-muted-foreground">
                      ({voteCount.toLocaleString()})
                    </span>
                  )}
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                {genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-border/50 bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            {children && (
              <div className="flex items-center justify-center gap-3 pt-2 lg:justify-start">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
