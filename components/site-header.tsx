"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSession } from "@/lib/supabase/auth";
import { signOutEverywhere } from "@/lib/supabase/sign-out";
import { LogOut, ChevronDown, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/supabase/errors";

type AccountProfile = {
  displayName: string;
  email: string;
  initials: string;
  avatarUrl: string | null;
};

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
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const account = React.useMemo<AccountProfile | null>(() => {
    if (!user) return null;

    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    const email = (user.email || "").trim();

    const candidateNames = [
      metadata.display_name,
      metadata.full_name,
      metadata.name,
      metadata.username,
      metadata.preferred_username,
      metadata.nickname,
      email.split("@")[0],
    ];

    const displayName =
      candidateNames
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .find((value) => value.length > 0) || "Account";

    const normalizedName = displayName.replace(/\s+/g, " ");

    const initials =
      normalizedName
        .split(/[\s._-]+/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .slice(0, 2)
        .join("") ||
      normalizedName.slice(0, 2).toUpperCase() ||
      "U";

    const avatarUrl =
      [metadata.avatar_url, metadata.picture, metadata.avatar, metadata.image]
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .find((value) => value.length > 0) || null;

    return {
      displayName: normalizedName,
      email,
      initials,
      avatarUrl,
    };
  }, [user]);

  React.useEffect(() => {
    if (!user) {
      setIsDropdownOpen(false);
    }
  }, [user]);

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
      <header className="sticky top-0 z-50 w-full bg-background">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <BrandLink />
          <DesktopNav pathname={pathname} user={user} />

          <div className="flex-1" />

          <DesktopActions
            loading={loading}
            user={user}
            account={account}
            onSignOut={handleSignOut}
            signingOut={signingOut}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />

          <MobileMenuTrigger />
        </div>
      </header>

      <MobileDrawer
        pathname={pathname}
        loading={loading}
        user={user}
        account={account}
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
            <Button
              key={href}
              variant="ghost"
              asChild
              className={cn(
                "rounded-lg px-3 text-sm font-medium",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <Link href={href} aria-current={isActive ? "page" : undefined}>
                {label}
              </Link>
            </Button>
          );
        },
      )}
    </nav>
  );
}

type DesktopActionsProps = {
  loading: boolean;
  user: ReturnType<typeof useSession>["user"];
  account: AccountProfile | null;
  onSignOut: () => void;
  signingOut: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
};

function DesktopActions({
  loading,
  user,
  account,
  onSignOut,
  signingOut,
  isDropdownOpen,
  setIsDropdownOpen,
}: DesktopActionsProps) {
  return (
    <div className="hidden items-center gap-1 md:flex">
      <ModeToggle />
      <div className="mx-1 h-6 w-px bg-border/50" />
      {loading ? (
        <Skeleton className="h-10 w-28 rounded-lg" />
      ) : user && account ? (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 gap-2 rounded-lg px-3 hover:bg-accent data-[state=open]:bg-accent"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={account.avatarUrl ?? undefined}
                  alt={account.displayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-xs font-medium text-primary-foreground">
                  {account.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">
                {account.displayName}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform",
                  isDropdownOpen && "rotate-180",
                )}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {account.displayName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {account.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              asChild
            >
              <Link href="/settings" onClick={() => setIsDropdownOpen(false)}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={onSignOut}
              disabled={signingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>
                {signingOut ? "Signing out..." : "Sign out"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button variant="ghost" asChild className="rounded-lg px-3">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="rounded-lg px-3">
            <Link href="/register">Sign up</Link>
          </Button>
        </>
      )}
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
          className="h-9 w-9 rounded-lg"
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
  account: AccountProfile | null;
  signingOut: boolean;
  onSignOut: () => void;
};

function MobileDrawer({
  pathname,
  loading,
  user,
  account,
  signingOut,
  onSignOut,
}: MobileDrawerProps) {
  return (
    <DrawerContent className="flex flex-col md:hidden rounded-t-xl">
      <VisuallyHidden>
        <DrawerTitle>Navigation Menu</DrawerTitle>
      </VisuallyHidden>

      {user && account && (
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={account.avatarUrl ?? undefined}
                alt={account.displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-sm font-semibold text-primary-foreground">
                {account.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-base font-semibold text-foreground truncate">
                {account.displayName}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {account.email}
              </span>
            </div>
          </div>
        </div>
      )}

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
                    "rounded-lg px-3.5 py-2.5 text-base font-medium transition-colors",
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
        {user && (
          <DrawerClose asChild>
            <Link
              href="/settings"
              className="rounded-lg px-3.5 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              aria-current={pathname === "/settings" ? "page" : undefined}
            >
              Settings
            </Link>
          </DrawerClose>
        )}
      </nav>

      <div className="mt-auto space-y-3 border-t px-6 py-4">
        {loading ? (
          <Skeleton className="h-10 w-full rounded-lg" />
        ) : user && account ? (
          <Button
            variant="outline"
            className="h-10 w-full rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onSignOut}
            disabled={signingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {signingOut ? "Signing out..." : "Sign out"}
          </Button>
        ) : (
          <div className="space-y-2">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="h-10 w-full rounded-lg"
                asChild
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button className="h-10 w-full rounded-lg" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </DrawerClose>
          </div>
        )}
        <div className="flex items-center justify-between rounded-lg px-4 py-2.5">
          <span className="text-sm font-medium text-foreground">Theme</span>
          <ModeToggle />
        </div>
      </div>
    </DrawerContent>
  );
}
