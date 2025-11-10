"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { PillTabs } from "@/components/ui/pill-tabs";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const active = theme ?? "system";

  const tabs = [
    {
      id: "light" as const,
      label: (
        <>
          <span className="sr-only">Light</span>
          <Sun className="h-4 w-4" aria-hidden="true" />
        </>
      ),
    },
    {
      id: "dark" as const,
      label: (
        <>
          <span className="sr-only">Dark</span>
          <Moon className="h-4 w-4" aria-hidden="true" />
        </>
      ),
    },
    {
      id: "system" as const,
      label: (
        <>
          <span className="sr-only">System</span>
          <Monitor className="h-4 w-4" aria-hidden="true" />
        </>
      ),
    },
  ];

  return (
    <PillTabs
      tabs={tabs}
      activeId={active}
      onTabChange={(id) => setTheme(id)}
      className="w-auto"
      itemClassName="inline-flex h-9 w-9 items-center justify-center p-0 flex-none"
      animationStrategy="transform"
      equalItemWidthPx={36}
      gapPx={2}
    />
  );
}
