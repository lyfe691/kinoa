"use server";

import { revalidatePath } from "next/cache";
import { upsertAccountProfile } from "@/lib/supabase/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SaveProfileInput = {
  displayName: string | null;
  email: string;
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

  const sanitizedDisplayName = input.displayName?.trim() || null;
  const sanitizedEmail = input.email.trim();
  const sanitizedAvatarUrl =
    input.avatarUrl === undefined ? undefined : input.avatarUrl;

  const profile = await upsertAccountProfile(
    {
      displayName: sanitizedDisplayName,
      avatarUrl: sanitizedAvatarUrl,
    },
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
  if (sanitizedDisplayName !== null) {
    metadataUpdates.display_name = sanitizedDisplayName;
  } else {
    metadataUpdates.display_name = null;
  }

  if (input.avatarUrl !== undefined) {
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
