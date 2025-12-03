"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const ShareDialog = dynamic(
  () => import("@/components/share-dialog").then((mod) => mod.ShareDialog),
  {
    ssr: false,
  },
);
import { useSession } from "@/lib/supabase/auth";
import { addToWatchlist, removeFromWatchlist } from "@/lib/supabase/watchlist";
import { useWatchlistStatus } from "@/hooks/use-watchlist-status";
import { toastManager } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  AnimatedIcon,
  type AnimatedIconHandle,
} from "@/components/animated-icon";
import shareIcon from "@/public/icons/share.json";
import bookmarkIcon from "@/public/icons/bookmark.json";
import bookmarkFilledIcon from "@/public/icons/bookmark-filled.json";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────────────

type MediaMenuProps = {
  mediaId: number;
  mediaType: "movie" | "tv";
  isInWatchlist?: boolean;
  className?: string;
  size?: "sm" | "default";
  variant?: "menu" | "button";
};

const TRIGGER_SIZE = { sm: 32, default: 36 } as const;
const MENU_WIDTH = 180;

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export const MediaMenu = React.memo(function MediaMenu({
  mediaId,
  mediaType,
  isInWatchlist: initialIsInWatchlist,
  className,
  size = "default",
  variant = "menu",
}: MediaMenuProps) {
  const router = useRouter();
  const { user } = useSession();
  const { isInWatchlist: fetchedStatus, loading: isChecking } =
    useWatchlistStatus(mediaId, mediaType, initialIsInWatchlist);

  const [isOpen, setIsOpen] = React.useState(false);
  const [isInWatchlist, setIsInWatchlist] = React.useState(
    initialIsInWatchlist ?? false,
  );
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const bookmarkIconRef = React.useRef<AnimatedIconHandle>(null);

  const isBusy = isProcessing || isChecking;
  const triggerSize = TRIGGER_SIZE[size];
  const watchlistLabel = isInWatchlist ? "In Watchlist" : "Add to Watchlist";

  // Sync with fetched status
  React.useEffect(() => {
    if (!isChecking) setIsInWatchlist(fetchedStatus);
  }, [fetchedStatus, isChecking]);

  // Close menu on escape or outside click
  React.useEffect(() => {
    if (!isOpen) return;

    const close = () => setIsOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        close();
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [isOpen]);

  const toggleWatchlist = React.useCallback(async () => {
    if (!user) return setShowAuthDialog(true);
    if (isBusy) return;

    setIsProcessing(true);
    const wasInWatchlist = isInWatchlist;
    setIsInWatchlist(!wasInWatchlist);

    try {
      const action = wasInWatchlist ? removeFromWatchlist : addToWatchlist;
      const result = await action(mediaId, mediaType);

      if (result.success) {
        if (wasInWatchlist) {
          const toastId = toastManager.add({
            title: "Removed from watchlist",
            type: "success",
            actionProps: {
              children: "Undo",
              onClick: async () => {
                setIsProcessing(true);
                const result = await addToWatchlist(mediaId, mediaType);

                if (result.success) {
                  setIsInWatchlist(true);
                  toastManager.close(toastId);
                  router.refresh();
                } else {
                  const isDuplicate =
                    result.error?.includes("duplicate") ||
                    result.error?.includes("unique");
                  if (isDuplicate) {
                    setIsInWatchlist(true);
                    toastManager.close(toastId);
                  } else {
                    toastManager.add({
                      title: "Failed to undo",
                      type: "error",
                    });
                  }
                }
                setIsProcessing(false);
              },
            },
          });
        } else {
          const toastId = toastManager.add({
            title: "Added to watchlist",
            type: "success",
            actionProps: {
              children: "View",
              onClick: () => {
                router.push("/watchlist");
                toastManager.close(toastId);
              },
            },
          });
        }
        router.refresh();
      } else {
        const isDuplicate =
          result.error?.includes("duplicate") ||
          result.error?.includes("unique");
        if (isDuplicate) {
          router.refresh();
        } else {
          setIsInWatchlist(wasInWatchlist);
          toastManager.add({
            title: result.error ?? "Something went wrong",
            type: "error",
          });
        }
      }
    } catch {
      setIsInWatchlist(wasInWatchlist);
      toastManager.add({ title: "Something went wrong", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  }, [user, isBusy, isInWatchlist, mediaId, mediaType, router]);

  const openShare = () => {
    setIsOpen(false);
    setShowShareDialog(true);
  };

  const goToLogin = () => {
    setShowAuthDialog(false);
    router.push("/login");
  };

  // Button variant for detail pages
  if (variant === "button") {
    return (
      <>
        <button
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer",
            isInWatchlist
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
            isBusy && "pointer-events-none opacity-50",
            className,
          )}
          onClick={toggleWatchlist}
          disabled={isBusy}
          aria-label={watchlistLabel}
          onMouseEnter={() => bookmarkIconRef.current?.play()}
        >
          {isBusy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <AnimatedIcon
              ref={bookmarkIconRef}
              icon={isInWatchlist ? bookmarkFilledIcon : bookmarkIcon}
              size={16}
              className={cn(isInWatchlist && "text-primary")}
            />
          )}
          {watchlistLabel}
        </button>
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onSignIn={goToLogin}
        />
      </>
    );
  }

  // Expandable menu variant for cards
  return (
    <>
      <div
        ref={menuRef}
        className={cn("relative", isOpen ? "z-50" : "z-10", className)}
        style={{ width: triggerSize, height: triggerSize }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Trigger */}
        <motion.button
          className={cn(
            "absolute right-0 top-0 flex items-center justify-center rounded-full cursor-pointer",
            "bg-background/70 hover:bg-background/90 backdrop-blur-sm",
            isOpen && "opacity-0 pointer-events-none",
          )}
          style={{ width: triggerSize, height: triggerSize }}
          onClick={() => setIsOpen(true)}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.1 }}
          aria-label="Open menu"
        >
          <MoreVertical
            size={size === "sm" ? 16 : 18}
            className="text-foreground/70"
          />
        </motion.button>

        {/* Expandable menu */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ width: MENU_WIDTH }}
              className="absolute right-0 top-0 origin-top-right overflow-hidden bg-popover border border-border rounded-xl shadow-lg"
            >
              <div className="flex flex-col p-1.5">
                <WatchlistMenuItem
                  label={watchlistLabel}
                  onClick={toggleWatchlist}
                  isActive={isInWatchlist}
                  isLoading={isBusy}
                />
                <ShareMenuItem onClick={openShare} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSignIn={goToLogin}
      />

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        mediaId={mediaId}
        mediaType={mediaType}
      />
    </>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Menu Items
// ─────────────────────────────────────────────────────────────────────────────

function WatchlistMenuItem({
  label,
  onClick,
  isActive,
  isLoading,
}: {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  isLoading?: boolean;
}) {
  const iconRef = React.useRef<AnimatedIconHandle>(null);

  return (
    <button
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer hover:bg-accent",
        isActive && "text-primary",
      )}
      onClick={onClick}
      disabled={isLoading}
      onMouseEnter={() => iconRef.current?.play()}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <AnimatedIcon
          ref={iconRef}
          icon={isActive ? bookmarkFilledIcon : bookmarkIcon}
          size={16}
          className={cn("opacity-60", isActive && "opacity-100 text-primary")}
        />
      )}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function ShareMenuItem({ onClick }: { onClick: () => void }) {
  const iconRef = React.useRef<AnimatedIconHandle>(null);

  return (
    <button
      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer hover:bg-accent"
      onClick={onClick}
      onMouseEnter={() => iconRef.current?.play()}
    >
      <AnimatedIcon
        ref={iconRef}
        icon={shareIcon}
        size={16}
        className="opacity-60"
      />
      <span className="whitespace-nowrap">Share</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth Dialog
// ─────────────────────────────────────────────────────────────────────────────

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
