"use client";

import {
  useRef,
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
};

export const AnimatedIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function AnimatedIcon({ icon, size = 24, className }, ref) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLSpanElement>(null);
    const [color, setColor] = useState<string | undefined>(undefined);

    // Get computed color from CSS to match theme
    useEffect(() => {
      if (!containerRef.current) return;

      const updateColor = () => {
        const computed = getComputedStyle(containerRef.current!).color;
        setColor(computed);
      };

      updateColor();

      // Update on theme change
      const observer = new MutationObserver(updateColor);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }, []);

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.playFromBeginning(),
    }));

    return (
      <span
        ref={containerRef}
        className={className}
        style={{ display: "inline-flex", width: size, height: size }}
      >
        <Player ref={playerRef} icon={icon} size={size} colorize={color} />
      </span>
    );
  },
);
