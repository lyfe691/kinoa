"use client";

import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import React from "react";

type AuthBrandingPanelProps = {
  images: string[];
};

export function AuthBrandingPanel({ images }: AuthBrandingPanelProps) {
  return (
    <div
      className="relative hidden w-1/2 overflow-hidden bg-muted lg:block"
      style={{ "--background": "var(--muted)" } as React.CSSProperties}
    >
      {/* 3D Marquee */}
      <div className="absolute inset-0">
        <ThreeDMarquee images={images} className="h-full rounded-none" />
      </div>

      {/* Tagline overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-10">
        <p className="text-2xl font-medium leading-relaxed text-foreground">
          The cinema experience, at home.
          <br />
          <span className="text-muted-foreground">
            Watch new movies and shows free, instantly.
          </span>
        </p>
      </div>
    </div>
  );
}
