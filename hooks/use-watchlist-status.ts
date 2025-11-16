"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/supabase/auth";

export function useWatchlistStatus(
  mediaId: number,
  mediaType: "movie" | "tv",
  initialState?: boolean,
) {
  const { user, supabase } = useSession();
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(
    initialState ?? false,
  );
  const [loading, setLoading] = useState<boolean>(initialState === undefined);

  useEffect(() => {
    if (initialState !== undefined) {
      setIsInWatchlist(initialState);
      setLoading(false);
    }
  }, [initialState]);

  useEffect(() => {
    if (!user) {
      setIsInWatchlist(false);
      setLoading(false);
      return;
    }

    if (!supabase) {
      return;
    }

    const client = supabase;
    const userId = user.id;

    if (initialState !== undefined) {
      // When we already know the state we skip the network request.
      return;
    }

    async function checkWatchlist() {
      try {
        const { data, error } = await client
          .from("watchlist")
          .select("id")
          .eq("user_id", userId)
          .eq("media_id", mediaId)
          .eq("media_type", mediaType)
          .maybeSingle();

        if (!error && data) {
          setIsInWatchlist(true);
        } else {
          setIsInWatchlist(false);
        }
      } catch (error) {
        console.error("Failed to check watchlist status:", error);
        setIsInWatchlist(false);
      } finally {
        setLoading(false);
      }
    }

    checkWatchlist();
  }, [user, supabase, mediaId, mediaType, initialState]);

  return { isInWatchlist, loading };
}
