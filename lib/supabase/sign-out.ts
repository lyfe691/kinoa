"use client";

import type { createSupabaseBrowserClient } from "./client";

type BrowserSupabase = ReturnType<typeof createSupabaseBrowserClient>;

function shouldIgnoreSignOutError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: number }).status === "number"
  ) {
    const status = (error as { status: number }).status;
    if ([400, 401, 403].includes(status)) {
      return true;
    }
  }

  const message =
    typeof error === "string"
      ? error
      : typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
        ? ((error as { message: string }).message ?? "")
        : "";

  return message.toLowerCase().includes("refresh token");
}

export async function signOutEverywhere(supabase?: BrowserSupabase | null) {
  if (supabase) {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error && !shouldIgnoreSignOutError(error)) {
      throw error;
    }
  }

  const response = await fetch("/api/auth/signout", {
    method: "POST",
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const serverMessage =
      data && typeof data.error === "string"
        ? data.error
        : "We couldn't finish signing you out.";
    throw new Error(serverMessage);
  }
}

