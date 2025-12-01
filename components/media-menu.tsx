"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Loader2 } from "lucide-react";
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

const PARTICLE_COUNT = 5;

function getParticleAnimation(index: number) {
  const angle = (index / PARTICLE_COUNT) * (2 * Math.PI);
  const radius = 18 + Math.random() * 8;
  const scale = 0.8 + Math.random() * 0.4;
  const duration = 0.6 + Math.random() * 0.1;

  return {
    initial: { scale: 0, opacity: 0.3, x: 0, y: 0 },
    animate: {
      scale: [0, scale, 0],
      opacity: [0.3, 0.8, 0],
      x: [0, Math.cos(angle) * radius],
      y: [0, Math.sin(angle) * radius * 0.75],
    },
    transition: { duration, delay: index * 0.04, ease: "easeOut" as const },
  };
}

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
  // We don't use a local 'loading' state for the UI to avoid replacing the icon with a spinner
  // during the optimistic update. This prevents the "animation playing while loading" glitch.
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const [animationKey, setAnimationKey] = React.useState(0);

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

    // Optimistic update: toggle immediately
    const previousState = isInWatchlist;
    setIsInWatchlist(!previousState);

    // Trigger animation immediately if adding
    if (!previousState) {
      setAnimationKey((k) => k + 1);
    }

    try {
      if (previousState) {
        const result = await removeFromWatchlist(mediaId, mediaType);
        if (result.success) {
          toastManager.add({
            title: "Removed from watchlist",
            type: "success",
          });
          router.refresh();
        } else {
          setIsInWatchlist(true); // Revert
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
            setIsInWatchlist(false); // Revert
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
      setIsInWatchlist(!isInWatchlist); // Revert
    }
  }, [user, isInWatchlist, mediaId, mediaType, router, checkingWatchlist]);

  // Only show loader if we are initially checking status, not during user interaction
  const isBusy = checkingWatchlist;
  const label = isInWatchlist ? "In Watchlist" : "Add to Watchlist";

  if (layout === "icon") {
    const containerSize = size === "sm" ? "h-9 w-9" : "h-11 w-11";
    const iconSize = size === "sm" ? 16 : 20;

    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative flex items-center justify-center z-0">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full cursor-pointer relative z-10",
                  containerSize,
                  "hover:bg-primary/5 active:scale-95",
                  className,
                )}
                aria-label={label}
                aria-pressed={isInWatchlist}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleWatchlist();
                }}
                disabled={isBusy}
              >
                {isBusy ? (
                  <Loader2 className={cn("animate-spin", size === "sm" ? "h-4 w-4" : "h-5 w-5")} />
                ) : (
                  <BookmarkIcon
                    size={iconSize}
                    isSaved={isInWatchlist}
                    animationKey={animationKey}
                  />
                )}
              </Button>

              {/* Particles live outside the button to prevent clipping */}
              <SavedParticles animationKey={animationKey} />
            </div>
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
        aria-label={label}
        aria-pressed={isInWatchlist}
      >
        <span className="relative flex items-center justify-center">
          {isBusy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BookmarkIcon
              size={16}
              isSaved={isInWatchlist}
              animationKey={animationKey}
            />
          )}
        </span>
        <span className="text-sm font-medium">{label}</span>
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

function BookmarkIcon({
  size,
  isSaved,
  animationKey,
}: {
  size: number;
  isSaved: boolean;
  animationKey: number;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <Bookmark className="opacity-60" size={size} aria-hidden="true" />
      <Bookmark
        className="absolute text-primary fill-primary transition-opacity duration-300"
        size={size}
        aria-hidden="true"
        style={{ opacity: isSaved ? 1 : 0 }}
      />
      <AnimatePresence mode="wait">
        {isSaved && (
          <motion.div
            key={animationKey}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--primary), transparent 60%) 0%, transparent 80%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SavedParticles({ animationKey }: { animationKey: number }) {
  return (
    <AnimatePresence mode="wait">
      {animationKey > 0 && (
        <motion.div
          key={animationKey}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          {[...Array(PARTICLE_COUNT)].map((_, i) => {
            const anim = getParticleAnimation(i);
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-primary"
                style={{
                  width: `${4 + Math.random() * 2}px`,
                  height: `${4 + Math.random() * 2}px`,
                  filter: "blur(1px)",
                  transform: "translate(-50%, -50%)",
                }}
                initial={anim.initial}
                animate={anim.animate}
                transition={anim.transition}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
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
