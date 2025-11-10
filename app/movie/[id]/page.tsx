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
import { formatRuntime, getMovieDetails } from "@/lib/tmdb";
import {
  MediaDetailLayout,
  MediaHeader,
  MediaOverview,
  MediaPoster,
} from "@/components/media-detail";

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
      title: "Movie unavailable • Kinoa",
      description: "We could not load this movie right now.",
    };
  }

  const description = movie.overview
    ? truncate(movie.overview)
    : "Stream this title on Kinoa.";

  return {
    title: `${movie.title} • Kinoa`,
    description,
    openGraph: {
      title: `${movie.title} • Kinoa`,
      description,
      type: "video.movie",
      siteName: "Kinoa",
      images: movie.posterUrl
        ? [
            {
              url: movie.posterUrl,
              width: 500,
              height: 750,
              alt: movie.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title} • Kinoa`,
      description,
      images: movie.posterUrl ? [movie.posterUrl] : undefined,
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

        <MediaOverview>{movie.overview}</MediaOverview>

        <Player kind="movie" imdbId={movie.imdbId} title={movie.title} />
      </MediaDetailLayout>
    </div>
  );
}
