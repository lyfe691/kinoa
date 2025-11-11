"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Suggestion, SuggestionItem } from "./SuggestionItem";

type SuggestionsDropdownProps = {
  isOpen: boolean;
  suggestions: Suggestion[];
  onSelectAction: (href: string) => void;
};

export function SuggestionsDropdown({
  isOpen,
  suggestions,
  onSelectAction,
}: SuggestionsDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          layout
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.22,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <div className="max-h-[440px] overflow-y-auto scrollbar-thin text-left">
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
