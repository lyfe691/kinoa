import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function NotFoundContent() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="mx-auto w-full max-w-xl">
          <AspectRatio ratio={16 / 9}>
            <Image
              src="/not-found.gif"
              alt="Mr. Robot says 404"
              fill
              priority
              unoptimized
              className="rounded-md object-cover ring-1 ring-border/50"
            />
          </AspectRatio>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button render={<Link href="/" />}>Go home</Button>
          <Button variant="ghost" render={<Link href="/search" />}>
            Search
          </Button>
        </div>
      </section>
    </main>
  );
}
