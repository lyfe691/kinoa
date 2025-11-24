"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/supabase/auth";

function GoogleIcon() {
  return (
    <svg
      aria-hidden
      focusable="false"
      className="h-4 w-4"
      viewBox="0 0 533.5 544.3"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285f4"
        d="M533.5 278.4c0-17.4-1.6-34-4.6-50.2H272.1v95.1h146.9c-6.3 33.9-25.3 62.7-54.1 81.9v68.2h87.4c51.1-47 81.2-116.2 81.2-194.9z"
      />
      <path
        fill="#34a853"
        d="M272.1 544.3c73.4 0 135.1-24.3 180.2-66.1l-87.4-68.2c-24.3 16.3-55.3 25.9-92.8 25.9-71 0-131.2-47.9-152.8-112.1H28.7v70.6c45.2 89.4 137.5 149.9 243.4 149.9z"
      />
      <path
        fill="#fbbc04"
        d="M119.3 323.8c-10.4-30.9-10.4-64.2 0-95.1V158H28.7c-37.8 75.5-37.8 165.1 0 240.6z"
      />
      <path
        fill="#ea4335"
        d="M272.1 107.7c38.9-.6 76 13.2 104.4 38.9l78.1-78.1C406.7 24.3 345 0 272.1 0 166.2 0 73.9 60.5 28.7 149.9l90.6 70.6c21.6-64.3 81.8-112.2 152.8-112.8z"
      />
    </svg>
  );
}

export function SocialAuthButtons({
  actionLabel = "Continue",
}: {
  actionLabel?: string;
}) {
  const { supabase } = useSession();
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(false);

  const handleOAuth = React.useCallback(async () => {
    if (!supabase) {
      toast.error("Unable to reach the authentication service. Try again.");
      return;
    }

    setLoading(true);

    try {
      const baseRedirect =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const redirectTo = baseRedirect
        ? `${baseRedirect}?next=${encodeURIComponent(pathname || "/")}`
        : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("OAuth sign in failed for google", err);
      toast.error("We couldn't start the sign-in flow. Please try again.");
      setLoading(false);
    }
  }, [supabase, pathname]);

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full justify-center gap-3"
      disabled={loading}
      onClick={handleOAuth}
    >
      <GoogleIcon />
      <span className="font-medium">{actionLabel} with Google</span>
    </Button>
  );
}
