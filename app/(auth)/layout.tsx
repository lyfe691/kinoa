import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - Form */}
      <div className="relative flex w-full flex-col lg:w-1/2">
        {/* Back button */}
        <header className="absolute left-0 right-0 top-0 z-50 p-4 sm:p-6 lg:p-8">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back home</span>
            </Link>
          </Button>
        </header>

        {/* Form container */}
        <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Right panel - Branding (hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-end overflow-hidden bg-zinc-950 p-10 lg:flex">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-transparent to-transparent" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-32 top-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

        {/* Tagline */}
        <div className="relative z-10 space-y-4">
          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-relaxed text-white/90">
              Your personal streaming companion.
              <br />
              <span className="text-white/60">Discover, track, and enjoy.</span>
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
