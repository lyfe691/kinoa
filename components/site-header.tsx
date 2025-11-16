"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSession } from "@/lib/supabase/auth";
import { signOutEverywhere } from "@/lib/supabase/sign-out";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/supabase/errors";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/watchlist", label: "Watchlist", authRequired: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, supabase, refreshSession } = useSession();
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = React.useCallback(async () => {
    setSigningOut(true);
    try {
      await signOutEverywhere(supabase);
      await refreshSession();
      toast.success("Signed out");
      router.push("/");
      router.refresh();
    } catch (error) {
      const message = getAuthErrorMessage(
        error,
        "We couldn't sign you out. Please try again.",
      );
      toast.error(message);
    } finally {
    setSigningOut(false);
    }
  }, [supabase, refreshSession, router]);

  return (
    <Drawer shouldScaleBackground setBackgroundColorOnScale={false}>
      <header className={cn("sticky top-0 z-50 bg-background")}>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <BrandLink />
          <DesktopNav pathname={pathname} user={user} />

          <div className="flex-1" />

          <DesktopActions
            loading={loading}
            user={user}
            onSignOut={handleSignOut}
            signingOut={signingOut}
          />

          <MobileMenuTrigger />
        </div>
      </header>

      <MobileDrawer
        pathname={pathname}
        loading={loading}
        user={user}
        signingOut={signingOut}
        onSignOut={handleSignOut}
      />
    </Drawer>
  );
}

function BrandLink() {
  return (
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-70"
          >
            kinoa
          </Link>
  );
}

function DesktopNav({
  pathname,
  user,
}: {
  pathname: string | null;
  user: ReturnType<typeof useSession>["user"];
}) {
  return (
          <nav className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.filter((item) => !item.authRequired || user).map(
        ({ href, label }) => {
              const isActive =
          pathname === href || (href !== "/" && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
        },
      )}
          </nav>
  );
}

type DesktopActionsProps = {
  loading: boolean;
  user: ReturnType<typeof useSession>["user"];
  onSignOut: () => void;
  signingOut: boolean;
};

function DesktopActions({
  loading,
  user,
  onSignOut,
  signingOut,
}: DesktopActionsProps) {
  return (
    <div className="hidden md:flex items-center gap-3">
      {!loading && (
        <>
          {user ? (
                <Button
                  variant="ghost"
                  size="sm"
              onClick={onSignOut}
              disabled={signingOut}
            >
                  <LogOut className="h-4 w-4" />
                  {signingOut ? "Signing out..." : "Sign out"}
            </Button>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </>
      )}
            <ModeToggle />
          </div>
  );
}

function MobileMenuTrigger() {
  return (
          <div className="flex md:hidden">
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
                className="h-9 w-9"
              >
                <div className="flex h-4 w-4 flex-col items-center justify-center gap-1">
                  <span className="h-0.5 w-full rounded-full bg-current" />
                  <span className="h-0.5 w-full rounded-full bg-current" />
                </div>
              </Button>
            </DrawerTrigger>
          </div>
  );
}

type MobileDrawerProps = {
  pathname: string | null;
  loading: boolean;
  user: ReturnType<typeof useSession>["user"];
  signingOut: boolean;
  onSignOut: () => void;
};

function MobileDrawer({
  pathname,
  loading,
  user,
  signingOut,
  onSignOut,
}: MobileDrawerProps) {
  return (
    <DrawerContent className="flex flex-col md:hidden">
        <VisuallyHidden>
          <DrawerTitle>Navigation Menu</DrawerTitle>
        </VisuallyHidden>

        <nav className="flex flex-col gap-1 p-6 pt-4">
        {NAV_ITEMS.filter((item) => !item.authRequired || user).map(
          ({ href, label }) => {
            const isActive =
              pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <DrawerClose asChild key={href}>
                <Link
                  href={href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              </DrawerClose>
            );
          },
        )}
        </nav>

      <div className="mt-auto border-t px-6 py-4 space-y-4">
        {!loading && (
          <>
            {user ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onSignOut}
                  disabled={signingOut}
                >
                  <LogOut className="h-4 w-4" />
                  {signingOut ? "Signing out..." : "Sign out"}
                </Button>
            ) : (
              <DrawerClose asChild>
                <Button variant="default" className="w-full" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </DrawerClose>
            )}
          </>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Appearance
          </span>
          <ModeToggle />
        </div>
        </div>
      </DrawerContent>
  );
}
