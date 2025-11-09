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
  vote_average?: number
  vote_count?: number
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
  vote_average?: number
  vote_count?: number
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
  runtime?: number | null
  seasonCount?: number
  episodeCount?: number
  rating?: number
  voteCount?: number
}

export async function getTrending(): Promise<MediaSummary[]> {
  const data = await tmdbFetch<TmdbTrendingResponse>('/trending/all/week', {
    language: 'en-US',
  })

  const items = data.results
    .filter((item): item is TmdbTrendingItem & { media_type: 'movie' | 'tv' } => 
      item.media_type === 'movie' || item.media_type === 'tv'
    )
    .slice(0, 12)

  // Fetch details for each item to get runtime/season info
  const detailedItems = await Promise.all(
    items.map(async (item) => {
      const type = item.media_type
      const releaseDate = type === 'movie' ? item.release_date : item.first_air_date
      const name = type === 'movie' ? item.title ?? '' : item.name ?? ''

      let runtime: number | null = null
      let seasonCount: number | undefined
      let episodeCount: number | undefined

      try {
        if (type === 'movie') {
          const details = await tmdbFetch<TmdbMovieResponse>(`/movie/${item.id}`, {
            language: 'en-US',
          })
          runtime = details.runtime
        } else {
          const details = await tmdbFetch<TmdbTvResponse>(`/tv/${item.id}`, {
            language: 'en-US',
          })
          seasonCount = details.number_of_seasons
          episodeCount = details.number_of_episodes
        }
      } catch (error) {
        // If details fetch fails, continue without runtime/season info
        console.error(`Failed to fetch details for ${type} ${item.id}:`, error)
      }

      return {
        id: item.id,
        type,
        name,
        overview: item.overview,
        posterUrl: buildImage(item.poster_path, POSTER_SIZE),
        backdropUrl: buildImage(item.backdrop_path, BACKDROP_SIZE),
        releaseYear: releaseDate ? new Date(releaseDate).getFullYear().toString() : undefined,
        href: type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}/1/1`,
        runtime,
        seasonCount,
        episodeCount,
        rating: item.vote_average,
        voteCount: item.vote_count,
      }
    })
  )

  return detailedItems
}

// Lists
type TmdbMovieListItem = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  vote_average?: number
  vote_count?: number
}

type TmdbTvListItem = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date?: string
  vote_average?: number
  vote_count?: number
}

type TmdbListResponse<T> = {
  results: T[]
}

async function mapMovieList(items: TmdbMovieListItem[]): Promise<MediaSummary[]> {
  const detailedMovies = await Promise.all(
    items.slice(0, 20).map(async (item) => {
      const releaseYear = item.release_date ? new Date(item.release_date).getFullYear().toString() : undefined
      
      let runtime: number | null = null
      try {
        const details = await tmdbFetch<TmdbMovieResponse>(`/movie/${item.id}`, {
          language: 'en-US',
        })
        runtime = details.runtime
      } catch (error) {
        console.error(`Failed to fetch movie details for ${item.id}:`, error)
      }

      return {
        id: item.id,
        type: 'movie' as const,
        name: item.title,
        overview: item.overview,
        posterUrl: buildImage(item.poster_path, POSTER_SIZE),
        backdropUrl: buildImage(item.backdrop_path, BACKDROP_SIZE),
        releaseYear,
        href: `/movie/${item.id}`,
        runtime,
        rating: item.vote_average,
        voteCount: item.vote_count,
      }
    })
  )

  return detailedMovies
}

async function mapTvList(items: TmdbTvListItem[]): Promise<MediaSummary[]> {
  const detailedShows = await Promise.all(
    items.slice(0, 20).map(async (item) => {
      const releaseYear = item.first_air_date ? new Date(item.first_air_date).getFullYear().toString() : undefined
      
      let seasonCount: number | undefined
      let episodeCount: number | undefined
      try {
        const details = await tmdbFetch<TmdbTvResponse>(`/tv/${item.id}`, {
          language: 'en-US',
        })
        seasonCount = details.number_of_seasons
        episodeCount = details.number_of_episodes
      } catch (error) {
        console.error(`Failed to fetch TV details for ${item.id}:`, error)
      }

      return {
        id: item.id,
        type: 'tv' as const,
        name: item.name,
        overview: item.overview,
        posterUrl: buildImage(item.poster_path, POSTER_SIZE),
        backdropUrl: buildImage(item.backdrop_path, BACKDROP_SIZE),
        releaseYear,
        href: `/tv/${item.id}/1/1`,
        seasonCount,
        episodeCount,
        rating: item.vote_average,
        voteCount: item.vote_count,
      }
    })
  )

  return detailedShows
}

export async function getLatestMovies(): Promise<MediaSummary[]> {
  const data = await tmdbFetch<TmdbListResponse<TmdbMovieListItem>>('/movie/now_playing', {
    language: 'en-US',
    region: 'US',
  }, 30 * 60)
  return mapMovieList(data.results)
}

export async function getLatestTvShows(): Promise<MediaSummary[]> {
  const data = await tmdbFetch<TmdbListResponse<TmdbTvListItem>>('/tv/on_the_air', {
    language: 'en-US',
  }, 30 * 60)
  return mapTvList(data.results)
}

export async function getTopRatedMovies(): Promise<MediaSummary[]> {
  const data = await tmdbFetch<TmdbListResponse<TmdbMovieListItem>>('/movie/top_rated', {
    language: 'en-US',
  }, 24 * 3600)
  return mapMovieList(data.results)
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

  const items = data.results
    .filter((item): item is TmdbSearchResult & { media_type: 'movie' | 'tv' } => {
      return (item.media_type === 'movie' || item.media_type === 'tv') && !!(item.title ?? item.name)
    })
    .slice(0, 20)

  const detailedItems = await Promise.all(
    items.map(async (item) => {
      const type = item.media_type
      const releaseDate = type === 'movie' ? item.release_date : item.first_air_date
      const name = type === 'movie' ? item.title ?? '' : item.name ?? ''

      let runtime: number | null = null
      let seasonCount: number | undefined
      let episodeCount: number | undefined

      try {
        if (type === 'movie') {
          const details = await tmdbFetch<TmdbMovieResponse>(`/movie/${item.id}`, {
            language: 'en-US',
          })
          runtime = details.runtime
        } else {
          const details = await tmdbFetch<TmdbTvResponse>(`/tv/${item.id}`, {
            language: 'en-US',
          })
          seasonCount = details.number_of_seasons
          episodeCount = details.number_of_episodes
        }
      } catch (error) {
        console.error(`Failed to fetch details for ${type} ${item.id}:`, error)
      }

      return {
        id: item.id,
        type,
        name,
        overview: item.overview,
        posterUrl: buildImage(item.poster_path, POSTER_SIZE),
        backdropUrl: buildImage(item.backdrop_path, BACKDROP_SIZE),
        releaseYear: releaseDate ? new Date(releaseDate).getFullYear().toString() : undefined,
        href: type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}/1/1`,
        runtime,
        seasonCount,
        episodeCount,
        rating: item.vote_average,
        voteCount: item.vote_count,
      }
    })
  )

  return detailedItems
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
  vote_average?: number
  vote_count?: number
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
  rating?: number
  voteCount?: number
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
    rating: movie.vote_average,
    voteCount: movie.vote_count,
  }
}

