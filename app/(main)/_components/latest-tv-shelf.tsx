import { MediaCard } from "@/components/media-card";
import { getLatestTvShows } from "@/lib/tmdb";

export async function LatestTvShelf() {
  const latestTv = await getLatestTvShows();

  return (
    <section className="space-y-5">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">
          Latest TV Shows
        </h2>
        <p className="text-sm text-muted-foreground">
          New episodes airing now.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {latestTv.map((item, index) => (
          <MediaCard key={`tv-${item.id}`} media={item} priority={index < 2} />
        ))}
      </div>
    </section>
  );
}
