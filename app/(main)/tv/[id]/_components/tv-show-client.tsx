"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Player } from "@/components/player";
import { MediaMenu } from "@/components/media-menu";
import {
  MediaDetailLayout,
  MediaHeader,
  MediaOverview,
  MediaPoster,
} from "@/components/media-detail";
import { formatRuntime } from "@/lib/format-runtime";
import { EpisodeSelector } from "./episode-selector";
import type { TvShowPageData, TvEpisode } from "@/lib/tmdb";

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

  // Find valid initial values
  const getValidInitialState = useCallback(() => {
    const season = show.seasons.find((s) => s.number === initialSeason);
    if (season) {
      const episode = season.episodes.find((e) => e.number === initialEpisode);
      if (episode) {
        return { season: initialSeason, episode: initialEpisode };
      }
      // Season exists but episode doesn't - default to first episode
      return {
        season: initialSeason,
        episode: season.episodes[0]?.number ?? 1,
      };
    }
    // Season doesn't exist - default to first season, first episode
    const firstSeason = show.seasons[0];
    return {
      season: firstSeason?.number ?? 1,
      episode: firstSeason?.episodes[0]?.number ?? 1,
    };
  }, [show.seasons, initialSeason, initialEpisode]);

  const [state, setState] = useState(getValidInitialState);

  // Get current season and episode data
  const currentSeason = useMemo(
    () => show.seasons.find((s) => s.number === state.season),
    [show.seasons, state.season],
  );

  const currentEpisode = useMemo(
    () => currentSeason?.episodes.find((e) => e.number === state.episode),
    [currentSeason, state.episode],
  );

  // Update URL without navigation (shallow routing)
  const updateUrl = useCallback(
    (season: number, episode: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("s", String(season));
      params.set("e", String(episode));
      router.replace(`/tv/${show.id}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, show.id],
  );

  // Handle episode change
  const handleEpisodeChange = useCallback(
    (season: number, episode: number) => {
      setState({ season, episode });
      updateUrl(season, episode);
    },
    [updateUrl],
  );

  // Format metadata
  const runtime = formatRuntime(currentEpisode?.runtime);
  const airDate = currentEpisode?.airDate
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
        new Date(currentEpisode.airDate),
      )
    : undefined;

  const episodeLabel = `S${state.season}:E${state.episode}`;

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{show.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <MediaDetailLayout
        poster={<MediaPoster src={show.posterUrl} title={show.name} priority />}
      >
        <MediaHeader
          badgeLabel="Series"
          title={show.name}
          metadata={[episodeLabel, runtime, airDate]}
          genres={show.genres}
          rating={show.rating}
          voteCount={show.voteCount}
        />

        <MediaMenu mediaId={show.id} mediaType="tv" layout="button" />

        <MediaOverview>
          {currentEpisode?.overview || show.overview}
        </MediaOverview>

        <Player
          key={`${state.season}-${state.episode}`}
          kind="tv"
          tmdbId={show.id}
          season={state.season}
          episode={state.episode}
          title={`${show.name} - ${currentEpisode?.name ?? `Episode ${state.episode}`}`}
        />

        {show.seasons.length > 0 && currentSeason && (
          <EpisodeSelector
            seasons={show.seasons}
            currentSeason={state.season}
            currentEpisode={state.episode}
            onEpisodeChange={handleEpisodeChange}
          />
        )}
      </MediaDetailLayout>
    </div>
  );
}

