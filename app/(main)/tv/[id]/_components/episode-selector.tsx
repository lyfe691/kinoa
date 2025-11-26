"use client";

import { useState, useEffect, useMemo } from "react";
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
import type { TvSeason } from "@/lib/tmdb";

type EpisodeSelectorProps = {
  seasons: TvSeason[];
  currentSeason: number;
  currentEpisode: number;
  onEpisodeChange: (season: number, episode: number) => void;
  className?: string;
};

const EPISODES_PER_PAGE = 12;

export function EpisodeSelector({
  seasons,
  currentSeason,
  currentEpisode,
  onEpisodeChange,
  className,
}: EpisodeSelectorProps) {
  const season = useMemo(
    () => seasons.find((s) => s.number === currentSeason),
    [seasons, currentSeason],
  );

  const episodes = season?.episodes ?? [];

  const [page, setPage] = useState(() =>
    Math.floor((currentEpisode - 1) / EPISODES_PER_PAGE),
  );

  useEffect(() => {
    setPage(Math.floor((currentEpisode - 1) / EPISODES_PER_PAGE));
  }, [currentEpisode]);

  const totalPages = Math.ceil(episodes.length / EPISODES_PER_PAGE);
  const startIdx = page * EPISODES_PER_PAGE;
  const endIdx = startIdx + EPISODES_PER_PAGE;
  const visibleEpisodes = episodes.slice(startIdx, endIdx);

  const handleSeasonChange = (value: string) => {
    const newSeason = parseInt(value, 10);
    const newSeasonData = seasons.find((s) => s.number === newSeason);
    const firstEpisode = newSeasonData?.episodes[0]?.number ?? 1;
    setPage(0);
    onEpisodeChange(newSeason, firstEpisode);
  };

  const handleEpisodeClick = (episodeNumber: number) => {
    onEpisodeChange(currentSeason, episodeNumber);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Season selector */}
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-medium tracking-wide text-muted-foreground">
          Season
        </span>
        <Select value={String(currentSeason)} onValueChange={handleSeasonChange}>
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
                {s.episodes.length > 0 ? ` · ${s.episodes.length} eps` : ""}
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
                "h-auto w-full justify-start rounded-md p-2 sm:p-2.5 transition-colors cursor-pointer",
                isActive ? "hover:bg-accent" : "hover:bg-accent/60",
              )}
              onClick={() => handleEpisodeClick(episode.number)}
              aria-current={isActive ? "true" : undefined}
            >
              <div className="flex w-full min-w-0 items-start gap-2">
                <div className="min-w-0 flex-1 space-y-0.5 text-left">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Episode {episode.number}
                  </div>
                  <div className="truncate text-xs font-medium leading-tight">
                    {episode.name}
                  </div>
                </div>
              </div>
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
            {startIdx + 1}-{Math.min(endIdx, episodes.length)} of{" "}
            {episodes.length}
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
