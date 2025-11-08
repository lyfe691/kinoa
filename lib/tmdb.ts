const API_BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const POSTER_SIZE = 'w500'
const BACKDROP_SIZE = 'w780'

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

function ensureApiKey() {
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_TMDB_API_KEY. Add it to your environment to enable data fetching.')
  }
}

type FetchParams = Record<string, string | number | undefined>

async function tmdbFetch<T>(path: string, params: FetchParams = {}, revalidate = 3600) {
  ensureApiKey()

  const url = new URL(`${API_BASE_URL}${path}`)
  url.searchParams.set('api_key', apiKey!)

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }
    url.searchParams.set(key, String(value))
  })

  const response = await fetch(url.toString(), {
    next: { revalidate },
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

function buildImage(path: string | null | undefined, size: string) {
  if (!path) {
    return null
  }
  return `${IMAGE_BASE_URL}/${size}${path}`
}

type TmdbTrendingItem = {
  id: number
  media_type: 'movie' | 'tv' | 'person'
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
}

type TmdbTrendingResponse = {
  results: TmdbTrendingItem[]
}

type TmdbSearchResult = {
  id: number
  media_type: 'movie' | 'tv' | 'person'
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
}

type TmdbSearchResponse = {
  results: TmdbSearchResult[]
}

export type MediaSummary = {
  id: number
  type: 'movie' | 'tv'
  name: string
  overview: string
  posterUrl: string | null
  backdropUrl: string | null
  releaseYear?: string
  href: string
}

export async function getTrending(): Promise<MediaSummary[]> {
  const data = await tmdbFetch<TmdbTrendingResponse>('/trending/all/week', {
    language: 'en-US',
  })

  return data.results
    .filter((item): item is TmdbTrendingItem & { media_type: 'movie' | 'tv' } => item.media_type === 'movie' || item.media_type === 'tv')
    .slice(0, 12)
    .map((item) => {
      const type = item.media_type
      const releaseDate = type === 'movie' ? item.release_date : item.first_air_date
      const name = type === 'movie' ? item.title ?? '' : item.name ?? ''

      return {
        id: item.id,
        type,
        name,
        overview: item.overview,
        posterUrl: buildImage(item.poster_path, POSTER_SIZE),
        backdropUrl: buildImage(item.backdrop_path, BACKDROP_SIZE),
        releaseYear: releaseDate ? new Date(releaseDate).getFullYear().toString() : undefined,
        href: type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}/1/1`,
      }
    })
}

export async function searchTitles(query: string): Promise<MediaSummary[]> {
  if (!query.trim()) {
    return []
  }

  const data = await tmdbFetch<TmdbSearchResponse>(
    '/search/multi',
    { language: 'en-US', query: query.trim(), include_adult: 'false' },
    300
  )

  return data.results
    .filter((item): item is TmdbSearchResult & { media_type: 'movie' | 'tv' } => {
      return (item.media_type === 'movie' || item.media_type === 'tv') && (item.title || item.name)
    })
    .slice(0, 20)
    .map((item) => {
      const type = item.media_type
      const releaseDate = type === 'movie' ? item.release_date : item.first_air_date
      const name = type === 'movie' ? item.title ?? '' : item.name ?? ''

      return {
        id: item.id,
        type,
        name,
        overview: item.overview,
        posterUrl: buildImage(item.poster_path, POSTER_SIZE),
        backdropUrl: buildImage(item.backdrop_path, BACKDROP_SIZE),
        releaseYear: releaseDate ? new Date(releaseDate).getFullYear().toString() : undefined,
        href: type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}/1/1`,
      }
    })
}

type TmdbMovieResponse = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string | null
  runtime: number | null
  genres: { id: number; name: string }[]
  imdb_id: string | null
}

export type MovieDetails = {
  id: number
  title: string
  overview: string
  posterUrl: string | null
  backdropUrl: string | null
  releaseDate?: string
  runtime?: number | null
  genres: string[]
  imdbId: string | null
}

export async function getMovieDetails(id: string): Promise<MovieDetails> {
  const movie = await tmdbFetch<TmdbMovieResponse>(`/movie/${id}`, {
    language: 'en-US',
  }, 12 * 3600)

  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterUrl: buildImage(movie.poster_path, POSTER_SIZE),
    backdropUrl: buildImage(movie.backdrop_path, BACKDROP_SIZE),
    releaseDate: movie.release_date ?? undefined,
    runtime: movie.runtime,
    genres: movie.genres.map((genre) => genre.name),
    imdbId: movie.imdb_id,
  }
}

type TmdbTvResponse = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  genres: { id: number; name: string }[]
}

type TmdbEpisodeResponse = {
  id: number
  name: string
  overview: string
  still_path: string | null
  air_date: string | null
  runtime: number | null
}

export type TvEpisodeDetails = {
  showId: number
  showName: string
  overview: string
  posterUrl: string | null
  backdropUrl: string | null
  genres: string[]
  episode: {
    id: number
    name: string
    overview: string
    stillUrl: string | null
    airDate?: string
    runtime?: number | null
    season: number
    number: number
  }
}

export async function getTvEpisodeDetails(id: string, season: string, episode: string): Promise<TvEpisodeDetails> {
  const [show, episodeDetails] = await Promise.all([
    tmdbFetch<TmdbTvResponse>(`/tv/${id}`, { language: 'en-US' }, 12 * 3600),
    tmdbFetch<TmdbEpisodeResponse>(`/tv/${id}/season/${season}/episode/${episode}`, { language: 'en-US' }, 6 * 3600),
  ])

  return {
    showId: show.id,
    showName: show.name,
    overview: show.overview,
    posterUrl: buildImage(show.poster_path, POSTER_SIZE),
    backdropUrl: buildImage(show.backdrop_path, BACKDROP_SIZE),
    genres: show.genres.map((genre) => genre.name),
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
  }
}

export function formatRuntime(runtime?: number | null) {
  if (!runtime) {
    return undefined
  }

  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  if (!hours) {
    return `${minutes}m`
  }
  if (!minutes) {
    return `${hours}h`
  }
  return `${hours}h ${minutes}m`
}

