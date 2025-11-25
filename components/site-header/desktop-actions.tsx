"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { containerVariants, itemVariants } from "./animations";
import { UserMenu } from "./user-menu";
import type { AccountProfile } from "@/lib/profile-utils";
import type { User } from "@supabase/supabase-js";

type DesktopActionsProps = {
  loading: boolean;
  user: User | null;
  account: AccountProfile | null;
  onSignOut: () => void;
  signingOut: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
};

export function DesktopActions({
  loading,
  user,
  account,
  onSignOut,
  signingOut,
  isDropdownOpen,
  setIsDropdownOpen,
}: DesktopActionsProps) {
  return (
    <AnimatePresence mode="wait">
      {!loading && (
        <motion.div
          key={user ? "authenticated" : "guest"}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="hidden items-center gap-1 md:flex"
        >
          <motion.div variants={itemVariants}>
            <ModeToggle />
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="mx-1 h-6 w-px bg-border/50"
          />
          {user && account ? (
            <motion.div variants={itemVariants}>
              <UserMenu
                account={account}
                onSignOut={onSignOut}
                signingOut={signingOut}
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
              />
            </motion.div>
          ) : (
            <>
              <motion.div variants={itemVariants}>
                <Button variant="ghost" asChild className="rounded-lg px-3">
                  <Link href="/login">Sign in</Link>
                </Button>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button asChild className="rounded-lg px-3">
                  <Link href="/register">Sign up</Link>
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
