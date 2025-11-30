import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Player } from "@/components/player";
import { StructuredData } from "@/components/structured-data";
import { getMovieDetails } from "@/lib/tmdb";
import { formatRuntime } from "@/lib/format-runtime";
import {
  MediaHero,
  MediaContent,
  MediaSection,
} from "@/components/media-detail";
import { absoluteUrl, buildMovieJsonLd } from "@/lib/seo";
import { MediaMenu } from "@/components/media-menu";

const truncate = (value: string, max = 160) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

type MoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(id).catch(() => null);

  if (!movie) {
    return {
      title: "Movie unavailable",
      description: "We could not load this movie right now.",
    };
  }

  const description = movie.overview
    ? truncate(movie.overview)
    : "Stream this title on Kinoa.";
  const canonical = absoluteUrl(`/movie/${movie.id}`);
  const socialImage = movie.posterUrl ?? movie.backdropUrl ?? undefined;

  return {
    title: movie.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: movie.title,
      description,
      type: "video.movie",
      siteName: "Kinoa",
      url: canonical,
      releaseDate: movie.releaseDate,
      images: socialImage
        ? [
            {
              url: socialImage,
              width: 1200,
              height: 630,
              alt: movie.title,
            },
          ]
        : [
            {
              url: absoluteUrl("/opengraph-image"),
              width: 1200,
              height: 630,
              alt: movie.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description,
      images: [socialImage ?? absoluteUrl("/opengraph-image")],
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = await getMovieDetails(id).catch(() => null);

  if (!movie) {
    notFound();
  }

  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear().toString()
    : undefined;
  const runtime = formatRuntime(movie.runtime);
  const movieJsonLd = buildMovieJsonLd(movie);

  return (
    <div>
      <MediaHero
        type="movie"
        title={movie.title}
        backdropUrl={movie.backdropUrl}
        posterUrl={movie.posterUrl}
        rating={movie.rating}
        voteCount={movie.voteCount}
        releaseYear={releaseYear}
        runtime={runtime}
        genres={movie.genres}
      >
        <MediaMenu mediaId={movie.id} mediaType="movie" layout="button" />
      </MediaHero>

      <MediaContent>
        {movie.overview && (
          <MediaSection title="Overview">
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              {movie.overview}
            </p>
          </MediaSection>
        )}

        <MediaSection title="Watch Now">
          <Player
            kind="movie"
            imdbId={movie.imdbId}
            tmdbId={movie.id}
            title={movie.title}
          />
        </MediaSection>
      </MediaContent>

      <StructuredData data={movieJsonLd} />
    </div>
  );
}
