"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import React from "react";

export type ThreeDMarqueeProps = {
  images: string[];
  className?: string;
};

export const ThreeDMarquee = ({ images, className }: ThreeDMarqueeProps) => {
  const chunkSize = Math.ceil(images.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return images.slice(start, start + chunkSize);
  });

  return (
    <div
      className={cn(
        "mx-auto block h-[600px] overflow-hidden rounded-2xl max-sm:h-100",
        className,
      )}
    >
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            style={{
              transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
            }}
            className="relative top-96 right-[50%] grid size-full origin-top-left grid-cols-4 gap-8 transform-3d"
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
                className="flex flex-col items-start gap-8"
              >
                <GridLineVertical className="-left-4" offset="80px" />
                {subarray.map((image, imageIndex) => (
                  <div className="relative" key={imageIndex + image}>
                    <GridLineHorizontal className="-top-4" offset="20px" />
                    <motion.img
                      whileHover={{
                        y: -10,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      key={imageIndex + image}
                      src={image}
                      alt={`Image ${imageIndex + 1}`}
                      className="aspect-970/700 rounded-lg object-cover ring-1 ring-border shadow-2xl"
                      width={970}
                      height={700}
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
          "--background": "var(--muted)", // Changed from var(--background) to var(--muted)
          "--color": "var(--foreground)", // Use foreground with low opacity for dots
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-(--height) w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] opacity-20", // Added opacity-20
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
          "--background": "var(--muted)", // Changed from var(--background) to var(--muted)
          "--color": "var(--foreground)", // Use foreground with low opacity for dots
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-(--width)",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] opacity-20", // Added opacity-20
        "bg-size-[var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "mask-exclude",
        "z-30",
        className,
      )}
    ></div>
  );
};
