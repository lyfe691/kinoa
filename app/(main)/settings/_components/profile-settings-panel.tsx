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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

type ProfileSettingsPanelProps = {
  profile: AccountProfile | null;
};

const MAX_AVATAR_SIZE = 300 * 1024; // 300 KB

const profileSchema = z.object({
  displayName: z
    .string()
    .max(80, "Display name must be 80 characters or fewer")
    .refine((value) => {
      const trimmed = value.trim();
      return trimmed.length === 0 || trimmed.length >= 2;
    }, "Display name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSettingsPanel({ profile }: ProfileSettingsPanelProps) {
  const router = useRouter();
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { refreshSession } = useSession();

  const initialDisplayName = profile?.displayName ?? "";
  const initialEmail = profile?.email ?? "";
  const initialAvatarUrl = profile?.avatarUrl ?? null;
  const profileId = profile?.id ?? "user";

  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(
    initialAvatarUrl,
  );
  const initialAvatarRef = React.useRef<string | null>(initialAvatarUrl);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: initialDisplayName,
      email: initialEmail,
    },
  });

  React.useEffect(() => {
    form.reset({
      displayName: profile?.displayName ?? "",
      email: profile?.email ?? "",
    });
    const nextAvatar = profile?.avatarUrl ?? null;
    setAvatarUrl(nextAvatar);
    initialAvatarRef.current = nextAvatar;
  }, [profile?.displayName, profile?.email, profile?.avatarUrl, form]);

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

    if (!file) {
      return;
    }

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
        const message = uploadError?.message?.toLowerCase() ?? "";
        if (message.includes("bucket not found")) {
          toast.error(
            "Avatar storage bucket missing. Create the 'avatars' bucket in Supabase Storage and try again.",
          );
        } else {
          toast.error("We couldn’t upload your avatar. Please try again.");
        }
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = data?.publicUrl ?? null;

      if (!publicUrl) {
        toast.error(
          "We couldn’t generate a link for your avatar. Please try again.",
        );
        return;
      }

      setAvatarUrl(publicUrl);
      toast.success("Avatar uploaded. Don’t forget to save your changes.");
    } catch (error) {
      console.error("[profiles] Unexpected avatar upload error", error);
      toast.error(
        "Something went wrong while uploading. Verify the 'avatars' bucket exists and try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
  };

  const hasAvatarChanged = avatarUrl !== initialAvatarRef.current;
  const isFormDirty = form.formState.isDirty || hasAvatarChanged;
  const isSaveDisabled = saving || uploading || !isFormDirty;

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      const trimmedDisplayName = values.displayName.trim();
      const trimmedEmail = values.email.trim();

      const result = await saveProfileAction({
        displayName: trimmedDisplayName.length ? trimmedDisplayName : null,
        email: trimmedEmail,
        avatarUrl: avatarUrl,
      });

      if (!result?.success) {
        toast.error(result?.error ?? "We couldn’t update your profile.");
        return;
      }

      form.reset({
        displayName: trimmedDisplayName,
        email: trimmedEmail,
      });

      const nextAvatar = result.profile?.avatarUrl ?? avatarUrl ?? null;
      setAvatarUrl(nextAvatar);
      initialAvatarRef.current = nextAvatar;

      const description = result.emailChanged
        ? result.emailRequiresConfirmation
          ? "We sent a confirmation link to your new email."
          : "Your email address has been updated."
        : undefined;

      toast.success("Profile updated", {
        description,
      });

      await refreshSession();
      router.refresh();
    } catch (error) {
      console.error("[profiles] Failed to save profile", error);
      toast.error("We hit a snag while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader className="space-y-1.5 p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">Profile</CardTitle>
            <CardDescription className="text-sm">
              Update your personal details, contact information, and profile
              photo. These details appear across Kinoa.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-4 sm:space-y-10 sm:p-6">
            <section className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/40 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
              <div className="relative flex shrink-0 items-center justify-center sm:items-start sm:justify-start">
                <Avatar className="size-24 border border-border/60 shadow-sm sm:size-28">
                  <AvatarImage
                    src={avatarUrl ?? undefined}
                    alt="Profile photo"
                  />
                  <AvatarFallback className="text-base font-semibold uppercase sm:text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground sm:text-left">
                    Profile photo
                  </h3>
                  <p className="mt-1 text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
                    This image appears across Kinoa anywhere your profile shows
                    up.
                  </p>
                </div>

                <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAvatarButtonClick}
                    disabled={uploading}
                    className="w-full sm:w-auto"
                  >
                    {uploading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UploadCloud className="mr-2 h-4 w-4" />
                    )}
                    Upload photo
                  </Button>
                  {avatarUrl ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveAvatar}
                      disabled={uploading}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  ) : null}
                </div>

                <p className="text-center text-xs text-muted-foreground sm:text-left">
                  JPG, PNG, or GIF. Max 300 KB.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
            </section>

            <section className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add how your name appears"
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormDescription className="text-xs sm:text-sm">
                      This is shown on your profile, watchlist, and shared
                      moments.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription className="text-xs sm:text-sm">
                      We'll use this for account notifications and security
                      alerts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </CardContent>

          <CardFooter className="flex flex-col-reverse items-stretch gap-2 border-t border-border/60 bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:p-6">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                form.reset({
                  displayName: profile?.displayName ?? "",
                  email: profile?.email ?? "",
                });
                setAvatarUrl(initialAvatarRef.current);
              }}
              disabled={
                saving ||
                uploading ||
                (!form.formState.isDirty && !hasAvatarChanged)
              }
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSaveDisabled} className="w-full sm:w-auto">
              {(saving || uploading) && (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
