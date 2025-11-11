"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
  isFocused: boolean;
  isNavigating: boolean;
  ariaControlsId?: string;
  isExpanded?: boolean;
};

export function SearchInput({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  isFocused,
  isNavigating,
  ariaControlsId,
  isExpanded,
}: SearchInputProps) {
  const trimmedValue = value.trim();

  return (
    <div className={cn("relative flex w-full items-center")}>
      <Search
        className={cn(
          "pointer-events-none absolute left-4 h-4 w-4 transition-colors duration-200",
          isFocused ? "text-primary" : "text-muted-foreground",
        )}
      />
      <input
        type="text"
        name="q"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label="Search movies and series"
        aria-controls={ariaControlsId}
        aria-expanded={isExpanded}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        className="h-14 w-full bg-transparent pl-11 pr-28 text-base outline-none placeholder:text-muted-foreground text-left"
      />
      <motion.button
        type="submit"
        disabled={isNavigating || !trimmedValue}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "absolute right-2 h-10 rounded-xl px-6 text-sm font-medium",
          "bg-primary text-primary-foreground shadow-lg transition-colors duration-200",
          "hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none",
        )}
      >
        Search
      </motion.button>
    </div>
  );
}
