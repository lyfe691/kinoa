"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookmarkMinus, BookmarkPlus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/lib/supabase/auth";
import { addToWatchlist, removeFromWatchlist } from "@/lib/supabase/watchlist";
import { useWatchlistStatus } from "@/hooks/use-watchlist-status";
import { useAuthPrompt } from "@/hooks/use-auth-prompt";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type MediaMenuProps = {
  mediaId: number;
  mediaType: "movie" | "tv";
  isInWatchlist?: boolean;
  className?: string;
  size?: "sm" | "default";
  layout?: "icon" | "button";
  mediaTitle?: string;
  mediaSubtitle?: string;
  mediaPoster?: string | null;
};

export function MediaMenu({
  mediaId,
  mediaType,
  isInWatchlist: propIsInWatchlist,
  className,
  size = "default",
  layout = "icon",
  mediaTitle,
  mediaSubtitle,
  mediaPoster,
}: MediaMenuProps) {
  const router = useRouter();
  const { user } = useSession();
  const { isInWatchlist: hookIsInWatchlist, loading: checkingWatchlist } =
    useWatchlistStatus(mediaId, mediaType, propIsInWatchlist);
  const [isInWatchlist, setIsInWatchlist] = React.useState(
    propIsInWatchlist ?? false,
  );
  const [loading, setLoading] = React.useState(false);
  const { requireAuth, AuthPrompt } = useAuthPrompt();

  // Use hook result as source of truth
  React.useEffect(() => {
    if (!checkingWatchlist) {
      setIsInWatchlist(hookIsInWatchlist);
    }
  }, [hookIsInWatchlist, checkingWatchlist]);

  const authPromptConfig = React.useMemo(
    () => ({
      title: "Sign in to save this",
      description: "Create a free account to keep your watchlist in sync.",
      actionLabel: "Sign in to save",
      media:
        mediaTitle
          ? {
              title: mediaTitle,
              subtitle: mediaSubtitle,
              image: mediaPoster,
              tag: mediaType === "movie" ? "Movie" : "Series",
            }
          : undefined,
    }),
    [mediaPoster, mediaSubtitle, mediaTitle, mediaType],
  );

  const handleToggleWatchlist = React.useCallback(async () => {
    if (!user) {
      requireAuth(authPromptConfig);
      return;
    }

    if (checkingWatchlist) {
      return;
    }

    setLoading(true);

    try {
      if (isInWatchlist) {
        const result = await removeFromWatchlist(mediaId, mediaType);
        if (result.success) {
          setIsInWatchlist(false);
          toast.success("Removed from watchlist");
          router.refresh();
        } else {
          toast.error(result.error ?? "Failed to remove from watchlist");
        }
      } else {
        const result = await addToWatchlist(mediaId, mediaType);
        if (result.success) {
          setIsInWatchlist(true);
          toast.success("Added to watchlist");
          router.refresh();
        } else {
          // Handle duplicate key error gracefully
          if (
            result.error?.includes("duplicate") ||
            result.error?.includes("unique")
          ) {
            setIsInWatchlist(true);
            router.refresh();
          } else {
            toast.error(result.error ?? "Failed to add to watchlist");
          }
        }
      }
    } catch (error) {
      console.error("Watchlist error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [
    user,
    isInWatchlist,
    mediaId,
    mediaType,
    router,
    checkingWatchlist,
    requireAuth,
    authPromptConfig,
  ]);

  const isBusy = loading || checkingWatchlist;
  const buttonLabel = isInWatchlist ? "Saved" : "Save";
  const buttonAriaLabel =
    layout === "button"
      ? buttonLabel
      : isInWatchlist
        ? "Remove from watchlist"
        : "Add to watchlist";

  const renderButton = () => (
    <Button
      variant={layout === "button" ? "outline" : "ghost"}
      size={
        layout === "button"
          ? size === "sm"
            ? "sm"
            : "default"
          : size === "sm"
            ? "icon-sm"
            : "icon"
      }
      className={cn(
        "rounded-full transition-all cursor-pointer",
        layout === "button" &&
          "gap-2 px-4 text-sm font-semibold hover:-translate-y-0.5",
        isInWatchlist &&
          (layout === "button"
            ? "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20"
            : "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"),
        className,
      )}
      aria-label={buttonAriaLabel}
      onClick={(e) => {
        e.preventDefault();
        handleToggleWatchlist();
      }}
      disabled={isBusy}
    >
      {isBusy ? (
        <Loader
          className={cn(
            "animate-spin",
            size === "sm" ? "h-4 w-4" : "h-5 w-5",
          )}
        />
      ) : isInWatchlist ? (
        <BookmarkMinus
          className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5")}
        />
      ) : (
        <BookmarkPlus
          className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5")}
        />
      )}
      {layout === "button" && <span>{buttonLabel}</span>}
    </Button>
  );

  return (
    <>
      {layout === "icon" ? (
        <Tooltip>
          <TooltipTrigger asChild>{renderButton()}</TooltipTrigger>
          <TooltipContent>
            <p>{buttonAriaLabel}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        renderButton()
      )}

      <AuthPrompt />
    </>
  );
}
