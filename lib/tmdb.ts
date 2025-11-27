import { cache } from "react";
import { ensureImdbId } from "./imdb";

const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const POSTER_SIZE = "w500";
const BACKDROP_SIZE = "w1280";
const BACKDROP_SIZE_LARGE = "original";

const CACHE_REVALIDATE = {
  short: 5 * 60,
  medium: 60 * 60,
  long: 6 * 3600,
  day: 24 * 3600,
};

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

function ensureApiKey() {
  if (!apiKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_TMDB_API_KEY. Add it to your environment to enable data fetching.",
    );
  }
}

type FetchParams = Record<string, string | number | undefined>;

async function tmdbFetch<T>(
  path: string,
  params: FetchParams = {},
  revalidate = CACHE_REVALIDATE.medium,
) {
  ensureApiKey();

  const url = new URL(`${API_BASE_URL}${path}`);
  url.searchParams.set("api_key", apiKey!);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString(), {
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

function buildImage(path: string | null | undefined, size: string) {
  if (!path) {
    return null;
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

type TmdbTrendingItem = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
};

type TmdbTrendingResponse = {
  results: TmdbTrendingItem[];
};

type TmdbSearchResult = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
};

type TmdbSearchResponse = {
  results: TmdbSearchResult[];
};

export type MediaSummary = {
  id: number;
  type: "movie" | "tv";
  name: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseYear?: string;
  href: string;
  imdbId?: string | null;
  runtime?: number | null;
  seasonCount?: number;
  episodeCount?: number;
  rating?: number;
  voteCount?: number;
};

export type MediaPreview = {
  id: number;
  type: "movie" | "tv";
  name: string;
  posterUrl: string | null;
  releaseYear?: string;
  href: string;
  rating?: number;
};

export async function getTrending(): Promise<MediaSummary[]> {
  const data = await tmdbFetch<TmdbTrendingResponse>(
    "/trending/all/week",
    {
      language: "en-US",
    },
    CACHE_REVALIDATE.medium,
  );

  const summaries = data.results
    .filter(
      (item): item is TmdbTrendingItem & { media_type: "movie" | "tv" } =>
        item.media_type === "movie" || item.media_type === "tv",
    )
    .slice(0, 15) // trending usually shows less than 20 and above 15, 15 looks good.
    .map((item) => {
      const type = item.media_type;
      const releaseDate =
        type === "movie" ? item.release_date : item.first_air_date;
      const name = type === "movie" ? (item.title ?? "") : (item.name ?? "");

      return {
        id: item.id,
        type,
        name,
        overview: item.overview,
        posterUrl: buildImage(item.poster_path, POSTER_SIZE),
        backdropUrl: buildImage(item.backdrop_path, BACKDROP_SIZE),
        releaseYear: releaseDate
          ? new Date(releaseDate).getFullYear().toString()
          : undefined,
        href: type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`,
        imdbId: null,
        rating: item.vote_average,
        voteCount: item.vote_count,
      };
    });

  return enrichMediaSummaries(summaries);
}

// Lists
type TmdbMovieListItem = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
};

type TmdbTvListItem = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
};

type TmdbListResponse<T> = {
  results: T[];
};

function mapMovieList(items: TmdbMovieListItem[]): MediaSummary[] {
  return items.slice(0, 20).map((item) => {
    const releaseYear = item.release_date
      ? new Date(item.release_date).getFullYear().toString()
      : undefined;

    return {
      id: item.id,
      type: "movie" as const,
      name: item.title,
      overview: item.overview,
      posterUrl: buildImage(item.poster_path, POSTER_SIZE),
      backdropUrl: buildImage(item.backdrop_path, BACKDROP_SIZE),
      releaseYear,
      href: `/movie/${item.id}`,
      imdbId: null,
      rating: item.vote_average,
      voteCount: item.vote_count,
    };
  });
}

function mapTvList(items: TmdbTvListItem[]): MediaSummary[] {
  return items.slice(0, 20).map((item) => {
    const releaseYear = item.first_air_date
      ? new Date(item.first_air_date).getFullYear().toString()
      : undefined;

    return {
      id: item.id,
      type: "tv" as const,
      name: item.name,
      overview: item.overview,
      posterUrl: buildImage(item.poster_path, POSTER_SIZE),
      backdropUrl: buildImage(item.backdrop_path, BACKDROP_SIZE),
      releaseYear,
      href: `/tv/${item.id}`,
      imdbId: null,
      rating: item.vote_average,
      voteCount: item.vote_count,
    };
  });
}

export async function getLatestMovies(): Promise<MediaSummary[]> {
  const data = await tmdbFetch<TmdbListResponse<TmdbMovieListItem>>(
    "/movie/now_playing",
    {
      language: "en-US",
      region: "US",
    },
    CACHE_REVALIDATE.medium,
  );
  return enrichMediaSummaries(mapMovieList(data.results));
}

export async function getLatestTvShows(): Promise<MediaSummary[]> {
  const data = await tmdbFetch<TmdbListResponse<TmdbTvListItem>>(
    "/tv/on_the_air",
    {
      language: "en-US",
    },
    CACHE_REVALIDATE.medium,
  );
  return enrichMediaSummaries(mapTvList(data.results));
}

export async function getTopRatedMovies(): Promise<MediaSummary[]> {
  const data = await tmdbFetch<TmdbListResponse<TmdbMovieListItem>>(
    "/movie/top_rated",
    {
      language: "en-US",
    },
    CACHE_REVALIDATE.day,
  );
  return enrichMediaSummaries(mapMovieList(data.results));
}

// Genres
type TmdbGenresResponse = {
  genres: { id: number; name: string }[];
};

export const getMovieGenres = cache(
  async (): Promise<{ id: number; name: string }[]> => {
    const data = await tmdbFetch<TmdbGenresResponse>(
      "/genre/movie/list",
      { language: "en-US" },
      CACHE_REVALIDATE.day,
    );
    return data.genres ?? [];
  },
);

export const getTvGenres = cache(
  async (): Promise<{ id: number; name: string }[]> => {
    const data = await tmdbFetch<TmdbGenresResponse>(
      "/genre/tv/list",
      { language: "en-US" },
      CACHE_REVALIDATE.day,
    );
    return data.genres ?? [];
  },
);

// Discover
type DiscoverParams = {
  with_genres?: string;
  sort_by?: string;
  primary_release_year?: string;
  first_air_date_year?: string;
  page?: number;
  vote_count_gte?: number;
};

export async function discoverMovies(
  params: DiscoverParams = {},
): Promise<MediaSummary[]> {
  const data = await tmdbFetch<TmdbListResponse<TmdbMovieListItem>>(
    "/discover/movie",
    {
      language: "en-US",
      include_adult: "false",
      include_video: "false",
      ...params,
    },
    CACHE_REVALIDATE.medium,
  );
  return enrichMediaSummaries(mapMovieList(data.results));
}

export async function discoverTv(
  params: DiscoverParams = {},
): Promise<MediaSummary[]> {
  const data = await tmdbFetch<TmdbListResponse<TmdbTvListItem>>(
    "/discover/tv",
    {
      language: "en-US",
      include_adult: "false",
      ...params,
    },
    CACHE_REVALIDATE.medium,
  );
  return enrichMediaSummaries(mapTvList(data.results));
}

export async function searchTitles(query: string): Promise<MediaSummary[]> {
  if (!query.trim()) {
    return [];
  }

  const data = await tmdbFetch<TmdbSearchResponse>(
    "/search/multi",
    { language: "en-US", query: query.trim(), include_adult: "false" },
    CACHE_REVALIDATE.short,
  );

  const summaries = data.results
    .filter(
      (item): item is TmdbSearchResult & { media_type: "movie" | "tv" } => {
        return (
          (item.media_type === "movie" || item.media_type === "tv") &&
          !!(item.title ?? item.name)
        );
      },
    )
    .slice(0, 20)
    .map((item) => {
      const type = item.media_type;
      const releaseDate =
        type === "movie" ? item.release_date : item.first_air_date;
      const name = type === "movie" ? (item.title ?? "") : (item.name ?? "");

      return {
        id: item.id,
        type,
        name,
        overview: item.overview,
        posterUrl: buildImage(item.poster_path, POSTER_SIZE),
        backdropUrl: buildImage(item.backdrop_path, BACKDROP_SIZE),
        releaseYear: releaseDate
          ? new Date(releaseDate).getFullYear().toString()
          : undefined,
        href: type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`,
        imdbId: null,
        rating: item.vote_average,
        voteCount: item.vote_count,
      };
    });

  return enrichMediaSummaries(summaries);
}

export async function searchPreviews(query: string): Promise<MediaPreview[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const data = await tmdbFetch<TmdbSearchResponse>(
    "/search/multi",
    { language: "en-US", query: trimmed, include_adult: "false" },
    CACHE_REVALIDATE.short,
  );

  return data.results
    .filter(
      (item): item is TmdbSearchResult & { media_type: "movie" | "tv" } => {
        return (
          (item.media_type === "movie" || item.media_type === "tv") &&
          !!(item.title ?? item.name)
        );
      },
    )
    .slice(0, 8)
    .map((item) => {
      const type = item.media_type;
      const releaseDate =
        type === "movie" ? item.release_date : item.first_air_date;
      const name = type === "movie" ? (item.title ?? "") : (item.name ?? "");

      return {
        id: item.id,
        type,
        name,
        posterUrl: buildImage(item.poster_path, POSTER_SIZE),
        releaseYear: releaseDate
          ? new Date(releaseDate).getFullYear().toString()
          : undefined,
        href: type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`,
        rating: item.vote_average,
      };
    });
}

type TmdbMovieResponse = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  runtime: number | null;
  genres: { id: number; name: string }[];
  imdb_id: string | null;
  vote_average?: number;
  vote_count?: number;
};

export type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate?: string;
  runtime?: number | null;
  genres: string[];
  imdbId: string | null;
  rating?: number;
  voteCount?: number;
};

export async function getMovieDetails(id: string): Promise<MovieDetails> {
  const movie = await tmdbFetch<TmdbMovieResponse>(
    `/movie/${id}`,
    {
      language: "en-US",
    },
    CACHE_REVALIDATE.long,
  );

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear().toString()
    : undefined;

  const imdbId = await ensureImdbId({
    imdbId: movie.imdb_id,
    title: movie.title,
    year: releaseYear,
    type: "movie",
  });

  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterUrl: buildImage(movie.poster_path, POSTER_SIZE),
    backdropUrl: buildImage(movie.backdrop_path, BACKDROP_SIZE_LARGE),
    releaseDate: movie.release_date ?? undefined,
    runtime: movie.runtime,
    genres: movie.genres.map((genre) => genre.name),
    imdbId,
    rating: movie.vote_average,
    voteCount: movie.vote_count,
  };
}

type TmdbTvResponse = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string | null;
  genres: { id: number; name: string }[];
  number_of_seasons: number;
  number_of_episodes: number;
  vote_average?: number;
  vote_count?: number;
  seasons: {
    id: number;
    name: string;
    season_number: number;
    episode_count: number | null;
  }[];
};

type TmdbEpisodeResponse = {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string | null;
  runtime: number | null;
};

type TmdbSeasonResponse = {
  episodes: {
    id: number;
    name: string;
    overview: string;
    episode_number: number;
    still_path: string | null;
    air_date: string | null;
    runtime: number | null;
  }[];
};

const getTvShowCached = cache(async (id: string) =>
  tmdbFetch<TmdbTvResponse>(
    `/tv/${id}`,
    { language: "en-US" },
    CACHE_REVALIDATE.day,
  ),
);

const getTvSeasonCached = cache(async (id: string, season: string) =>
  tmdbFetch<TmdbSeasonResponse>(
    `/tv/${id}/season/${season}`,
    { language: "en-US" },
    CACHE_REVALIDATE.day,
  ),
);

const getTvEpisodeCached = cache(
  async (id: string, season: string, episode: string) =>
    tmdbFetch<TmdbEpisodeResponse>(
      `/tv/${id}/season/${season}/episode/${episode}`,
      { language: "en-US" },
      CACHE_REVALIDATE.long,
    ),
);

export type TvEpisodeDetails = {
  showId: number;
  showName: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  genres: string[];
  imdbId?: string | null;
  rating?: number;
  voteCount?: number;
  seasons: {
    number: number;
    name: string;
    episodeCount: number;
  }[];
  allEpisodes: Record<number, { number: number; name: string }[]>;
  episode: {
    id: number;
    name: string;
    overview: string;
    stillUrl: string | null;
    airDate?: string;
    runtime?: number | null;
    season: number;
    number: number;
  };
};

export type TvShowDetails = {
  id: number;
  name: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  genres: string[];
  seasonCount: number;
  episodeCount: number;
  rating?: number;
  voteCount?: number;
  imdbId: string | null;
};

export type TvEpisode = {
  id: number;
  number: number;
  name: string;
  overview: string;
  stillUrl: string | null;
  airDate?: string;
  runtime?: number | null;
};

export type TvSeason = {
  number: number;
  name: string;
  episodes: TvEpisode[];
};

export type TvShowPageData = {
  id: number;
  name: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  genres: string[];
  rating?: number;
  voteCount?: number;
  imdbId: string | null;
  firstAirDate?: string;
  seasons: TvSeason[];
};

export async function getTvShow(id: string): Promise<TvShowDetails> {
  const show = await getTvShowCached(id);

  const firstAirYear = show.first_air_date
    ? new Date(show.first_air_date).getFullYear().toString()
    : undefined;

  const imdbId = await ensureImdbId({
    imdbId: undefined,
    title: show.name,
    year: firstAirYear,
    type: "series",
  });

  return {
    id: show.id,
    name: show.name,
    overview: show.overview,
    posterUrl: buildImage(show.poster_path, POSTER_SIZE),
    backdropUrl: buildImage(show.backdrop_path, BACKDROP_SIZE),
    genres: show.genres.map((genre) => genre.name),
    seasonCount: show.number_of_seasons,
    episodeCount: show.number_of_episodes,
    rating: show.vote_average,
    voteCount: show.vote_count,
    imdbId,
  };
}

export async function getTvShowWithSeasons(id: string): Promise<TvShowPageData> {
  const show = await getTvShowCached(id);

  const firstAirYear = show.first_air_date
    ? new Date(show.first_air_date).getFullYear().toString()
    : undefined;

  const imdbId = await ensureImdbId({
    imdbId: undefined,
    title: show.name,
    year: firstAirYear,
    type: "series",
  });

  // Filter to only real seasons (not specials which are season 0)
  const seasonNumbers = (show.seasons ?? [])
    .filter((s) => s.season_number > 0)
    .map((s) => s.season_number);

  // Fetch all seasons in parallel
  const seasonDataPromises = seasonNumbers.map(async (seasonNum) => {
    const seasonData = await getTvSeasonCached(id, String(seasonNum));
    const seasonInfo = show.seasons.find((s) => s.season_number === seasonNum);

    return {
      number: seasonNum,
      name: seasonInfo?.name || `Season ${seasonNum}`,
      episodes: seasonData.episodes.map((ep) => ({
        id: ep.id,
        number: ep.episode_number,
        name: ep.name || `Episode ${ep.episode_number}`,
        overview: ep.overview || "",
        stillUrl: buildImage(ep.still_path, BACKDROP_SIZE),
        airDate: ep.air_date ?? undefined,
        runtime: ep.runtime,
      })),
    };
  });

  const seasons = await Promise.all(seasonDataPromises);

  return {
    id: show.id,
    name: show.name,
    overview: show.overview,
    posterUrl: buildImage(show.poster_path, POSTER_SIZE),
    backdropUrl: buildImage(show.backdrop_path, BACKDROP_SIZE_LARGE),
    genres: show.genres.map((genre) => genre.name),
    rating: show.vote_average,
    voteCount: show.vote_count,
    imdbId,
    firstAirDate: show.first_air_date ?? undefined,
    seasons,
  };
}

export async function getTvEpisodeDetails(
  id: string,
  season: string,
  episode: string,
): Promise<TvEpisodeDetails> {
  const [show, seasonDetails, episodeDetails] = await Promise.all([
    getTvShowCached(id),
    getTvSeasonCached(id, season),
    getTvEpisodeCached(id, season, episode),
  ]);

  const firstAirYear = show.first_air_date
    ? new Date(show.first_air_date).getFullYear().toString()
    : undefined;

  const imdbId = await ensureImdbId({
    imdbId: undefined,
    title: show.name,
    year: firstAirYear,
    type: "series",
  });

  const seasons = (show.seasons ?? [])
    .filter((seasonInfo) => seasonInfo.season_number > 0)
    .map((seasonInfo) => ({
      number: seasonInfo.season_number,
      name: seasonInfo.name || `Season ${seasonInfo.season_number}`,
      episodeCount: seasonInfo.episode_count ?? 0,
    }));

  const allEpisodes: Record<number, { number: number; name: string }[]> = {
    [Number(season)]: seasonDetails.episodes.map((ep) => ({
      number: ep.episode_number,
      name: ep.name || `Episode ${ep.episode_number}`,
    })),
  };

  return {
    showId: show.id,
    showName: show.name,
    overview: show.overview,
    posterUrl: buildImage(show.poster_path, POSTER_SIZE),
    backdropUrl: buildImage(show.backdrop_path, BACKDROP_SIZE),
    genres: show.genres.map((genre) => genre.name),
    imdbId,
    rating: show.vote_average,
    voteCount: show.vote_count,
    seasons,
    allEpisodes,
    episode: {
      id: episodeDetails.id,
      name: episodeDetails.name,
      overview: episodeDetails.overview,
      stillUrl: buildImage(episodeDetails.still_path, BACKDROP_SIZE),
      airDate: episodeDetails.air_date ?? undefined,
      runtime: episodeDetails.runtime,
      season: Number(season),
      number: Number(episode),
    },
  };
}

async function enrichMediaSummaries(
  items: MediaSummary[],
): Promise<MediaSummary[]> {
  // Limit expensive detail lookups to the first few items so we stay under TMDB rate limits.
  const ENRICH_LIMIT = 4;

  const enriched = await Promise.all(
    items.map(async (item, index) => {
      if (index >= ENRICH_LIMIT) {
        if (item.type === "movie") {
          const imdbId = await ensureImdbId({
            imdbId: item.imdbId,
            title: item.name,
            year: item.releaseYear,
            type: "movie",
          });
          return {
            ...item,
            imdbId: imdbId ?? item.imdbId ?? null,
          };
        }

        const seriesImdbId = await ensureImdbId({
          imdbId: item.imdbId,
          title: item.name,
          year: item.releaseYear,
          type: "series",
        });

        return {
          ...item,
          imdbId: seriesImdbId ?? item.imdbId ?? null,
        };
      }

      if (item.type === "movie") {
        try {
          const details = await tmdbFetch<TmdbMovieResponse>(
            `/movie/${item.id}`,
            { language: "en-US" },
            CACHE_REVALIDATE.long,
          );

          const runtime =
            details.runtime && details.runtime > 0
              ? details.runtime
              : item.runtime;
          const releaseYear =
            details.release_date && details.release_date.length >= 4
              ? new Date(details.release_date).getFullYear().toString()
              : item.releaseYear;
          const imdbId = await ensureImdbId({
            imdbId: details.imdb_id ?? item.imdbId,
            title: details.title,
            year: releaseYear,
            type: "movie",
          });

          return {
            ...item,
            runtime,
            imdbId: imdbId ?? item.imdbId ?? null,
          };
        } catch {
          const imdbId = await ensureImdbId({
            imdbId: item.imdbId,
            title: item.name,
            year: item.releaseYear,
            type: "movie",
          });

          return {
            ...item,
            imdbId: imdbId ?? item.imdbId ?? null,
          };
        }
      }

      const hasSeasonInfo = item.seasonCount && item.seasonCount > 0;
      const hasEpisodeInfo = item.episodeCount && item.episodeCount > 0;

      const fallbackImdbId = await ensureImdbId({
        imdbId: item.imdbId,
        title: item.name,
        year: item.releaseYear,
        type: "series",
      });

      if (hasSeasonInfo && hasEpisodeInfo) {
        return {
          ...item,
          imdbId: fallbackImdbId ?? item.imdbId ?? null,
        };
      }

      try {
        const details = await tmdbFetch<TmdbTvResponse>(
          `/tv/${item.id}`,
          { language: "en-US" },
          CACHE_REVALIDATE.day,
        );

        const seasonCount =
          details.number_of_seasons && details.number_of_seasons > 0
            ? details.number_of_seasons
            : item.seasonCount;
        const episodeCount =
          details.number_of_episodes && details.number_of_episodes > 0
            ? details.number_of_episodes
            : item.episodeCount;
        const releaseYear =
          details.first_air_date && details.first_air_date.length >= 4
            ? new Date(details.first_air_date).getFullYear().toString()
            : item.releaseYear;
        const imdbId = await ensureImdbId({
          imdbId: item.imdbId,
          title: details.name,
          year: releaseYear,
          type: "series",
        });

        return {
          ...item,
          seasonCount,
          episodeCount,
          imdbId: imdbId ?? fallbackImdbId ?? item.imdbId ?? null,
        };
      } catch {
        return {
          ...item,
          imdbId: fallbackImdbId ?? item.imdbId ?? null,
        };
      }
    }),
  );

  return enriched;
}

export { formatRuntime } from "./format-runtime";

/**
 * Fetches backdrop images for the auth branding panel.
 * Returns an array of image URLs from trending movies/shows.
 */
export async function getAuthBrandingImages(): Promise<string[]> {
  const [page1, page2, page3] = await Promise.all([
    tmdbFetch<TmdbTrendingResponse>(
      "/trending/all/week",
      { language: "en-US", page: 1 },
      CACHE_REVALIDATE.long,
    ),
    tmdbFetch<TmdbTrendingResponse>(
      "/trending/all/week",
      { language: "en-US", page: 2 },
      CACHE_REVALIDATE.long,
    ),
    tmdbFetch<TmdbTrendingResponse>(
      "/trending/all/week",
      { language: "en-US", page: 3 },
      CACHE_REVALIDATE.long,
    ),
  ]);

  const allResults = [...page1.results, ...page2.results, ...page3.results];

  return (
    allResults
      .filter(
        (item): item is TmdbTrendingItem & { backdrop_path: string } =>
          item.backdrop_path !== null,
      )
      // Remove duplicates based on ID
      .filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.id === item.id),
      )
      .slice(0, 60) // Increase to 60 images (15 per column)
      .map((item) => buildImage(item.backdrop_path, BACKDROP_SIZE)!)
  );
}
