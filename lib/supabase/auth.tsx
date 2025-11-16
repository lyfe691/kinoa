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

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  supabase: BrowserSupabase | null;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
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
  const [loading, setLoading] = useState(!initialSession);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const refreshSession = useCallback(async () => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    setSession(currentSession);
    setUser(currentSession?.user ?? null);
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
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
        return;
      }

      // Handle password recovery
      if (event === "PASSWORD_RECOVERY") {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        return;
      }

      // Handle all other auth state changes
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(
    () => ({ user, session, loading, supabase, refreshSession }),
    [user, session, loading, supabase, refreshSession],
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
