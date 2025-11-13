import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Kinoa — Scheduled Maintenance",
  description: "Kinoa is undergoing a short maintenance window. We will return shortly.",
};

export default function MaintenancePage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <div className="mx-auto w-full max-w-md">
        <AspectRatio ratio={16 / 9}>
          <Image
            src="/not-found.gif"
            alt="Maintenance in progress"
            fill
            priority
            unoptimized
            className="rounded-md object-cover ring-1 ring-border/50"
          />
        </AspectRatio>
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">We&apos;ll be back soon</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;re making a few updates to keep everything running smoothly. Thanks for your patience
          — Kinoa will be online again shortly.
        </p>
      </div>
      <Button asChild variant="secondary">
        <Link
          href="https://neal.fun/infinite-craft/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Neal's Infinite Craft (opens in a new tab)"
          className="inline-flex items-center"
        >
          Craft something while you wait
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}

