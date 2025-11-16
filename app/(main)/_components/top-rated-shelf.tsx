import { MediaCard } from "@/components/media-card";
import { getTopRatedMovies } from "@/lib/tmdb";

export async function TopRatedShelf() {
  const topRated = await getTopRatedMovies();

  return (
    <section className="space-y-5">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">Top Rated</h2>
        <p className="text-sm text-muted-foreground">
          Timeless classics and critically acclaimed films.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {topRated.map((item, index) => (
          <MediaCard key={`top-${item.id}`} media={item} priority={index < 2} />
        ))}
      </div>
    </section>
  );
}
