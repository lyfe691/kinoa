"use client";

import { Suspense } from "react";
import { motion, type Variants } from "framer-motion";
import { SearchBar } from "@/components/search-bar";
import { Skeleton } from "@/components/ui/skeleton";

// Animation Config

const EASE = [0.25, 0.1, 0.25, 1] as const;

const FADE_UP: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.0,
      ease: EASE
    },
  },
};

const STAGGER: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Component

export function HomeHeader() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={STAGGER}
      className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 py-24 text-center sm:py-32"
    >
      <motion.h1
        variants={FADE_UP}
        className="mb-12 text-5xl font-medium tracking-tighter sm:text-7xl"
      >
        <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          What do you want to watch?
        </span>
      </motion.h1>

      <motion.div
        variants={FADE_UP}
        className="w-full max-w-2xl"
      >
        <Suspense fallback={<SearchBarFallback />}>
          <div className="relative">
            {/* Soft anchor glow behind input */}
            <div className="absolute -inset-4 -z-10 rounded-full bg-primary/5 blur-xl" />
            <SearchBar enableSuggestions />
          </div>
        </Suspense>
      </motion.div>
    </motion.section>
  );
}

function SearchBarFallback() {
  return (
    <div className="relative flex h-14 w-full items-center rounded-2xl border border-border/40 bg-background/50 px-4 shadow-sm backdrop-blur-md">
      <Skeleton className="mr-3 h-5 w-5 shrink-0 rounded-full opacity-25" />
      <Skeleton className="h-5 w-40 rounded-md opacity-20" />
      <div className="ml-auto">
        <Skeleton className="h-8 w-8 rounded-lg opacity-10" />
      </div>
    </div>
  );
}