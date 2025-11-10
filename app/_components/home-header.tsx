"use client";

import { Suspense } from "react";
import { SearchBar } from "@/components/search-bar";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeHeader() {
  return (
    <header className="space-y-8">
      <div className="space-y-5 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          What do you want to watch?
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Everything you want to watch, in one place.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <Suspense
          fallback={
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative h-14 w-full">
                <Skeleton className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full" />
                <Skeleton className="absolute left-10 right-28 top-1/2 h-5 -translate-y-1/2 rounded-md" />
                <Skeleton className="absolute right-2 top-1/2 h-10 w-24 -translate-y-1/2 rounded-xl" />
              </div>
            </div>
          }
        >
          <SearchBar enableSuggestions={true} />
        </Suspense>
      </div>
    </header>
  );
}
