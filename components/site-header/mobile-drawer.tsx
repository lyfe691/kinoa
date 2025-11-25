"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Settings } from "lucide-react";
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
import {
  mobileContainerVariants,
  mobileItemVariants,
  navContainerVariants,
  navLinkVariants,
  userHeaderVariants,
  avatarVariants,
  textSlideVariants,
  springTransition,
} from "./animations";
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

      <AnimatePresence>
        {user && account && <MobileUserHeader account={account} />}
      </AnimatePresence>

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
    <motion.div
      variants={userHeaderVariants}
      initial="hidden"
      animate="visible"
      className="border-b px-6 py-4"
    >
      <div className="flex items-center gap-3">
        <motion.div
          variants={avatarVariants}
          initial="hidden"
          animate="visible"
        >
          <Avatar className="h-12 w-12 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
            <AvatarImage
              src={account.avatarUrl ?? undefined}
              alt={account.displayName ?? "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-sm font-semibold text-primary-foreground">
              {account.initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <motion.div
          variants={textSlideVariants}
          initial="hidden"
          animate="visible"
          className="flex min-w-0 flex-1 flex-col gap-0.5"
        >
          <span className="truncate text-base font-semibold text-foreground">
            {account.displayName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {account.email}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function MobileNavLinks({
  pathname,
  user,
}: {
  pathname: string | null;
  user: User | null;
}) {
  const allLinks = [
    ...NAV_ITEMS.filter(
      (item) => !("authRequired" in item) || !item.authRequired || user,
    ),
    ...(user ? [{ href: "/settings", label: "Settings", icon: Settings }] : []),
  ];

  return (
    <motion.nav
      variants={navContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-1 p-6 pt-4"
    >
      {allLinks.map(({ href, label }) => {
        const isActive =
          pathname === href || (href !== "/" && pathname?.startsWith(href));

        return (
          <motion.div key={href} variants={navLinkVariants}>
            <DrawerClose asChild>
              <Link
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="relative">{label}</span>
              </Link>
            </DrawerClose>
          </motion.div>
        );
      })}
    </motion.nav>
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
                  className="h-11 w-full rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={onSignOut}
                  disabled={signingOut}
                >
                  <motion.div
                    animate={signingOut ? { rotate: 360 } : { rotate: 0 }}
                    transition={{
                      duration: 1,
                      repeat: signingOut ? Infinity : 0,
                      ease: "linear",
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                  </motion.div>
                  {signingOut ? "Signing out..." : "Sign out"}
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div variants={mobileItemVariants}>
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      className="h-11 w-full rounded-xl"
                      asChild
                    >
                      <Link href="/login">Sign in</Link>
                    </Button>
                  </DrawerClose>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <DrawerClose asChild>
                    <Button className="h-11 w-full rounded-xl" asChild>
                      <Link href="/register">Sign up</Link>
                    </Button>
                  </DrawerClose>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ...springTransition }}
        className="flex items-center justify-between rounded-xl px-4 py-3"
      >
        <span className="text-sm font-medium text-foreground">Theme</span>
        <ModeToggle />
      </motion.div>
    </div>
  );
}
