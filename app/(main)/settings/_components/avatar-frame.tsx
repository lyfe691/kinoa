"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toastManager } from "@/components/ui/toast";
import { Loader } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/supabase/auth";
import type { AccountProfile } from "@/lib/profile-utils";
import { saveProfileAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageCropperDialog } from "@/components/image-cropper-dialog";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB for initial selection
const UPLOAD_SIZE_LIMIT = 300 * 1024; // 300 KB for final upload

export function AvatarFrame({ profile }: { profile: AccountProfile | null }) {
  const router = useRouter();
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);
  const { refreshSession } = useSession();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const initialAvatarUrl = profile?.avatarUrl ?? null;
  const profileId = profile?.id ?? "user";

  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(
    initialAvatarUrl,
  );
  const [pendingBlob, setPendingBlob] = React.useState<Blob | null>(null);

  const propAvatarUrlRef = React.useRef(initialAvatarUrl);

  // Sync with profile prop changes, but only if we don't have a pending change
  React.useEffect(() => {
    if (!pendingBlob && profile?.avatarUrl !== propAvatarUrlRef.current) {
      setAvatarUrl(profile?.avatarUrl ?? null);
      propAvatarUrlRef.current = profile?.avatarUrl ?? null;
    }
  }, [profile?.avatarUrl, pendingBlob]);

  const [saving, setSaving] = React.useState(false);
  const [isCropperOpen, setIsCropperOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toastManager.add({
        title: "Please choose an image file.",
        type: "error",
      });
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      toastManager.add({
        title: "Image is too large. Please choose an image under 5MB.",
        type: "error",
      });
      return;
    }

    setSelectedFile(file);
    setIsCropperOpen(true);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (croppedBlob.size > UPLOAD_SIZE_LIMIT) {
      toastManager.add({
        title: "Image is too large. Please use an image under 300KB.",
        type: "error",
      });
      return;
    }

    // Create a local preview URL
    const objectUrl = URL.createObjectURL(croppedBlob);
    setAvatarUrl(objectUrl);
    setPendingBlob(croppedBlob);
    setIsCropperOpen(false);

    // Note: We do NOT revoke this immediately, we need it for display.
    // We'll trust browser/react cleanup or handle it in useEffect if strictness is needed.
  };

  const hasChanged =
    avatarUrl !== propAvatarUrlRef.current || pendingBlob !== null;

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;

      // 1. Upload if there is a pending blob
      if (pendingBlob) {
        const extension =
          selectedFile?.name.split(".").pop()?.toLowerCase() ?? "png";
        const path = `${profileId}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, pendingBlob, {
            cacheControl: "3600",
            upsert: true,
            contentType: selectedFile?.type || "image/png",
          });

        if (uploadError) {
          console.error("[profiles] Avatar upload failed", uploadError);
          toastManager.add({
            title: "We couldn’t upload your avatar. Please try again.",
            type: "error",
          });
          return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        if (!data?.publicUrl) {
          toastManager.add({
            title: "We couldn’t generate a link for your avatar.",
            type: "error",
          });
          return;
        }
        finalAvatarUrl = data.publicUrl;
      }

      // 2. Update Profile
      const result = await saveProfileAction({
        avatarUrl: finalAvatarUrl,
      });

      if (!result?.success) {
        toastManager.add({
          title: result?.error ?? "We couldn’t update your profile.",
          type: "error",
        });
        return;
      }

      toastManager.add({
        title: "Profile updated successfully",
        type: "success",
      });

      // Update refs and state
      propAvatarUrlRef.current = result.profile?.avatarUrl ?? null;
      setPendingBlob(null);

      // If we used a blob URL, it's technically stale now compared to the remote URL,
      // but visually identical. We can switch to the remote URL.
      setAvatarUrl(result.profile?.avatarUrl ?? null);

      await refreshSession();
      router.refresh();
    } catch (error) {
      console.error("Failed to save avatar", error);
      toastManager.add({ title: "Failed to save changes.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const selectedFileUrl = React.useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  // Cleanup object URLs
  React.useEffect(() => {
    return () => {
      if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl);
      if (pendingBlob && avatarUrl && avatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [selectedFileUrl, pendingBlob, avatarUrl]);

  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Avatar</h3>
          <p className="text-sm text-muted-foreground">
            This is your profile avatar.
            <br />
            Click on the avatar to upload a custom one from your files.
          </p>
        </div>
        <div className="shrink-0">
          <div
            className="relative flex cursor-pointer overflow-hidden rounded-full transition-opacity hover:opacity-80"
            onClick={handleAvatarButtonClick}
          >
            <Avatar className="size-24 border border-border">
              <AvatarImage
                src={avatarUrl ?? undefined}
                alt="Profile photo"
                className="object-cover"
              />
              <AvatarFallback className="bg-muted text-3xl font-semibold uppercase text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t bg-muted/40 px-6 py-4">
        <p className="text-[13px] text-muted-foreground">
          This image appears across Kinoa anywhere your profile shows up.
        </p>
        <Button
          onClick={handleSave}
          disabled={!hasChanged || saving}
          size="sm"
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>

      <ImageCropperDialog
        open={isCropperOpen}
        onOpenChange={setIsCropperOpen}
        imageSrc={selectedFileUrl}
        fileType={selectedFile?.type}
        onCropComplete={handleCropComplete}
        aspect={1}
      />
    </div>
  );
}
