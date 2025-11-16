export const MOVIE_SORTS = [
  { id: "popularity.desc", label: "Popularity" },
  { id: "vote_average.desc", label: "Rating" },
  { id: "primary_release_date.desc", label: "Release date" },
] as const;

export const TV_SORTS = [
  { id: "popularity.desc", label: "Popularity" },
  { id: "vote_average.desc", label: "Rating" },
  { id: "first_air_date.desc", label: "Air date" },
] as const;

export type SortOption = (typeof MOVIE_SORTS | typeof TV_SORTS)[number];

type ContentType = "all" | "movie" | "tv";
type MovieSortId = (typeof MOVIE_SORTS)[number]["id"];
type TvSortId = (typeof TV_SORTS)[number]["id"];

const MOVIE_SORT_IDS = new Set<MovieSortId>(
  MOVIE_SORTS.map((option) => option.id),
);
const TV_SORT_IDS = new Set<TvSortId>(TV_SORTS.map((option) => option.id));

function isMovieSortId(value: string): value is MovieSortId {
  return MOVIE_SORT_IDS.has(value as MovieSortId);
}

function isTvSortId(value: string): value is TvSortId {
  return TV_SORT_IDS.has(value as TvSortId);
}

export function getSortOptions(type: ContentType) {
  return type === "tv" ? TV_SORTS : MOVIE_SORTS;
}

export function normalizeSort(type: ContentType, sort: string | undefined) {
  const options = getSortOptions(type);
  const defaultSort = options[0]?.id ?? "popularity.desc";

  if (!sort) {
    return defaultSort;
  }

  if (type === "tv") {
    return isTvSortId(sort) ? sort : defaultSort;
  }

  return isMovieSortId(sort) ? sort : defaultSort;
}
