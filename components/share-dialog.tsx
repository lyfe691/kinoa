"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useClipboard } from "@/hooks/use-clipboard";
import {
  AnimatedIcon,
  type AnimatedIconHandle,
} from "@/components/animated-icon";
import linkIcon from "@/public/icons/link.json";
import copyIcon from "@/public/icons/copy.json";

type ShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: number;
  mediaType: "movie" | "tv";
};

export function ShareDialog({
  open,
  onOpenChange,
  mediaId,
  mediaType,
}: ShareDialogProps) {
  const isMobile = useIsMobile();
  const { isCopied, copyToClipboard } = useClipboard();
  const linkIconRef = React.useRef<AnimatedIconHandle>(null);
  const copyIconRef = React.useRef<AnimatedIconHandle>(null);

  const shareUrl = React.useMemo(
    () =>
      typeof window !== "undefined"
        ? `${window.location.origin}/${mediaType}/${mediaId}`
        : "",
    [mediaType, mediaId],
  );

  const handleCopy = () => {
    copyToClipboard(shareUrl);
    copyIconRef.current?.play();
  };

  // Play link animation on open
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => linkIconRef.current?.play(), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const content = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl border border-border bg-muted/30 focus-within:ring-2 focus-within:ring-ring/20 transition-all">
        <input
          className="flex-1 bg-transparent border-none text-sm font-mono text-foreground outline-none placeholder:text-muted-foreground/50 min-w-0"
          value={shareUrl}
          readOnly
          onClick={(e) => e.currentTarget.select()}
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCopy}
          className="shrink-0 h-9 px-4 rounded-lg font-medium min-w-[90px] shadow-sm"
        >
          <div className="flex items-center gap-2">
            <AnimatedIcon
              ref={copyIconRef}
              icon={copyIcon}
              size={18}
              className="opacity-70"
            />
            <div className="relative overflow-hidden h-5 w-12">
              <AnimatePresence mode="wait" initial={false}>
                {isCopied ? (
                  <motion.span
                    key="copied"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center"
                  >
                    Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center"
                  >
                    Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );

  const HeaderTitle = () => (
    <div
      className="flex items-center gap-2"
      onMouseEnter={() => linkIconRef.current?.play()}
    >
      <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
        <AnimatedIcon ref={linkIconRef} icon={linkIcon} size={20} />
      </div>
      <span>Share</span>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>
              <HeaderTitle />
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm p-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            <HeaderTitle />
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
