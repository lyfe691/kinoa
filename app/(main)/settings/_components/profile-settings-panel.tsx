"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader, Trash2, UploadCloud } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/supabase/auth";
import type { AccountProfile } from "@/lib/supabase/profile";
import { saveProfileAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame";

type ProfileSettingsPanelProps = {
  profile: AccountProfile | null;
};

const MAX_AVATAR_SIZE = 300 * 1024; // 300 KB

// --- Schemas ---

const displayNameSchema = z.object({
  displayName: z
    .string()
    .max(80, "Display name must be 80 characters or fewer")
    .refine((value) => {
      const trimmed = value.trim();
      return trimmed.length === 0 || trimmed.length >= 2;
    }, "Display name must be at least 2 characters"),
});

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

// --- Components ---

function AvatarFrame({ profile }: { profile: AccountProfile | null }) {
  const router = useRouter();
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);
  const { refreshSession } = useSession();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const initialAvatarUrl = profile?.avatarUrl ?? null;
  const profileId = profile?.id ?? "user";

  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(
    initialAvatarUrl,
  );
  
  const propAvatarUrlRef = React.useRef(initialAvatarUrl);
  
  React.useEffect(() => {
    if (profile?.avatarUrl !== propAvatarUrlRef.current) {
      setAvatarUrl(profile?.avatarUrl ?? null);
      propAvatarUrlRef.current = profile?.avatarUrl ?? null;
    }
  }, [profile?.avatarUrl]);

  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const initials = React.useMemo(() => {
    const name = profile?.displayName ?? "";
    if (name) {
      const [first, second] = name.trim().split(/\s+/);
      return (
        (first?.charAt(0) ?? "") + (second?.charAt(0) ?? first?.charAt(1) ?? "")
      )
        .slice(0, 2)
        .toUpperCase();
    }
    const email = profile?.email ?? "";
    return email.slice(0, 2).toUpperCase() || "U";
  }, [profile?.displayName, profile?.email]);

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Please upload an image smaller than 300 KB.");
      return;
    }

    setUploading(true);
    try {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${profileId}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("[profiles] Avatar upload failed", uploadError);
        toast.error("We couldn’t upload your avatar. Please try again.");
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = data?.publicUrl ?? null;

      if (!publicUrl) {
        toast.error("We couldn’t generate a link for your avatar.");
        return;
      }

      setAvatarUrl(publicUrl);
      toast.success("Avatar uploaded. Click Save to apply changes.");
    } catch (error) {
      console.error("[profiles] Unexpected avatar upload error", error);
      toast.error("Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
  };

  const hasChanged = avatarUrl !== propAvatarUrlRef.current;

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveProfileAction({
        avatarUrl: avatarUrl,
      });

      if (!result?.success) {
        toast.error(result?.error ?? "We couldn’t update your profile.");
        return;
      }

      toast.success("Profile photo updated");
      propAvatarUrlRef.current = result.profile?.avatarUrl ?? null; // Update ref to new saved value
      await refreshSession();
      router.refresh();
    } catch (error) {
      console.error("Failed to save avatar", error);
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>Profile Photo</FrameTitle>
        <FrameDescription>
          This image appears across Kinoa anywhere your profile shows up.
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <div className="flex items-center gap-6">
          <div className="relative flex shrink-0">
            <Avatar className="size-20 border border-border shadow-sm">
              <AvatarImage src={avatarUrl ?? undefined} alt="Profile photo" />
              <AvatarFallback className="text-lg font-semibold uppercase">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleAvatarButtonClick}
                disabled={uploading || saving}
                className="h-8"
              >
                {uploading ? (
                  <Loader className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-3.5 w-3.5" />
                )}
                Upload new photo
              </Button>
              {avatarUrl ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveAvatar}
                  disabled={uploading || saving}
                  className="h-8 text-muted-foreground hover:text-destructive"
                >
                  Remove
                </Button>
              ) : null}
            </div>
            <p className="text-[13px] text-muted-foreground">
              Recommended: Square JPG, PNG, or GIF, at least 1000x1000 pixels.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end border-t pt-4">
          <Button
            onClick={handleSave}
            disabled={!hasChanged || saving || uploading}
            size="sm"
          >
            {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </FramePanel>
    </Frame>
  );
}

function DisplayNameFrame({ profile }: { profile: AccountProfile | null }) {
  const router = useRouter();
  const { refreshSession } = useSession();
  const [saving, setSaving] = React.useState(false);

  const form = useForm<z.infer<typeof displayNameSchema>>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: {
      displayName: profile?.displayName ?? "",
    },
  });

  // Update form if profile changes from outside
  React.useEffect(() => {
    form.reset({ displayName: profile?.displayName ?? "" });
  }, [profile?.displayName, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      const trimmedName = values.displayName.trim();
      const result = await saveProfileAction({
        displayName: trimmedName.length ? trimmedName : null,
      });

      if (!result?.success) {
        toast.error(result?.error ?? "Update failed.");
        return;
      }

      toast.success("Display name updated");
      form.reset({ displayName: trimmedName });
      await refreshSession();
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  });

  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>Display Name</FrameTitle>
        <FrameDescription>
          This is shown on your profile, watchlist, and shared moments.
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                disabled={!form.formState.isDirty || saving}
                size="sm"
              >
                {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </FramePanel>
    </Frame>
  );
}

function EmailFrame({ profile }: { profile: AccountProfile | null }) {
  const router = useRouter();
  const { refreshSession } = useSession();
  const [saving, setSaving] = React.useState(false);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: profile?.email ?? "",
    },
  });

  React.useEffect(() => {
    form.reset({ email: profile?.email ?? "" });
  }, [profile?.email, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      const trimmedEmail = values.email.trim();
      const result = await saveProfileAction({
        email: trimmedEmail,
      });

      if (!result?.success) {
        toast.error(result?.error ?? "Update failed.");
        return;
      }

      const description = result.emailChanged
        ? result.emailRequiresConfirmation
          ? "Confirmation link sent to new email."
          : "Email updated."
        : undefined;

      toast.success("Email updated", { description });
      form.reset({ email: trimmedEmail });
      await refreshSession();
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  });

  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>Email Address</FrameTitle>
        <FrameDescription>
          We’ll use this for account notifications and security alerts.
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                disabled={!form.formState.isDirty || saving}
                size="sm"
              >
                {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </FramePanel>
    </Frame>
  );
}

// --- Main Panel ---

export function ProfileSettingsPanel({ profile }: ProfileSettingsPanelProps) {
  return (
    <div className="space-y-6">
      <AvatarFrame profile={profile} />
      <DisplayNameFrame profile={profile} />
      <EmailFrame profile={profile} />
    </div>
  );
}
