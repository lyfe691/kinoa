"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/search/SearchInput";
import { SuggestionsDropdown } from "@/components/search/SuggestionsDropdown";
import type { Suggestion } from "@/components/search/SuggestionItem";
import { motion } from "framer-motion";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  enableSuggestions?: boolean;
};

export function SearchBar({
  placeholder = "Enter keywords...",
  className,
  enableSuggestions = true,
}: SearchBarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  const [value, setValue] = React.useState(q);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isInputFocused, setIsInputFocused] = React.useState(false);
  const [isNavigating, startTransition] = React.useTransition();

  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const trimmedValue = value.trim();
  const hasResults =
    enableSuggestions && isDropdownOpen && suggestions.length > 0;

  React.useEffect(() => {
    setValue(q);
  }, [q]);

  React.useEffect(() => {
    if (!enableSuggestions || trimmedValue.length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const controller = new AbortController();
    const debounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search/preview?q=${encodeURIComponent(trimmedValue)}`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error("Failed to load suggestions");

        const data = (await response.json()) as { results?: Suggestion[] };
        const items = Array.isArray(data.results) ? data.results : [];

        setSuggestions(items);
        setIsDropdownOpen(items.length > 0 && isInputFocused);
      } catch (error) {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setIsDropdownOpen(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(debounce);
    };
  }, [trimmedValue, isInputFocused, enableSuggestions]);

  const handleFocus = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsInputFocused(true);
    if (enableSuggestions && suggestions.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleBlur = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsInputFocused(false);
      setIsDropdownOpen(false);
    }, 120);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDropdownOpen(false);
    startTransition(() => {
      router.push(
        trimmedValue
          ? `/search?q=${encodeURIComponent(trimmedValue)}`
          : "/search",
      );
    });
  };

  const navigateTo = (href: string) => {
    setIsDropdownOpen(false);
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <motion.div
        layout
        initial={false}
        animate={{
          boxShadow:
            isInputFocused || hasResults
              ? "0 16px 40px rgba(0,0,0,0.24)"
              : "0 6px 18px rgba(0,0,0,0.12)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative overflow-hidden rounded-2xl bg-card border border-border"
        aria-expanded={hasResults}
      >
        <SearchInput
          value={value}
          onChange={setValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          isFocused={isInputFocused}
          isNavigating={isNavigating}
          hasResultsOpen={hasResults}
        />

        <SuggestionsDropdown
          isOpen={hasResults}
          suggestions={suggestions}
          onSelect={navigateTo}
        />
      </motion.div>
    </form>
  );
}
