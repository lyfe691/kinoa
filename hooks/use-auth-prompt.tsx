"use client";

import Image from "next/image";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

export type AuthPromptMedia = {
  title: string;
  subtitle?: string;
  badge?: string;
  image?: string | null;
  meta?: string[];
};

type AuthPromptOptions = {
  title: string;
  description?: string;
  media?: AuthPromptMedia;
  continueLabel?: string;
  cancelLabel?: string;
  onContinue?: () => void;
  onClose?: () => void;
};

export function useAuthPrompt() {
  const [options, setOptions] = React.useState<AuthPromptOptions | null>(null);

  const closePrompt = React.useCallback(() => {
    setOptions(null);
    options?.onClose?.();
  }, [options]);

  const openAuthPrompt = React.useCallback((config: AuthPromptOptions) => {
    setOptions(config);
  }, []);

  const AuthPrompt = React.useCallback(() => {
    if (!options) return null;

    const {
      title,
      description,
      media,
      continueLabel = "Sign in",
      cancelLabel = "Maybe later",
      onContinue,
    } = options;

    return (
      <Dialog open onOpenChange={(open) => !open && closePrompt()}>
        <DialogContent className="max-w-lg gap-6 rounded-2xl">
          {media && (
            <div className="flex flex-col gap-4 rounded-xl bg-muted/40 p-4 sm:flex-row sm:items-center">
              <div className="overflow-hidden rounded-lg bg-background/50 shadow-sm">
                <AspectRatio ratio={2 / 3} className="w-full sm:w-32">
                  {media.image ? (
                    <Image
                      src={media.image}
                      alt=""
                      fill
                      unoptimized
                      sizes="128px"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <span className="text-sm font-medium">No image</span>
                    </div>
                  )}
                </AspectRatio>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {media.badge && <Badge variant="secondary">{media.badge}</Badge>}
                  {media.meta && media.meta.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {media.meta.map((item, index) => (
                        <React.Fragment key={item}>
                          {index > 0 && (
                            <Separator orientation="vertical" className="h-4" />
                          )}
                          <span>{item}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-base font-semibold leading-tight">{media.title}</p>
                  {media.subtitle && (
                    <p className="text-sm text-muted-foreground">{media.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-2xl font-semibold leading-tight">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-base text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => closePrompt()}
            >
              {cancelLabel}
            </Button>
            <Button
              className={cn("w-full sm:w-auto")}
              onClick={() => {
                closePrompt();
                onContinue?.();
              }}
            >
              {continueLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }, [options, closePrompt]);

  return { openAuthPrompt, AuthPrompt };
}
