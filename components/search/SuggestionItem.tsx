"use client";

import * as React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export type Suggestion = {
  id: number;
  type: "movie" | "tv";
  name: string;
  posterUrl: string | null;
  releaseYear?: string;
  href: string;
  rating?: number;
};

type SuggestionItemProps = {
  item: Suggestion;
  onSelectAction: (href: string) => void;
};

export const SuggestionItem = React.memo(function SuggestionItem({
  item,
  onSelectAction,
}: SuggestionItemProps) {
  return (
    <div
      role="option"
      aria-selected="false"
      className="group relative mb-1 cursor-pointer overflow-hidden rounded-xl transition-all duration-200 hover:bg-muted/60"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onSelectAction(item.href)}
    >
      <div className="flex items-center gap-3.5 p-3">
        <div className="relative h-[72px] w-12 shrink-0 overflow-hidden rounded-lg bg-muted/80 shadow-sm ring-1 ring-border/40 transition-all duration-200 group-hover:scale-102 group-hover:shadow-lg">
          {item.posterUrl ? (
            <Image
              src={item.posterUrl}
              alt={item.name}
              fill
              unoptimized
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground/30">
              {item.type === "movie" ? "MV" : "TV"}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="truncate text-[15px] font-semibold leading-tight tracking-tight transition-colors duration-200 group-hover:text-primary">
            {item.name}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary transition-all duration-200 group-hover:bg-primary/20 group-hover:shadow-sm">
              {item.type === "movie" ? "Movie" : "TV"}
            </span>
            {item.releaseYear && (
              <span className="text-xs font-medium text-muted-foreground/70">
                {item.releaseYear}
              </span>
            )}
            {item.type === "tv" && (
               <span className="text-xs font-medium text-muted-foreground/70">
                 • TV Series
               </span>
            )}
            {item.rating && item.rating > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                {item.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
