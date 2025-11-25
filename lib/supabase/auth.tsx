"use client";

import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
  useRef,
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
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const isMounted = useRef(true);

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

  const applySessionState = useCallback(
    async (nextSession: Session | null, shouldMarkLoaded = false) => {
      if (!isMounted.current) return;

      const nextUser = nextSession?.user ?? null;
      setSession(nextSession);
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        if (shouldMarkLoaded) setLoading(false);
        return;
      }

      const userProfile = await fetchProfile(
        nextUser.id,
        nextUser.email ?? null,
      );

      if (!isMounted.current) return;

      setProfile(userProfile);
      if (shouldMarkLoaded) setLoading(false);
    },
    [fetchProfile, isMounted],
  );

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      let sessionWithFreshUser = currentSession;

      if (currentSession) {
        const {
          data: { user: freshUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (freshUser) {
          sessionWithFreshUser = { ...currentSession, user: freshUser };
        }
      }

      await applySessionState(sessionWithFreshUser, true);
    } catch (error) {
      console.error('Failed to refresh session', error);
      if (isMounted.current) {
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    }
  }, [applySessionState, isMounted, supabase]);

  useEffect(() => {
    refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted.current) return;

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      await applySessionState(newSession);

      if (isMounted.current) {
        setLoading(false);
      }
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [applySessionState, refreshSession, supabase]);

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
