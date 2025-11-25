"use client";

import { Button } from "@/components/ui/button";
import { DrawerTrigger } from "@/components/ui/drawer";

export function MobileMenuTrigger() {
  return (
    <div className="flex md:hidden">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle menu"
          className="h-9 w-9 rounded-lg"
        >
          <div className="flex h-4 w-4 flex-col items-center justify-center gap-1">
            <span className="h-0.5 w-full rounded-full bg-current" />
            <span className="h-0.5 w-full rounded-full bg-current" />
          </div>
        </Button>
      </DrawerTrigger>
    </div>
  );
}
