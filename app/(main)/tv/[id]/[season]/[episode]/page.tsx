import { redirect } from "next/navigation";

type LegacyEpisodePageProps = {
  params: Promise<{
    id: string;
    season: string;
    episode: string;
  }>;
};

/**
 * Legacy route handler - redirects to the new TV show page with query params.
 * Keeps old URLs like /tv/123/1/5 working by redirecting to /tv/123?s=1&e=5
 */
export default async function LegacyEpisodePage({
  params,
}: LegacyEpisodePageProps) {
  const { id, season, episode } = await params;
  redirect(`/tv/${id}?s=${season}&e=${episode}`);
}
