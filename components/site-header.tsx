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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/lib/supabase/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/supabase/errors";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/watchlist", label: "Watchlist" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useSession();
  const [signingOut, setSigningOut] = React.useState(false);
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);

  const handleSignOut = React.useCallback(async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out");
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
  }, [supabase, router]);

  const userInitial = React.useMemo(
    () => user?.email?.charAt(0).toUpperCase() ?? "U",
    [user?.email],
  );

  return (
    <Drawer shouldScaleBackground setBackgroundColorOnScale={false}>
      <header className={cn("sticky top-0 z-50 bg-background")}>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <BrandLink />
          <DesktopNav pathname={pathname} />

          <div className="flex-1" />

          <DesktopActions
            loading={loading}
            user={user}
            userInitial={userInitial}
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
        userInitial={userInitial}
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

function DesktopNav({ pathname }: { pathname: string | null }) {
  return (
          <nav className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map(({ href, label }) => {
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
            })}
          </nav>
  );
}

type DesktopActionsProps = {
  loading: boolean;
  user: ReturnType<typeof useSession>["user"];
  userInitial: string;
  onSignOut: () => void;
  signingOut: boolean;
};

function DesktopActions({
  loading,
  user,
  userInitial,
  onSignOut,
  signingOut,
}: DesktopActionsProps) {
  const username = user?.user_metadata?.username;

  return (
    <div className="hidden md:flex items-center gap-3">
      {!loading && (
        <>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  aria-label="Open user menu"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{userInitial}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {username || "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onSignOut} disabled={signingOut}>
                  <LogOut className="h-4 w-4" />
                  {signingOut ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
  userInitial: string;
  signingOut: boolean;
  onSignOut: () => void;
};

function MobileDrawer({
  pathname,
  loading,
  user,
  userInitial,
  signingOut,
  onSignOut,
}: MobileDrawerProps) {
  const username = user?.user_metadata?.username;

  return (
    <DrawerContent className="flex flex-col md:hidden">
        <VisuallyHidden>
          <DrawerTitle>Navigation Menu</DrawerTitle>
        </VisuallyHidden>

        <nav className="flex flex-col gap-1 p-6 pt-4">
        {NAV_ITEMS.map(({ href, label }) => {
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
          })}
        </nav>

      <div className="mt-auto border-t px-6 py-4 space-y-4">
        {!loading && (
          <>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {username || "Account"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onSignOut}
                  disabled={signingOut}
                >
                  <LogOut className="h-4 w-4" />
                  {signingOut ? "Signing out..." : "Sign out"}
                </Button>
              </div>
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
