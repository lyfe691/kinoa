"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import dynamic from "next/dynamic";
import { useSession } from "@/lib/supabase/auth";
import { addToWatchlist, removeFromWatchlist } from "@/lib/supabase/watchlist";
import { useWatchlistStatus } from "@/hooks/use-watchlist-status";
import { useIsMobile } from "@/hooks/use-mobile";
import { toastManager } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  AnimatedIcon,
  type AnimatedIconHandle,
} from "@/components/animated-icon";
import { Spinner } from "@/components/ui/spinner";
import shareIcon from "@/public/icons/share.json";
import bookmarkIcon from "@/public/icons/bookmark.json";
import bookmarkFilledIcon from "@/public/icons/bookmark-filled.json";

const ShareDialog = dynamic(
  () => import("@/components/share-dialog").then((mod) => mod.ShareDialog),
  { ssr: false },
);

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
const MENU_WIDTH = 200;

// ─────────────────────────────────────────────────────────────────────────────
// Custom Hook: Watchlist Logic
// ─────────────────────────────────────────────────────────────────────────────

function useWatchlistAction({
  mediaId,
  mediaType,
  initialIsInWatchlist,
}: {
  mediaId: number;
  mediaType: "movie" | "tv";
  initialIsInWatchlist?: boolean;
}) {
  const router = useRouter();
  const { user } = useSession();
  const { isInWatchlist: fetchedStatus, loading: isChecking } =
    useWatchlistStatus(mediaId, mediaType, initialIsInWatchlist);

  const [isInWatchlist, setIsInWatchlist] = React.useState(
    initialIsInWatchlist ?? false,
  );
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);

  React.useEffect(() => {
    if (!isChecking) setIsInWatchlist(fetchedStatus);
  }, [fetchedStatus, isChecking]);

  const toggleWatchlist = React.useCallback(async () => {
    if (!user) return setShowAuthDialog(true);
    if (isProcessing || isChecking) return;

    setIsProcessing(true);
    const wasInWatchlist = isInWatchlist;
    setIsInWatchlist(!wasInWatchlist);

    try {
      const action = wasInWatchlist ? removeFromWatchlist : addToWatchlist;
      const result = await action(mediaId, mediaType);

      if (result.success) {
        const toastId = toastManager.add({
          title: wasInWatchlist
            ? "Removed from watchlist"
            : "Added to watchlist",
          type: "success",
          actionProps: wasInWatchlist
            ? {
                children: "Undo",
                onClick: async () => {
                  setIsProcessing(true);
                  const undoResult = await addToWatchlist(mediaId, mediaType);
                  if (
                    undoResult.success ||
                    undoResult.error?.includes("duplicate")
                  ) {
                    setIsInWatchlist(true);
                    toastManager.close(toastId);
                    router.refresh();
                  } else {
                    toastManager.add({
                      title: "Failed to undo",
                      type: "error",
                    });
                  }
                  setIsProcessing(false);
                },
              }
            : {
                children: "View",
                onClick: () => {
                  router.push("/watchlist");
                  toastManager.close(toastId);
                },
              },
        });
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
  }, [
    user,
    isProcessing,
    isChecking,
    isInWatchlist,
    mediaId,
    mediaType,
    router,
  ]);

  return {
    isInWatchlist,
    isBusy: isProcessing || isChecking,
    toggleWatchlist,
    showAuthDialog,
    setShowAuthDialog,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export const MediaMenu = React.memo(function MediaMenu(props: MediaMenuProps) {
  const { variant = "menu" } = props;

  if (variant === "button") {
    return <MediaMenuButton {...props} />;
  }

  return <MediaMenuPopup {...props} />;
});

// ─────────────────────────────────────────────────────────────────────────────
// Button Variant (for detail pages)
// ─────────────────────────────────────────────────────────────────────────────

function MediaMenuButton({
  mediaId,
  mediaType,
  isInWatchlist: initialIsInWatchlist,
  className,
}: MediaMenuProps) {
  const router = useRouter();
  const bookmarkIconRef = React.useRef<AnimatedIconHandle>(null);

  const {
    isInWatchlist,
    isBusy,
    toggleWatchlist,
    showAuthDialog,
    setShowAuthDialog,
  } = useWatchlistAction({ mediaId, mediaType, initialIsInWatchlist });

  const watchlistLabel = isInWatchlist ? "In Watchlist" : "Add to Watchlist";

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
          <Spinner className="size-4" />
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
        onSignIn={() => {
          setShowAuthDialog(false);
          router.push("/login");
        }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Popup/Drawer Variant (for cards)
// ─────────────────────────────────────────────────────────────────────────────

function MediaMenuPopup({
  mediaId,
  mediaType,
  isInWatchlist: initialIsInWatchlist,
  className,
  size = "default",
}: MediaMenuProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const {
    isInWatchlist,
    isBusy,
    toggleWatchlist,
    showAuthDialog,
    setShowAuthDialog,
  } = useWatchlistAction({ mediaId, mediaType, initialIsInWatchlist });

  const triggerSize = TRIGGER_SIZE[size];
  const watchlistLabel = isInWatchlist ? "In Watchlist" : "Add to Watchlist";

  // Close menu on escape or outside click (desktop only)
  React.useEffect(() => {
    if (!isOpen || isMobile) return;

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
  }, [isOpen, isMobile]);

  const handleWatchlist = () => {
    toggleWatchlist();
    setIsOpen(false);
  };

  const handleShare = () => {
    setIsOpen(false);
    setShowShareDialog(true);
  };

  const menuContent = (
    <MenuItems
      watchlistLabel={watchlistLabel}
      isInWatchlist={isInWatchlist}
      isBusy={isBusy}
      onWatchlist={handleWatchlist}
      onShare={handleShare}
      isMobile={isMobile}
    />
  );

  return (
    <>
      <div
        ref={menuRef}
        className={cn("relative", isOpen ? "z-50" : "z-10", className)}
        style={{ width: triggerSize, height: triggerSize }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <motion.button
          className={cn(
            "flex items-center justify-center rounded-full cursor-pointer relative z-20",
          )}
          style={{ width: triggerSize, height: triggerSize }}
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.1 }}
          aria-label="Open menu"
        >
          <MoreVertical
            size={size === "sm" ? 16 : 18}
            className="text-foreground/70"
          />
        </motion.button>

        {/* Desktop: Dropdown */}
        {!isMobile && (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ width: MENU_WIDTH }}
                className="absolute right-0 top-full mt-2 origin-top-right overflow-hidden bg-popover border border-border rounded-xl shadow-lg z-10"
              >
                <div className="flex flex-col p-1.5">{menuContent}</div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Mobile: Drawer */}
      {isMobile && (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <VisuallyHidden>
                <DrawerTitle>Media Options</DrawerTitle>
              </VisuallyHidden>
            </DrawerHeader>
            <div className="flex flex-col gap-1 p-4 pt-0">{menuContent}</div>
          </DrawerContent>
        </Drawer>
      )}

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSignIn={() => {
          setShowAuthDialog(false);
          router.push("/login");
        }}
      />

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        mediaId={mediaId}
        mediaType={mediaType}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared Menu Items
// ─────────────────────────────────────────────────────────────────────────────

function MenuItems({
  watchlistLabel,
  isInWatchlist,
  isBusy,
  onWatchlist,
  onShare,
  isMobile,
}: {
  watchlistLabel: string;
  isInWatchlist: boolean;
  isBusy: boolean;
  onWatchlist: () => void;
  onShare: () => void;
  isMobile: boolean;
}) {
  const watchlistIconRef = React.useRef<AnimatedIconHandle>(null);
  const shareIconRef = React.useRef<AnimatedIconHandle>(null);

  const itemClass = cn(
    "flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
    isMobile ? "px-3 py-3.5 active:bg-accent" : "px-2.5 py-2 hover:bg-accent",
  );

  return (
    <>
      <button
        className={cn(itemClass, isInWatchlist && "text-primary")}
        onClick={onWatchlist}
        disabled={isBusy}
        onMouseEnter={() => !isMobile && watchlistIconRef.current?.play()}
      >
        {isBusy ? (
          <Spinner className="size-4" />
        ) : (
          <AnimatedIcon
            ref={watchlistIconRef}
            icon={isInWatchlist ? bookmarkFilledIcon : bookmarkIcon}
            size={18}
            className={cn(
              "opacity-60",
              isInWatchlist && "opacity-100 text-primary",
            )}
          />
        )}
        <span>{watchlistLabel}</span>
      </button>

      <button
        className={itemClass}
        onClick={onShare}
        onMouseEnter={() => !isMobile && shareIconRef.current?.play()}
      >
        <AnimatedIcon
          ref={shareIconRef}
          icon={shareIcon}
          size={18}
          className="opacity-60"
        />
        <span>Share</span>
      </button>
    </>
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
