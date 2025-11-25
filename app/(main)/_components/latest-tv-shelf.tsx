import { MediaCard } from "@/components/media-card";
import { getLatestTvShows } from "@/lib/tmdb";
import { Section } from "./section";

export async function LatestTvShelf() {
  const latestTv = await getLatestTvShows();

  return (
    <Section title="Latest TV Shows" description="New episodes airing now.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {latestTv.map((item, index) => (
          <MediaCard key={`tv-${item.id}`} media={item} priority={index < 2} />
        ))}
      </div>
    </Section>
  );
}
