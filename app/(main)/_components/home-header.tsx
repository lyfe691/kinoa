"use client";

import * as React from "react";
import { Suspense } from "react";
import { motion, type Variants } from "framer-motion";
import { SearchBar } from "@/components/search-bar";
import { SearchBarFallback } from "@/components/search/search-bar-fallback";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const FADE_UP: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
    filter: "blur(8px)",
    willChange: "opacity, transform, filter",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: EASE,
    },
  },
};

const STAGGER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// --- Component ---

export function HomeHeader() {
  const searchBarRef = React.useRef<React.ElementRef<typeof SearchBar>>(null);

  const handleHintClick = (term: string) => {
    searchBarRef.current?.setValue(term);
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={STAGGER}
      className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 py-24 text-center sm:py-32"
    >
      <motion.h1
        variants={FADE_UP}
        className="mb-10 text-5xl font-medium tracking-tighter sm:text-7xl"
        style={{ textWrap: "balance" }}
      >
        <span className="bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          What do you want to watch?
        </span>
      </motion.h1>

      <motion.div variants={FADE_UP} className="w-full max-w-2xl relative z-10">
        <Suspense
          fallback={
            <SearchBarFallback className="border-border/40 bg-background/50 backdrop-blur-md" />
          }
        >
          <div className="relative">
            <div
              className="absolute -inset-4 -z-10 rounded-full bg-primary/10 blur-2xl"
              aria-hidden="true"
            />
            <SearchBar ref={searchBarRef} enableSuggestions />
          </div>
        </Suspense>
      </motion.div>

      {/* Quick Hints */}
      <motion.p
        variants={FADE_UP}
        className="mt-6 text-xs text-muted-foreground sm:text-sm"
      >
        Try something like{" "}
        <button
          onClick={() => handleHintClick("Chernobyl")}
          className="text-foreground font-medium transition-all hover:text-primary hover:underline decoration-dotted underline-offset-4 cursor-pointer"
          type="button"
        >
          &ldquo;Chernobyl&rdquo;
        </button>{" "}
        or{" "}
        <button
          onClick={() => handleHintClick("Spirited Away")}
          className="text-foreground font-medium transition-all hover:text-primary hover:underline decoration-dotted underline-offset-4 cursor-pointer"
          type="button"
        >
          &ldquo;Spirited Away&rdquo;
        </button>
        .
      </motion.p>
    </motion.section>
  );
}
