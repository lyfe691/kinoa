"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Loader } from "lucide-react";
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
import { toastManager } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type MediaMenuProps = {
  mediaId: number;
  mediaType: "movie" | "tv";
  isInWatchlist?: boolean;
  className?: string;
  size?: "sm" | "default";
  layout?: "icon" | "button";
};

export function MediaMenu({
  mediaId,
  mediaType,
  isInWatchlist: propIsInWatchlist,
  className,
  size = "default",
  layout = "icon",
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
      const previousState = isInWatchlist;
      setIsInWatchlist(!previousState);

      if (previousState) {
        const result = await removeFromWatchlist(mediaId, mediaType);
        if (result.success) {
          toastManager.add({
            title: "Removed from watchlist",
            type: "success",
          });
          router.refresh();
        } else {
          setIsInWatchlist(true);
          toastManager.add({
            title: result.error ?? "Failed to remove from watchlist",
            type: "error",
          });
        }
      } else {
        const result = await addToWatchlist(mediaId, mediaType);
        if (result.success) {
          const id = toastManager.add({
            title: "Added to watchlist",
            type: "success",
            actionProps: {
              children: "View",
              onClick: () => {
                router.push("/watchlist");
                toastManager.close(id);
              },
            },
          });
          router.refresh();
        } else {
          if (
            result.error?.includes("duplicate") ||
            result.error?.includes("unique")
          ) {
            router.refresh();
          } else {
            setIsInWatchlist(false);
            toastManager.add({
              title: result.error ?? "Failed to add to watchlist",
              type: "error",
            });
          }
        }
      }
    } catch (error) {
      console.error("Watchlist error:", error);
      toastManager.add({ title: "Something went wrong", type: "error" });
      setIsInWatchlist(!isInWatchlist);
    } finally {
      setLoading(false);
    }
  }, [user, isInWatchlist, mediaId, mediaType, router, checkingWatchlist]);

  const isBusy = loading || checkingWatchlist;

  // Icon-only layout (for cards)
  if (layout === "icon") {
    const containerSize = size === "sm" ? "h-9 w-9" : "h-11 w-11";
    const iconSize = size === "sm" ? "h-5 w-5" : "h-6 w-6";
    const label = isInWatchlist ? "In Watchlist" : "Add to Watchlist";

    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all duration-200 cursor-pointer",
                containerSize,
                "hover:bg-primary/5 hover:scale-105 active:scale-95",
                isInWatchlist
                  ? "text-primary hover:text-primary"
                  : "text-muted-foreground hover:text-primary",
                className,
              )}
              aria-label={label}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleWatchlist();
              }}
              disabled={isBusy}
            >
              {isBusy ? (
                <Loader className={cn("animate-spin", iconSize)} />
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isInWatchlist ? "saved" : "unsaved"}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Bookmark
                      className={cn(iconSize, isInWatchlist && "fill-current")}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>

        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onSignIn={() => {
            setShowAuthDialog(false);
            router.push("/login");
          }}
        />
      </>
    );
  }

  // Button layout (for detail pages)
  return (
    <>
      <button
        className={cn(
          "group inline-flex items-center gap-2 transition-colors cursor-pointer",
          isInWatchlist
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
          isBusy && "pointer-events-none opacity-50",
          className,
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleToggleWatchlist();
        }}
        disabled={isBusy}
        aria-label={
          isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
        }
      >
        <span className="relative">
          {isBusy ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Bookmark
              className={cn(
                "h-4 w-4 transition-all duration-200",
                "group-hover:scale-110 group-active:scale-95",
                isInWatchlist && "fill-current",
              )}
            />
          )}
        </span>

        <span className="text-sm font-medium">
          {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </span>
      </button>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSignIn={() => {
          setShowAuthDialog(false);
          router.push("/login");
        }}
      />
    </>
  );
}

function AuthDialog({
  open,
  onOpenChange,
  onSignIn,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button onClick={onSignIn} className="w-full sm:w-auto">
            Sign in
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
