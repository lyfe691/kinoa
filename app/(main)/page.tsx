import { Suspense } from "react";
import { SectionSkeleton } from "./_components/section-skeleton";
import { TrendingFilter } from "./_components/trending-filter";
import { LatestMoviesShelf } from "./_components/latest-movies-shelf";
import { LatestTvShelf } from "./_components/latest-tv-shelf";
import { TopRatedShelf } from "./_components/top-rated-shelf";
import { getTrending } from "@/lib/tmdb";
import { HomeHeader } from "./_components/home-header";
import { NativeBanner } from "@/components/ads/native-banner";

export default async function Home() {
  const trending = await getTrending();

  return (
    <div className="space-y-24 pb-24">
      <HomeHeader />

      <div className="space-y-12">
        <TrendingFilter items={trending} />

        <NativeBanner />

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

        <NativeBanner />

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

        <NativeBanner />

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

        <NativeBanner />
      </div>
    </div>
  );
}
