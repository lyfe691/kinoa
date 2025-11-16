import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Kinoa — High Traffic",
  description: "Kinoa is experiencing unusually high traffic at the moment.",
};

export default function MaintenancePage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <div className="mx-auto w-full max-w-md">
        <AspectRatio ratio={16 / 9}>
          <Image
            src="/not-found.gif"
            alt="High traffic"
            fill
            priority
            unoptimized
            className="rounded-md object-cover ring-1 ring-border/50"
          />
        </AspectRatio>
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          We’re experiencing high traffic
        </h1>
        <p className="text-sm text-muted-foreground">
          Kinoa is receiving more requests than usual. We’re scaling up — you’ll
          be back in shortly.
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
          Pass the time
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}
