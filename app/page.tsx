import { Suspense } from "react";
import { SectionSkeleton } from "./_components/section-skeleton";
import { TrendingFilter } from "./_components/trending-filter";
import { LatestMoviesShelf } from "./_components/latest-movies-shelf";
import { LatestTvShelf } from "./_components/latest-tv-shelf";
import { TopRatedShelf } from "./_components/top-rated-shelf";
import { getTrending } from "@/lib/tmdb";
import { HomeHeader } from "./_components/home-header";

export default async function Home() {
  const trending = await getTrending();

  return (
    <section className="flex flex-col gap-10">
      <HomeHeader />

      <TrendingFilter items={trending} />

      <Suspense
        fallback={
          <SectionSkeleton
            title="Latest Movies"
            description="Fresh in theaters and newly available."
          />
        }
      >
        <LatestMoviesShelf />
      </Suspense>

      <Suspense
        fallback={
          <SectionSkeleton
            title="Latest TV Shows"
            description="New episodes airing now."
          />
        }
      >
        <LatestTvShelf />
      </Suspense>

      <Suspense
        fallback={
          <SectionSkeleton
            title="Top Rated"
            description="Timeless classics and critically acclaimed films."
          />
        }
      >
        <TopRatedShelf />
      </Suspense>
    </section>
  );
}
