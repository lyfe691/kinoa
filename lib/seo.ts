import type { MovieDetails, TvEpisodeDetails } from "@/lib/tmdb";

const FALLBACK_SITE_URL = "https://kinoa.lol";

function normalizeSiteUrl(url?: string) {
  if (!url) {
    return FALLBACK_SITE_URL;
  }

  try {
    const normalized = new URL(url);
    return normalized.origin;
  } catch {
    try {
      const normalized = new URL(`https://${url}`);
      return normalized.origin;
    } catch {
      return FALLBACK_SITE_URL;
    }
  }
}

const resolvedSiteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const siteConfig = {
  name: "Kinoa",
  shortName: "Kinoa",
  tagline: "Kinoa — The cinema experience, at home",
  description:
    "Kinoa lets you watch the newest movies and TV episodes online for free. Stream instantly with no subscriptions and no limits.",
  keywords: [
    "kinoa",
    "kinoa streaming",
    "watch movies online",
    "watch tv shows online",
    "stream movies free",
    "free movie streaming platform",
    "free tv streaming",
    "watch movies online free",
    "latest movies online",
    "free streaming site",
  ],
  locale: "en_US",
  url: resolvedSiteUrl,
  themeColor: "#04060A",
  accentColor: "#16A085",
  publisher: "Kinoa",
};

const baseUrl = `${siteConfig.url}/`;

export function absoluteUrl(path = "/") {
  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return `${siteConfig.url}${path.startsWith("/") ? "" : "/"}${path}`;
  }
}

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/favicon.ico"),
    },
  },
};

const WEB_PLATFORMS = [
  "http://schema.org/DesktopWebPlatform",
  "http://schema.org/MobileWebPlatform",
];

export function buildMovieJsonLd(movie: MovieDetails) {
  const images = (
    [movie.posterUrl, movie.backdropUrl] as Array<string | null>
  ).filter((image): image is string => Boolean(image));

  const hasRuntime = typeof movie.runtime === "number" && movie.runtime > 0;
  const hasRating =
    typeof movie.rating === "number" && typeof movie.voteCount === "number";

  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    url: absoluteUrl(`/movie/${movie.id}`),
    image: images.length ? images : undefined,
    datePublished: movie.releaseDate,
    genre: movie.genres,
    duration: hasRuntime ? `PT${Math.max(movie.runtime ?? 0, 0)}M` : undefined,
    sameAs: movie.imdbId
      ? `https://www.imdb.com/title/${movie.imdbId}`
      : undefined,
    aggregateRating: hasRating
      ? {
          "@type": "AggregateRating",
          ratingValue: Number((movie.rating ?? 0).toFixed(1)),
          ratingCount: movie.voteCount,
        }
      : undefined,
    potentialAction: {
      "@type": "WatchAction",
      target: absoluteUrl(`/movie/${movie.id}`),
      actionPlatform: WEB_PLATFORMS,
    },
  };
}

export function buildEpisodeJsonLd(details: TvEpisodeDetails) {
  const episode = details.episode;
  const imageCandidates = (
    [episode.stillUrl, details.backdropUrl, details.posterUrl] as Array<
      string | null
    >
  ).filter((image): image is string => Boolean(image));
  const hasRuntime = typeof episode.runtime === "number" && episode.runtime > 0;
  const hasRating =
    typeof details.rating === "number" && typeof details.voteCount === "number";

  return {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    name: episode.name || `Episode ${episode.number}`,
    episodeNumber: episode.number,
    seasonNumber: episode.season,
    description: episode.overview || details.overview,
    image: imageCandidates.length ? imageCandidates : undefined,
    url: absoluteUrl(
      `/tv/${details.showId}/${episode.season}/${episode.number}`,
    ),
    datePublished: episode.airDate,
    duration: hasRuntime
      ? `PT${Math.max(episode.runtime ?? 0, 0)}M`
      : undefined,
    partOfSeries: {
      "@type": "TVSeries",
      name: details.showName,
      url: absoluteUrl(`/tv/${details.showId}`),
      genre: details.genres,
      sameAs: details.imdbId
        ? `https://www.imdb.com/title/${details.imdbId}`
        : undefined,
    },
    potentialAction: {
      "@type": "WatchAction",
      target: absoluteUrl(
        `/tv/${details.showId}/${episode.season}/${episode.number}`,
      ),
      actionPlatform: WEB_PLATFORMS,
    },
    aggregateRating: hasRating
      ? {
          "@type": "AggregateRating",
          ratingValue: Number((details.rating ?? 0).toFixed(1)),
          ratingCount: details.voteCount,
        }
      : undefined,
  };
}
