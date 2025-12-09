"use client";

import {
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Player } from "@lordicon/react";

export type AnimatedIconHandle = {
  play: () => void;
};

type AnimatedIconProps = {
  icon: object;
  size?: number;
  className?: string;
  colors?: string; // e.g. "primary:#e83a30,secondary:#e83a30"
  disableThemeColor?: boolean; // New prop to disable automatic coloring
};

export const AnimatedIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function AnimatedIcon(
    { icon, size = 24, className, colors, disableThemeColor = false },
    ref,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLSpanElement>(null);
    const [themeColor, setThemeColor] = useState<string | undefined>(undefined);

    // Get computed color from CSS to match theme
    // We use useLayoutEffect here to prevent a flash of unstyled/default color
    // This runs synchronously after DOM mutations but before paint
    useLayoutEffect(() => {
      // If we provided explicit colors OR we want to disable theme coloring (for multi-color icons), skip this
      if (colors || disableThemeColor || !containerRef.current) return;

      const updateColor = () => {
        const computed = getComputedStyle(containerRef.current!).color;
        setThemeColor(computed);
      };

      updateColor();

      // Update on theme change
      const observer = new MutationObserver(updateColor);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }, [colors, disableThemeColor]);

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.playFromBeginning(),
    }));

    // If colors prop is provided, use it.
    // If disableThemeColor is true, pass undefined to let the JSON's native colors show.
    // Otherwise, use the computed themeColor.
    const finalColor = colors ? colors : disableThemeColor ? undefined : themeColor;

    return (
      <span
        ref={containerRef}
        className={className}
        style={{ display: "inline-flex", width: size, height: size }}
      >
        <Player
          ref={playerRef}
          icon={icon}
          size={size}
          colorize={finalColor}
        />
      </span>
    );
  },
);
