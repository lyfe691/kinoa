import { MediaCard } from "@/components/media-card";
import { getTopRatedMovies } from "@/lib/tmdb";
import { Section } from "./section";

export async function TopRatedShelf() {
  const topRated = await getTopRatedMovies();

  return (
    <Section
      title="Top Rated"
      description="Timeless classics and critically acclaimed films."
    >
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        {topRated.map((item, index) => (
          <MediaCard
            key={`top-rated-${item.id}`}
            media={item}
            priority={index < 2}
          />
        ))}
      </div>
    </Section>
  );
}
