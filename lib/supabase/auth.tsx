"use client";

import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createSupabaseBrowserClient } from "./client";
import type { User, Session } from "@supabase/supabase-js";

type BrowserSupabase = ReturnType<typeof createSupabaseBrowserClient>;

export type AuthProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: AuthProfile | null;
  loading: boolean;
  supabase: BrowserSupabase | null;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  supabase: null,
  refreshSession: async () => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
  initialSession?: Session | null;
};

export function AuthProvider({
  children,
  initialSession = null,
}: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(!initialSession);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const fetchProfile = useCallback(
    async (userId: string, userEmail: string | null) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          return null;
        }

        if (data) {
          return {
            ...data,
            email: userEmail,
          };
        }

        return null;
      } catch (error) {
        console.error("Unexpected error fetching profile:", error);
        return null;
      }
    },
    [supabase],
  );

  const refreshSession = useCallback(async () => {
    // 1. Get current session from client state/cookies
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    let currentUser = currentSession?.user ?? null;

    // 2. If we have a session, try to fetch fresh user data from server
    // This ensures we get the latest email/metadata if it changed recently
    if (currentSession) {
      const { data: { user: freshUser }, error } = await supabase.auth.getUser();
      if (freshUser && !error) {
        currentUser = freshUser;
      }
    }

    setSession(currentSession);
    setUser(currentUser);

    if (currentUser) {
      const userProfile = await fetchProfile(currentUser.id, currentUser.email ?? null);
      setProfile(userProfile);
    } else {
      setProfile(null);
    }
  }, [supabase, fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        let currentUser = currentSession?.user ?? null;
        
        // Fetch fresh user data on init too, to catch any out-of-band updates
        if (currentSession) {
           const { data: { user: freshUser } } = await supabase.auth.getUser();
           if (freshUser) {
             currentUser = freshUser;
           }
        }

        setSession(currentSession);
        setUser(currentUser);

        if (currentUser) {
          const userProfile = await fetchProfile(
            currentUser.id,
            currentUser.email ?? null,
          );
          if (isMounted) {
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      // Handle sign out - clear everything
      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setProfile(null);
        return;
      }

      // Handle password recovery
      if (event === "PASSWORD_RECOVERY") {
        setSession(newSession);
        const currentUser = newSession?.user ?? null;
        setUser(currentUser);
        // Typically don't need to fetch profile for recovery, but safe to do so
        return;
      }

      // Handle all other auth state changes
      setSession(newSession);
      const currentUser = newSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await fetchProfile(
          currentUser.id,
          currentUser.email ?? null,
        );
        if (isMounted) {
          setProfile(userProfile);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const value = useMemo(
    () => ({ user, session, profile, loading, supabase, refreshSession }),
    [user, session, profile, loading, supabase, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSession must be used within AuthProvider");
  }
  return context;
}
