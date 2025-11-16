"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkMinus, BookmarkPlus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useSession } from "@/lib/supabase/auth";
import { addToWatchlist, removeFromWatchlist } from "@/lib/supabase/watchlist";
import { useWatchlistStatus } from "@/hooks/use-watchlist-status";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type MediaMenuProps = {
  mediaId: number;
  mediaType: "movie" | "tv";
  isInWatchlist?: boolean;
  className?: string;
  size?: "sm" | "default";
};

export function MediaMenu({
  mediaId,
  mediaType,
  isInWatchlist: propIsInWatchlist,
  className,
  size = "default",
}: MediaMenuProps) {
  const router = useRouter();
  const { user } = useSession();
  const { isInWatchlist: hookIsInWatchlist, loading: checkingWatchlist } =
    useWatchlistStatus(mediaId, mediaType, propIsInWatchlist);
  const [isInWatchlist, setIsInWatchlist] = React.useState(
    propIsInWatchlist ?? false,
  );
  const [loading, setLoading] = React.useState(false);
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);

  // Use hook result as source of truth
  React.useEffect(() => {
    if (!checkingWatchlist) {
      setIsInWatchlist(hookIsInWatchlist);
    }
  }, [hookIsInWatchlist, checkingWatchlist]);

  const handleToggleWatchlist = React.useCallback(async () => {
    if (!user) {
      setShowAuthDialog(true);
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
  }, [user, isInWatchlist, mediaId, mediaType, router, checkingWatchlist]);

  const isBusy = loading || checkingWatchlist;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size === "sm" ? "icon-sm" : "icon"}
            className={cn(
              "rounded-full transition-all cursor-pointer",
              isInWatchlist &&
                "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
              className,
            )}
            aria-label={
              isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
            }
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
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          </p>
        </TooltipContent>
      </Tooltip>

      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be signed in to add items to your watchlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowAuthDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowAuthDialog(false);
                router.push("/login");
              }}
              className="w-full sm:w-auto"
            >
              Sign in
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </>
  );
}
