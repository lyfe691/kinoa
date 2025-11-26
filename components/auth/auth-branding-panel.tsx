"use client";

import React from "react";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

type AuthBrandingPanelProps = {
  images: string[];
};

export function AuthBrandingPanel({ images }: AuthBrandingPanelProps) {
  return (
    <div
      className="relative hidden w-1/2 overflow-hidden bg-background lg:block"
      style={{ "--background": "var(--background)" } as React.CSSProperties}
    >
      {/* 3D Marquee Background */}
      <div className="absolute inset-0 z-1000">
        <ThreeDMarquee
          images={images}
          className="h-full rounded-none opacity-100"
        />
      </div>
    </div>
  );
}
