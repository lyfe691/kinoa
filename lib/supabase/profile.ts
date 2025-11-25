"use server";

import { createSupabaseServerClient } from "./server";
import {
  mapRowToProfile,
  type ProfileRow,
  type AccountProfile,
} from "@/lib/profile-utils";

type SupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;

/**
 * Supabase setup expectations:
 * - `profiles` table with columns:
 *   - `id` (uuid, primary key, references `auth.users`)
 *   - `display_name` (text, nullable)
 *   - `avatar_url` (text, nullable)
 *   - `updated_at` (timestamp, defaults to now())
 * - Storage bucket `avatars` with authenticated uploads and public read.
 */

async function fetchProfileRow(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[profiles] Failed to load profile", error);
    return null;
  }

  return data ?? null;
}

export async function getAccountProfile(): Promise<AccountProfile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("[profiles] Failed to resolve auth user", error);
    return null;
  }

  if (!user) {
    return null;
  }

  const row = await fetchProfileRow(supabase, user.id);
  return mapRowToProfile(
    row,
    user.email ?? "",
    user.id,
    (user.user_metadata ?? {}) as Record<string, unknown>,
  );
}

export type UpdateAccountProfileInput = {
  displayName?: string | null;
  avatarUrl?: string | null;
};

export async function upsertAccountProfile(
  updates: UpdateAccountProfileInput,
  options: { supabase?: SupabaseServerClient } = {},
): Promise<AccountProfile | null> {
  const supabase = options.supabase ?? (await createSupabaseServerClient());
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("[profiles] Failed to resolve auth user", error);
    return null;
  }

  if (!user) {
    return null;
  }

  const existing = await fetchProfileRow(supabase, user.id);

  const payload: ProfileRow & { updated_at: string } = {
    id: user.id,
    display_name:
      updates.displayName !== undefined
        ? updates.displayName
        : (existing?.display_name ?? null),
    avatar_url:
      updates.avatarUrl !== undefined
        ? updates.avatarUrl
        : (existing?.avatar_url ?? null),
    updated_at: new Date().toISOString(),
  };

  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" });

  if (upsertError) {
    console.error("[profiles] Failed to upsert profile", upsertError);
    return null;
  }

  return mapRowToProfile(
    payload,
    user.email ?? "",
    user.id,
    (user.user_metadata ?? {}) as Record<string, unknown>,
  );
}
