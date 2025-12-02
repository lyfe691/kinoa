"use client";

import * as React from "react";
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
};

export function ShareDialog({
  open,
  onOpenChange,
  mediaId,
  mediaType,
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

  const content = <ShareContent shareUrl={shareUrl} copied={copied} onCopy={copyLink} />;

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

function ShareContent({
  shareUrl,
  copied,
  onCopy,
}: {
  shareUrl: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-muted/50 rounded-lg border border-border/50 text-foreground/80 font-mono truncate">
            {shareUrl}
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={onCopy}
            className="shrink-0 h-10 w-10 rounded-lg transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={copied ? "check" : "copy"}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </div>
  );
}
