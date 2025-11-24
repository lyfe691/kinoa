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
      <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
        <div className="relative h-16 w-12 overflow-hidden rounded-md bg-muted shadow-sm">
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

        <div className="min-w-0 space-y-1">
          {tag && (
            <span className="text-[11px] font-medium uppercase tracking-wide text-primary/80">
              {tag}
            </span>
          )}
          <p className="line-clamp-1 text-sm font-semibold leading-tight">
            {title}
          </p>
          {subtitle && (
            <p className="line-clamp-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    )
  }, [config])

  const renderContent = React.useCallback(() => {
    if (!config) return null

    return (
      <div className="space-y-4">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {renderMediaPreview()}

        <DialogFooter className="sm:justify-between">
          <Button
            variant="ghost"
            className="w-full justify-center sm:w-auto"
            onClick={closePrompt}
          >
            {config.cancelLabel ?? "Cancel"}
          </Button>
          <Button
            className="w-full justify-center sm:w-auto"
            onClick={handleSignIn}
          >
            {config.actionLabel ?? "Sign in"}
          </Button>
        </DialogFooter>
      </div>
    )
  }, [closePrompt, config, handleSignIn, renderMediaPreview])

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
          <DrawerHeader className="text-left">
            <DrawerTitle>{config?.title}</DrawerTitle>
            <DrawerDescription>{config?.description}</DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 px-4">
            {renderMediaPreview()}
            <DrawerFooter className="gap-2 px-0">
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={closePrompt}
              >
                {config?.cancelLabel ?? "Cancel"}
              </Button>
              <Button className="w-full justify-center" onClick={handleSignIn}>
                {config?.actionLabel ?? "Sign in"}
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }, [
    closePrompt,
    config,
    handleSignIn,
    isDesktop,
    renderContent,
    renderMediaPreview,
  ])

  return { requireAuth, AuthPrompt }
}
