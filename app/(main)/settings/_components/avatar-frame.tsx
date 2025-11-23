"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/supabase/auth";
import type { AccountProfile } from "@/lib/supabase/profile";
import { saveProfileAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_AVATAR_SIZE = 300 * 1024; // 300 KB

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
                        onChange={handleAvatarUpload}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between border-t bg-muted/40 px-6 py-4">
                <p className="text-[13px] text-muted-foreground">
                    This image appears across Kinoa anywhere your profile shows up.
                </p>
                <Button
                    onClick={handleSave}
                    disabled={!hasChanged || saving || uploading}
                    size="sm"
                    className="bg-foreground text-background hover:bg-foreground/90"
                >
                    {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                </Button>
            </div>
        </div>
    );
}
