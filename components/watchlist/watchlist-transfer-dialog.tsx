"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Archive, Download, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toastManager } from "@/components/ui/toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWatchlist } from "@/components/watchlist-provider";
import type { MediaSummary } from "@/lib/tmdb";

type ImportItem = { id: number; type: "movie" | "tv" };

function parseImportFile(data: unknown): ImportItem[] {
  const items = Array.isArray(data)
    ? data
    : Array.isArray((data as { items?: unknown })?.items)
      ? (data as { items: unknown[] }).items
      : [];

  const seen = new Set<string>();
  const result: ImportItem[] = [];

  for (const item of items) {
    const type =
      (item as { type?: string; media_type?: string }).type ??
      (item as { media_type?: string }).media_type;
    const id =
      (item as { id?: number; media_id?: number }).id ??
      (item as { media_id?: number }).media_id;

    if (
      (type === "movie" || type === "tv") &&
      typeof id === "number" &&
      id > 0
    ) {
      const key = `${type}-${id}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({ id, type });
      }
    }
  }

  return result;
}

type TransferContentProps = {
  media: MediaSummary[];
  onSuccess?: () => void;
};

function TransferContent({ media, onSuccess }: TransferContentProps) {
  const router = useRouter();
  const {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    watchlist,
    isLoading,
  } = useWatchlist();

  const [replaceMode, setReplaceMode] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const currentItems = React.useMemo(
    () => media.filter((m) => isInWatchlist(m.id, m.type)),
    [media, isInWatchlist],
  );

  const handleExport = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      items: currentItems.map((m) => ({
        id: m.id,
        type: m.type,
        name: m.name,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kinoa-watchlist-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    setBusy(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const items = parseImportFile(parsed);

      if (items.length === 0) {
        toastManager.add({
          title: "Import failed",
          description: "No valid items found in file",
          type: "error",
        });
        return;
      }

      const toAdd = items.filter((i) => !isInWatchlist(i.id, i.type));
      const importedKeys = new Set(items.map((i) => `${i.type}-${i.id}`));
      const toRemove = replaceMode
        ? Array.from(watchlist).filter((k) => !importedKeys.has(k))
        : [];

      await Promise.all([
        ...toAdd.map((i) => addToWatchlist(i.id, i.type)),
        ...toRemove.map((key) => {
          const [type, id] = key.split("-");
          return removeFromWatchlist(Number(id), type as "movie" | "tv");
        }),
      ]);

      const parts: string[] = [];
      if (toAdd.length) parts.push(`${toAdd.length} added`);
      if (toRemove.length) parts.push(`${toRemove.length} removed`);

      toastManager.add({
        title: "Import complete",
        description: parts.length ? parts.join(", ") : "Already up to date",
        type: "success",
      });

      router.refresh();
      onSuccess?.();
    } catch (e) {
      toastManager.add({
        title: "Import failed",
        description: e instanceof Error ? e.message : "Could not read file",
        type: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Export</p>
          <p className="text-xs text-muted-foreground">
            Download your watchlist as JSON
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={currentItems.length === 0 || isLoading}
          className="w-full"
        >
          <Download className="mr-2 size-4" />
          Export ({currentItems.length})
        </Button>
      </div>

      {/* Import */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Import</p>
          <p className="text-xs text-muted-foreground">
            Restore from a JSON backup
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border px-3 py-2">
          <Label htmlFor="replace-toggle" className="cursor-pointer text-sm">
            Replace existing
          </Label>
          <Switch
            id="replace-toggle"
            checked={replaceMode}
            onCheckedChange={setReplaceMode}
          />
        </div>
        {replaceMode && (
          <p className="text-xs text-muted-foreground">
            Items not in the file will be removed from your watchlist.
          </p>
        )}

        <Button
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={busy || isLoading}
          className="w-full"
        >
          <Upload className="mr-2 size-4" />
          {busy ? "Importing..." : "Select File"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) void handleImport(f);
          }}
        />
      </div>
    </div>
  );
}

type WatchlistTransferDialogProps = {
  media: MediaSummary[];
  trigger?: React.ReactNode;
};

export function WatchlistTransferDialog({
  media,
  trigger,
}: WatchlistTransferDialogProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState(0);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) setKey((k) => k + 1); // Reset content state on open
  };

  const defaultTrigger = (
    <Button variant="outline" size="lg">
      <Archive className="size-4" />
      Backup
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>{trigger ?? defaultTrigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Manage Watchlist</DrawerTitle>
            <DrawerDescription>
              Export or import your saved titles
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <TransferContent
              key={key}
              media={media}
              onSuccess={() => setOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Manage Watchlist</DialogTitle>
          <DialogDescription>
            Export or import your saved titles
          </DialogDescription>
        </DialogHeader>
        <TransferContent
          key={key}
          media={media}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
