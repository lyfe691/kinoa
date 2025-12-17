"use client";

import * as React from "react";
import { useSession } from "@/lib/supabase/auth";
import { toastManager } from "@/components/ui/toast";
import {
  getWatchlistIds,
  addToWatchlist as addToWatchlistAction,
  removeFromWatchlist as removeFromWatchlistAction,
} from "@/lib/supabase/watchlist";

type WatchlistContextType = {
  watchlist: Set<string>; // Format: "movie-123", "tv-456"
  isLoading: boolean;
  addToWatchlist: (mediaId: number, mediaType: "movie" | "tv") => Promise<void>;
  removeFromWatchlist: (
    mediaId: number,
    mediaType: "movie" | "tv",
  ) => Promise<void>;
  isInWatchlist: (mediaId: number, mediaType: "movie" | "tv") => boolean;
  refreshWatchlist: () => Promise<void>;
};

const WatchlistContext = React.createContext<WatchlistContextType | undefined>(
  undefined,
);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const [watchlist, setWatchlist] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshWatchlist = React.useCallback(async () => {
    if (!user) {
      setWatchlist(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const data = await getWatchlistIds();
    const newSet = new Set<string>();
    data.forEach((item) => {
      newSet.add(`${item.media_type}-${item.media_id}`);
    });
    setWatchlist(newSet);
    setIsLoading(false);
  }, [user?.id]);

  // Fetch watchlist on mount or user change
  React.useEffect(() => {
    refreshWatchlist();
  }, [refreshWatchlist]);

  const addToWatchlist = React.useCallback(
    async (mediaId: number, mediaType: "movie" | "tv") => {
      if (!user) return;

      const key = `${mediaType}-${mediaId}`;
      if (watchlist.has(key)) return; // Already in watchlist

      // Optimistic update
      setWatchlist((prev) => {
        const next = new Set(prev);
        next.add(key);
        return next;
      });

      const { error } = await addToWatchlistAction(mediaId, mediaType);

      if (error) {
        // If it's a duplicate, we can ignore the error as the state is already what we want
        if (error.includes("duplicate")) {
          return;
        }

        console.error("Failed to add to watchlist:", error);
        // Revert on error
        setWatchlist((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
        toastManager.add({
          title: "Failed to add to watchlist",
          type: "error",
        });
      }
    },
    [user, watchlist],
  );

  const removeFromWatchlist = React.useCallback(
    async (mediaId: number, mediaType: "movie" | "tv") => {
      if (!user) return;

      const key = `${mediaType}-${mediaId}`;
      if (!watchlist.has(key)) return; // Not in watchlist

      // Optimistic update
      setWatchlist((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });

      const { error } = await removeFromWatchlistAction(mediaId, mediaType);

      if (error) {
        console.error("Failed to remove from watchlist:", error);
        // Revert on error
        setWatchlist((prev) => {
          const next = new Set(prev);
          next.add(key);
          return next;
        });
        toastManager.add({
          title: "Failed to remove from watchlist",
          type: "error",
        });
      }
    },
    [user, watchlist],
  );

  const isInWatchlist = React.useCallback(
    (mediaId: number, mediaType: "movie" | "tv") => {
      return watchlist.has(`${mediaType}-${mediaId}`);
    },
    [watchlist],
  );

  const value = React.useMemo(
    () => ({
      watchlist,
      isLoading,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      refreshWatchlist,
    }),
    [
      watchlist,
      isLoading,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      refreshWatchlist,
    ],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = React.useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
