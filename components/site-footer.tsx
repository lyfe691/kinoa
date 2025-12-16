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
  { href: "/contact", label: "Contact Us" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-5">
          {/* Disclaimer section */}
          <div className="space-y-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            <p>
              Kinoa is a discovery interface. We do not host, upload, or store
              audiovisual files. All playback is delivered directly by
              independent third-party hosters at your own discretion and risk.
            </p>
            <p>
              Metadata is sourced from public APIs. Kinoa does not control,
              moderate, or guarantee external streams and assumes no
              responsibility for their availability, legality, or data
              practices. Please review our legal policies before use.
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

          {/* Bottom bar */}
          <div className="border-t border-border/40 pt-5">
            {/* Mobile: stacked layout */}
            <div className="flex flex-col items-center gap-4 sm:hidden">
              {/* Removed Buy Me A Coffee button due to privacy concerns*/}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Kinoa</p>
                <span className="text-border">•</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 py-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
                      aria-label="Open legal links"
                    >
                      Legal
                      <ChevronDown className="ml-0.5 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    {legalLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <span className="flex-1">{link.label}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Desktop: horizontal layout */}
            <div className="hidden items-center justify-between text-sm text-muted-foreground sm:flex">
              <div className="flex items-center gap-6">
                <p>
                  &copy; {new Date().getFullYear()} Kinoa. All rights reserved.
                </p>
                {/* Removed Buy Me A Coffee button due to privacy concerns*/}
              </div>
              <nav className="flex items-center" aria-label="Footer">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-sm text-muted-foreground hover:text-foreground"
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
                          className="flex cursor-pointer items-center gap-2"
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
      </div>
    </footer>
  );
}
