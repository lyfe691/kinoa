"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <Drawer shouldScaleBackground setBackgroundColorOnScale={false}>
      <header className={cn("sticky top-0 z-50 bg-background")}>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-70"
          >
            kinoa
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label }) => {
              const isActive =
                pathname === href ||
                (href !== "/" && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Desktop theme toggle */}
          <div className="hidden md:flex">
            <ModeToggle />
          </div>

          {/* Mobile trigger */}
          <div className="flex md:hidden">
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
                className="h-9 w-9"
              >
                <div className="flex h-4 w-4 flex-col items-center justify-center gap-1">
                  <span className="h-0.5 w-full rounded-full bg-current" />
                  <span className="h-0.5 w-full rounded-full bg-current" />
                </div>
              </Button>
            </DrawerTrigger>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <DrawerContent className="flex flex-col">
        <VisuallyHidden>
          <DrawerTitle>Navigation Menu</DrawerTitle>
        </VisuallyHidden>

        <nav className="flex flex-col gap-1 p-6 pt-4">
          {navItems.map(({ href, label }) => {
            const isActive =
              pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <DrawerClose asChild key={href}>
                <Link
                  href={href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              </DrawerClose>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center justify-between border-t px-6 py-4">
          <span className="text-sm font-medium text-muted-foreground">
            Appearance
          </span>
          <ModeToggle />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
