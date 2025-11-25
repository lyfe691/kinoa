"use client";

import { ThreeDMarquee } from "@/components/ui/3d-marquee";

type AuthMarqueeProps = {
  images: string[];
};

export function AuthMarquee({ images }: AuthMarqueeProps) {
  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <ThreeDMarquee images={images} />
      {/* Gradient overlays for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-transparent" />
    </div>
  );
}
