"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TabItemType = {
  id: string;
  label: React.ReactNode;
};

type PillTabsProps = {
  tabs: TabItemType[];
  defaultActiveId?: string;
  activeId?: string;
  onTabChange?: (id: string) => void;
  className?: string;
  itemClassName?: string;
  activePillClassName?: string;
  animationStrategy?: "layout" | "transform";
  equalItemWidthPx?: number;
  gapPx?: number;
};

const PillTabs = React.forwardRef<HTMLDivElement, PillTabsProps>(
  (props, ref) => {
    const {
      tabs,
      defaultActiveId = tabs[0]?.id,
      activeId,
      onTabChange,
      className,
      itemClassName,
      activePillClassName,
      animationStrategy = "layout",
      equalItemWidthPx,
      gapPx = 2,
    } = props;

    const [uncontrolledActive, setUncontrolledActive] =
      React.useState(defaultActiveId);
    const activeTab = activeId ?? uncontrolledActive;
    const layoutInstanceId = React.useId();
    const activeIndex = React.useMemo(
      () =>
        Math.max(
          0,
          tabs.findIndex((t) => t.id === activeTab),
        ),
      [tabs, activeTab],
    );

    const handleClick = React.useCallback(
      (id: string) => {
        if (activeId === undefined) {
          setUncontrolledActive(id);
        }
        onTabChange?.(id);
      },
      [onTabChange, activeId],
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-0.5 p-0.5 bg-muted rounded-full w-full sm:w-auto",
          animationStrategy === "transform" && "relative",
          className,
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleClick(tab.id)}
            className={cn(
              "relative flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition touch-none",
              "text-xs sm:text-sm font-medium whitespace-nowrap",
              itemClassName,
              activeTab === tab.id
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {animationStrategy === "layout" && activeTab === tab.id && (
              <motion.div
                layoutId={`pill-tabs-active-pill-${layoutInstanceId}`}
                className={cn(
                  "absolute inset-0 bg-primary rounded-full",
                  activePillClassName,
                )}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
        {animationStrategy === "transform" &&
          typeof equalItemWidthPx === "number" && (
            <motion.div
              aria-hidden="true"
              className={cn(
                "absolute top-0.5 left-0.5 rounded-full bg-primary",
                activePillClassName,
              )}
              style={{
                width: equalItemWidthPx,
                height: equalItemWidthPx,
              }}
              transition={{ type: "spring", duration: 0.5 }}
              animate={{
                x: activeIndex * (equalItemWidthPx + gapPx),
              }}
            />
          )}
      </div>
    );
  },
);

PillTabs.displayName = "PillTabs";

export { PillTabs };
