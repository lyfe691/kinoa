"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import {
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { mobileContainerVariants, mobileItemVariants } from "./animations";
import { NAV_ITEMS } from "./nav-items";
import type { AccountProfile } from "@/lib/profile-utils";
import type { User } from "@supabase/supabase-js";

type MobileDrawerProps = {
  pathname: string | null;
  loading: boolean;
  user: User | null;
  account: AccountProfile | null;
  signingOut: boolean;
  onSignOut: () => void;
};

export function MobileDrawer({
  pathname,
  loading,
  user,
  account,
  signingOut,
  onSignOut,
}: MobileDrawerProps) {
  return (
    <DrawerContent className="flex flex-col rounded-t-xl md:hidden">
      <VisuallyHidden>
        <DrawerTitle>Navigation Menu</DrawerTitle>
      </VisuallyHidden>

      {user && account && <MobileUserHeader account={account} />}

      <MobileNavLinks pathname={pathname} user={user} />

      <MobileFooter
        loading={loading}
        user={user}
        account={account}
        signingOut={signingOut}
        onSignOut={onSignOut}
      />
    </DrawerContent>
  );
}

function MobileUserHeader({ account }: { account: AccountProfile }) {
  return (
    <div className="border-b px-6 py-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={account.avatarUrl ?? undefined}
            alt={account.displayName ?? "User"}
            className="object-cover"
          />
          <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-sm font-semibold text-primary-foreground">
            {account.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-base font-semibold text-foreground">
            {account.displayName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {account.email}
          </span>
        </div>
      </div>
    </div>
  );
}

function MobileNavLinks({
  pathname,
  user,
}: {
  pathname: string | null;
  user: User | null;
}) {
  return (
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
            className={cn(
              "rounded-lg px-3.5 py-2.5 text-base font-medium transition-colors",
              pathname?.startsWith("/settings")
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
            aria-current={
              pathname?.startsWith("/settings") ? "page" : undefined
            }
          >
            Settings
          </Link>
        </DrawerClose>
      )}
    </nav>
  );
}

type MobileFooterProps = {
  loading: boolean;
  user: User | null;
  account: AccountProfile | null;
  signingOut: boolean;
  onSignOut: () => void;
};

function MobileFooter({
  loading,
  user,
  account,
  signingOut,
  onSignOut,
}: MobileFooterProps) {
  return (
    <div className="mt-auto space-y-3 border-t px-6 py-4">
      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            key={user ? "authenticated" : "guest"}
            variants={mobileContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-2"
          >
            {user && account ? (
              <motion.div variants={mobileItemVariants}>
                <Button
                  variant="outline"
                  className="h-10 w-full rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={onSignOut}
                  disabled={signingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {signingOut ? "Signing out..." : "Sign out"}
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div variants={mobileItemVariants}>
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      className="h-10 w-full rounded-lg"
                      asChild
                    >
                      <Link href="/login">Sign in</Link>
                    </Button>
                  </DrawerClose>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <DrawerClose asChild>
                    <Button className="h-10 w-full rounded-lg" asChild>
                      <Link href="/register">Sign up</Link>
                    </Button>
                  </DrawerClose>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-between rounded-lg px-4 py-2.5">
        <span className="text-sm font-medium text-foreground">Theme</span>
        <ModeToggle />
      </div>
    </div>
  );
}
