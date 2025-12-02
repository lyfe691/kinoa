"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Player } from "@/components/player";
import { MediaMenu } from "@/components/media-menu";
import {
  MediaHero,
  MediaContent,
  MediaSection,
} from "@/components/media-detail";
import { formatRuntime } from "@/lib/format-runtime";
import { EpisodeSelector } from "./episode-selector";
import type { TvShowPageData } from "@/lib/tmdb";

type TvShowClientProps = {
  show: TvShowPageData;
  initialSeason: number;
  initialEpisode: number;
};

export function TvShowClient({
  show,
  initialSeason,
  initialEpisode,
}: TvShowClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getValidInitialState = useCallback(() => {
    const season = show.seasons.find((s) => s.number === initialSeason);
    if (season) {
      const episode = season.episodes.find((e) => e.number === initialEpisode);
      if (episode) {
        return { season: initialSeason, episode: initialEpisode };
      }
      return {
        season: initialSeason,
        episode: season.episodes[0]?.number ?? 1,
      };
    }
    const firstSeason = show.seasons[0];
    return {
      season: firstSeason?.number ?? 1,
      episode: firstSeason?.episodes[0]?.number ?? 1,
    };
  }, [show.seasons, initialSeason, initialEpisode]);

  const [state, setState] = useState(getValidInitialState);

  const currentSeason = useMemo(
    () => show.seasons.find((s) => s.number === state.season),
    [show.seasons, state.season],
  );

  const currentEpisode = useMemo(
    () => currentSeason?.episodes.find((e) => e.number === state.episode),
    [currentSeason, state.episode],
  );

  const updateUrl = useCallback(
    (season: number, episode: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("s", String(season));
      params.set("e", String(episode));
      router.replace(`/tv/${show.id}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, show.id],
  );

  const handleEpisodeChange = useCallback(
    (season: number, episode: number) => {
      setState({ season, episode });
      updateUrl(season, episode);
    },
    [updateUrl],
  );

  const runtime = formatRuntime(currentEpisode?.runtime);
  const episodeLabel = `S${state.season}:E${state.episode}`;

  // Get first air year from show data
  const releaseYear = show.firstAirDate
    ? new Date(show.firstAirDate).getFullYear().toString()
    : undefined;

  return (
    <div>
      <MediaHero
        type="tv"
        title={show.name}
        backdropUrl={show.backdropUrl}
        posterUrl={show.posterUrl}
        rating={show.rating}
        voteCount={show.voteCount}
        releaseYear={releaseYear}
        runtime={runtime}
        genres={show.genres}
        episodeLabel={episodeLabel}
      >
        <MediaMenu
          mediaId={show.id}
          mediaType="tv"
          title={show.name}
          posterUrl={show.posterUrl}
          variant="button"
        />
      </MediaHero>

      <MediaContent>
        {/* Episode info */}
        {currentEpisode && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{currentEpisode.name}</h2>
            {currentEpisode.overview && (
              <p className="text-muted-foreground leading-relaxed max-w-3xl">
                {currentEpisode.overview}
              </p>
            )}
          </div>
        )}

        {/* Fallback to show overview if no episode overview */}
        {!currentEpisode?.overview && show.overview && (
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            {show.overview}
          </p>
        )}

        <MediaSection title="Watch Now">
          <Player
            key={`${state.season}-${state.episode}`}
            kind="tv"
            tmdbId={show.id}
            season={state.season}
            episode={state.episode}
            title={`${show.name} - ${currentEpisode?.name ?? `Episode ${state.episode}`}`}
          />
        </MediaSection>

        {show.seasons.length > 0 && currentSeason && (
          <MediaSection title="Episodes">
            <EpisodeSelector
              seasons={show.seasons}
              currentSeason={state.season}
              currentEpisode={state.episode}
              onEpisodeChange={handleEpisodeChange}
            />
          </MediaSection>
        )}
      </MediaContent>
    </div>
  );
}
