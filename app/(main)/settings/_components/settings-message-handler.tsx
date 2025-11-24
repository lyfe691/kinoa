"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/supabase/auth";

export function SettingsMessageHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { refreshSession } = useSession();
  const verified = searchParams.get("verified");

  React.useEffect(() => {
    if (verified === "true") {
      toast.success("Email updated successfully", {
        description: "Your new email address has been confirmed.",
      });

      // Force a session refresh to ensure client state matches server state
      refreshSession();

      // Clean up the URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("verified");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [verified, router, pathname, searchParams, refreshSession]);

  return null;
}
