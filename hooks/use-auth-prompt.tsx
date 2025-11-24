"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useSession } from "@/lib/supabase/auth"
import { cn } from "@/lib/utils"

export type AuthPromptMedia = {
  title: string
  subtitle?: string
  image?: string | null
  tag?: string
}

export type AuthPromptConfig = {
  title?: string
  description?: string
  actionLabel?: string
  cancelLabel?: string
  redirectTo?: string
  media?: AuthPromptMedia
}

type UseAuthPromptReturn = {
  requireAuth: (
    config: AuthPromptConfig,
    onAuthorized?: () => void | Promise<void>,
  ) => Promise<boolean> | boolean
  AuthPrompt: () => React.JSX.Element | null
}

export function useAuthPrompt(): UseAuthPromptReturn {
  const router = useRouter()
  const { user } = useSession()
  const [config, setConfig] = React.useState<AuthPromptConfig | null>(null)
  const [isDesktop, setIsDesktop] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)")
    setIsDesktop(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    mediaQuery.addEventListener("change", handler)

    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  const requireAuth = React.useCallback(
    async (
      nextConfig: AuthPromptConfig,
      onAuthorized?: () => void | Promise<void>,
    ) => {
      if (user) {
        await onAuthorized?.()
        return true
      }

      setConfig({
        title: nextConfig.title ?? "Sign in required",
        description:
          nextConfig.description ??
          "Create a free account to sync your watchlist across devices.",
        actionLabel: nextConfig.actionLabel ?? "Sign in",
        cancelLabel: nextConfig.cancelLabel ?? "Maybe later",
        redirectTo: nextConfig.redirectTo ?? "/login",
        media: nextConfig.media,
      })

      return false
    },
    [user],
  )

  const closePrompt = React.useCallback(() => setConfig(null), [])

  const handleSignIn = React.useCallback(() => {
    if (!config) return

    const destination = config.redirectTo ?? "/login"
    closePrompt()
    router.push(destination)
  }, [closePrompt, config, router])

  const renderMediaPreview = React.useCallback(
    (placement: "dialog" | "drawer") => {
      if (!config?.media) return null

      const { image, subtitle, tag, title } = config.media

      return (
        <div
          className={cn(
            "pointer-events-none absolute",
            placement === "dialog"
              ? "-top-16 right-8 sm:right-10"
              : "left-1/2 -top-16 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0",
          )}
        >
          <div className="relative h-24 w-16 overflow-hidden rounded-xl border bg-background shadow-xl ring-1 ring-border">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                unoptimized
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="pointer-events-auto mt-3 w-44 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur">
            {tag && (
              <span className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary">
                {tag}
              </span>
            )}
            <p className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">
              {title}
            </p>
            {subtitle && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      )
    },
    [config],
  )

  const renderActions = React.useCallback(
    (stacked?: boolean) => (
      <div
        className={cn(
          "flex w-full gap-3",
          stacked ? "flex-col" : "flex-row-reverse sm:flex-row",
        )}
      >
        <Button className="w-full justify-center" onClick={handleSignIn}>
          {config?.actionLabel ?? "Sign in"}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-center"
          onClick={closePrompt}
        >
          {config?.cancelLabel ?? "Cancel"}
        </Button>
      </div>
    ),
    [closePrompt, config?.actionLabel, config?.cancelLabel, handleSignIn],
  )

  const renderContent = React.useCallback(() => {
    if (!config) return null

    return (
      <div className="relative space-y-6 overflow-visible pt-2 sm:pt-4">
        {renderMediaPreview("dialog")}

        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl">{config.title}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-between">
          {renderActions()}
        </DialogFooter>
      </div>
    )
  }, [config, renderActions, renderMediaPreview])

  const AuthPrompt = React.useCallback(() => {
    const open = Boolean(config)

    if (!open) return null

    if (isDesktop) {
      const content = renderContent()

      if (!content) return null

      return (
        <Dialog open={open} onOpenChange={(next) => !next && closePrompt()}>
          <DialogContent showCloseButton className="overflow-visible">
            {content}
          </DialogContent>
        </Dialog>
      )
    }

    return (
      <Drawer open={open} onOpenChange={(next) => !next && closePrompt()}>
        <DrawerContent className="overflow-visible pb-8">
          <div className="relative space-y-6 px-4 pb-2 pt-6 sm:pt-8">
            {renderMediaPreview("drawer")}

            <DrawerHeader className="text-left px-0 pt-0">
              <DrawerTitle className="text-lg leading-6">
                {config?.title}
              </DrawerTitle>
              <DrawerDescription className="text-base text-muted-foreground">
                {config?.description}
              </DrawerDescription>
            </DrawerHeader>

            <DrawerFooter className="gap-2 px-0 pt-0">
              {renderActions(true)}
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }, [
    closePrompt,
    config,
    isDesktop,
    renderContent,
    renderActions,
    renderMediaPreview,
  ])

  return { requireAuth, AuthPrompt }
}
