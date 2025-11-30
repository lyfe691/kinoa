import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTvShowWithSeasons } from "@/lib/tmdb";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import { TvShowClient } from "./_components/tv-show-client";

const truncate = (value: string, max = 160) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

type TvPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ s?: string; e?: string }>;
};

export async function generateMetadata({
  params,
}: TvPageProps): Promise<Metadata> {
  const { id } = await params;
  const show = await getTvShowWithSeasons(id).catch(() => null);

  if (!show) {
    return {
      title: "Show unavailable",
      description: "We could not load this show right now.",
    };
  }

  const description = show.overview
    ? truncate(show.overview)
    : "Stream this series on Kinoa.";
  const canonical = absoluteUrl(`/tv/${show.id}`);
  const socialImage = show.posterUrl ?? show.backdropUrl ?? undefined;

  return {
    title: show.name,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: show.name,
      description,
      type: "video.tv_show",
      siteName: siteConfig.name,
      url: canonical,
      images: socialImage
        ? [
            {
              url: socialImage,
              width: 500,
              height: 750,
              alt: show.name,
            },
          ]
        : [
            {
              url: absoluteUrl("/opengraph-image"),
              width: 1200,
              height: 630,
              alt: show.name,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: show.name,
      description,
      images: [socialImage ?? absoluteUrl("/opengraph-image")],
    },
  };
}

export default async function TvPage({ params, searchParams }: TvPageProps) {
  const { id } = await params;
  const { s, e } = await searchParams;

  const show = await getTvShowWithSeasons(id).catch(() => null);

  if (!show) {
    notFound();
  }

  // Parse initial season/episode from URL params
  const initialSeason = s ? parseInt(s, 10) : 1;
  const initialEpisode = e ? parseInt(e, 10) : 1;

  return (
    <TvShowClient
      show={show}
      initialSeason={initialSeason}
      initialEpisode={initialEpisode}
    />
  );
}
