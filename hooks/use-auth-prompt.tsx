"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"
import { createPortal } from "react-dom"

import { Button } from "@/components/ui/button"
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
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

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
    (placement: "desktop" | "mobile") => {
      if (!config?.media) return null

      const { image, subtitle, tag, title } = config.media

      return (
        <div
          className={cn(
            "pointer-events-none absolute",
            placement === "desktop"
              ? "-top-16 right-6 sm:-top-20 sm:right-10"
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
        {renderMediaPreview("desktop")}

        <div className="space-y-2 text-left">
          <p className="text-xl font-semibold text-foreground">{config.title}</p>
          <p className="text-base text-muted-foreground">{config.description}</p>
        </div>

        <div className="sm:justify-between">{renderActions()}</div>
      </div>
    )
  }, [config, renderActions, renderMediaPreview])

  const AuthPrompt = React.useCallback(() => {
    const open = Boolean(config)

    if (!open) return null

    const portal = isDesktop ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closePrompt}
        />

        <div className="relative w-full max-w-md overflow-visible">
          {renderMediaPreview("desktop")}

          <div className="relative w-full overflow-visible rounded-2xl border bg-background p-6 shadow-2xl ring-1 ring-border">
            {renderContent()}
          </div>
        </div>
      </div>
    ) : (
      <div className="fixed inset-0 z-50 flex flex-col justify-end">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closePrompt}
        />

        <div className="relative w-full overflow-visible rounded-t-3xl border bg-background px-4 pb-6 pt-8 shadow-2xl ring-1 ring-border sm:px-6">
          <span className="absolute left-1/2 top-3 h-1.5 w-12 -translate-x-1/2 rounded-full bg-muted" />

          {renderMediaPreview("mobile")}

          <div className="space-y-5 pt-2">
            <div className="space-y-2 text-left">
              <p className="text-lg font-semibold text-foreground">{config?.title}</p>
              <p className="text-base text-muted-foreground">{config?.description}</p>
            </div>

            <div className="gap-2">{renderActions(true)}</div>
          </div>
        </div>
      </div>
    )

    if (!isMounted) return null

    return createPortal(portal, document.body)
  }, [
    closePrompt,
    config,
    isDesktop,
    isMounted,
    renderContent,
    renderActions,
    renderMediaPreview,
  ])

  return { requireAuth, AuthPrompt }
}
