"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, FileJson, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toastManager } from "@/components/ui/toast";
import { useWatchlist } from "@/components/watchlist-provider";
import {
  importWatchlistItems,
  type WatchlistImportItem,
} from "@/lib/supabase/watchlist";
import type { MediaSummary } from "@/lib/tmdb";

const EXPORT_VERSION = 1;

type WatchlistTransferProps = {
  media: MediaSummary[];
};

type WatchlistExportPayload = {
  version: number;
  exportedAt: string;
  items: {
    id: number;
    type: "movie" | "tv";
    title: string;
    href: string;
  }[];
};

function buildExportPayload(media: MediaSummary[]): WatchlistExportPayload {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    items: media.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.name,
      href: item.href,
    })),
  };
}

function readItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const items = (payload as { items?: unknown[] }).items;
    if (Array.isArray(items)) {
      return items;
    }

    const legacyItems = (payload as { watchlist?: unknown[] }).watchlist;
    if (Array.isArray(legacyItems)) {
      return legacyItems;
    }
  }

  return [];
}

function parseImportPayload(
  rawText: string,
): { items?: WatchlistImportItem[]; error?: string } {
  if (!rawText.trim()) {
    return { error: "Paste the exported JSON first." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    console.error("Invalid JSON provided for watchlist import:", error);
    return {
      error: "We couldn't read that file. Double-check the JSON and try again.",
    };
  }

  const items = readItems(parsed);

  if (!items.length) {
    return { error: "No watchlist items found in the provided file." };
  }

  const normalized = new Map<string, WatchlistImportItem>();

  items.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const typedItem = item as {
      id?: number;
      media_id?: number;
      type?: string;
      media_type?: string;
    };

    const mediaType =
      typedItem.type === "movie" || typedItem.type === "tv"
        ? typedItem.type
        : typedItem.media_type === "movie" || typedItem.media_type === "tv"
          ? typedItem.media_type
          : null;

    const mediaIdRaw = typedItem.id ?? typedItem.media_id;
    const mediaId = typeof mediaIdRaw === "number" ? mediaIdRaw : null;

    if (!mediaType || !mediaId || Number.isNaN(mediaId) || mediaId <= 0) {
      return;
    }

    const key = `${mediaType}-${mediaId}`;
    if (!normalized.has(key)) {
      normalized.set(key, { media_id: mediaId, media_type: mediaType });
    }
  });

  const normalizedItems = Array.from(normalized.values());

  if (!normalizedItems.length) {
    return { error: "No valid watchlist items were detected in the file." };
  }

  return { items: normalizedItems };
}

export function WatchlistTransfer({ media }: WatchlistTransferProps) {
  const router = useRouter();
  const { refreshWatchlist } = useWatchlist();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [importText, setImportText] = React.useState("");
  const [replaceExisting, setReplaceExisting] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [importError, setImportError] = React.useState<string | null>(null);
  const [isImporting, setIsImporting] = React.useState(false);

  const exportPayload = React.useMemo(
    () => buildExportPayload(media),
    [media],
  );
  const exportJson = React.useMemo(
    () => JSON.stringify(exportPayload, null, 2),
    [exportPayload],
  );
  const exportFileName = React.useMemo(() => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return `kinoa-watchlist-${formattedDate}.json`;
  }, []);

  const handleDownload = React.useCallback(() => {
    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = exportFileName;
    anchor.click();
    URL.revokeObjectURL(url);
    toastManager.add({
      title: "Watchlist exported",
      description: "Your JSON file is ready for download.",
      type: "success",
    });
  }, [exportFileName, exportJson]);

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
      toastManager.add({
        title: "Copied to clipboard",
        description: "Paste this JSON later to restore your watchlist.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to copy watchlist export:", error);
      toastManager.add({
        title: "Copy failed",
        description: "We couldn't copy the data. Please download the file.",
        type: "error",
      });
    }
  }, [exportJson]);

  const handleFileSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setImportText(text);
      setFileName(file.name);
      setImportError(null);
      event.target.value = "";
    } catch (error) {
      console.error("Failed to read import file:", error);
      setImportError("We couldn't read that file. Try another JSON export.");
    }
  };

  const handleImport = async () => {
    setImportError(null);
    const { items, error } = parseImportPayload(importText);

    if (error || !items) {
      setImportError(error ?? "Unable to process that import file.");
      return;
    }

    setIsImporting(true);

    try {
      const result = await importWatchlistItems(items, {
        replace: replaceExisting,
      });

      if (!result.success) {
        setImportError(
          result.error ?? "Something went wrong while importing your data.",
        );
        toastManager.add({
          title: "Import failed",
          description:
            result.error ?? "We couldn't import your watchlist. Try again.",
          type: "error",
        });
        return;
      }

      toastManager.add({
        title: "Watchlist imported",
        description:
          result.imported > 0
            ? `Added ${result.imported} ${
                result.imported === 1 ? "title" : "titles"
              } (${result.skipped} skipped).`
            : "Everything was already in your watchlist.",
        type: "success",
      });

      await refreshWatchlist();
      router.refresh();
      setIsDialogOpen(false);
      setImportText("");
      setReplaceExisting(false);
      setFileName(null);
    } catch (error) {
      console.error("Unexpected error during watchlist import:", error);
      setImportError("Something went wrong. Please try again.");
      toastManager.add({
        title: "Import failed",
        description: "Something went wrong while importing your watchlist.",
        type: "error",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const watchlistCount = media.length;

  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>Export or import your watchlist</FrameTitle>
        <FrameDescription>
          Download a portable JSON backup or restore titles from a previous
          export.
        </FrameDescription>
      </FrameHeader>
      <FramePanel className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
            <FileJson className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Portable watchlist JSON
            </p>
            <p className="text-sm text-muted-foreground">
              {watchlistCount > 0
                ? `Includes ${watchlistCount} ${watchlistCount === 1 ? "title" : "titles"}.`
                : "Import a previous export to start your watchlist."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            Copy JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Export file
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" size="sm">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import watchlist</DialogTitle>
                <DialogDescription>
                  Upload the JSON file you exported or paste its contents below.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="watchlist-file">Import from file</Label>
                  <Input
                    id="watchlist-file"
                    type="file"
                    accept="application/json"
                    onChange={handleFileSelection}
                  />
                  {fileName && (
                    <p className="text-xs text-muted-foreground">
                      Loaded from {fileName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="watchlist-json">Or paste JSON</Label>
                  <Textarea
                    id="watchlist-json"
                    placeholder='{"items":[{"id":123,"type":"movie"}]}'
                    rows={6}
                    value={importText}
                    onChange={(event) => {
                      setImportText(event.target.value);
                      setImportError(null);
                    }}
                  />
                  {importError && (
                    <p className="text-xs text-destructive">{importError}</p>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      Replace existing watchlist
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Remove current titles before importing.
                    </p>
                  </div>
                  <Switch
                    checked={replaceExisting}
                    onCheckedChange={setReplaceExisting}
                    aria-label="Replace existing watchlist"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleImport}
                  disabled={isImporting}
                >
                  {isImporting ? "Importing..." : "Import watchlist"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </FramePanel>
    </Frame>
  );
}
