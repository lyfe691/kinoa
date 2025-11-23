"use server";

import { revalidatePath } from "next/cache";
import { upsertAccountProfile } from "@/lib/supabase/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SaveProfileInput = {
  displayName?: string | null;
  email?: string;
  avatarUrl?: string | null;
};

export async function saveProfileAction(input: SaveProfileInput) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const message =
      error?.message ?? "You need to be signed in to update your profile.";
    return { success: false, error: message };
  }

  const sanitizedDisplayName = input.displayName === undefined ? undefined : (input.displayName?.trim() || null);

  if (sanitizedDisplayName && sanitizedDisplayName.length > 25) {
    return { success: false, error: "Display name must be 25 characters or fewer." };
  }

  const sanitizedEmail = input.email?.trim();
  const sanitizedAvatarUrl = input.avatarUrl;

  // Validate avatar URL is from our Supabase storage
  if (sanitizedAvatarUrl) {
    try {
      const url = new URL(sanitizedAvatarUrl);
      const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
      // Allow storage URLs from the same Supabase project
      if (url.origin !== supabaseUrl.origin || !url.pathname.startsWith("/storage/v1/object/public/avatars/")) {
        return { success: false, error: "Invalid avatar URL." };
      }
    } catch {
      return { success: false, error: "Invalid avatar URL format." };
    }
  }

  const profileUpdates: { displayName?: string | null; avatarUrl?: string | null } = {};
  if (sanitizedDisplayName !== undefined) profileUpdates.displayName = sanitizedDisplayName;
  if (sanitizedAvatarUrl !== undefined) profileUpdates.avatarUrl = sanitizedAvatarUrl;

  const profile = await upsertAccountProfile(
    profileUpdates,
    { supabase },
  );

  if (!profile) {
    return {
      success: false,
      error: "We couldn’t update your profile details. Please try again.",
    };
  }

  let emailChanged = false;
  let emailRequiresConfirmation = false;

  const currentEmail = user.email ?? "";

  const metadataUpdates: Record<string, string | null> = {};
  if (sanitizedDisplayName !== undefined) {
    metadataUpdates.display_name = sanitizedDisplayName;
  }

  if (sanitizedAvatarUrl !== undefined) {
    metadataUpdates.avatar_url = sanitizedAvatarUrl ?? null;
  }

  const userUpdatePayload: Parameters<typeof supabase.auth.updateUser>[0] = {};

  if (sanitizedEmail && sanitizedEmail !== currentEmail) {
    userUpdatePayload.email = sanitizedEmail;
  }

  if (Object.keys(metadataUpdates).length > 0) {
    userUpdatePayload.data = metadataUpdates;
  }

  if (Object.keys(userUpdatePayload).length > 0) {
    const { data, error: updateError } =
      await supabase.auth.updateUser(userUpdatePayload);

    if (updateError) {
      return {
        success: false,
        error:
          updateError.message ??
          "We couldn’t update your profile details. Please try again.",
      };
    }

    if (userUpdatePayload.email) {
      emailChanged = true;
      if (data?.user?.email !== sanitizedEmail) {
        emailRequiresConfirmation = true;
      }
    }
  }

  await revalidatePath("/settings");

  return {
    success: true,
    emailChanged,
    emailRequiresConfirmation,
    profile,
  };
}
