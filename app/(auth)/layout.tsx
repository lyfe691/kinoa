import Link from "next/link";
import { ArrowLeft, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-[1.05fr_1fr]">
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Film className="h-5 w-5" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold">Kinoa</span>
              <span className="text-xs text-muted-foreground">Streaming dashboard</span>
            </div>
          </Link>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back home</span>
            </Link>
          </Button>
        </header>

        <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12 pt-4 sm:px-8 lg:px-12">
          <div className="w-full max-w-[480px] rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            {children}
          </div>
        </main>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0b0f19] via-[#0a101c] to-[#0b1224] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_80%_50%,rgba(59,130,246,0.1),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.1),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_60%_80%,rgba(255,255,255,0.04),transparent_30%)] opacity-40" />

        <div className="relative z-10 flex h-full items-center justify-center px-10 py-16">
          <div className="w-full max-w-2xl space-y-10 text-left text-muted-foreground">
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.08em] text-foreground/70">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live preview
              </span>
              <Button variant="outline" size="sm" asChild className="border-border/40 bg-background/40 text-xs backdrop-blur">
                <Link href="/">Back to catalog</Link>
              </Button>
            </div>

            <blockquote className="rounded-2xl border border-white/5 bg-white/5 p-8 text-left shadow-2xl shadow-emerald-500/10 backdrop-blur">
              <p className="text-2xl font-semibold leading-relaxed text-white">
                “I get to explore new releases faster with Kinoa, and everything stays synced across my devices. It feels effortless.”
              </p>
              <footer className="mt-6 flex items-center gap-3 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">@</span>
                  <div className="leading-tight">
                    <div className="font-semibold text-white">R. P. Gallegos</div>
                    <div className="text-xs text-white/70">Early access member</div>
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