type TmdbTvResponse = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  genres: { id: number; name: string }[]
  number_of_seasons: number
  number_of_episodes: number
  vote_average?: number
  vote_count?: number
  seasons: {
    id: number
    name: string
    season_number: number
    episode_count: number | null
  }[]
}

type TmdbEpisodeResponse = {
  id: number
  name: string
  overview: string
  still_path: string | null
  air_date: string | null
  runtime: number | null
}

type TmdbSeasonResponse = {
  episodes: {
    id: number
    name: string
    episode_number: number
  }[]
}

export type TvEpisodeDetails = {
  showId: number
  showName: string
  overview: string
  posterUrl: string | null
  backdropUrl: string | null
  genres: string[]
  rating?: number
  voteCount?: number
  seasons: {
    number: number
    name: string
    episodeCount: number
  }[]
  allEpisodes: Record<number, { number: number; name: string }[]>
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
  const [show, seasonDetails, episodeDetails] = await Promise.all([
    tmdbFetch<TmdbTvResponse>(`/tv/${id}`, { language: 'en-US' }, 24 * 3600),
    tmdbFetch<TmdbSeasonResponse>(`/tv/${id}/season/${season}`, { language: 'en-US' }, 24 * 3600),
    tmdbFetch<TmdbEpisodeResponse>(`/tv/${id}/season/${season}/episode/${episode}`, { language: 'en-US' }, 12 * 3600),
  ])

  const seasons = (show.seasons ?? [])
    .filter((seasonInfo) => seasonInfo.season_number > 0)
    .map((seasonInfo) => ({
      number: seasonInfo.season_number,
      name: seasonInfo.name || `Season ${seasonInfo.season_number}`,
      episodeCount: seasonInfo.episode_count ?? 0,
    }))

  const allEpisodes: Record<number, { number: number; name: string }[]> = {
    [Number(season)]: seasonDetails.episodes.map((ep) => ({
      number: ep.episode_number,
      name: ep.name || `Episode ${ep.episode_number}`,
    })),
  }

  return {
    showId: show.id,
    showName: show.name,
    overview: show.overview,
    posterUrl: buildImage(show.poster_path, POSTER_SIZE),
    backdropUrl: buildImage(show.backdrop_path, BACKDROP_SIZE),
    genres: show.genres.map((genre) => genre.name),
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