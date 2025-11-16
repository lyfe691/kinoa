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

  if (sanitizedEmail && sanitizedEmail !== currentEmail) {
    const { data, error: emailError } = await supabase.auth.updateUser({
      email: sanitizedEmail,
    });

    if (emailError) {
      return {
        success: false,
        error:
          emailError.message ??
          "We couldn’t update your email. Please try again.",
      };
    }

    emailChanged = true;

    // Supabase returns the original user until the new email is confirmed.
    if (data?.user?.email !== sanitizedEmail) {
      emailRequiresConfirmation = true;
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
