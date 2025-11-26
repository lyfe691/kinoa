"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import React from "react";

export type ThreeDMarqueeProps = {
  images: string[];
  className?: string;
};

export const ThreeDMarquee = ({ images, className }: ThreeDMarqueeProps) => {
  // Duplicate images to ensure we have enough content for more columns
  // and sufficient vertical height for the scrolling effect
  const allImages = [...images, ...images];
  const COLUMNS = 8; // Increased from 4 to 8 for better density on large screens
  const chunkSize = Math.ceil(allImages.length / COLUMNS);

  const chunks = Array.from({ length: COLUMNS }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return allImages.slice(start, start + chunkSize);
  });

  return (
    <div
      className={cn(
        "mx-auto block h-[600px] overflow-hidden rounded-2xl max-sm:h-100",
        className,
      )}
    >
      <div className="flex size-full items-center justify-center">
        {/* 
          Use vmax to ensure the grid is always large enough relative to the viewport,
          preventing empty spaces when zooming out.
          Removed fixed pixel sizes and responsive scales.
        */}
        <div className="h-[150vmax] w-[150vmax] shrink-0">
          <div
            style={{
              transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
            }}
            className="grid size-full origin-center grid-cols-8 gap-4 transform-3d md:gap-8"
          >
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ y: colIndex % 2 === 0 ? 100 : -100 }}
                transition={{
                  duration: colIndex % 2 === 0 ? 20 : 25,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
                key={colIndex + "marquee"}
                className="flex flex-col items-center gap-4 will-change-transform md:gap-8"
              >
                <GridLineVertical
                  className="-left-2 md:-left-4"
                  offset="80px"
                />
                {subarray.map((image, imageIndex) => (
                  <div
                    className="relative w-full"
                    key={`${colIndex}-${imageIndex}-${image}`}
                  >
                    <GridLineHorizontal
                      className="-top-2 md:-top-4"
                      offset="20px"
                    />
                    <motion.img
                      src={image}
                      alt={`Image ${imageIndex + 1}`}
                      className="aspect-970/700 w-full rounded-lg object-cover shadow-2xl ring-1 ring-border will-change-transform"
                      loading="lazy"
                    />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export type GridLineHorizontalProps = {
  className?: string;
  offset?: string;
};

const GridLineHorizontal = ({ className, offset }: GridLineHorizontalProps) => {
  return (
    <div
      style={
        {
          "--background": "var(--muted)",
          "--color": "var(--foreground)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-(--height) w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] opacity-20",
        "bg-size-[var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "mask-exclude",
        "z-30",
        className,
      )}
    ></div>
  );
};

export type GridLineVerticalProps = {
  className?: string;
  offset?: string;
};

const GridLineVertical = ({ className, offset }: GridLineVerticalProps) => {
  return (
    <div
      style={
        {
          "--background": "var(--muted)",
          "--color": "var(--foreground)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-(--width)",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] opacity-20",
        "bg-size-[var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "mask-exclude",
        "z-30",
        className,
      )}
    ></div>
  );
};
