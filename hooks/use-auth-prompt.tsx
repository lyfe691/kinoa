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

  const renderMediaPreview = React.useCallback(() => {
    if (!config?.media) return null

    const { image, subtitle, tag, title } = config.media

    return (
      <div className="relative mx-auto w-full max-w-md pt-10">
        <div className="absolute inset-x-0 -top-12 flex justify-center">
          <div className="relative h-24 w-16 overflow-hidden rounded-xl border bg-muted shadow-lg">
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
        </div>

        <div className="rounded-2xl border bg-muted/40 p-4 pt-12 shadow-sm">
          {tag && (
            <span className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary">
              {tag}
            </span>
          )}
          <p className="line-clamp-2 text-base font-semibold leading-tight text-foreground">
            {title}
          </p>
          {subtitle && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    )
  }, [config])

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
      <div className="space-y-6">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl">{config.title}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {renderMediaPreview()}

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
          <DialogContent showCloseButton>{content}</DialogContent>
        </Dialog>
      )
    }

    return (
      <Drawer open={open} onOpenChange={(next) => !next && closePrompt()}>
        <DrawerContent>
          <div className="space-y-6 px-4 pb-6 pt-2">
            <DrawerHeader className="text-left px-0">
              <DrawerTitle className="text-lg leading-6">
                {config?.title}
              </DrawerTitle>
              <DrawerDescription className="text-base text-muted-foreground">
                {config?.description}
              </DrawerDescription>
            </DrawerHeader>

            {renderMediaPreview()}

            <DrawerFooter className="gap-2 px-0">
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
