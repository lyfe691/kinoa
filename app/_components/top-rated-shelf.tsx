import { MediaCard } from "@/components/media-card";
import { getTopRatedMovies } from "@/lib/tmdb";

export async function TopRatedShelf() {
  const topRated = await getTopRatedMovies();

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Top Rated</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
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
