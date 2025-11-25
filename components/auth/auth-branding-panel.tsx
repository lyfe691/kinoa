"use client";

import { ThreeDMarquee } from "@/components/ui/3d-marquee";

type AuthBrandingPanelProps = {
  images: string[];
};

export function AuthBrandingPanel({ images }: AuthBrandingPanelProps) {
  return (
    <div className="relative hidden w-1/2 overflow-hidden bg-zinc-950 lg:block">
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/80" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-zinc-950/50 via-transparent to-zinc-950/50" />

      {/* 3D Marquee */}
      <div className="absolute inset-0">
        <ThreeDMarquee images={images} className="h-full rounded-none" />
      </div>

      {/* Tagline overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-10">
        <p className="text-2xl font-medium leading-relaxed text-white/90">
          Your personal streaming companion.
          <br />
          <span className="text-white/60">Discover, track, and enjoy.</span>
        </p>
      </div>
    </div>
  );
}
