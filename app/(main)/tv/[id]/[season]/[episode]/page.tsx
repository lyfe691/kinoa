import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Player } from "@/components/player";
import { EpisodeNavigator } from "@/components/episode-navigator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StructuredData } from "@/components/structured-data";
import { getTvEpisodeDetails } from "@/lib/tmdb";
import { formatRuntime } from "@/lib/format-runtime";
import {
  MediaDetailLayout,
  MediaHeader,
  MediaOverview,
  MediaPoster,
} from "@/components/media-detail";
import { absoluteUrl, buildEpisodeJsonLd } from "@/lib/seo";
import { MediaMenu } from "@/components/media-menu";

const truncate = (value: string, max = 160) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

type EpisodePageProps = {
  params: Promise<{
    id: string;
    season: string;
    episode: string;
  }>;
};

export async function generateMetadata({
  params,
}: EpisodePageProps): Promise<Metadata> {
  const { id, season, episode } = await params;
  const details = await getTvEpisodeDetails(id, season, episode).catch(
    () => null,
  );

  if (!details) {
    return {
      title: "Episode unavailable",
      description: "We could not load this episode right now.",
    };
  }

  const episodeTitle =
    details.episode.name ||
    `${details.showName} episode ${details.episode.number}`;
  const description = truncate(
    details.episode.overview ||
      details.overview ||
      "Stream this episode on Kinoa.",
  );
  const image =
    details.episode.stillUrl ??
    details.posterUrl ??
    details.backdropUrl ??
    undefined;
  const canonical = absoluteUrl(
    `/tv/${details.showId}/${details.episode.season}/${details.episode.number}`,
  );

  return {
    title: `${episodeTitle} • ${details.showName}`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${episodeTitle} • ${details.showName}`,
      description,
      type: "video.episode",
      siteName: "Kinoa",
      url: canonical,
      images: [
        {
          url: image ?? absoluteUrl("/opengraph-image"),
          width: image ? 1280 : 1200,
          height: image ? 720 : 630,
          alt: episodeTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${episodeTitle} • ${details.showName}`,
      description,
      images: [image ?? absoluteUrl("/opengraph-image")],
    },
  };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { id, season, episode } = await params;
  const details = await getTvEpisodeDetails(id, season, episode).catch(
    () => null,
  );

  if (!details) {
    notFound();
  }

  const runtime = formatRuntime(details.episode.runtime);
  const airDate = details.episode.airDate
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
        new Date(details.episode.airDate),
      )
    : undefined;

  const currentSeasonEpisodes =
    details.allEpisodes[details.episode.season] || [];
  const episodeJsonLd = buildEpisodeJsonLd(details);

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
            <BreadcrumbLink asChild>
              <Link href={`/tv/${details.showId}/1/1`}>{details.showName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              S{details.episode.season}:E{details.episode.number}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <MediaDetailLayout
        poster={
          <MediaPoster
            src={details.posterUrl}
            title={details.showName}
            priority
          />
        }
      >
        <MediaHeader
          badgeLabel="Series"
          title={details.showName}
          metadata={[
            `S${details.episode.season}:E${details.episode.number}`,
            runtime,
            airDate,
          ]}
          genres={details.genres}
          rating={details.rating}
          voteCount={details.voteCount}
        />

        <div className="flex flex-wrap items-center gap-3">
          <MediaMenu
            mediaId={details.showId}
            mediaType="tv"
            layout="button"
            className="w-full justify-center sm:w-auto"
          />
          <p className="text-sm text-muted-foreground">
            Save this series to keep it on your watchlist.
          </p>
        </div>

        <MediaOverview>
          {details.episode.overview || details.overview}
        </MediaOverview>

        <Player
          kind="tv"
          tmdbId={details.showId}
          season={details.episode.season}
          episode={details.episode.number}
          title={`${details.showName} - ${details.episode.name}`}
        />

        {details.seasons.length > 0 && (
          <EpisodeNavigator
            showId={details.showId}
            seasons={details.seasons}
            seasonEpisodes={currentSeasonEpisodes}
            currentSeason={details.episode.season}
            currentEpisode={details.episode.number}
          />
        )}
      </MediaDetailLayout>
      <StructuredData data={episodeJsonLd} />
    </div>
  );
}
