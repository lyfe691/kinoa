"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { springTransition } from "./animations";
import { NAV_ITEMS } from "./nav-items";
import type { User } from "@supabase/supabase-js";

type DesktopNavProps = {
  pathname: string | null;
  user: User | null;
};

export function DesktopNav({ pathname, user }: DesktopNavProps) {
  const [hoveredPath, setHoveredPath] = React.useState<string | null>(null);

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.filter((item) => !item.authRequired || user).map(
        ({ href, label }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
              onMouseEnter={() => setHoveredPath(href)}
              onMouseLeave={() => setHoveredPath(null)}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg bg-muted"
                    layoutId="nav-active-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={springTransition}
                  />
                )}
                {hoveredPath === href && !isActive && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg bg-muted/50"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{label}</span>
            </Link>
          );
        },
      )}
    </nav>
  );
}
