"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAuthErrorMessage } from "@/lib/supabase/errors";
import { useSession } from "@/lib/supabase/auth";
import { Spinner } from "@/components/ui/spinner";
import {
  AnimatedIcon,
  type AnimatedIconHandle,
} from "@/components/animated-icon";
import googleIcon from "@/public/icons/google-colored-2.json";

type GoogleAuthButtonProps = {
  disabled?: boolean;
  onError?: (error: string | null) => void;
  onLoadingChange?: (loading: boolean) => void;
};

export function GoogleAuthButton({
  disabled,
  onError,
  onLoadingChange,
}: GoogleAuthButtonProps) {
  const { supabase } = useSession();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [loading, setLoading] = React.useState(false);
  const iconRef = React.useRef<AnimatedIconHandle>(null);

  React.useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  const handleClick = React.useCallback(async () => {
    if (loading || disabled) return;

    onError?.(null);
    setLoading(true);

    if (!supabase) {
      onError?.(
        "Unable to reach the authentication service. Please try again.",
      );
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${next || "/"}`,
        },
      });

      if (error) throw error;
    } catch (err) {
      const message = getAuthErrorMessage(
        err,
        "Unable to sign in with Google. Please try again.",
      );
      onError?.(message);
      setLoading(false);
    }
  }, [disabled, loading, onError, supabase, next]);

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-3 group"
      onClick={handleClick}
      disabled={disabled || loading}
      size="lg"
      onMouseEnter={() => iconRef.current?.play()}
    >
      {loading ? (
        <Spinner className="h-4 w-4" />
      ) : (
        <AnimatedIcon
          ref={iconRef}
          icon={googleIcon}
          size={18}
          className="group-hover:opacity-100 transition-opacity"
          disableThemeColor={true}
        />
      )}
      <span>Continue with Google</span>
    </Button>
  );
}
