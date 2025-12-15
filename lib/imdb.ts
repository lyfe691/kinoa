const OMDB_API_URL = "https://www.omdbapi.com/";

const IMDB_ID_PATTERN = /^tt\d{5,}$/i;

type OmdbLookupParams =
  | {
      imdbId: string;
      title?: string;
      year?: string;
      type: "movie" | "series" | "episode";
    }
  | {
      imdbId?: string | null;
      title: string;
      year?: string;
      type: "movie" | "series" | "episode";
    };

type OmdbRequest = {
  url: string;
  cacheKey: string;
};

const lookupCache = new Map<string, string | null>();
let warnedAboutMissingKey = false;

function getOmdbApiKey() {
  const key = process.env.OMDB_API_KEY;
  if (!key && process.env.NODE_ENV !== "production" && !warnedAboutMissingKey) {
    warnedAboutMissingKey = true;
    console.warn(
      "[imdb] Missing OMDB_API_KEY. IMDb lookup fallback is disabled.",
    );
  }
  return key ?? null;
}

function normalizeYear(year?: string) {
  if (!year) return undefined;
  const trimmed = year.trim();
  if (!trimmed) return undefined;
  const match = trimmed.match(/^\d{4}$/);
  return match ? match[0] : undefined;
}

function normalizeImdbId(value: string) {
  return value.trim().toLowerCase();
}

function buildOmdbRequest(params: OmdbLookupParams): OmdbRequest | null {
  const apiKey = getOmdbApiKey();
  if (!apiKey) {
    return null;
  }

  const searchParams = new URLSearchParams();
  searchParams.set("apikey", apiKey);

  let cacheKey: string | null = null;

  if (
    "imdbId" in params &&
    params.imdbId &&
    IMDB_ID_PATTERN.test(params.imdbId)
  ) {
    const normalized = normalizeImdbId(params.imdbId);
    searchParams.set("i", normalized);
    cacheKey = `i:${normalized}`;
  } else if ("title" in params) {
    const title = params.title?.trim();
    if (!title) {
      return null;
    }
    searchParams.set("t", title);
    const year = normalizeYear(params.year);
    if (year) {
      searchParams.set("y", year);
    }
    searchParams.set("type", params.type);
    const keyTitle = title.toLowerCase();
    cacheKey = `t:${params.type}:${keyTitle}:${year ?? ""}`;
  } else {
    return null;
  }

  return {
    url: `${OMDB_API_URL}?${searchParams.toString()}`,
    cacheKey,
  };
}

async function requestOmdb(params: OmdbLookupParams) {
  const request = buildOmdbRequest(params);
  if (!request) {
    return null;
  }

  if (lookupCache.has(request.cacheKey)) {
    return lookupCache.get(request.cacheKey) ?? null;
  }

  try {
    const response = await fetch(request.url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 6 * 3600 },
    });

    if (!response.ok) {
      lookupCache.set(request.cacheKey, null);
      return null;
    }

    const data = (await response.json()) as
      | { Response: "True"; imdbID?: string }
      | { Response: "False"; Error?: string };

    if (data.Response === "True" && data.imdbID) {
      const normalizedId = normalizeImdbId(data.imdbID);
      lookupCache.set(request.cacheKey, normalizedId);
      return normalizedId;
    }

    if (data.Response === "False" && data.Error) {
      console.warn(`[imdb] OMDb lookup failed for ${request.url}: ${data.Error}`);
    }

    lookupCache.set(request.cacheKey, null);
    return null;
  } catch (error) {
    console.warn("[imdb] OMDb lookup request error", error);
    lookupCache.set(request.cacheKey, null);
    return null;
  }
}

export function isLikelyImdbId(value: string | null | undefined) {
  if (!value) return false;
  return IMDB_ID_PATTERN.test(value.trim());
}

export async function ensureImdbId({
  imdbId,
  title,
  year,
  type,
}: {
  imdbId?: string | null;
  title: string;
  year?: string;
  type: "movie" | "series" | "episode";
}) {
  const canonicalId = imdbId?.trim();
  if (isLikelyImdbId(canonicalId)) {
    return normalizeImdbId(canonicalId!);
  }

  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return canonicalId ?? null;
  }

  const lookedUp = await requestOmdb({
    title: trimmedTitle,
    year,
    type,
  });

  if (isLikelyImdbId(lookedUp)) {
    return normalizeImdbId(lookedUp!);
  }

  return canonicalId ?? null;
}
