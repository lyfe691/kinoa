"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Bookmark, Loader2 } from "lucide-react";
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
import { AnimatedIcon } from "@/components/animated-icon";
import { useSession } from "@/lib/supabase/auth";
import { addToWatchlist, removeFromWatchlist } from "@/lib/supabase/watchlist";
import { useWatchlistStatus } from "@/hooks/use-watchlist-status";
import { toastManager } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import shareIcon from "@/public/icons/share.json";

type MediaMenuProps = {
  mediaId: number;
  mediaType: "movie" | "tv";
  isInWatchlist?: boolean;
  className?: string;
  size?: "sm" | "default";
  variant?: "menu" | "button";
};

const BUTTON_SIZE = { sm: 36, default: 40 } as const;
const MENU_WIDTH = 180;
const MENU_HEIGHT = 84;

export function MediaMenu({
  mediaId,
  mediaType,
  isInWatchlist: initialIsInWatchlist,
  className,
  size = "default",
  variant = "menu",
}: MediaMenuProps) {
  const router = useRouter();
  const { user } = useSession();
  const { isInWatchlist: fetchedIsInWatchlist, loading: isChecking } =
    useWatchlistStatus(mediaId, mediaType, initialIsInWatchlist);

  const [isOpen, setIsOpen] = React.useState(false);
  const [isInWatchlist, setIsInWatchlist] = React.useState(
    initialIsInWatchlist ?? false,
  );
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const isBusy = isProcessing || isChecking;
  const buttonSize = BUTTON_SIZE[size];

  // Sync with fetched status
  React.useEffect(() => {
    if (!isChecking) setIsInWatchlist(fetchedIsInWatchlist);
  }, [fetchedIsInWatchlist, isChecking]);

  // Close menu on escape or outside click
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleWatchlist = React.useCallback(async () => {
    if (!user) return setShowAuthDialog(true);
    if (isBusy) return;

    setIsProcessing(true);
    const wasInWatchlist = isInWatchlist;
    setIsInWatchlist(!wasInWatchlist);

    try {
      const result = await (wasInWatchlist
        ? removeFromWatchlist(mediaId, mediaType)
        : addToWatchlist(mediaId, mediaType));

      if (result.success) {
        if (wasInWatchlist) {
          toastManager.add({
            title: "Removed from watchlist",
            type: "success",
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

  const handleShare = () => {
    const path = mediaType === "movie" ? `/movie/${mediaId}` : `/tv/${mediaId}`;
    navigator.clipboard.writeText(window.location.origin + path);
    toastManager.add({ title: "Link copied to clipboard", type: "success" });
    setIsOpen(false);
  };

  const openAuthDialog = () => {
    setShowAuthDialog(false);
    router.push("/login");
  };

  const watchlistLabel = isInWatchlist ? "In Watchlist" : "Add to Watchlist";

  // Simple button variant for detail pages
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
        >
          {isBusy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Bookmark
              className={cn("size-4", isInWatchlist && "fill-primary")}
            />
          )}
          {watchlistLabel}
        </button>

        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onSignIn={openAuthDialog}
        />
      </>
    );
  }

  // Expandable menu for media cards
  return (
    <>
      <div
        ref={menuRef}
        className={cn("relative z-10", className)}
        style={{ width: buttonSize, height: buttonSize }}
      >
        <motion.div
          layout
          initial={false}
          animate={{
            width: isOpen ? MENU_WIDTH : buttonSize,
            height: isOpen ? MENU_HEIGHT : buttonSize,
            borderRadius: isOpen ? 12 : buttonSize / 2,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className={cn(
            "absolute right-0 top-0 overflow-hidden border",
            isOpen
              ? "bg-popover border-border shadow-lg"
              : "bg-background/80 border-border/50 hover:bg-accent hover:border-border",
          )}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait" initial={false}>
            {!isOpen ? (
              <motion.button
                key="trigger"
                className="flex items-center justify-center w-full h-full cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open menu"
                onClick={() => setIsOpen(true)}
              >
                <MoreVertical
                  size={size === "sm" ? 18 : 20}
                  className="text-foreground/70"
                />
              </motion.button>
            ) : (
              <motion.div
                key="menu"
                className="flex flex-col justify-center h-full p-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                <MenuItem
                  icon={Bookmark}
                  label={watchlistLabel}
                  onClick={toggleWatchlist}
                  isActive={isInWatchlist}
                  isLoading={isBusy}
                />
                <ShareMenuItem onClick={handleShare} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSignIn={openAuthDialog}
      />
    </>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  isActive,
  isLoading,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  isLoading?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer",
        "hover:bg-accent",
        isActive && "text-primary",
      )}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Icon
          className={cn("size-4", isActive ? "fill-primary" : "opacity-60")}
        />
      )}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function ShareMenuItem({ onClick }: { onClick: () => void }) {
  const iconRef =
    React.useRef<import("@/components/animated-icon").AnimatedIconHandle>(null);

  return (
    <button
      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer hover:bg-accent"
      onClick={onClick}
      onMouseEnter={() => iconRef.current?.play()}
    >
      <AnimatedIcon ref={iconRef} icon={shareIcon} size={20} />
      <span className="whitespace-nowrap">Share</span>
    </button>
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
