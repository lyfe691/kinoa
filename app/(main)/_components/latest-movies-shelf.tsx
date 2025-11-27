import { MediaCard } from "@/components/media-card";
import { getLatestMovies } from "@/lib/tmdb";
import { Section } from "./section";

export async function LatestMoviesShelf() {
  const latestMovies = await getLatestMovies();

  return (
    <Section
      title="Latest Movies"
      description="Fresh in theaters and newly available."
    >
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        {latestMovies.map((item, index) => (
          <MediaCard
            key={`movie-${item.id}`}
            media={item}
            priority={index < 2}
          />
        ))}
      </div>
    </Section>
  );
}
