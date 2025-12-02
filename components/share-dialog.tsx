"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type ShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: number;
  mediaType: "movie" | "tv";
  title?: string;
  posterUrl?: string | null;
};

export function ShareDialog({
  open,
  onOpenChange,
  mediaId,
  mediaType,
  title,
  posterUrl,
}: ShareDialogProps) {
  const isMobile = useIsMobile();
  const [copied, setCopied] = React.useState(false);

  const shareUrl = React.useMemo(
    () => (typeof window !== "undefined" ? `${window.location.origin}/${mediaType}/${mediaId}` : ""),
    [mediaType, mediaId]
  );

  const copyLink = React.useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }, [shareUrl]);

  React.useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [open, copied]);

  const content = (
    <ShareContent
      mediaType={mediaType}
      title={title}
      posterUrl={posterUrl}
      shareUrl={shareUrl}
      copied={copied}
      onCopy={copyLink}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Share</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

function ShareContent({
  mediaType,
  title,
  posterUrl,
  shareUrl,
  copied,
  onCopy,
}: {
  mediaType: "movie" | "tv";
  title?: string;
  posterUrl?: string | null;
  shareUrl: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-3">
        {posterUrl && (
          <div className="relative shrink-0 w-12 aspect-2/3 rounded overflow-hidden bg-muted">
            <Image src={posterUrl} alt="" fill unoptimized className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          {title && <p className="font-medium truncate">{title}</p>}
          <p className="text-sm text-muted-foreground">
            {mediaType === "tv" ? "TV Show" : "Movie"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 px-3 py-2 text-sm bg-muted rounded-md text-muted-foreground font-mono truncate">
          {shareUrl}
        </div>
        <Button size="icon" variant="outline" onClick={onCopy} className="shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={copied ? "check" : "copy"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              {copied ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4" />
              )}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
}
