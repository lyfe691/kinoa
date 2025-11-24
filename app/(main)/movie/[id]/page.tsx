import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Player } from "@/components/player";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StructuredData } from "@/components/structured-data";
import { getMovieDetails } from "@/lib/tmdb";
import { formatRuntime } from "@/lib/format-runtime";
import {
  MediaDetailLayout,
  MediaHeader,
  MediaOverview,
  MediaPoster,
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
            <BreadcrumbPage>{movie.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <MediaDetailLayout
        poster={
          <MediaPoster src={movie.posterUrl} title={movie.title} priority />
        }
      >
        <MediaHeader
          badgeLabel="Movie"
          title={movie.title}
          metadata={[releaseYear, runtime]}
          genres={movie.genres}
          rating={movie.rating}
          voteCount={movie.voteCount}
        />

        <div className="flex flex-wrap items-center gap-3">
          <MediaMenu
            mediaId={movie.id}
            mediaType="movie"
            layout="button"
            className="w-full justify-center sm:w-auto"
          />
          <p className="text-sm text-muted-foreground">
            Save this movie to revisit it anytime.
          </p>
        </div>

        <MediaOverview>{movie.overview}</MediaOverview>

        <Player
          kind="movie"
          imdbId={movie.imdbId}
          tmdbId={movie.id}
          title={movie.title}
        />
      </MediaDetailLayout>
      <StructuredData data={movieJsonLd} />
    </div>
  );
}
