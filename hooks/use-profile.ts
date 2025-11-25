"use client";

import { useEffect, useState, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/supabase/auth";
import {
  type AccountProfile,
  mapRowToProfile,
  type ProfileRow,
} from "@/lib/profile-utils";

export function useProfile() {
  const { user, session } = useSession();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchProfile() {
      try {
        // Fetch profile from the 'profiles' table
        const { data, error } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .eq("id", user!.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
        }

        if (isMounted) {
          const profileData = mapRowToProfile(
            data as ProfileRow | null,
            user!.email ?? "",
            user!.id,
            (user!.user_metadata ?? {}) as Record<string, unknown>,
          );
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Unexpected error fetching profile:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    // Subscribe to realtime changes on the profiles table for this user
    const channel = supabase
      .channel(`profile:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (isMounted) {
            // When a change happens, merge it.
            // Payload.new has the new row data.
            const newRow = payload.new as ProfileRow;
            const profileData = mapRowToProfile(
              newRow,
              user!.email ?? "",
              user!.id,
              (user!.user_metadata ?? {}) as Record<string, unknown>,
            );
            setProfile(profileData);
          }
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user, session, supabase]);

  return { profile, loading };
}
