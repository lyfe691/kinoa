"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EpisodeNavigatorProps = {
  showId: number;
  seasons: {
    number: number;
    name: string;
    episodeCount: number;
  }[];
  seasonEpisodes: {
    number: number;
    name: string;
  }[];
  currentSeason: number;
  currentEpisode: number;
  className?: string;
};

const EPISODES_PER_PAGE = 12;

export function EpisodeNavigator({
  showId,
  seasons,
  seasonEpisodes,
  currentSeason,
  currentEpisode,
  className,
}: EpisodeNavigatorProps) {
  const router = useRouter();
  const [page, setPage] = useState(() => {
    // Start on the page containing the current episode
    return Math.floor((currentEpisode - 1) / EPISODES_PER_PAGE);
  });

  useEffect(() => {
    setPage(Math.floor((currentEpisode - 1) / EPISODES_PER_PAGE));
  }, [currentEpisode]);

  const totalPages = Math.ceil(seasonEpisodes.length / EPISODES_PER_PAGE);
  const startIdx = page * EPISODES_PER_PAGE;
  const endIdx = startIdx + EPISODES_PER_PAGE;
  const visibleEpisodes = seasonEpisodes.slice(startIdx, endIdx);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Season selector */}
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-medium tracking-wide text-muted-foreground">
          Season
        </span>
        <Select
          value={String(currentSeason)}
          onValueChange={(value) => {
            setPage(0);
            router.push(`/tv/${showId}/${value}/1`);
          }}
        >
          <SelectTrigger
            className="h-9 w-[160px] rounded-lg"
            aria-label="Select season"
          >
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((s) => (
              <SelectItem key={s.number} value={String(s.number)}>
                Season {s.number}
                {s.episodeCount ? ` · ${s.episodeCount} eps` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Episode grid */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {visibleEpisodes.map((episode) => {
          const isActive = episode.number === currentEpisode;
          return (
            <Button
              key={episode.number}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "h-auto w-full justify-start rounded-md p-2 sm:p-2.5 transition-colors",
                isActive ? "hover:bg-accent" : "hover:bg-accent/60",
              )}
              asChild
            >
              <Link
                href={`/tv/${showId}/${currentSeason}/${episode.number}`}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className="flex w-full min-w-0 items-start gap-2"
              >
                <div className="min-w-0 flex-1 space-y-0.5 text-left">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Episode {episode.number}
                  </div>
                  <div className="truncate text-xs font-medium leading-tight">
                    {episode.name}
                  </div>
                </div>
              </Link>
            </Button>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 border-t pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <span className="text-[11px] text-muted-foreground">
            {startIdx + 1}-{Math.min(endIdx, seasonEpisodes.length)} of{" "}
            {seasonEpisodes.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
