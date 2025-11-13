"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Suggestion, SuggestionItem } from "./SuggestionItem";

type SuggestionsDropdownProps = {
  isOpen: boolean;
  suggestions: Suggestion[];
  onSelectAction: (href: string) => void;
};

const scrollContainerStyle: React.CSSProperties = {
  scrollbarGutter: "stable",
};

export function SuggestionsDropdown({
  isOpen,
  suggestions,
  onSelectAction,
}: SuggestionsDropdownProps) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [measuredHeight, setMeasuredHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    if (!isOpen) {
      setMeasuredHeight(0);
      return;
    }
    const el = contentRef.current;
    if (!el) return;

    const MAX_HEIGHT = 440; // match max-h-[440px]
    const updateHeight = () => {
      const next = Math.min(el.scrollHeight, MAX_HEIGHT);
      setMeasuredHeight(next);
    };
    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [isOpen, suggestions.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: measuredHeight, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.22,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <div
            ref={contentRef}
            id="search-suggestions"
            role="listbox"
            className="max-h-[440px] overflow-y-auto scrollbar-thin text-left"
            style={scrollContainerStyle}
          >
            <div className="p-2">
              {suggestions.map((item) => (
                <SuggestionItem
                  key={`${item.type}-${item.id}`}
                  item={item}
                  onSelectAction={onSelectAction}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
