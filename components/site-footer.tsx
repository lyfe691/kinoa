"use client";

import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-5">
          {/* Disclaimer section */}
          <div className="space-y-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            <p>
              Kinoa does not host, upload, or store any video files. All
              playback is provided via third‑party hosters. Metadata is sourced
              from public APIs.
            </p>
            <p>
              This product uses the TMDB API but is not endorsed or certified by{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                TMDb
              </a>
              .
            </p>
          </div>

          {/* Bottom bar: Copyright + Legal */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-5 text-xs text-muted-foreground sm:flex-row sm:text-sm">
            <p>&copy; {new Date().getFullYear()} Kinoa. All rights reserved.</p>
            <nav className="flex items-center" aria-label="Footer">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground hover:text-foreground sm:text-sm"
                    aria-label="Open legal links"
                  >
                    Legal
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {legalLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <span className="flex-1">{link.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
