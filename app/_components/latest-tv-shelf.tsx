import { MediaCard } from "@/components/media-card";
import { getLatestTvShows } from "@/lib/tmdb";

export async function LatestTvShelf() {
  const latestTv = await getLatestTvShows();

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">
          Latest TV Shows
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
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
